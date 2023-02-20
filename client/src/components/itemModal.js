import React, {Component} from 'react';

import Button from './Button';
import Modal from './modal';
import store from '../store';

export class AddNewItemModal extends Component {

    onAmountChange = (event) => {
        const newValue = event.target.value;
        const partList = newValue.split('.');
        if (partList.length == 1 || (partList.length == 2 && partList[1].length < 3)) {
            this.props.onItemPropertyChanged('amount', parseFloat(event.target.value))
        }
    }

    onRecursChange = (event) => {
        this.props.onItemPropertyChanged('recurs_monthly', event.target.checked);
    }

    onChange = (fieldName) => (
        (event) => {
            this.props.onItemPropertyChanged(fieldName, event.target.value);
        }
    )

    onDescriptionChange = (event) => {
        this.setState({description: event.target.value});
    }

    onSubmit = () => {
        if (
            isNaN(parseFloat(this.props.amount))
            || this.props.date === ''
            || this.props.description === ''
            || isNaN(parseInt(this.props.paid_by))
        ) {
            return;
        }

        store.dispatch(addExpense(
            this.state.amount,
            this.state.paid_by,
            this.state.date,
            this.state.description
        ));
        this.props.onSubmit();
    }

    onCancel = (event) => {
        event.preventDefault();
        this.props.onCancel();
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
                                    onChange={this.onChange('paid_by')} 
                                    value={this.state.paid_by}
                                >
                                    {this.props.personList.map((person) => (
                                        // todo: default this to current user
                                        <option
                                            key={person.id} 
                                            value={person.id}
                                        >
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
                                    checked={this.state.recurs_monthly}
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
