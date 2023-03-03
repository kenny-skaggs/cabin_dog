from dataclasses import dataclass
import uuid

from django.contrib.auth.models import User
from django.db import models


class ExpenseQuerySet(models.query.QuerySet):
    def for_user(self, user_id):
        return self.filter(pay_space__persons__user__id=user_id)

    def for_household(self, household_id):
        return self.filter(pay_space__id=household_id)

    def unsettled(self):
        return self.filter(payment__isnull=True)


class PersonQuerySet(models.query.QuerySet):
    def for_user(self, user_id):
        return self.filter(pay_space__persons__user__id=user_id)

    def for_household(self, household_id):
        return self.filter(pay_space__id=household_id)


class PaySpace(models.Model):
    reference = models.UUIDField(default=uuid.uuid4)
    

class Person(models.Model):
    name = models.CharField(max_length=64)
    available_income = models.FloatField('monthly income to use for calculations')
    pay_space = models.ForeignKey(PaySpace, on_delete=models.CASCADE, null=True, related_name='persons')
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='person', null=True)

    objects = PersonQuerySet.as_manager()


class Payment(models.Model):
    amount = models.FloatField()
    timestamp = models.DateTimeField()
    payer = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='has_paid')
    payee = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='was_paid')


class Expense(models.Model):
    description = models.CharField(max_length=256)
    amount = models.FloatField()
    date = models.DateField()
    recurs_monthly = models.BooleanField()
    # todo: add calc category functionality (how much the cost should be shared)
    paid_by = models.ForeignKey(Person, on_delete=models.CASCADE)
    pay_space = models.ForeignKey(PaySpace, on_delete=models.CASCADE, null=True)
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, null=True, related_name='expense_list')

    objects = ExpenseQuerySet.as_manager()


@dataclass
class BalanceData:
    payer: Person = None
    payee: Person = None
    amount: float = 0
    
