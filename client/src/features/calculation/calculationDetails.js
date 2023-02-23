import React, {Component} from 'react';
import { connect } from 'react-redux';

import Button from '../../components/Button';
import CalculationSummary from './calculationSummary';
import CurrencyDisplay from '../../components/currencyDisplay';
import Modal from '../../components/modal';

import { closeCalculationModal, postPayment } from './calculationSlice';

class CalculationDetails extends Component {
    render () {
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
                                {/* <td><CurrencyDisplay amount={Object.values(userResponsible).reduce((partialSum, amount) => amount + partialSum, 0)} /></td> */}
                            </tr>
                        </tbody>
                    </table>
                </div>
                <br />
                <CalculationSummary />
                <div className='buttons is-pulled-right'>
                    {/* <div className='calculation-result'>{result}</div> */}
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