import api from './api';

export default class {
    
    static getAll = async conversationId => {
        let result = {
            data: null,
            error: null
        };

        await api.get(`/messages/${conversationId}`)
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