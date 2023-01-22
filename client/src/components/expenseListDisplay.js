import React, {Component} from 'react';

export class ExpenseItem extends Component {
    render () {
        return (
            <tr className='expense-item'>
                <td className='date'>{this.props.date}</td>
                <td className='amount'>{this.props.amount.toFixed(2)}</td>
                <td className='description'>{this.props.description}</td>
                <td className='paid-by'>{this.props.payedBy}</td>
            </tr>
        );
    }
}

export class ExpenseList extends Component {
    render() {
        return (
            <table className="table is-striped is-fullwidth">
                <tbody>
                    {this.props.expense_list.map((expense) => (
                        <ExpenseItem
                            amount={expense.amount}
                            description={expense.description}
                            date={expense.date}
                            payedBy={expense.payed_by}
                            key={expense.id}
                        />
                    ))}
                </tbody>
            </table>
        )
    }
}
