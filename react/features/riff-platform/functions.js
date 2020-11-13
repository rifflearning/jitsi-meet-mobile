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

export const groupMeetingsByDays = meetings => {
    if (!meetings || !meetings.length) {
        return {};
    }

    const nowDate = new Date().toString()
        .slice(0, 15);

    const transformDate = timestamp => {
        const formatedDate = new Date(timestamp).toString()
            .slice(0, 15);

        return nowDate === formatedDate ? 'Today' : formatedDate.slice(0, 10);
    };

    const groupedMeetings = {};

    meetings.forEach(el => {
        if (groupedMeetings[transformDate(el.dateStart)]) {
            groupedMeetings[transformDate(el.dateStart)].push(el);
        } else {
            groupedMeetings[transformDate(el.dateStart)] = [ el ];
        }
    });

    return groupedMeetings;
};

export const formatDurationTime = (startDate, endDate) => {
    // eslint-disable-next-line no-confusing-arrow
    const addZero = i => i < 10 ? `0${i}` : i;

    const dateStart = new Date(startDate);
    const timeStart = `${addZero(dateStart.getHours())}:${addZero(dateStart.getMinutes())}`;

    if (!endDate) {
        return timeStart;
    }

    const dateEnd = new Date(endDate);
    const timeEnd = `${addZero(dateEnd.getHours())}:${addZero(dateEnd.getMinutes())}`;

    return `${timeStart} - ${timeEnd}`;
};