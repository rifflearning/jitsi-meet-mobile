/* eslint-disable require-jsdoc */

import api from '../api';
import * as actionTypes from '../constants/actionTypes';

function meetingsRequest() {
    return {
        type: actionTypes.MEETINGS_REQUEST
    };
}

function meetingsSuccess(meetingsLists) {
    return {
        type: actionTypes.MEETINGS_SUCCESS,
        meetingsLists
    };
}

function meetingsFailure(error) {
    return {
        type: actionTypes.MEETINGS_FAILURE,
        error
    };
}

export function getMeetings(listType) {
    return async dispatch => {
        dispatch(meetingsRequest());

        try {
            const res = await api.fetchMeetings(listType);
            
            dispatch(meetingsSuccess(res));
        } catch (e) {
            console.error('Error in getMeetings', e);
            dispatch(meetingsFailure(e.message));
        }
    };
}

export function getMeetingsByGroup(groupName, listType) {
    return async dispatch => {
        dispatch(meetingsRequest());

        try {
            const res = await api.fetchMeetingsByGroup(groupName, listType);

            dispatch(meetingsSuccess(res));
        } catch (e) {
            console.error('Error in getMeetingsByGroup', e);
            dispatch(meetingsFailure(e.message));
        }
    };
}

export function getMeetingsRecurring(roomId, listType) {
    return async dispatch => {
        dispatch(meetingsRequest());

        try {
            const res = await api.fetchMeetingsRecurring(roomId, listType);

            dispatch(meetingsSuccess(res));
        } catch (e) {
            console.error('Error in getMeetingsRecurring', e);
            dispatch(meetingsFailure(e.message));
        }
    };
}

export function deleteMeeting(id) {
    return async (dispatch, getState) => {

        const state = getState();
        const meetingsListType = state['features/riff-platform'].meetings.listType;

        try {
            await api.deleteMeeting(id);
            dispatch(getMeetings(meetingsListType));
        } catch (e) {
            console.error('Error in deleteMeeting', e);
        }
    };
}

export function deleteMeetingsMultipleRooms(id) {
    return async (dispatch, getState) => {

        const state = getState();
        const meetingsListType = state['features/riff-platform'].meetings.listType;

        try {
            await api.deleteMeetingsMultipleRooms(id);
            dispatch(getMeetings(meetingsListType));
        } catch (e) {
            console.error('Error in deleteMeetingsMultipleRooms', e);
        }
    };
}

export function deleteMeetingsRecurring(roomId) {
    return async (dispatch, getState) => {

        const state = getState();
        const meetingsListType = state['features/riff-platform'].meetings.listType;

        try {
            await api.deleteMeetingsRecurring(roomId);
            dispatch(getMeetings(meetingsListType));
        } catch (e) {
            console.error('Error in deleteMeetingsMultipleRooms', e);
        }
    };
}

export function setMeetingsListType(listType) {
    return {
        type: actionTypes.SET_MEETINGS_LIST_TYPE,
        listType
    };
}
