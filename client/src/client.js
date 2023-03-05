import axios from "axios";

import auth from "./auth";
import { debouncedCallable } from "./utils";

export class Client {
    constructor() {
        if (process.env === 'development') {
            axios.defaults.baseURL = 'http://localhost:8000';
        } else {
            axios.defaults.baseURL = '/api';
        }

        axios.interceptors.request.use((config) => {
                if (auth.hasAuthToken() && !config.url.includes('register')) {
                    config.headers.Authorization = `Token ${auth.getAuthToken()}`;
                }
                return config;
            }
        );
    }

    get = (url, data) => {
        return axios.get(url).then(response => response);
    }

    post = (url, data) => {
        return axios.post(url, data).then(response => response);
    }

    put = (url, data) => {
        return axios.put(url, data).then(response => response);
    }

    delete = (url) => {
        return axios.delete(url);
    }
};

export default new Client();
