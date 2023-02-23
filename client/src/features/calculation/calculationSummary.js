import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../components/Button';
import CurrencyDisplay from '../../components/currencyDisplay';

class CalculationSummary extends Component {
    render () {
        if (this.props.amount === 0) {
            return null;
        }

        return (
            <span>
                {this.props.payer.name} should send&nbsp;
                $<CurrencyDisplay amount={this.props.amount} />&nbsp;
                to {this.props.payee.name}
            </span>
        );
    }
}

export default connect(
    (state) => {
        if (state.persons.list.length === 0) {
            return {amount: 0};
        }

        return {
            amount: state.calculation.balancingPayment,
            payer: state.persons.list.find(person => person.id === state.calculation.payer.id),
            payee: state.persons.list.find(person => person.id === state.calculation.payee.id)
        }
    }
)(CalculationSummary);