import React, {Component} from 'react';

export class ExpenseItem extends Component {
    onEditClicked = () => {
        this.props.onEditItem({
            id: this.props.id,
            date: this.props.date,
            amount: this.props.amount,
            description: this.props.description,
            payed_by: this.props.payed_by
        });
    }

    render () {
        return (
            <tr className='expense-item'>
                <td className='date'>{this.props.date}</td>
                <td className='amount'>{this.props.amount.toFixed(2)}</td>
                <td className='description'>{this.props.description}</td>
                <td className='paid-by'>{this.props.payed_by}</td>
                <td><span className='is-clickable' onClick={this.onEditClicked}>edit</span></td>
            </tr>
        );
    }
}

export class ExpenseList extends Component {

    _compareDates = (a, b) => {
        if (a.date > b.date) {
            return 1;
        } else if (a.date < b.date) {
            return -1;
        } else {
            return 0;
        }
    }

    render() {
        return (
            <table className="table is-striped is-fullwidth">
                <tbody>
                    {this.props.expense_list.sort(this._compareDates).map((expense) => (
                        <ExpenseItem
                            id={expense.id}
                            amount={expense.amount}
                            description={expense.description}
                            date={expense.date}
                            payed_by={expense.payed_by}
                            key={expense.id}
                            onEditItem={this.props.onEditItem}
                        />
                    ))}
                </tbody>
            </table>
        )
    }
}
