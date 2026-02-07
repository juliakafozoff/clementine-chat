import session from '../store/session';
import store from '../store/store';
import { setKey } from '../store/actions';
import keys from '../store/keys';
import Swal from 'sweetalert2';

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_TIME = 5 * 60 * 1000; // Warn 5 minutes before timeout

let inactivityTimer;
let warningTimer;

export const startInactivityTimer = () => {
    // Only start timer if user is logged in
    const isLoggedIn = store.getState().session.isLoggedIn;
    if (!isLoggedIn) {
        return;
    }

    clearInactivityTimer();
    
    // Set warning timer
    warningTimer = setTimeout(() => {
        const stillLoggedIn = store.getState().session.isLoggedIn;
        if (!stillLoggedIn) {
            clearInactivityTimer();
            return;
        }

        Swal.fire({
            title: 'Session Expiring Soon',
            text: 'Your session will expire in 5 minutes due to inactivity. Click "Stay Logged In" to continue.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Stay Logged In',
            cancelButtonText: 'Logout',
            timer: WARNING_TIME,
            timerProgressBar: true,
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then((result) => {
            if (result.isConfirmed) {
                startInactivityTimer(); // Reset timer
            } else if (result.dismiss === Swal.DismissReason.timer) {
                // Timer expired - logout
                handleLogout();
            } else {
                // User clicked logout
                handleLogout();
            }
        });
    }, INACTIVITY_TIMEOUT - WARNING_TIME);
    
    // Set logout timer
    inactivityTimer = setTimeout(() => {
        handleLogout();
    }, INACTIVITY_TIMEOUT);
};

export const clearInactivityTimer = () => {
    if (inactivityTimer) {
        clearTimeout(inactivityTimer);
        inactivityTimer = null;
    }
    if (warningTimer) {
        clearTimeout(warningTimer);
        warningTimer = null;
    }
};

const handleLogout = () => {
    session.clearTokens();
    session.clear();
    store.dispatch(setKey(keys.isLoggedIn, false));
    store.dispatch(setKey(keys.user, null));
    
    Swal.fire({
        title: 'Session Expired',
        text: 'You have been logged out due to inactivity.',
        icon: 'info',
        confirmButtonText: 'OK'
    }).then(() => {
        window.location.href = '/';
    });
};

// Reset timer on user activity
const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
let isInitialized = false;

export const initializeInactivityTimer = () => {
    if (isInitialized) return;
    isInitialized = true;

    events.forEach(event => {
        document.addEventListener(event, () => {
            const isLoggedIn = store.getState().session.isLoggedIn;
            if (isLoggedIn) {
                startInactivityTimer();
            }
        }, true);
    });
};

