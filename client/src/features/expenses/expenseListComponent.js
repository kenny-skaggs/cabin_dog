import {motion, AnimatePresence} from 'framer-motion';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import ExpenseItemComponent from './expenseItemComponent';


class ExpenseList extends Component {

    _compareDates = (a, b) => {
        if (a.date > b.date) {
            return -1;
        } else if (a.date < b.date) {
            return 1;
        } else {
            return 0;
        }
    }

    render() {
        const arrayToDisplay = [...this.props.expenseList];
        return (
            <motion.table className="table is-striped is-fullwidth">
                <motion.tbody>
                    <AnimatePresence initial={false} mode='popLayout'>
                        {arrayToDisplay.sort(this._compareDates).map((expense) => (
                            <ExpenseItemComponent
                                item={expense}
                                key={expense.id}
                                onEditItem={this.props.onEditItem}
                            />
                        ))}
                    </AnimatePresence>
                </motion.tbody>
            </motion.table>
        )
    }
}

export default connect((state) => {
    const expenseList = state.expenses.list;
    return {
        expenseList
    };
})(ExpenseList);
