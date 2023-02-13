import uuid

from django.contrib.auth.models import User
from django.db import models


class PaySpace(models.Model):
    reference = models.UUIDField(default=uuid.uuid4)



class ExpenseUser(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    pay_space = models.ForeignKey(PaySpace, on_delete=models.CASCADE, related_name='expense_users')


class Person(models.Model):
    name = models.CharField(max_length=64)
    available_income = models.FloatField('monthly income to use for calculations')

    pay_space = models.ForeignKey(PaySpace, on_delete=models.CASCADE, null=True)


class Expense(models.Model):
    description = models.CharField(max_length=256)
    amount = models.FloatField()
    date = models.DateField()
    recurs_monthly = models.BooleanField()
    # todo: add calc category functionality (how much the cost should be shared)
    paid_by = models.ForeignKey(Person, on_delete=models.CASCADE)

    pay_space = models.ForeignKey(PaySpace, on_delete=models.CASCADE, null=True)
    
