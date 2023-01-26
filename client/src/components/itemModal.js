import React, {Component} from 'react';

export class AddNewItemModal extends Component {

    onAmountChange = (event) => {
        const newValue = event.target.value;
        const partList = newValue.split('.');
        if (partList.length == 1 || (partList.length == 2 && partList[1].length < 3)) {
            this.props.onItemPropertyChanged('amount', event.target.value)
        }
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
        this.props.onSubmit();
    }

    render () {
        if (!this.props.showModal) {
            return null;
        }

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
            <div className='modal is-active'>
                <div className='modal-background'></div>
                <div className='modal-content box'>
                    <div className='field'>
                        <p className='control has-icons-left'>
                            <input 
                                className='input'
                                type='number'
                                placeholder='Amount'
                                step='0.01'
                                onChange={this.onAmountChange}
                                value={this.props.amount}
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
                                value={this.props.date}
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
                                value={this.props.description}
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
                                    value={this.props.paid_by}
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
                    <div className='buttons is-pulled-right'>
                        <button className='button is-success' onClick={this.onSubmit}>
                            {this.props.id ? 'Save' : 'Add'}
                        </button>
                        <button className='button' onClick={this.props.onCancel}>Cancel</button>
                    </div>
                    {editItemControls}
                </div>
            </div>
        );
    }
}
