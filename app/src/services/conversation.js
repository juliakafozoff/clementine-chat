import api from './api';

export default class {

    static create = async members => {
        let result = {
            data: null,
            error: null
        };

        const data =  {
            joined: Date.now(),
            members: members
        }

        await api.post('/conversations/', data)
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

    static getAll = async id => {
        let result = {
            data: null,
            error: null
        };

        await api.get(`/conversations/all/${id}`)
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