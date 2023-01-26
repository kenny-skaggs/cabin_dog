import {motion, AnimatePresence} from 'framer-motion';
import React, {Component, forwardRef} from 'react';

class ExpenseItem extends Component {
    onEditClicked = () => {
        this.props.onEditItem({
            id: this.props.id,
            date: this.props.date,
            amount: this.props.amount,
            description: this.props.description,
            paid_by: this.props.paid_by
        });
    }

    render () {
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
                <td className='date'>{this.props.date}</td>
                <td className='amount'>{this.props.amount.toFixed(2)}</td>
                <td className='description'>{this.props.description}</td>
                <td className='paid-by'>{this.props.personList.find(person => person.id == this.props.paid_by).name}</td>
                <td><span className='is-clickable' onClick={this.onEditClicked}>edit</span></td>
            </motion.tr>
        );
    }
}

const ReffedItem = forwardRef((props, ref) => <ExpenseItem forwardedRef={ref} {...props} />);

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
            <motion.table className="table is-striped is-fullwidth">
                <motion.tbody>
                    <AnimatePresence initial={false} mode='popLayout'>
                        {this.props.expenseList.sort(this._compareDates).map((expense) => (
                            <ReffedItem
                                id={expense.id}
                                amount={expense.amount}
                                description={expense.description}
                                date={expense.date}
                                paid_by={expense.paid_by}
                                key={expense.id}
                                personList={this.props.personList}
                                onEditItem={this.props.onEditItem}
                            />
                        ))}
                    </AnimatePresence>
                </motion.tbody>
            </motion.table>
        )
    }
}
