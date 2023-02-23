import React, {Component} from 'react';
import { connect } from 'react-redux';

import './app.sass';

import Button from './components/Button';
import CalculationSummary from './features/calculation/calculationSummary';
import CalculationDetails from './features/calculation/calculationDetails';
import ExpenseList from './features/expenses/expenseListComponent';
import ItemModal from './features/expenses/itemModal';

import { fetchCalculation, showCalculationModal } from './features/calculation/calculationSlice';
import { fetchExpenses, fetchNextExpensePage, createNew } from './features/expenses/expensesSlice';
import { fetchCurrentUser, fetchPersons } from './features/persons/personsSlice';

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
            this.props.fetchCalculation();
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

    render() {
        if (!this.props.hasData) {
            return null;
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
                        <div className='buttons navbar-item'>
                            <Button onClick={() => this.props.showCalculationModal()}>
                                <CalculationSummary />
                            </Button>
                            <Button onClick={() => this.props.createNew()}>Add New</Button>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <ExpenseList />
                    <Button
                        onClick={() => this.props.fetchNextExpensePage()}
                        disabled={!this.props.canLoadMoreExpenses}
                    >
                        Load more
                    </Button>
                </div>
                <ItemModal />
                <CalculationDetails />
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
        && state.calculation.payee.id !== null
    );
    return {
        expensesStatus,
        personsStatus,
        hasData,
        canLoadMoreExpenses: state.expenses.canLoadMoreExpenses
    };
}, {
    createNew,
    fetchCalculation,
    fetchCurrentUser,
    fetchExpenses,
    fetchNextExpensePage,
    fetchPersons,
    showCalculationModal
})(App);
