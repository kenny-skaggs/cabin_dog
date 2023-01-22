import React, {Component} from 'react';

export class AddNewItemModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: props.date,
            amount: props.amount,
            description: props.description,
            personId: 1
        }
    }

    onDateChange = (event) => {
        this.setState({date: event.target.value});
    }

    onAmountChange = (event) => {
        const newValue = event.target.value;
        const partList = newValue.split('.');
        if (partList.length == 1 || (partList.length == 2 && partList[1].length < 3)) {
            this.setState({amount: event.target.value});
        }
    }

    onDescriptionChange = (event) => {
        this.setState({description: event.target.value});
    }

    onPersonChange = (event) => {
        this.setState({personId: event.target.value});
    }

    onSubmit = () => {
        console.log({
            amount: this.state.amount,
            date: this.state.date,
            description: this.state.description,
            personId: this.state.personId
        })
    }

    render () {
        if (!this.props.showModal) {
            return null;
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
                                value={this.state.amount}
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
                                onChange={this.onDateChange}
                                value={this.state.date}
                            />
                            <span className='icon is-left'>
                                <i className='far fa-calendar' />
                            </span>
                        </p>
                    </div>
                    <div className='field'>
                        <p className='control has-icons-left'>
                            <input className='input' placeholder='Description' onChange={this.onDescriptionChange}/>
                            <span className='icon is-left'>
                                <i className='fas fa-comment' />
                            </span>
                        </p>
                    </div>
                    <div className='field'>
                        <div className='control has-icons-left'>
                            <div className='select is-fullwidth'>
                                <select onChange={this.onPersonChange} value={this.state.personId}>
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
                        <button className='button is-success' onClick={this.onSubmit}>Add</button>
                        <button className='button' onClick={this.props.onCancel}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }
}
