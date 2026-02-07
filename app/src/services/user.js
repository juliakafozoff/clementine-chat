import api from './api';
import utils from "../utils/utils";

export default class {

    static getAll = async keyword => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            keyword: keyword
        };

        await api.post('/users/all', data)
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response?.data || err.message || 'An error occurred';
            });

        return result;
    }

    static login = async (email, password) => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            email: email,
            password: password
        };

        await api.post('/users/login', data)
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response?.data || err.message || 'An error occurred';
            });

        return result;
    }

    static signup = async (name, email, password) => {
        let result = {
            data: null,
            error: null
        };

        const data = {
            name: name,
            email: email,
            password: password,
            ip: await utils.getIp()
        };

        await api.post('/users/signup', data)
            .then(resp => {
                if (resp.status === 200) {
                    result.data = resp.data;
                }
            })
            .catch(err => {
                result.error = err.response?.data || err.message || 'An error occurred';
            });

        return result;
    }
}