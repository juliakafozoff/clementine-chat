import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { setKey, getKey, clearKeys } from './store/actions';
import { startInactivityTimer, initializeInactivityTimer } from './utils/sessionTimeout';
import './App.css';
const Header = React.lazy(() => import('./components/Header'));
const Footer = React.lazy(() => import('./components/Footer'));
const Login = React.lazy(() => import('./components/Login'));
const Loading = React.lazy(() => import('./components/Loading'));
const Signup = React.lazy(() => import('./components/Signup'));
const Chat = React.lazy(() => import('./components/Chat'));
const Home = React.lazy(() => import('./components/Home'));

function App({
    session,
    setKey
}) {

    useEffect(() => {
        // Initialize inactivity timer system
        initializeInactivityTimer();
        
        // Start timer if user is logged in
        if (session.isLoggedIn) {
            startInactivityTimer();
        }
    }, [session.isLoggedIn]);

    return (
        <BrowserRouter>
            {session.isLoading && <Loading />}
            {session.showLogin && <Login />}
            {session.showSignup && <Signup />}
            <Header />
            <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path='/chat' component={Chat} />
            </Switch>
            <Footer />
        </BrowserRouter>
    );
}

const mapStateToProps = store => ({
    session: store.session
});

const mapDispatchToProps = dispatch => ({
    setKey: (key, value) => dispatch(setKey(key, value)),
    getKey: key => dispatch(getKey(key)),
    clearKeys: () => dispatch(clearKeys())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
