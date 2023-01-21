'use strict';

axios.defaults.baseURL = 'http://localhost:8000';

import {App} from './App';
const container = document.querySelector('#app');
const react_root = ReactDOM.createRoot(container);
react_root.render(<App />);
