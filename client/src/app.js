'use strict';
import './app.sass';

const e = React.createElement;



class ExpenseItem extends React.Component {
    render () {
        return (
            <tr className='expense-item'>
                <td className='date'>{this.props.date}</td>
                <td className='amount'>{this.props.amount.toFixed(2)}</td>
                <td className='description'>{this.props.description}</td>
                <td className='paid-by'>{this.props.payedBy}</td>
            </tr>
        );
    }
}

class ExpenseList extends React.Component {
    render() {
        return (
            <table className="table is-striped is-fullwidth">
                <tbody>
                    {this.props.expense_list.map((expense) => (
                        <ExpenseItem
                            amount={expense.amount}
                            description={expense.description}
                            date={expense.date}
                            payedBy={expense.payed_by}
                            key={expense.id}
                        />
                    ))}
                </tbody>
            </table>
        )
    }
}

class AddNewItemModal extends React.Component {
    render () {
        if (!this.props.showModal) {
            return null;
        }

        return (
            <div className='modal is-active'>
                <div className='modal-background'></div>
                <div className='modal-content box'>
                    <div className='field'>
                        <p className='control has-icons-left'>
                            <input className='input' placeholder='Amount' />
                            <span className='icon is-left'>
                                <i className='fas fa-sack-dollar' />
                            </span>
                        </p>
                    </div>
                    <div className='field'>
                        <p className='control has-icons-left'>
                            <input className='input' placeholder='Date' />
                            <span className='icon is-left'>
                                <i className='far fa-calendar' />
                            </span>
                        </p>
                    </div>
                    <div className='field'>
                        <p className='control has-icons-left'>
                            <input className='input' placeholder='Description' />
                            <span className='icon is-left'>
                                <i className='fas fa-comment' />
                            </span>
                        </p>
                    </div>
                    <div className='field'>
                        <p className='control has-icons-left'>
                            <input className='input' placeholder='Person' />
                            <span className='icon is-left'>
                                <i className='fas fa-user' />
                            </span>
                        </p>
                    </div>
                    <div className='buttons is-pulled-right'>
                        <button className='button is-success'>Add</button>
                        <button className='button' onClick={this.props.onCancel}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expenses: [],
            msg: 'loading',
            showingNewItemModal: false
        }
    }

    componentDidMount() {
        this.setState({msg: 'calling api'});
        axios.get('/expenses/').then((response) => {
            this.setState({expenses: response.data});
            this.setState({msg: 'done loading'});
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
                    showModal={this.state.showingNewItemModal}
                    onCancel={this.closeNewItemModel}
                />
            </div>
        );
    }
}

axios.defaults.baseURL = 'http://localhost:8000';

const container = document.querySelector('#app');
const react_root = ReactDOM.createRoot(container);
react_root.render(<App />);
