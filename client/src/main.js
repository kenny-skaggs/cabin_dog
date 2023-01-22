'use strict';

import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom/client';

import {App} from './App';


axios.defaults.baseURL = 'http://localhost:8000';


const container = document.querySelector('#app');
const react_root = ReactDOM.createRoot(container);
react_root.render(<App />);
