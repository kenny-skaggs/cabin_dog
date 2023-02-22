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
            <Button>
                <span>{this.props.payer.name} should send</span>&nbsp;
                $<CurrencyDisplay amount={this.props.amount} />&nbsp;
                <span>to {this.props.payee.name}</span>
            </Button>
        );
    }
}

export default connect(
    (state) => {
        if (state.persons.list.length === 0) {
            return {amount: 0};
        }

        return {
            amount: state.calculation.amount,
            payer: state.persons.list.find(person => person.id === state.calculation.payerId),
            payee: state.persons.list.find(person => person.id === state.calculation.payeeId)
        }
    }
)(CalculationSummary);