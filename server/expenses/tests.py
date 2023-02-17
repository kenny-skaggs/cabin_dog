
from django.test import TestCase

from expenses import models
from expenses.utils import BalanceCalculator


class EvenIncomeBalanceTestCase(TestCase):
    def setUp(self):
        self.person_one = models.Person(id=1, available_income=10)
        self.person_two = models.Person(id=2, available_income=10)

    def test_single_charge(self):
        balance = BalanceCalculator.calculate_balance(
            person_list=[self.person_one, self.person_two],
            expense_list=[models.Expense(amount=4, paid_by=self.person_one)]
        )
        self.assertEqual(self.person_one, balance.payee)
        self.assertEqual(self.person_two, balance.payer)
        self.assertEqual(balance.amount, 2)

    def test_even_charges(self):
        balance = BalanceCalculator.calculate_balance(
            person_list=[self.person_one, self.person_two],
            expense_list=[
                models.Expense(amount=5, paid_by=self.person_one),
                models.Expense(amount=5, paid_by=self.person_two)
            ]
        )
        self.assertEqual(balance.amount, 0)

    def test_complex_charges(self):
        balance = BalanceCalculator.calculate_balance(
            person_list=[self.person_one, self.person_two],
            expense_list=[
                models.Expense(amount=2, paid_by=self.person_two),
                models.Expense(amount=7, paid_by=self.person_two),
                models.Expense(amount=1, paid_by=self.person_one)
            ]
        )
        self.assertEqual(self.person_two, balance.payee)
        self.assertEqual(self.person_one, balance.payer)
        self.assertEqual(balance.amount, 4)


class UnevenIncomeBalanceTestCase(TestCase):
    def setUp(self):
        self.person_one = models.Person(id=1, available_income=60)
        self.person_two = models.Person(id=2, available_income=40)

    def test_even_charges(self):
        balance = BalanceCalculator.calculate_balance(
            person_list=[self.person_one, self.person_two],
            expense_list=[
                models.Expense(amount=6, paid_by=self.person_one),
                models.Expense(amount=4, paid_by=self.person_two)
            ]
        )
        self.assertEqual(balance.amount, 0)

    def test_single_charge(self):
        balance = BalanceCalculator.calculate_balance(
            person_list=[self.person_one, self.person_two],
            expense_list=[models.Expense(amount=10, paid_by=self.person_one)]
        )
        self.assertEqual(self.person_one, balance.payee)
        self.assertEqual(self.person_two, balance.payer)
        self.assertEqual(balance.amount, 4)

    def test_complex_charges(self):
        balance = BalanceCalculator.calculate_balance(
            person_list=[self.person_one, self.person_two],
            expense_list=[
                models.Expense(amount=2, paid_by=self.person_two),
                models.Expense(amount=7, paid_by=self.person_two),
                models.Expense(amount=1, paid_by=self.person_one)
            ]
        )
        self.assertEqual(self.person_two, balance.payee)
        self.assertEqual(self.person_one, balance.payer)
        self.assertEqual(balance.amount, 5)
