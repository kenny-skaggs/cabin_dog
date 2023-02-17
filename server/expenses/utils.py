from typing import List

from expenses import models


class BalanceCalculator:
    @classmethod
    def calculate_balance(
        cls,
        person_list: List[models.Person],
        expense_list: List[models.Expense]
    ) -> models.BalanceData:
        total_amount_paid = 0
        amount_paid_map = {person: 0 for person in person_list}
        for expense in expense_list:
            amount_paid_map[expense.paid_by] += expense.amount
            total_amount_paid += expense.amount

        total_income = sum([person.available_income for person in person_list])
        amount_responsible_map = {
            person: person.available_income / total_income * total_amount_paid
            for person in person_list
        }

        amount_overpaid_map = {
            person: amount_paid_map[person] - amount_responsible_map[person]
            for person in person_list
        }

        # Assuming there are only two people from this point on
        person_that_overpaid = max(amount_overpaid_map, key=amount_overpaid_map.get)
        person_that_underpaid = min(amount_overpaid_map, key=amount_overpaid_map.get)

        return models.BalanceData(
            payee=person_that_overpaid,
            payer=person_that_underpaid,
            amount=amount_overpaid_map[person_that_overpaid]
        )
