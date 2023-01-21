import './app.sass';

import {ExpenseItem, ExpenseList} from './components/expenseListDisplay';
import {AddNewItemModal} from './components/itemModal';

export class App extends React.Component {
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
        });
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
