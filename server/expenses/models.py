from django.db import models


class Person(models.Model):
    name = models.CharField(max_length=64)
    available_income = models.FloatField('monthly income to use for calculations')


class Expense(models.Model):
    description = models.CharField(max_length=256)
    amount = models.FloatField()
    date = models.DateField()
    # todo: add calc category functionality (how much the cost should be shared)
    payed_by = models.ForeignKey(Person, on_delete=models.CASCADE)