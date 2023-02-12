'use strict';

import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom/client';

import {App} from './App';
import { registerDevice } from './network';


axios.defaults.baseURL = 'http://localhost:8000';
axios.interceptors.request.use((config) => {
        const token = localStorage.getItem('id_token');
        if (token !== null && !config.url.includes('register')) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    }
);
axios.interceptors.response.use(
    response => response,
    (error) => {
        console.log(error);
        if (error.response.status == 401 && !error.response.config.url.includes('register')) {
            registerDevice();
        } else {
            return Promise.reject(error);
        }
    }
);



const container = document.querySelector('#app');
const react_root = ReactDOM.createRoot(container);
react_root.render(<App />);
