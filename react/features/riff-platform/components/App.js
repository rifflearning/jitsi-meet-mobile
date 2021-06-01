/* eslint-disable require-jsdoc */
/* global process */
/* eslint-disable react/jsx-sort-props */
/* eslint-disable react/jsx-no-bind */

import { makeStyles } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import { initialize as initRiffMetrics } from '@rifflearning/riff-metrics';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import { connect } from '../../base/redux';
import * as actionTypes from '../constants/actionTypes';
import { app as riffdataApp } from '../libs/riffdata-client';

import Header from './Header';
import Main from './Main';
import MeetingEndedPage from './MeetingEndedPage';
import Sidebar from './Sidebar';


const useStyles = makeStyles(() => {
    return {
        root: {
            display: 'flex',
            backgroundColor: '#282725'
        }
    };
});

async function loginToServerForSibilent() {
    try {
        await riffdataApp.authenticate({
            strategy: 'local',
            email: 'default-user-email',
            password: 'default-user-password'
        });
    } catch (err) {
        console.error('Error while loginToServerForSibilent', err);
    }
}

const App = ({ user, state }) => {
    const classes = useStyles();
    const [ isOpen, setIsOpen ] = React.useState(true);

    useEffect(() => {
        async function fetchMyAPI() {
            await loginToServerForSibilent();
        }

        fetchMyAPI();
    }, []);

    const metricsConfig = {
        serverConnections: { riffdataApp },
        actionTypes: {
            APP_USER_LOGOUT: actionTypes.LOGOUT,
            APP_USER_LOGIN: actionTypes.LOGIN_SUCCESS
        },
        selectors: {
            getCurrentUserId: () => user.uid,
            getMetrics: () => state.metrics,
            getIsRiffConnected: () => true
        }
    };

    initRiffMetrics(metricsConfig);

    const handleSidebarOpen = () => {
        setIsOpen(true);
    };
    const handleSidebarClose = () => {
        setIsOpen(false);
    };

    if (process.env.MATTERMOST_EMBEDDED_ONLY === 'true') {
        return (<div className = { classes.root }>
            <CssBaseline />
            <MeetingEndedPage />
        </div>);
    }

    return (
        <div className = { classes.root }>
            <CssBaseline />
            <Header
                handleSidebarOpen = { handleSidebarOpen }
                isOpen = { isOpen } />
            {Boolean(user) && <Sidebar
                handleSidebarClose = { handleSidebarClose }
                isOpen = { isOpen } />
            }
            <Main />
        </div>
    );
};

App.propTypes = {
    state: PropTypes.object,
    user: PropTypes.object
};

const mapStateToProps = state => {
    console.log('state', state);

    return {
        user: state['features/riff-platform'].signIn.user,
        state: state['features/riff-platform']

    };
};

export default connect(mapStateToProps)(App);
