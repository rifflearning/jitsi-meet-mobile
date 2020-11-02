/* global APP */

import { _navigate } from '../app/middleware';

import { customHistory } from './components';

export const getJwt = () => localStorage.getItem('jwt-token');

export const setJwt = token => {
    localStorage.setItem('jwt-token', token);
};

export const removeJwt = () => {
    localStorage.removeItem('jwt-token');
};

export const getPrevPath = () => sessionStorage.getItem('prevPathname');

export const setPrevPath = pathName => {
    sessionStorage.setItem('prevPathname', pathName);
};

export const navigateToConference = conferencePath => {
    customHistory.push(conferencePath);
    _navigate({ getState: APP.store.getState });
};
