import React, { useState, useEffect } from 'react';
import { Redirect, NavLink } from 'react-router-dom';
import keys from "../store/keys";
import { setKey, clearKeys, session, setStringifiedKey } from "../store/actions";
import { connect } from "react-redux";
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import utils from '../utils/utils';
import userService from '../services/user';
import sessionStorage from '../store/session';
import { startInactivityTimer } from '../utils/sessionTimeout';

function Login({
    session,
    setKey,
    setStringifiedKey,
    getKey,
    clearKeys,
    ...props
}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [redirectTo, setRedirectTo] = useState(null);

    useEffect(() => {
        clearKeys();
    }, []);

    const handleSubmit = async e => {
        e.preventDefault();
        if (!email || email.length === 0) {
            setErrorMessage(`Email address is required.`);
            return;
        } else {
            if (!utils.isValidEmail(email)) {
                setErrorMessage(`Please provide a valid email address.`);
                return;
            }
        }
        if (!password || password.length === 0) {
            setErrorMessage(`Password is required.`);
            return;
        }

        userService.login(email, password)
            .then(result => {
                if (result.error) {
                    setErrorMessage(result.error);
                    return;
                }

                if (result.data) {
                    const { user, accessToken, refreshToken } = result.data;
                    setErrorMessage('');
                    setSuccessMessage(`Login successful! Redirecting...`);

                    // Store tokens with appropriate expiry
                    if (rememberMe) {
                        // 7 days for "remember me"
                        sessionStorage.setTokens(accessToken, refreshToken, 7 * 24 * 60 * 60);
                    } else {
                        // 15 minutes for regular session
                        sessionStorage.setTokens(accessToken, refreshToken, 15 * 60);
                    }
                    
                    setStringifiedKey(keys.user, user);
                    setKey(keys.isLoggedIn, true);
                    setKey(keys.showLogin, false);
                    
                    // Start inactivity timer
                    startInactivityTimer();
                }
            });
    }

    return (
        <Rodal visible={session.showLogin}
            onClose={() => setKey(keys.showLogin, false)}
            closeOnEsc={false}
            closeMaskOnClick={false}
            customStyles={utils.rodalSmallVertical()}>
            <div className="container-fluid text-center">
                {redirectTo && <Redirect push to={redirectTo} />}
                <form onSubmit={handleSubmit}>
                    <h4 className="m-4">Login</h4>
                    <div className="row">
                        <div className="col text-left">
                            <div className="form-group">
                                <label htmlFor="txtEmail">Email</label>
                                <input type="text" className="form-control"
                                    placeholder="Email" required="required"
                                    onBlur={e => setErrorMessage(``)} id="txtEmail"
                                    value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col text-left">
                            <div className="form-group">
                                <label htmlFor="txtPassword">Password</label>
                                <input type="password" className="form-control"
                                    placeholder="Password" required="required"
                                    onBlur={e => setErrorMessage(``)} id="txtPassword"
                                    value={password} onChange={e => setPassword(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col text-left">
                            <div className="form-group">
                                <input 
                                    type="checkbox" 
                                    id="rememberMe"
                                    checked={rememberMe}
                                    onChange={e => setRememberMe(e.target.checked)}
                                />
                                <label htmlFor="rememberMe" style={{marginLeft: '8px'}}>Remember me</label>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                            {successMessage && <div className="alert alert-success">{successMessage}</div>}
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <button type="submit" className="btn btn-primary"
                                onClick={handleSubmit}>Login</button>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <div className="form-group text-left mt-30">
                                New to our platform?
                                <button type="button" className="btn btn-link" onClick={e => {
                                    setKey(keys.showSignup, true);
                                    setKey(keys.showLogin, false)
                                }}>Signup here
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </Rodal>
    );
}

const mapStateToProps = store => ({
    session: store.session
});

const mapDispatchToProps = dispatch => ({
    setKey: (key, value) => dispatch(setKey(key, value)),
    clearKeys: () => dispatch(clearKeys()),
    setStringifiedKey: (key, value) => dispatch(setStringifiedKey(key, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);