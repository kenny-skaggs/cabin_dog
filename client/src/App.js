import React, {Component} from 'react';
import { connect } from 'react-redux';

import './app.sass';

import client from './client';
import Button from './components/Button';
import CalculateModal from './components/calculationModal';
import ExpenseList from './features/expenses/expenseListComponent';
import { fetchExpenses, createNew } from './features/expenses/expensesSlice';
import { fetchCurrentUser, fetchPersons } from './features/persons/personsSlice';
import ItemModal from './features/expenses/itemModal';

import auth from './auth';


class App extends Component {

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        if (auth.hasAuthToken()) {
            this.props.fetchExpenses();
            this.props.fetchPersons();
            this.props.fetchCurrentUser();
        } else {
            this.network.register_device(this.loadData);
        }
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
            expenseListView = (
                <div className="container">
                    <ExpenseList />
                </div>
            )
        }

        return (
            <div>
                <div className='top-bar is-clearfix'>
                    <div className='title is-pulled-left'>Cabin Dog</div>
                    <div className='buttons is-pulled-right'>
                        <Button onClick={() => this.setState({showingCalculationModal: true})}>Calculate</Button>
                        <Button onClick={() => this.props.createNew()}>Add New</Button>
                    </div>
                </div>
                {expenseListView}
                <ItemModal />
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
    createNew,
    fetchCurrentUser,
    fetchExpenses,
    fetchPersons,
})(App);
