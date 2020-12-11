/* eslint-disable require-jsdoc */

import api from '../api';
import * as actionTypes from '../constants/actionTypes';

import { signInSuccess } from './signIn';

function resetPasswordRequest() {
    return {
        type: actionTypes.RESET_REQUEST
    };
}

function resetPasswordSuccess(token) {
    return dispatch => {

        dispatch({ type: actionTypes.RESET_SUCCESS });

     return dispatch(signInSuccess(token));
    };
}

function resetPasswordFailure(error) {
    return {
        type: actionTypes.RESET_FAILURE,
        error
    };
}

export function resetPassword({ email, password }) {
    return async dispatch => {
        dispatch(resetPasswordRequest());

        try {
            const res = await api.resetPassword({ email,
                password });
                console.log('res', res)

            return dispatch(resetPasswordSuccess(res.token));
        } catch (e) {
            if (e.status === 404) {
                dispatch(resetPasswordFailure('User is not exists. Please register before using this service.'));
            } else {
                dispatch(resetPasswordFailure('Error in reset password'));
            }
        }
    };
}

