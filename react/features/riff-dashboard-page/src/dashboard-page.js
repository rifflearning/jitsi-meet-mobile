/* ******************************************************************************
 * index.jsx                                                                    *
 * *************************************************************************/ /**
 *
 * @fileoverview Setup/initialization of the Riff react SPA
 *
 * Created on       August 7, 2017
 * @author          Jordan Reedie
 * @author          Dan Calacci
 *
 * @copyright (c) 2017 Riff Learning,
 *            See LICENSE.txt for license information.
 *
 * ******************************************************************************/

// import 'webrtc-adapter'; // see https://bloggeek.me/webrtc-adapter-js/ for what this does.

// TODO: WHY? If this isn't here, video chat crashes when someone joins!
//       And yet as far as I can tell this package is only supposed to be used
//       for development. -mjl 2018-10-15
// import 'react-hot-loader';

// import 'sass/main.scss';

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { persistor, store } from 'Redux/store';
import { getRtcServerVer } from 'Redux/selectors/config';
import { logger } from 'libs/utils';

import { browserHistory } from './history';
import { Helmet } from 'react-helmet';

import { NavBar } from 'Components/NavBar';
import { Dashboard } from 'Components/Dashboard';
import { firebaseApp } from './libs/utils/firebase_utils';

logger.info(`Running riff-rtc server version ${getRtcServerVer()}\n\n`);

// We don't have access to jitsi's store here, so paste data manually
const setRiffFirebaseCredentials = (userData) => {
    const riffMetrics = JSON.parse(localStorage.getItem('features/riff-metrics')) || {};
    riffMetrics.userData = userData;
    localStorage.setItem('features/riff-metrics',JSON.stringify(riffMetrics));
}

const DashboardPage = () => {
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const unsubscribe = firebaseApp.auth().onAuthStateChanged(user => {
            if (user === null) {
                localStorage.setItem('prevPathname', window.location.pathname);
                window.location.href = '/static/login.html';
            } else {
                const { displayName, email, uid } = user;
                setRiffFirebaseCredentials({ displayName, email, uid })
                setIsAuth(true);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    if (!isAuth) return <div />;

    return <div>
        <Helmet defaultTitle='Riff' titleTemplate='%s - Riff' />
        <div>
            <NavBar
                activeRoute={'/riffs'}
            />
            <div id='main-content-container'>
                <Dashboard />
            </div>
        </div>
    </div>
}

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <ConnectedRouter history={browserHistory}>
              <DashboardPage />
            </ConnectedRouter>
        </PersistGate>
    </Provider>,
    document.getElementById('root')
);