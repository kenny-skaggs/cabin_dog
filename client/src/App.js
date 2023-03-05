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
import RegistrationLinkView from './features/persons/registrationLinkView';
import client from './client';


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            registrationLink: null
        };
    }

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

    onAddPerson = () => {
        client.post('/add/person/').then((response) => {
            this.setState({ registrationLink: { personToken: response.data } });
        });
    }

    onAddDevice = () => {
        client.post('/add/device/').then((response) => {
            this.setState({ registrationLink: { deviceToken: response.data } });
        });
    }

    onRegistrationDone = () => {
        this.setState({ registrationLink: null });
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
        } else if (this.state.registrationLink) {
            registrationView = (
                <RegistrationLinkView 
                    {...this.state.registrationLink} 
                    onDone={this.onRegistrationDone} 
                />
            );
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
                                Setup
                            </a>

                            <div className="navbar-dropdown">
                                <a className="navbar-item" onClick={this.onAddPerson}>
                                    Add Person
                                </a>
                                <a className="navbar-item" onClick={this.onAddDevice}>
                                    Add Device
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
