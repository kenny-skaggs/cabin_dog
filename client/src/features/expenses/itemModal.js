import React, {Component} from 'react';
import { connect } from 'react-redux';

import Button from '../../components/Button';
import Modal from '../../components/modal';
import { closeModal, addExpense, updateExpense } from './expensesSlice';


Date.prototype.toDateInputValue = (function() {
    let local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
});


export class ItemModal extends Component {

    constructor(props) {
        super(props);
        this.state = ItemModal._getNewItemTemplate(props);
    }

    onAmountChange = (event) => {
        const newValue = event.target.value;
        const partList = newValue.split('.');
        if (partList.length == 1 || (partList.length == 2 && partList[1].length < 3)) {
            this.setState({ amount: newValue });
        }
    }

    onRecursChange = (event) => {
        this.setState({ recursMonthly: event.target.checked });
    }

    onChange = (fieldName) => (
        (event) => {
            this.setState({ [fieldName]: event.target.value })
        }
    )

    onDescriptionChange = (event) => {
        this.setState({ description: event.target.value });
    }

    onSubmit = () => {
        if (
            isNaN(parseFloat(this.state.amount))
            || this.state.date === ''
            || this.state.description === ''
            || isNaN(parseInt(this.state.paidBy))
        ) {
            return;
        }

        let updateFunction = null;
        if (this.state.id !== null) {
            updateFunction = this.props.updateExpense;
        } else {
            updateFunction = this.props.addExpense;
        }
        updateFunction({
            id: this.state.id,
            amount: this.state.amount,
            paidBy: this.state.paidBy,
            date: this.state.date,
            description: this.state.description,
            recursMonthly: this.state.recursMonthly
        });
    }

    onCancel = (event) => {
        event.preventDefault();
        this.props.closeModal();
    }

    static _getNewItemTemplate(props) {
        return {
            id: null,
            date: new Date().toDateInputValue(),
            amount: '',
            description: '',
            paidBy: props.currentUserId,
            recursMonthly: false
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.editingItem !== undefined && state.id !== props.editingItem.id) {
            return props.editingItem;
        } else if (state.id !== null && props.editingItem === undefined) {
            return ItemModal._getNewItemTemplate(props);
        }
        if (state.paidBy == undefined) {
            return {
                paidBy: props.currentUserId
            }
        }
        return null;
    }

    render () {
        let editItemControls = '';
        if (this.props.id) {
            editItemControls = (
                <div className='buttons is-pulled-left'>
                    <button className='button is-danger' onClick={this.props.onDelete}>
                        Delete
                    </button>
                </div>
            )
        }

        return (
            <Modal showModal={this.props.showModal}>
                <form onSubmit={(event) => event.preventDefault()}>
                    <div className='field'>
                        <p className='control has-icons-left'>
                            <input 
                                className='input'
                                type='number'
                                placeholder='Amount'
                                step='0.01'
                                onChange={this.onAmountChange}
                                value={this.state.amount}
                                required
                                autoFocus
                            />
                            <span className='icon is-left'>
                                <i className='fas fa-sack-dollar' />
                            </span>
                        </p>
                    </div>
                    <div className='field'>
                        <p className='control has-icons-left'>
                            <input 
                                className='input' 
                                type='date' 
                                placeholder='Date' 
                                onChange={this.onChange('date')}
                                value={this.state.date}
                            />
                            <span className='icon is-left'>
                                <i className='far fa-calendar' />
                            </span>
                        </p>
                    </div>
                    <div className='field'>
                        <p className='control has-icons-left'>
                            <input
                                className='input' 
                                placeholder='Description' 
                                onChange={this.onChange('description')}
                                value={this.state.description}
                                required
                            />
                            <span className='icon is-left'>
                                <i className='fas fa-comment' />
                            </span>
                        </p>
                    </div>
                    <div className='field'>
                        <div className='control has-icons-left'>
                            <div className='select is-fullwidth'>
                                <select 
                                    onChange={this.onChange('paidBy')} 
                                    value={this.state.paidBy}
                                >
                                    {this.props.personList.map((person) => (
                                        <option key={person.id} value={person.id}>
                                            {person.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <span className='icon is-left'>
                                <i className='fas fa-user' />
                            </span>
                        </div>
                    </div>
                    <div className='field'>
                        <div className='control'>
                            <label className='checkbox'>
                                <input type='checkbox'
                                    onChange={this.onRecursChange} 
                                    checked={this.state.recursMonthly}
                                /> Recurs monthly
                            </label>
                        </div>
                    </div>
                    <div className='buttons is-pulled-right'>
                        <Button className='is-success' onClick={this.onSubmit}>
                            {this.state.id ? 'Save' : 'Add'}
                        </Button>
                        <Button onClick={this.onCancel}>Cancel</Button>
                    </div>
                    {editItemControls}
                </form>
            </Modal>
        )
    }
}

export default connect(
    (state) => {
        return {
            currentUserId: state.persons.currentUserId,
            showModal: state.expenses.showModal,
            editingItem: state.expenses.list.find(expense => expense.id === state.expenses.editItemId),
            personList: state.persons.list
        };
    },
    {
        closeModal,
        addExpense,
        updateExpense
    }
)(ItemModal);
