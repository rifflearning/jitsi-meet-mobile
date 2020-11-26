/* eslint-disable object-property-newline */
/* eslint-disable curly */
/* eslint-disable require-jsdoc */

import api from '../api';
import * as actionTypes from '../constants/actionTypes';
import * as errorTypes from '../constants/errorTypes';

function meetingRequest() {
    return {
        type: actionTypes.MEETING_REQUEST
    };
}

function meetingSuccess(meeting) {
    return {
        type: actionTypes.MEETING_SUCCESS,
        meeting
    };
}

function meetingFailure(error) {
    return {
        type: actionTypes.MEETING_FAILURE,
        error
    };
}

export function getMeeting(meetingId) {
    return async dispatch => {
        dispatch(meetingRequest());
        let meeting = null;

        try {
            const res = await api.fetchMeeting(meetingId);

            if (res) {
                meeting = res;
                dispatch(meetingSuccess(meeting));
            } else {
                dispatch(meetingFailure('No meeting with this ID'));
            }
        } catch (error) {
            dispatch(meetingFailure('No meeting with this ID'));
            console.error('Error in getMeeting', error);
        }

        return meeting;
    };
}

export function checkIsMeetingAllowed(meetingId) {
    return async (dispatch, getState) => {
        try {
            const meeting = await dispatch(getMeeting(meetingId));

            if (!meeting) return null;

            // is time to meeting left less than 5 minutes
            if (timeToMeeting(meeting) > 5 * 60 * 1000) return { error: errorTypes.NOT_A_MEETING_TIME, meeting };

            const isHost = meeting.createdBy === getState()['features/riff-platform'].signIn.user.uid;

            // if waitForHost required, check if host entered
            // eslint-disable-next-line max-len
            if (!isHost && meeting.waitForHost && !isHostEntered(meeting)) return { error: errorTypes.NO_HOST_ERROR, meeting };

            // if host, send isHostJoined - timestamp;
            if (meeting.waitForHost && isHost) await sendIsHostJoinedTimeStamp(meeting); // or not await?

            return meeting;
        } catch (error) {
            return { error };
        }
    };
}

// externalize check functions

function timeToMeeting(meeting) {
    return new Date(meeting.dateStart).getTime() - Date.now();
}

async function sendIsHostJoinedTimeStamp(meeting) {
    try {
        await api.updateMeeting(meeting._id, { hostJoinedAt: new Date() });
    } catch (error) {
        console.error('Error in checkIsMeetingAllowed, api.updateMeeting', error);
    }
}

function isHostEntered(meeting) {
    if (meeting.hostJoinedAt) {

        // host joined not older than 2 hours
        const fiveHours = 2 * 60 * 60 * 1000;
        const fiveMinutes = 5 * 60 * 1000;
        const hostJoinedAtDate = new Date(meeting.hostJoinedAt);
        const timeFromHostJoined = Date.now() - hostJoinedAtDate;
        const timeFromMeetingCouldStart = new Date(meeting.dateStart) - fiveMinutes;
        // eslint-disable-next-line max-len
        const isJoinedNotLongAgo = fiveHours > timeFromHostJoined && hostJoinedAtDate > timeFromMeetingCouldStart;

        return isJoinedNotLongAgo;
    }

    return false;
}
