import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Group } from '@visx/group';
import { Bar } from '@visx/shape';
import { scaleLinear, scaleBand, scaleOrdinal } from '@visx/scale';

import Button from '../../components/Button';
import CalculationSummary from './calculationSummary';
import CurrencyDisplay from '../../components/currencyDisplay';
import Modal from '../../components/ContentModal';

import { closeCalculationModal, postPayment } from './calculationSlice';


class CalculationDetails extends Component {
    render () {
        const personData = this.props.personList.map((person) => {
            const percentResponsible = person.availableIncome / this.props.totalIncome;
            const amountResponsible = percentResponsible * this.props.totalPaid;
            const amountOverpaid = person.paid - amountResponsible;
            return {
                paid: person.paid,
                responsible: amountResponsible,
                overPaid: amountOverpaid,
                name: person.name,
                id: person.id
            }
        });

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
                            {this.props.personList.map((person) => {
                                const percentResponsible = person.availableIncome / this.props.totalIncome;
                                const amountResponsible = percentResponsible * this.props.totalPaid;
                                const amountOverpaid = person.paid - amountResponsible;
                                return <tr key={person.id}>
                                    <td>{person.name}</td>
                                    <td><CurrencyDisplay amount={person.availableIncome} /></td>
                                    <td><CurrencyDisplay amount={percentResponsible} /></td>
                                    <td><CurrencyDisplay amount={person.paid} /></td>
                                    <td><CurrencyDisplay amount={amountResponsible} /></td>
                                    <td><CurrencyDisplay amount={amountOverpaid} /></td>
                                </tr>
                            })}
                            <tr>
                                <td />
                                <td><CurrencyDisplay amount={this.props.totalIncome} /></td>
                                <td />
                                <td><CurrencyDisplay amount={this.props.totalPaid} /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <br />
                <CalculationSummary />
                <div className='buttons is-pulled-right'>
                    <Button onClick={() => this.props.postPayment(this.props.balanceAmount)}>Paid</Button>
                    <Button onClick={() => this.props.closeModal()}>Cancel</Button>
                </div>
            </Modal>
        )
    }
}

export default connect(
    (state) => ({
        showModal: state.calculation.showModal,
        personList: [
            {
                ...state.calculation.payer,
                ...state.persons.list.find((person) => person.id == state.calculation.payer.id)
            },
            {
                ...state.calculation.payee,
                ...state.persons.list.find((person) => person.id == state.calculation.payee.id)
            },
        ],
        balanceAmount: state.calculation.balancingPayment,
        totalIncome: state.persons.list.reduce((partialSum, person) => partialSum + person.availableIncome, 0),
        totalPaid: state.calculation.payer.paid + state.calculation.payee.paid
    }),
    {
        closeModal: closeCalculationModal,
        postPayment
    }
)(CalculationDetails);
