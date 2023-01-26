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
            editingItem: this.getNewItem()
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
        description: '',
        paid_by: 1
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

    submitItemModel = () => {
        const item = this.state.editingItem;
        if (item.id) {
            this._editItem(item);
        } else {
            this._addNewItem(item);
        }
    }

    _addNewItem = (item) => {
        axios.post('/expenses/', item).then((response) => {
            this.setState({
                expenses: [
                    ...this.state.expenses,
                    response.data
                ]
            })
            this.closeNewItemModel();
        });
    }

    _editItem = (item) => {
        axios.put(`/expenses/${item.id}/`, item).then(() => {
            this.closeNewItemModel();
        });
    }

    onDeleteItem = () => {
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
        if (this.state.expenses.length > 0) {
            expenseListView = (
                <div className="container">
                    <ExpenseList expense_list={this.state.expenses} onEditItem={this.onEditItem} />
                </div>
            )
        }

        return (
            <div>
                <div className='top-bar is-clearfix'>
                    <div className='title is-pulled-left'>Cabin Dog -- {this.state.msg} </div>
                    <Button className='is-pulled-right'
                            onClick={this.showNewItemModal}
                    >
                        Add New
                    </Button>
                </div>
                {expenseListView}
                <AddNewItemModal
                    key={this.state.editingItem.id}
                    {...this.state.editingItem}
                    personList={this.state.personList}
                    showModal={this.state.showingNewItemModal}
                    onItemPropertyChanged={this.onItemPropertyChanged}
                    onSubmit={this.submitItemModel}
                    onDelete={this.onDeleteItem}
                    onCancel={this.closeNewItemModel}
                />
            </div>
        );
    }
}
