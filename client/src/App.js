import React, {Component} from 'react';
import { connect } from 'react-redux';

import './app.sass';

import client from './client';
import Button from './components/Button';
import CalculateModal from './components/calculationModal';
import ExpenseList from './features/expenses/expenseListComponent';
import { fetchExpenses } from './features/expenses/expensesSlice';
import { fetchPersons } from './features/persons/personsSlice';
import {AddNewItemModal} from './components/itemModal';

import auth from './auth';


Date.prototype.toDateInputValue = (function() {
    let local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
});


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            expenses: [],
            personList: [],
            showingNewItemModal: false,
            showingCalculationModal: false,
            editingItem: this.getNewItemTemplate()
        };
        this.network = client;
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        if (auth.hasAuthToken()) {
            this.props.fetchExpenses();
            this.props.fetchPersons();
        } else {
            this.network.register_device(this.loadData);
        }
    }
 
    getNewItemTemplate = () => ({
        date: new Date().toDateInputValue(),
        amount: '',
        description: '',
        paid_by: this.state != undefined && this.state.personList.length > 0 ? this.state.personList[0].id : 0,
        recurs_monthly: false
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
        this.network.post('/expenses/', item).then((expense) => {
            this.setState({
                expenses: [
                    ...this.state.expenses,
                    expense
                ]
            });
            this.closeNewItemModel();
        });
    }

    _submitEditItem = (item) => {
        const replacedId = item.id;
        this.network.put(`/expenses/${replacedId}/`, item).then(() => {
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
        this.network.delete(`/expenses/${deletedId}/`).then(() => {
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
        if (this.props.expensesStatus === 'succeeded' && this.props.personsStatus === 'succeeded') {
            console.log('shaoeu')
            expenseListView = (
                <div className="container">
                    <ExpenseList onEditItem={this.onEditItemClicked} />
                </div>
            )
        }

        return (
            <div>
                <div className='top-bar is-clearfix'>
                    <div className='title is-pulled-left'>Cabin Dog</div>
                    <div className='buttons is-pulled-right'>
                        <Button onClick={() => this.setState({showingCalculationModal: true})}>Calculate</Button>
                        <Button onClick={this.onNewItemClicked}>Add New</Button>
                    </div>
                </div>
                {expenseListView}
                {/* <AddNewItemModal
                    {...this.state.editingItem}
                    personList={this.state.personList}
                    showModal={this.state.showingNewItemModal}
                    onItemPropertyChanged={this.onItemPropertyChanged}
                    onSubmit={this.submitItemModel}
                    onDelete={this.onDeleteItemClicked}
                    onCancel={this.closeNewItemModel}
                /> */}
                {/* <CalculateModal
                    personList={this.state.personList}
                    expenseList={this.state.expenses}
                    showModal={this.state.showingCalculationModal}
                    onCancel={() => this.setState({showingCalculationModal: false})}
                /> */}
            </div>
        );
    }
}

export default connect((state) => {
    const expensesStatus = state.expenses.status;
    const personsStatus = state.persons.status;
    return {
        expensesStatus,
        personsStatus
    };
}, {
    fetchExpenses: fetchExpenses,
    fetchPersons: fetchPersons
})(App);
