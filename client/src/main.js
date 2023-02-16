'use strict';

import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom/client';

import {App} from './App';


const container = document.querySelector('#app');
const react_root = ReactDOM.createRoot(container);
react_root.render(<App />);
