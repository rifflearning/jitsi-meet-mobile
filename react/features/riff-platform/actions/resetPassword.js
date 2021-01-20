/* eslint-disable require-jsdoc */

import api from '../api';
import * as actionTypes from '../constants/actionTypes';


function resetPasswordRequest() {
    return {
        type: actionTypes.RESET_REQUEST
    };
}

function resetPasswordSuccess(success) {
    return {
        type: actionTypes.RESET_SUCCESS,
        success
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
            await api.resetPassword({ email,
                password });

            // eslint-disable-next-line max-len
            return dispatch(resetPasswordSuccess('The password has successfully been changed. You can now login with the new password. You will land to login page in 5 seconds'));

        } catch (e) {
            if (e.status === 404) {
                dispatch(resetPasswordFailure('User is not exist. Please register before using this service.'));
            } else {
                dispatch(resetPasswordFailure('Error in reset password'));
            }
        }
    };
}

export function hideResetMessage() {
    return {
        type: actionTypes.RESET_HIDE_MESSAGE
    };
}

