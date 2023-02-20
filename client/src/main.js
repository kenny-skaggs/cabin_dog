'use strict';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './App';
import store from './store';


const container = document.querySelector('#app');
const react_root = ReactDOM.createRoot(container);
react_root.render(
    <Provider store={store}>
        <App />
    </Provider>
);
