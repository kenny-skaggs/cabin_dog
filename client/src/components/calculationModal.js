import React, {Component} from 'react';

import Button from './Button';
import Modal from './modal';

export default class CalculateModal extends Component {
    render () {
        let totalPaid = 0;
        const userPaid = {};
        this.props.expenseList.forEach(expense => {
            totalPaid += expense.amount;
            userPaid[expense.paid_by] = expense.amount + (userPaid[expense.paid_by] || 0);
        });

        const totalIncome = this.props.personList.reduce(
            (partialSum, person) => partialSum + person.available_income, 0
        );
        const userPercent = {};
        this.props.personList.forEach(person => {
            userPercent[person.id] = person.available_income / totalIncome;
        });

        let firstOneOverpaid = 0;
        if (this.props.personList.length > 0) {
            const firstPersonId = this.props.personList[0].id;
            firstOneOverpaid = (totalPaid * userPercent[firstPersonId]) - userPaid[firstPersonId];
        }

        let result = (<div>Broke even</div>);
        if (firstOneOverpaid > 0) {
            result = (<div>
                {this.props.personList[0].name} owes 
                &nbsp;{this.props.personList[1].name} 
                &nbsp;{firstOneOverpaid}</div>);
        } else if (firstOneOverpaid < 0) {
            result = (<div>
                {this.props.personList[1].name} owes 
                &nbsp;{this.props.personList[0].name} 
                &nbsp;{-firstOneOverpaid}</div>);
        }
        
        return (
            <Modal showModal={this.props.showModal}>
                <div className='calculation-view'>
                    <div>
                        Total Income: {totalIncome}
                    </div>
                    <div>
                        Percentages
                        {this.props.personList.map((person) => (
                            <p key={person.id}>
                                {person.name}: {userPercent[person.id]} (@ {person.available_income})
                            </p>
                        ))}
                    </div>
                    <div>
                        Total Paid: {totalPaid}
                    </div>
                    <div>
                        Amount Responsible
                        {this.props.personList.map((person) => (
                            <p key={person.id}>
                                {person.name}: {totalPaid * userPercent[person.id]}
                            </p>
                        ))}
                    </div>
                    <div>
                        Actual Paid
                        {this.props.personList.map((person) => (
                            <p key={person.id}>{person.name}: {userPaid[person.id]}</p>
                        ))}
                    </div>
                    {result}
                </div>
                <div className='buttons is-pulled-right'>
                    <Button>Paid</Button>
                    <Button onClick={this.props.onCancel}>Cancel</Button>
                </div>
            </Modal>
        )
    }
}
