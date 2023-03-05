import React, {Component} from 'react';
import { connect } from 'react-redux';

import './app.sass';

import Button from './components/Button';
import CalculationSummary from './features/calculation/calculationSummary';
import CalculationDetails from './features/calculation/calculationDetails';
import ExpenseList from './features/expenses/expenseListComponent';
import ItemModal from './features/expenses/itemModal';
import LoadingAnimation from './components/LoadingAnimation';
import LoadingModal from './components/LoadingModal';
import RegistrationView from './features/persons/registrationView';

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
            const token = window.location.hash.slice(1);
            if (token) {
                auth.setAuthToken(token);
                window.location = '/';
            }
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
        let contentDisplay = '';
        let summaryDisplay = '';
        let nextPageControl = '';
        let registrationView = '';
        if (this.props.hasData) {
            if (this.props.isNewPageLoading) {
                nextPageControl = <LoadingAnimation />
            } else {
                nextPageControl = (
                    <Button
                        onClick={() => this.props.fetchNextExpensePage()}
                        disabled={!this.props.canLoadMoreExpenses}
                    >
                        Load more
                    </Button>
                )
            }

            summaryDisplay = (
                <Button onClick={() => this.props.showCalculationModal()}>
                    <CalculationSummary />
                </Button>
            );
            contentDisplay = (
                <div>
                    <ExpenseList />
                    { nextPageControl }
                </div>
            );
        }
        if (!auth.hasAuthToken()) {
            registrationView = <RegistrationView />;
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

                        <div className="navbar-item has-dropdown is-hoverable">
                            <a className="navbar-link">
                                More
                            </a>

                            <div className="navbar-dropdown">
                                <a className="navbar-item">
                                    About
                                </a>
                                <a className="navbar-item">
                                    Jobs
                                </a>
                                <a className="navbar-item">
                                    Contact
                                </a>
                                <hr className="navbar-divider"></hr>
                                <a className="navbar-item">
                                    Report an issue
                                </a>
                            </div>
                        </div>
                        <div className='buttons navbar-item'>
                            {summaryDisplay}
                            <Button onClick={() => this.props.createNew()}>Add New</Button>
                        </div>
                    </div>
                </div>
                <div className="container">
                    {contentDisplay}
                </div>
                <ItemModal />
                <CalculationDetails />
                <LoadingModal />
                {registrationView}
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
        isNewPageLoading: state.expenses.paginationStatus === 'loading',
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
