/* eslint-disable require-jsdoc */
import { deleteMeeting, deleteMeetingsRecurring } from '../actions/meetings';
import api from '../api';
import * as actionTypes from '../constants/actionTypes';
import { checkMeetingSingleOccurrenceDate } from '../functions';

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
            dispatch(deleteMeeting(id));
            dispatch(schedule(meeting));
            dispatch(updateSchedulerSuccess(meeting));
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
            dispatch(deleteMeetingsRecurring(roomId));
            dispatch(schedule(meeting));
            dispatch(updateSchedulerSuccess(currentMeeting));
        } catch (e) {
            dispatch(updateSchedulerFailure(e.message));
        }
    };
}

export function updateScheduleRecurringSingleOccurrence(id, roomId, meeting) {
    return async dispatch => {
        dispatch(updateSchedulerRequest());

        try {
            const meetings = await api.fetchMeetingsRecurring(roomId, 'upcoming');
            const isMeetingDateValid = checkMeetingSingleOccurrenceDate({ meetingId: id,
                meeting,
                meetingsRecurring: meetings });

            if (isMeetingDateValid) {

                const res = await api.updateMeeting(id, meeting);

                dispatch(updateSchedulerSuccess(res));
            } else {
                dispatch(updateSchedulerFailure('This occurrence has conflicts with an existing occurrence.'));
            }
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
