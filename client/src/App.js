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
            editingItem: this.getNewItem(),
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

    getNewItem = () => ({
        date: new Date().toDateInputValue(),
        amount: '',
        description: ''
    })

    onEditItem = (item) => {
        this.setState({
            editingItem: item,
            showingNewItemModal: true
        });
    }

    showNewItemModal = () => {
        this.setState({
            editingItem: this.getNewItem(),
            showingNewItemModal: true
        });
    }

    submitNewItemModel = () => {
        const item = this.state.editingItem;
        const url = item.id ? `/expenses/${item.id}/` : '/expenses';
        const method = item.id ? axios.put : axios.post;
        method(url, item).then(this.closeNewItemModel);
    }

    onDeleteItem = () => {
        axios.delete(`/expenses/${this.state.editingItem.id}/`).then(this.closeNewItemModel);
    }

    closeNewItemModel = () => {
        this.setState({showingNewItemModal: false});
    }

    onItemPropertyChanged = (name, newValue) => {
        this.setState({editingItem: {
            ...this.state.editingItem,
            [name]: newValue
        }});
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
                    <ExpenseList expense_list={this.state.expenses} onEditItem={this.onEditItem} />
                </div>
                <AddNewItemModal
                    key={this.state.editingItem.id}
                    {...this.state.editingItem}
                    personList={this.state.personList}
                    showModal={this.state.showingNewItemModal}
                    onItemPropertyChanged={this.onItemPropertyChanged}
                    onSubmit={this.submitNewItemModel}
                    onDelete={this.onDeleteItem}
                    onCancel={this.closeNewItemModel}
                />
            </div>
        );
    }
}
