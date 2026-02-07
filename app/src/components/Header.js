import React from 'react';
import { NavLink } from 'react-router-dom';
import keys from '../store/keys';
import { setKey, getKey, clearKeys } from '../store/actions';
import { connect } from "react-redux";
import sessionStorage from '../store/session';
import { clearInactivityTimer } from '../utils/sessionTimeout';

function Header({
    session,
    setKey,
    clearKeys,
    ...props
}) {

    const handleLogout = e => {
        e.preventDefault();

        setTimeout(() => {
            clearInactivityTimer();
            sessionStorage.clearTokens();
            clearKeys();
            setKey(keys.isLoggedIn, false);
            window.location.href = "/";
        }, 500);
    }

    return (
        <div className="main-header">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" href="/">
                    MERN SocketIO Chat
                </a>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                    data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    {
                        session.isLoggedIn !== true &&
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <NavLink className="nav-link" to="#"
                                    onClick={() => setKey(keys.showSignup, true)}>Signup</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="#"
                                    onClick={() => setKey(keys.showLogin, true)}>Login</NavLink>
                            </li>
                        </ul>
                    }
                    {
                        session.isLoggedIn === true && session.user &&
                        <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">Users</NavLink>
                        </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/chat">Messages</NavLink>
                            </li>
                            <li className="nav-item dropdown li-username-header">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span id="username-header">{session.user.name}</span>
                                </a>
                                <div className="dropdown-menu dropdown-menu-right user-dropdown"
                                    aria-labelledby="navbarDropdownMenuLink">
                                    <button className="dropdown-item" onClick={handleLogout}>
                                        <i className="fa fa-sign-out-alt m-1"></i>
                                        Logout
                                    </button>
                                </div>
                            </li>
                        </ul>
                    }
                </div>
            </nav>
        </div>
    );
}

const mapStateToProps = store => ({
    session: store.session
});

const mapDispatchToProps = dispatch => ({
    setKey: (key, value) => dispatch(setKey(key, value)),
    clearKeys: () => dispatch(clearKeys()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);