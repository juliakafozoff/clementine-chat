

import { SET_KEY, GET_KEY } from './actions';
import session from "./session";
import keys from "./keys";

// Check if token is expired on initialization
const isTokenExpired = session.isTokenExpired();
const hasValidToken = session.getAccessToken() && !isTokenExpired;
const isLoggedInFromStorage = session.get(keys.isLoggedIn) === 'true';

const initialState = {
    isLoggedIn: hasValidToken && isLoggedInFromStorage,
    isLoading: false,
    showLogin: false,
    showSignup: false,
    user: hasValidToken ? (session.getParsed(keys.user) || null) : null,
    startConversation: session.get(keys.startConversation) || null
};

// Clear invalid session data if token is expired
if (isTokenExpired && isLoggedInFromStorage) {
    session.clearTokens();
    session.set(keys.isLoggedIn, 'false');
}

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_KEY:
            return {
                ...state,
                [action.payload.key]: action.payload.value
            };

        case GET_KEY:
            return {
                ...state
            };

        default:
			return state;
    }
}

export default reducer;