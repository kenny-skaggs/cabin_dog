'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var e = React.createElement;

var ExpenseItem = function (_React$Component) {
    _inherits(ExpenseItem, _React$Component);

    function ExpenseItem() {
        _classCallCheck(this, ExpenseItem);

        return _possibleConstructorReturn(this, (ExpenseItem.__proto__ || Object.getPrototypeOf(ExpenseItem)).apply(this, arguments));
    }

    _createClass(ExpenseItem, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                null,
                React.createElement(
                    'span',
                    { style: {
                            'width': '5em',
                            'display': 'inline-block',
                            'paddingRight': '10px'
                        } },
                    this.props.date
                ),
                React.createElement(
                    'span',
                    { style: {
                            'width': '4em',
                            'display': 'inline-block',
                            'textAlign': 'right',
                            'paddingRight': '2em'
                        } },
                    this.props.amount.toFixed(2)
                ),
                React.createElement(
                    'span',
                    { style: {
                            'width': '10em',
                            'display': 'inline-block',
                            'paddingRight': '2em'
                        }
                    },
                    this.props.description
                ),
                React.createElement(
                    'span',
                    null,
                    this.props.payedBy
                )
            );
        }
    }]);

    return ExpenseItem;
}(React.Component);

var ExpenseList = function (_React$Component2) {
    _inherits(ExpenseList, _React$Component2);

    function ExpenseList() {
        _classCallCheck(this, ExpenseList);

        return _possibleConstructorReturn(this, (ExpenseList.__proto__ || Object.getPrototypeOf(ExpenseList)).apply(this, arguments));
    }

    _createClass(ExpenseList, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'ul',
                null,
                this.props.expense_list.map(function (expense) {
                    return React.createElement(ExpenseItem, {
                        amount: expense.amount,
                        description: expense.description,
                        date: expense.date,
                        payedBy: expense.payed_by,
                        key: expense.id
                    });
                })
            );
        }
    }]);

    return ExpenseList;
}(React.Component);

var App = function (_React$Component3) {
    _inherits(App, _React$Component3);

    function App(props) {
        _classCallCheck(this, App);

        var _this3 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this3.state = {
            expenses: [],
            msg: 'loading'
        };
        return _this3;
    }

    _createClass(App, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this4 = this;

            this.setState({ msg: 'calling api' });
            axios.get('/expenses/').then(function (response) {
                _this4.setState({ expenses: response.data });
                _this4.setState({ msg: 'done loading' });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                null,
                React.createElement(
                    'h1',
                    null,
                    'hello app root -- ',
                    this.state.msg,
                    ' '
                ),
                React.createElement(ExpenseList, { expense_list: this.state.expenses })
            );
        }
    }]);

    return App;
}(React.Component);

axios.defaults.baseURL = 'http://localhost:8000';

var container = document.querySelector('#app');
var react_root = ReactDOM.createRoot(container);
react_root.render(React.createElement(App, null));