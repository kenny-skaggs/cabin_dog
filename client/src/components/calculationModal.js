import React, {Component} from 'react';

import Button from './Button';
import CurrencyDisplay from './currencyDisplay';
import Modal from './modal';

export default class CalculateModal extends Component {
    render () {
        let totalPaid = 0;
        const userPaid = {};
        this.props.expenseList.forEach(expense => {
            totalPaid += expense.amount;
            userPaid[expense.paid_by] = expense.amount + (userPaid[expense.paid_by] || 0);
        });

        const totalIncome = 0;
        const userPercent = {};
        const userResponsible = {};
        this.props.personList.forEach(person => {
            const percent = person.available_income / totalIncome;
            userPercent[person.id] = percent;
            userResponsible[person.id] = totalPaid * percent;
        });

        let firstOneOverpaid = 0;
        if (this.props.personList.length > 0) {
            const firstPersonId = this.props.personList[0].id;
            firstOneOverpaid = (totalPaid * userPercent[firstPersonId]) - userPaid[firstPersonId];
        }

        let result = (<div>Broke even</div>);
        if (firstOneOverpaid > 0) {
            result = (<div>
                {this.props.personList[0].name} should send 
                &nbsp;{this.props.personList[1].name} 
                &nbsp;<CurrencyDisplay amount={firstOneOverpaid} /></div>);
        } else if (firstOneOverpaid < 0) {
            result = (<div>
                {this.props.personList[1].name} should send 
                &nbsp;{this.props.personList[0].name} 
                &nbsp;<CurrencyDisplay amount={-firstOneOverpaid} /></div>);
        }
        
        return (
            <Modal showModal={this.props.showModal}>
                <div className='calculation-view'>
                    <table className='table is-bordered is-fullwidth'>
                        <thead>
                            <tr>
                                <th />
                                <th>Income</th>
                                <th>Percent</th>
                                <th>Paid</th>
                                <th>Should Pay</th>
                                <th>Difference</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.personList.map((person) => (
                                <tr key={person.id}>
                                    <td>{person.name}</td>
                                    <td><CurrencyDisplay amount={person.available_income} /></td>
                                    <td><CurrencyDisplay amount={userPercent[person.id]} /></td>
                                    <td><CurrencyDisplay amount={userPaid[person.id] || 0} /></td>
                                    <td><CurrencyDisplay amount={userResponsible[person.id]} /></td>
                                    <td><CurrencyDisplay amount={userPaid[person.id] || 0 - userResponsible[person.id]} /></td>
                                </tr>
                            ))}
                            <tr>
                                <td />
                                <td><CurrencyDisplay amount={totalIncome} /></td>
                                <td />
                                <td><CurrencyDisplay amount={totalPaid} /></td>
                                {/* <td><CurrencyDisplay amount={Object.values(userResponsible).reduce((partialSum, amount) => amount + partialSum, 0)} /></td> */}
                            </tr>
                        </tbody>
                    </table>
                </div>
                <br />
                <div className='buttons is-pulled-right'>
                    <div className='calculation-result'>{result}</div>
                    <Button>Paid</Button>
                    <Button onClick={this.props.onCancel}>Cancel</Button>
                </div>
            </Modal>
        )
    }
}
