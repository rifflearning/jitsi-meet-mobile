import * as ROUTES from './constants/routes';

// Save room name before redirecting to signIn page, so we could redirect back to meeting after login.
export const previousLocationRoomName = {
    isPrevPathRoomName: path => path?.split('/')[1] && (path?.split('/')[1] !== ROUTES.BASENAME.slice(1)),
    get() {
        const prevPathname = sessionStorage.getItem('prevPathname');

        sessionStorage.removeItem('prevPathname');

        return prevPathname;
    },
    set(pathName) {
        if (this.isPrevPathRoomName(pathName)) {
            sessionStorage.setItem('prevPathname', pathName);
        }
    }
};

export const jwt = {
    get() {
        return localStorage.getItem('jwt-token');
    },
    set(token) {
        localStorage.setItem('jwt-token', token);
    },
    remove() {
        localStorage.removeItem('jwt-token');
    }
};

/**
 * Groups meetingsLists to object: {Today: meetingList, [otherDate]: meetingList ...}.
 *
 * @param {Array} meetings - Array of meetings from db.
 * @returns {string} - Returns object map of meetings: {Today: meetingObj, 'thu, 04 04': meetingObj}.
 */
export function groupMeetingsByDays(meetings) {
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
}

/**
 * Transforms milliseconds to duration string time.
 *
 * @param {number} startDate - Start date in milliseconds.
 * @param {number} endDate - End date in milliseconds.
 * @returns {string} - Returns in format: HH:MM - HH:MM.
 */
export function formatDurationTime(startDate, endDate) {
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
}

/**
 * Transforms milliseconds to string time.
 *
 * @param {number} milliseconds - Date in milliseconds.
 * @returns {string} - Returns in format: DD days and HH:MM:SS..
 */
export function msToTime(milliseconds) {
    // eslint-disable-next-line no-confusing-arrow
    const addZero = i => i < 10 ? `0${i}` : i;

    let s = milliseconds;
    const ms = s % 1000;

    s = (s - ms) / 1000;
    const secs = s % 60;

    s = (s - secs) / 60;
    const mins = s % 60;

    s = (s - mins) / 60;
    const hrs = s % 24;

    const d = (s - hrs) / 24;
    const days = d ? `${d} ${d === 1 ? 'day' : 'days'} and ` : '';

    return `${days}${addZero(hrs)}:${addZero(mins)}:${addZero(secs)}`;
}

/**
 * Checks if current pathname equals to riff-platform basename.
 *
 *
 * @returns {boolean} - True if we're on platform, false if on roomId or '/'.
 */
export function isRiffPlatformCurrentPath() {
    return window.location.pathname.split('/')[1] === ROUTES.BASENAME.slice(1);
}
