const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const TOKEN_EXPIRY_KEY = 'tokenExpiry';

const session = {
    set: (key, value) => localStorage.setItem(key, value),
    setStringified: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
    get: key => localStorage.getItem(key),
    getParsed: key => {
        try {
            return JSON.parse(localStorage.getItem(key)) || null;
        } catch {
            return null;
        }
    },
    remove: key => localStorage.removeItem(key),
    clear: () => localStorage.clear(),
    
    // Token management
    setTokens: (accessToken, refreshToken, expiresIn) => {
        localStorage.setItem(TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        const expiryTime = Date.now() + (expiresIn * 1000);
        localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
    },
    
    getAccessToken: () => localStorage.getItem(TOKEN_KEY),
    getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
    
    isTokenExpired: () => {
        const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
        if (!expiry) return true;
        return Date.now() >= parseInt(expiry);
    },
    
    clearTokens: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(TOKEN_EXPIRY_KEY);
    }
};

export default session;