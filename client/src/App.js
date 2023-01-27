import axios from 'axios';
import React, {Component} from 'react';

import './app.sass';

import Button from './components/Button';
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
            editingItem: this.getNewItemTemplate()
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

    getNewItemTemplate = () => ({
        date: new Date().toDateInputValue(),
        amount: '',
        description: '',
        paid_by: 1
    })

    onEditItemClicked = (item) => {
        this.setState({
            editingItem: item,
            showingNewItemModal: true
        });
    }

    onNewItemClicked = () => {
        this.setState({
            editingItem: this.getNewItemTemplate(),
            showingNewItemModal: true
        });
    }

    submitItemModel = () => {
        const item = this.state.editingItem;
        if (item.id) {
            this._submitEditItem(item);
        } else {
            this._submitNewItem(item);
        }
    }

    _submitNewItem = (item) => {
        axios.post('/expenses/', item).then((response) => {
            this.setState({
                expenses: [
                    ...this.state.expenses,
                    response.data
                ]
            });
            this.closeNewItemModel();
        });
    }

    _submitEditItem = (item) => {
        const replacedId = item.id;
        axios.put(`/expenses/${replacedId}/`, item).then(() => {
            this.setState({
                expenses: [
                    ...this.state.expenses.filter(possibleMatch => possibleMatch.id != replacedId),
                    item
                ]
            });
            this.closeNewItemModel();
        });
    }

    onDeleteItemClicked = () => {
        const deletedId = this.state.editingItem.id;
        axios.delete(`/expenses/${deletedId}/`).then(() => {
            this.setState({
                expenses: this.state.expenses.filter(item => item.id != deletedId)
            });
            this.closeNewItemModel();
        });
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
        let expenseListView = '';
        if (this.state.expenses.length > 0 && this.state.personList.length > 0) {
            expenseListView = (
                <div className="container">
                    <ExpenseList
                        expenseList={this.state.expenses}
                        personList={this.state.personList}
                        onEditItem={this.onEditItemClicked}
                    />
                </div>
            )
        }

        return (
            <div>
                <div className='top-bar is-clearfix'>
                    <div className='title is-pulled-left'>Cabin Dog -- {this.state.msg} </div>
                    <div className='buttons is-pulled-right'>
                        <Button disabled>Calculate</Button>
                        <Button onClick={this.onNewItemClicked}>Add New</Button>
                    </div>
                </div>
                {expenseListView}
                <AddNewItemModal
                    {...this.state.editingItem}
                    personList={this.state.personList}
                    showModal={this.state.showingNewItemModal}
                    onItemPropertyChanged={this.onItemPropertyChanged}
                    onSubmit={this.submitItemModel}
                    onDelete={this.onDeleteItemClicked}
                    onCancel={this.closeNewItemModel}
                />
            </div>
        );
    }
}
