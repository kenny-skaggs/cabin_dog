from collections import defaultdict
import uuid
from typing import List

from django.contrib.auth.models import User
from faker import Faker
from rest_framework import generics, permissions, response, views, viewsets
from rest_framework.authtoken.models import Token

from expenses import calculation, models, serializers


class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = models.Expense.objects.all()
    serializer_class = serializers.ExpenseSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.for_user(self.request.user.id)
    
    def create(self, request, *args, **kwargs):
        request.data.update({
            'pay_space': request.user.device.person.pay_space.id
        })
        return super().create(request, *args, **kwargs)


class PersonViewSet(viewsets.ModelViewSet):
    queryset = models.Person.objects.all()
    serializer_class = serializers.PersonSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.for_user(self.request.user.id)


class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    
    def create(self, request):
        fake = Faker()

        new_user = User.objects.create(username=uuid.uuid4())
        new_pay_space = models.PaySpace.objects.create()
        models.ExpenseUser.objects.create(pay_space=new_pay_space, user=new_user)

        for _ in range(2):
            models.Person.objects.create(
                name=fake.first_name(),
                available_income=fake.pyint(min_value=2000, max_value=6000),
                pay_space=new_pay_space
            )

        token = Token.objects.create(user=new_user)
        return response.Response(token.key)

class CurrentUserView(views.APIView):
    def get(self, request):
        return response.Response({
            'id': request.user.id
        })

class CalculationView(views.APIView):
    def get(self, request):
        person_list: List[models.Person] = models.Person.objects.for_user(self.request.user.id).all()
        expenses = models.Expense.objects.for_user(self.request.user.id).all()

        person_map = {
            person.id: calculation.Person(
                available_income=person.available_income,
                id_=person.id
            )
            for person in person_list
        }
        for expense in expenses:
            person_map[expense.paid_by.id].amount_paid += expense.amount

        # assuming just two people for now
        shared_expense = calculation.ExpenseSharing(*person_map.values())
        balance = shared_expense.get_balance()
        return response.Response({
            'payee_id': balance.payee.id,
            'payer_id': balance.payer.id,
            'amount': balance.amount
        })
