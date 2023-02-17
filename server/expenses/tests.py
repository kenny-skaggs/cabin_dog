
from django.test import TestCase
import pytest

from expenses import calculation


@pytest.mark.django_db
class EvenIncomeBalanceTestCase(TestCase):
    def setUp(self):
        self.person_one = calculation.Person(available_income=10)
        self.person_two = calculation.Person(available_income=10)
        self.expense_sharing = calculation.ExpenseSharing(
            person_one=self.person_one,
            person_two=self.person_two
        )

    def test_single_charge(self):
        self.person_one.amount_paid = 4

        balance = self.expense_sharing.get_balance()
        self.assertEqual(self.person_one, balance.payee)
        self.assertEqual(self.person_two, balance.payer)
        self.assertEqual(2, balance.amount)

    def test_even_charges(self):
        self.person_one.amount_paid = 5
        self.person_two.amount_paid = 5
        
        balance = self.expense_sharing.get_balance()
        self.assertEqual(0, balance.amount)

    def test_complex_charges(self):
        self.person_one.amount_paid = 1
        self.person_two.amount_paid = 9

        balance = self.expense_sharing.get_balance()
        self.assertEqual(balance.payee, self.person_two)
        self.assertEqual(balance.payer, self.person_one)
        self.assertEqual(balance.amount, 4)


@pytest.mark.django_db
class UnevenIncomeBalanceTestCase(TestCase):
    def setUp(self):
        self.person_one = calculation.Person(available_income=60)
        self.person_two = calculation.Person(available_income=40)
        self.expense_sharing = calculation.ExpenseSharing(
            person_one=self.person_one,
            person_two=self.person_two
        )

    def test_even_charges(self):
        self.person_one.amount_paid = 6
        self.person_two.amount_paid = 4
        
        balance = self.expense_sharing.get_balance()
        self.assertEqual(0, balance.amount)

    def test_single_charge(self):
        self.person_one.amount_paid = 10
        
        balance = self.expense_sharing.get_balance()
        self.assertEqual(self.person_one, balance.payee)
        self.assertEqual(self.person_two, balance.payer)
        self.assertEqual(4, balance.amount)

    def test_complex_charges(self):
        self.person_one.amount_paid = 1
        self.person_two.amount_paid = 9
        
        balance = self.expense_sharing.get_balance()
        self.assertEqual(self.person_two, balance.payee)
        self.assertEqual(self.person_one, balance.payer)
        self.assertEqual(5, balance.amount)
