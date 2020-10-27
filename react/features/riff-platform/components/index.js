/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-sort-props */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-multi-comp */
import React, { useState } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route, Redirect
} from 'react-router-dom';

import { connect } from '../../base/redux';

import App from './App';
import SignIn from './SignIn';
import SignUp from './SignUp';

const Reset = () => <div>Reset</div>;

const RiffPlatform = ({ token, logout }) => {
    const onSubmitSignUp = ({ email, password, name = 'default name' }) => {
        // fetch('https://localhost:4445/api/register', {
        //     method: 'post',
        //     headers: { 'Content-type': 'application/json' },
        //     body: JSON.stringify({
        //         email,
        //         password,
        //         name
        //     })
        // })
        // .then(r => r.json())
        // .then(r => {
        //     setLoggedIn(r.token);
        //     console.log(r);
        // })
        // .catch(console.error);
    };

    const loggedInRoutes = (
        <Switch>
            <Route
                exact = { true }
                path = '/' >
                <App logout = { logout } />
            </Route>
            <Redirect to = '/' />
        </Switch>
    );

    const authRoutes = (
        <Switch>
            <Route
                path = '/login' >
                <SignIn />
            </Route>
            <Route
                path = '/signup' >
                <SignUp onSubmit = { onSubmitSignUp } />
            </Route>
            <Route
                component = { Reset }
                path = '/reset' />
            <Redirect to = '/login' />
        </Switch>
    );

    return (
        <Router basename = '/app'>
            <Switch>
                {token ? loggedInRoutes : authRoutes}
            </Switch>
        </Router>
    );
};

const mapStateToProps = state => {
    return { token: state['features/riff-platform'].signIn.token };
};

export default connect(mapStateToProps)(RiffPlatform);
