/* eslint-disable require-jsdoc */

import api from '../api';
import * as actionTypes from '../constants/actionTypes';

function schedulerRequest() {
    return {
        type: actionTypes.SCHEDULER_REQUEST
    };
}

function schedulerSuccess(meeting) {
    return {
        type: actionTypes.SCHEDULER_SUCCESS,
        meeting
    };
}

function schedulerFailure(error) {
    return {
        type: actionTypes.SCHEDULER_FAILURE,
        error
    };
}

export function schedule(meeting) {
    return async dispatch => {
        dispatch(schedulerRequest());

        try {
            const res = await api.scheduleMeeting(meeting);

            dispatch(schedulerSuccess(res));
        } catch (e) {
            dispatch(schedulerFailure(e.message));
        }
    };
}

export function updateSchedule(id, meeting) {
    return async dispatch => {
        dispatch(schedulerRequest());

        try {
            const res = await api.updateMeeting(id, meeting);

            dispatch(schedulerSuccess(res));
        } catch (e) {
            dispatch(schedulerFailure(e.message));
        }
    };
}

export function updateScheduleRecurring(roomId, meeting) {
    return async dispatch => {
        dispatch(schedulerRequest());

        try {
            const res = await api.updateMeetingsRecurring(roomId, meeting);

            dispatch(schedulerSuccess(res));
        } catch (e) {
            dispatch(schedulerFailure(e.message));
        }
    };
}

export function updateScheduleMultipleRooms(id, meeting) {
    return async dispatch => {
        dispatch(schedulerRequest());
        try {
            const res = await api.updateMeetingsMultipleRooms(id, meeting);
            
            dispatch(schedulerSuccess(res));
        } catch (e) {
            dispatch(schedulerFailure(e.message));
        }
    };
}

export function schedulerReset() {
    return {
        type: actionTypes.SCHEDULER_RESET
    };
}
