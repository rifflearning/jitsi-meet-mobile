/* eslint-disable require-jsdoc */

import api from '../api';
import * as actionTypes from '../constants/actionTypes';

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
    return async dispatch => {
        try {
            const meeting = await dispatch(getMeeting(meetingId));

            if (!meeting) {
                return null;
            }

            const timeToMeeting = new Date(meeting.dateStart).getTime() - Date.now();

            if (timeToMeeting > 5 * 60 * 1000) {
                return { error: 'not a meeting time',
                    meeting };
            }

            return meeting;
        } catch (error) {
            return { error };
        }
    };
}
