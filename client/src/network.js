import axios from "axios";


let _register_device_call = undefined;


export function registerDevice() {
    if (_register_device_call === undefined) {
        _register_device_call = setTimeout(() => {
            axios.post('/register/').then((response) => {
                localStorage.setItem('id_token', response.data);
            });
            _register_device_call = undefined;
        }, 100);
    }
}