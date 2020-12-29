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

function updateSchedulerRequest() {
    return {
        type: actionTypes.UPDATE_SCHEDULER_REQUEST
    };
}

function updateSchedulerSuccess(meeting) {
    return {
        type: actionTypes.UPDATE_SCHEDULER_SUCCESS,
        meeting
    };
}

function updateSchedulerFailure(error) {
    return {
        type: actionTypes.UPDATE_SCHEDULER_FAILURE,
        error
    };
}


export function updateSchedule(id, meeting) {
    return async dispatch => {
        dispatch(updateSchedulerRequest());

        try {
            const res = await api.updateMeeting(id, meeting);

            dispatch(updateSchedulerSuccess(res));
        } catch (e) {
            dispatch(updateSchedulerFailure(e.message));
        }
    };
}

export function updateScheduleRecurring(roomId, meeting) {
    return async (dispatch, getState) => {
        dispatch(updateSchedulerRequest());
        const state = getState();
        const currentMeeting = state['features/riff-platform'].meeting.meeting;

        try {
            await api.updateMeetingsRecurring(roomId, meeting);

            dispatch(updateSchedulerSuccess(currentMeeting));
        } catch (e) {
            dispatch(updateSchedulerFailure(e.message));
        }
    };
}

export function updateScheduleMultipleRooms(id, meeting) {
    return async (dispatch, getState) => {
        dispatch(updateSchedulerRequest());
        const state = getState();
        const currentMeeting = state['features/riff-platform'].meeting.meeting;

        try {
            await api.updateMeetingsMultipleRooms(id, meeting);

            dispatch(updateSchedulerSuccess(currentMeeting));
        } catch (e) {
            dispatch(updateSchedulerFailure(e.message));
        }
    };
}

export function schedulerReset() {
    return {
        type: actionTypes.SCHEDULER_RESET
    };
}

export function updateSchedulerReset() {
    return {
        type: actionTypes.UPDATE_SCHEDULER_RESET
    };
}
