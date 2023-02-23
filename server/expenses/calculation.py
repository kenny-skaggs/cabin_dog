from dataclasses import dataclass
from typing import List, Tuple

from expenses import models


class Person:
    def __init__(self, available_income: float, id_: int, amount_paid: float = 0):
        self.available_income = available_income
        self.amount_paid = amount_paid
        self.id = id_


@dataclass
class Balancer:
    payer: Person
    payee: Person
    amount: float


class ExpenseSharing:
    def __init__(self, person_one: Person, person_two: Person):
        self._person_one = person_one
        self._person_two = person_two

    @classmethod
    def retrieve_for_household(cls, household_id) -> Tuple['ExpenseSharing', List[models.Expense]]:
        # todo: set up way to cache this in redis

        person_list: List[models.Person] = models.Person.objects.for_household(household_id).all()
        expenses = models.Expense.objects.for_household(household_id).unsettled().all()

        person_map = {
            person.id: Person(
                available_income=person.available_income,
                id_=person.id
            )
            for person in person_list
        }
        for expense in expenses:
            person_map[expense.paid_by.id].amount_paid += expense.amount

        # assuming just two people for now
        shared_expense = ExpenseSharing(*person_map.values())
        return shared_expense.get_balance(), expenses
        

    def get_balance(self) -> Balancer:
        total_amount_paid = self._person_one.amount_paid + self._person_two.amount_paid
        total_income = self._person_one.available_income + self._person_two.available_income
        responsible_map = {
            person: person.available_income / total_income * total_amount_paid
            for person in [self._person_one, self._person_two]
        }

        one_overpayment = self._person_one.amount_paid - responsible_map[self._person_one]
        if one_overpayment > 0:
            payee = self._person_one
            payer = self._person_two
        else:
            payee = self._person_two
            payer = self._person_one

        return Balancer(
            payer=payer,
            payee=payee,
            amount=abs(one_overpayment)
        )
