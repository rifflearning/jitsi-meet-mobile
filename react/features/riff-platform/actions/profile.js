/* eslint-disable require-jsdoc */

import api from '../api';
import * as actionTypes from '../constants/actionTypes';

function profileRequest() {
    return {
        type: actionTypes.PROFILE_REQUEST
    };
}

function profileSuccess(payload) {
    return {
        type: actionTypes.PROFILE_SUCCESS,
        payload
    };
}

function profileFailure(error) {
    return {
        type: actionTypes.PROFILE_FAILURE,
        error
    };
}

export function getProfile() {
    return async dispatch => {
        dispatch(profileRequest());

        try {
            const res = await api.fetchProfile();

            dispatch(profileSuccess(res));
        } catch (e) {
            dispatch(profileFailure(e.message));
        }
    };
}

