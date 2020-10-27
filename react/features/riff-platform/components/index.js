/* eslint-disable */
import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route, Redirect
} from 'react-router-dom';

import { connect } from '../../base/redux';
import { createBrowserHistory } from "history";
import DashboardPage from '../../riff-dashboard-page/src/dashboard-page';

import App from './App';
import SignIn from './SignIn';
import SignUp from './SignUp';

export const customHistory = createBrowserHistory();

const Reset = () => <div>Reset</div>;

const RiffPlatform = ({ token }) => {
    const loggedInRoutes = (
        <Switch>
            <Route
                exact = { true }
                path = '/' >
                <App />
            </Route>
            <Route
                component={DashboardPage}
                path = '/dashboard' />
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
                <SignUp />
            </Route>
            <Route
                component = { Reset }
                path = '/reset' />
            <Redirect to = '/login' />
        </Switch>
    );

    return (
        <Router basename = '/app' history={customHistory}>
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
