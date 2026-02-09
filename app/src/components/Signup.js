import React, {useState, useEffect} from 'react';
import keys from "../store/keys";
import {setKey, clearKeys, setStringifiedKey} from "../store/actions";
import {connect} from "react-redux";
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import utils from '../utils/utils';
import userService from '../services/user';
import sessionStorage from '../store/session';
import { startInactivityTimer } from '../utils/sessionTimeout';

function Signup({
                    session,
                    setKey,
                    getKey,
                    clearKeys,
                    setStringifiedKey,
                    ...props
                }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        clearKeys();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = e => {
        e.preventDefault();

        if (!name || name.length === 0) {
            setErrorMessage(`Name is required.`);
            return;
        }

        if (!email || email.length === 0) {
            setErrorMessage(`Email address is required.`);
            return;
        } else {
            if (!utils.isValidEmail(email)) {
                setErrorMessage(`Please provide a valid email address`);
                return;
            }
        }

        if (!password || password.length === 0) {
            setErrorMessage(`Password is required.`);
            return;
        }

        userService.signup(name, email, password)
            .then(result => {
                if (result.error) {
                    // Provide more helpful error messages
                    let errorMsg = result.error;
                    if (result.error === 'Network Error' || result.error.includes('Network')) {
                        errorMsg = 'Unable to connect to server. Please check your connection or contact support.';
                    }
                    setErrorMessage(errorMsg);
                    setKey(keys.isLoading, false);
                    return;
                }

                if (result.data) {
                    const { user, accessToken, refreshToken } = result.data;
                    setErrorMessage('');
                    setSuccessMessage(`Signup successful! Redirecting...`);

                    // Store tokens (15 minutes default for new signups)
                    sessionStorage.setTokens(accessToken, refreshToken, 15 * 60);
                    
                    setStringifiedKey(keys.user, user);
                    setKey(keys.isLoggedIn, true);
                    setKey(keys.showSignup, false);
                    
                    // Start inactivity timer
                    startInactivityTimer();
                }
            });
    }

    return (
        <>
            <Rodal visible={session.showSignup}
                   onClose={() => setKey(keys.showSignup, false)}
                   closeOnEsc={false}
                   closeMaskOnClick={false}
                   customStyles={utils.rodalSmallVertical()}>
                <div className="container-fluid text-center">
                    <h4 className="m-4">Signup</h4>
                    <div className="row">
                        <div className="col text-left">
                            <div className="form-group">
                                <label htmlFor="txtName">Full name</label>
                                <input type="text" className="form-control"
                                       placeholder="Full name"
                                       onBlur={e => setErrorMessage(``)} id="txtName"
                                       value={name} onChange={e => setName(e.target.value)}/>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col text-left">
                            <div className="form-group">
                                <label htmlFor="txtEmail">Email</label>
                                <input type="text" className="form-control"
                                       placeholder="Email"
                                       onBlur={e => setErrorMessage(``)} id="txtEmail"
                                       value={email} onChange={e => setEmail(e.target.value)}/>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col text-left">
                            <div className="form-group">
                                <label htmlFor="txtPassword">Password</label>
                                <input type="password" className="form-control"
                                       placeholder="Password"
                                       onBlur={e => setErrorMessage(``)} id="txtPassword"
                                       value={password} onChange={e => setPassword(e.target.value)}/>
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
                            <button
                                type="submit"
                                className="btn btn-primary"
                                onClick={handleSubmit}>Signup</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="form-group text-left mt-20">
                                Already have account?
                                <button type="button" className="btn btn-link"
                                        onClick={e => {
                                            setKey(keys.showSignup, false);
                                            setKey(keys.showLogin, true)
                                        }}>Login here</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Rodal>
        </>
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

export default connect(mapStateToProps, mapDispatchToProps)(Signup);