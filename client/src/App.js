import React, {Component} from 'react';
import { connect } from 'react-redux';

import './app.sass';

import Button from './components/Button';
import CalculationSummary from './features/calculation/calculationSummary';
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
        if (this.props.hasData) {
            expenseListView = (
                <div className="container">
                    <ExpenseList />
                </div>
            )
        }

        return (
            <div>
                <div className='navbar'>
                    <div className='navbar-brand'>
                        <div className='navbar-item'>
                            <h1 className='title'>Cabin Dog</h1>
                        </div>
                    </div>
                    <div className='navbar-end'>
                        <div className='navbar-item'>
                            <CalculationSummary />
                        </div>
                        <div className='buttons navbar-item'>
                            <Button onClick={() => this.setState({showingCalculationModal: true})}>Calculate</Button>
                            <Button onClick={() => this.props.createNew()}>Add New</Button>
                        </div>
                    </div>
                </div>
                {expenseListView}
                <ItemModal />
            </div>
        );
    }
}

export default connect((state) => {
    const expensesStatus = state.expenses.status;
    const personsStatus = state.persons.status;
    const hasData = (
        state.expenses.list.length > 0
        && state.persons.list.length > 0
    )
    return {
        expensesStatus,
        personsStatus,
        hasData
    };
}, {
    createNew,
    fetchCurrentUser,
    fetchExpenses,
    fetchPersons,
})(App);
