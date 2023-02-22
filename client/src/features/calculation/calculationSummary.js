import React, { Component } from 'react';
import { connect } from 'react-redux';

class CalculationSummary extends Component {
    render () {
        if (this.props.amount === 0) {
            return null;
        }

        return <span>Amount found: {this.props.amount}</span>;
    }
}

export default connect(
    (state) => ({
        amount: state.calculation.amount
    })
)(CalculationSummary);