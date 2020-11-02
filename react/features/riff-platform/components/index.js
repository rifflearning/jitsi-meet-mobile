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
import { getJwt } from '../functions';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';

export const customHistory = createBrowserHistory();

const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: purple[600],
        },
        secondary: {
            main: purple[50],
        }
    },
  });

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
        <ThemeProvider theme={darkTheme}>
            <Router basename='/app' history={customHistory}>
                <div style={{display:'flex', flexDirection:'column', height:'100vh', backgroundColor:'#282725'}}>
                    <div>header</div>
                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                        <div style={{flex:1}}>
                            <Switch>
                                {getJwt() ? loggedInRoutes : authRoutes}
                            </Switch>
                        </div>
                        <div>footer</div>
                    </div>
                </div>
            </Router>
        </ThemeProvider>
    );
};

const mapStateToProps = state => {
    return { token: state['features/riff-platform'].signIn.token };
};

export default connect(mapStateToProps)(RiffPlatform);
