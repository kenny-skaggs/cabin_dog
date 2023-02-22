import { motion } from 'framer-motion';
import React, { Component, forwardRef } from 'react';
import { connect } from 'react-redux';

import { edit } from './expensesSlice';
import { selectPersonById } from '../persons/personsSlice';


class ExpenseItem extends Component {
    onEditClicked = () => {
        this.props.onEditItem(this.props.item);
    }

    render () {
        let recurranceIcon = '';
        if (this.props.item.recursMonthly) {
            recurranceIcon = (
                <span className='icon'>
                    <i className='fas fa-repeat' />
                </span>
            )
        }
        
        return (
            <motion.tr
                layout
                key={this.props.id} 
                initial={{
                    opacity: 0
                }} 
                animate={{
                    opacity: 1
                }} 
                exit={{
                    opacity: 0
                }} 
                className='expense-item'
                ref={this.props.forwardedRef}
            >
                <td className='recurrence'>{recurranceIcon}</td>
                <td className='date'>{this.props.item.date}</td>
                <td className='amount'>{this.props.item.amount.toFixed(2)}</td>
                <td className='description'>{this.props.item.description}</td>
                <td className='paid-by'>{this.props.person.name}</td>
                <td><span className='is-clickable' onClick={() => this.props.edit(this.props.item.id)}>edit</span></td>
            </motion.tr>
        );
    }
}

const ConnectedComponent = connect(
    (state, ownProps) => {
        const person = selectPersonById(state, ownProps.item.paidBy);
        return {
            person
        };
    },
    {
        edit
    }
)(ExpenseItem);

export default forwardRef((props, ref) => <ConnectedComponent {...props} forwardedRef={ref} />);
