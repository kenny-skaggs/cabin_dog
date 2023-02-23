from collections import defaultdict
from datetime import datetime
from typing import List
import uuid

from django.contrib.auth.models import User
from faker import Faker
from rest_framework import generics, permissions, response, views, viewsets
from rest_framework.authtoken.models import Token

from expenses import calculation, models, serializers


class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = models.Expense.objects.all()
    serializer_class = serializers.ExpenseSerializer

    # todo: set up paging

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
        balance, _ = calculation.ExpenseSharing.retrieve_for_household(
            household_id=request.user.device.person.pay_space.id
        )
        return response.Response({
            'payee': {
                'id': balance.payee.id,
                'paid': balance.payee.amount_paid
            },
            'payer': {
                'id': balance.payer.id,
                'paid': balance.payer.amount_paid
            },
            'balancing_payment': balance.amount
        })


class PaymentView(views.APIView):
    def post(self, request):
        balance, expense_list = calculation.ExpenseSharing.retrieve_for_household(
            household_id=request.user.device.person.pay_space.id
        )

        if balance.amount == request.data['amount']:
            payment = models.Payment(
                amount=balance.amount,
                timestamp=datetime.utcnow(),
                payer_id=balance.payer.id,
                payee_id=balance.payee.id
            )
            payment.save()
            payment.expense_list.set(expense_list)
            payment.save()

            return response.Response('success')
        else:
            return response.Response('mismatch', status=409)
