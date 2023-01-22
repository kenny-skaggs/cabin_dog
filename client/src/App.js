import axios from 'axios';
import React, {Component} from 'react';

import './app.sass';

import {ExpenseItem, ExpenseList} from './components/expenseListDisplay';
import {AddNewItemModal} from './components/itemModal';


Date.prototype.toDateInputValue = (function() {
    let local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
});


export class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expenses: [],
            personList: [],
            msg: 'loading',
            showingNewItemModal: false,
            editingItem: null,
        }
    }

    componentDidMount() {
        this.setState({msg: 'calling api'});
        axios.get('/expenses/').then((response) => {
            this.setState({expenses: response.data});
            this.setState({msg: 'done loading'});
        });
        axios.get('/person/').then((response) => {
            this.setState({personList: response.data});
        })
    }

    showNewItemModal = () => {
        this.setState({showingNewItemModal: true})
    }

    closeNewItemModel = () => {
        this.setState({showingNewItemModal: false});
    }

    render() {
        return (
            <div>
                <div className='top-bar is-clearfix'>
                    <div className='title is-pulled-left'>Cabin Dog -- {this.state.msg} </div>
                    <button className='button is-pulled-right'
                            onClick={this.showNewItemModal}
                    >
                        Add New
                    </button>
                </div>
                <div className="container">
                    <ExpenseList expense_list={this.state.expenses} />
                </div>
                <AddNewItemModal
                    date={new Date().toDateInputValue()}
                    amount={''}
                    description={''}
                    personList={this.state.personList}
                    showModal={this.state.showingNewItemModal}
                    onCancel={this.closeNewItemModel}
                />
            </div>
        );
    }
}
