'use strict';

const e = React.createElement;



class ExpenseItem extends React.Component {
    render () {
        return (
            <div className='expense-item'>
                <span className='date'>{this.props.date}</span>
                <span className='amount'>{this.props.amount.toFixed(2)}</span>
                <span className='description'>{this.props.description}</span>
                <span>{this.props.payedBy}</span>
            </div>
        );
    }
}

class ExpenseList extends React.Component {
    render() {
        return (
            <ul>
                {this.props.expense_list.map((expense) => (
                    <ExpenseItem
                        amount={expense.amount}
                        description={expense.description}
                        date={expense.date}
                        payedBy={expense.payed_by}
                        key={expense.id}
                    />
                ))}
            </ul>
        )
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expenses: [],
            msg: 'loading'
        }
    }

    componentDidMount() {
        this.setState({msg: 'calling api'});
        axios.get('/expenses/').then((response) => {
            this.setState({expenses: response.data});
            this.setState({msg: 'done loading'});
        })
    }

    render() {
        return (
            <div>
                <h1>hello app root -- {this.state.msg} </h1>
                <ExpenseList expense_list={this.state.expenses} />
            </div>
        );
    }
}

axios.defaults.baseURL = 'http://localhost:8000';

const container = document.querySelector('#app');
const react_root = ReactDOM.createRoot(container);
react_root.render(<App />);
