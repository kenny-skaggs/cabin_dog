import uuid

from django.contrib.auth.models import User
from faker import Faker
from rest_framework import generics, permissions, response, viewsets
from rest_framework.authtoken.models import Token

from expenses import models, serializers


class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = models.Expense.objects.all()
    serializer_class = serializers.ExpenseSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.filter(pay_space__expense_users__user__id=self.request.user.id)
    
    def create(self, request, *args, **kwargs):
        request.data.update({
            'pay_space': request.user.expense_user.pay_space.id
        })
        return super().create(request, *args, **kwargs)


class PersonViewSet(viewsets.ModelViewSet):
    queryset = models.Person.objects.all()
    serializer_class = serializers.PersonSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.filter(pay_space__expense_users__user__id=self.request.user.id)


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
