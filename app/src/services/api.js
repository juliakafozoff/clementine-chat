import axios from 'axios';
import session from '../store/session';
import store from '../store/store';
import { setKey } from '../store/actions';
import keys from '../store/keys';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000',
});

// Request interceptor - add token to requests
api.interceptors.request.use(
    (config) => {
        const token = session.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // If 401 and not already retrying, try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const refreshToken = session.getRefreshToken();
                if (!refreshToken) {
                    throw new Error('No refresh token');
                }
                
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/users/refresh`,
                    { refreshToken }
                );
                
                const { accessToken } = response.data;
                
                // Update tokens with new access token (keep same expiry as before - 15 minutes)
                // Reuse the existing refreshToken variable
                session.setTokens(accessToken, refreshToken, 15 * 60);
                
                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed - logout user
                session.clearTokens();
                session.clear();
                store.dispatch(setKey(keys.isLoggedIn, false));
                store.dispatch(setKey(keys.user, null));
                window.location.href = '/';
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;

