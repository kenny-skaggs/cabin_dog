from collections import defaultdict
from datetime import datetime
from typing import List
import uuid

from django.contrib.auth.models import User
from faker import Faker
from rest_framework import generics, permissions, response, views, viewsets
from rest_framework.pagination import LimitOffsetPagination

from expenses import auth, calculation, models, serializers


class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = models.Expense.objects.all()
    serializer_class = serializers.ExpenseSerializer
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.for_user(self.request.user.id).order_by('-date')
    
    def create(self, request, *args, **kwargs):
        request.data.update({
            'pay_space': request.user.person.pay_space.id
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

        models.Person.objects.create(
            name=fake.first_name(),
            available_income=fake.pyint(min_value=2000, max_value=6000),
            pay_space=new_pay_space,
            user=new_user
        )

        token = auth.MultiToken.objects.create(user=new_user)
        return response.Response(token.key)
    

class AddDeviceView(views.APIView):
    def post(self, request):
        """
        Generate and return new device token for authenticated user.
        User will then use authenticated device to activate new device.
        """
        new_token = auth.MultiToken.objects.create(user=request.user)
        return response.Response(new_token.key)


class AddPersonView(views.APIView):
    def post(self, request, household_ref):
        """
        Generate new person and device token for authenticated user's household.
        User will then current device to activate new user's device.
        """
        return response.Response()


class CurrentUserView(views.APIView):
    def get(self, request):
        return response.Response({
            'id': request.user.person.id
        })

class CalculationView(views.APIView):
    def get(self, request):
        balance, _ = calculation.ExpenseSharing.retrieve_for_household(
            household_id=request.user.person.pay_space.id
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
            household_id=request.user.person.pay_space.id
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
