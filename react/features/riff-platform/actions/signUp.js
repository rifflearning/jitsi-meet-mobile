/* eslint-disable require-jsdoc */

import api from '../api';
import * as actionTypes from '../constants/actionTypes';

import { signInSuccess } from './signIn';

function signUpRequest() {
    return {
        type: actionTypes.REGISTER_REQUEST
    };
}

function signUpSuccess(token) {
    return dispatch => {

        dispatch({ type: actionTypes.REGISTER_SUCCESS });

        return dispatch(signInSuccess(token));
    };
}

function signUpFailure(error) {
    return {
        type: actionTypes.REGISTER_FAILURE,
        error
    };
}

export function signUp({ email, password, name }) {
    return async dispatch => {
        dispatch(signUpRequest());

        try {
            const res = await api.signUp({ name,
                email,
                password });

            return dispatch(signUpSuccess(res.token));
        } catch (e) {
            if (e.status === 401) {
                dispatch(signUpFailure('User already exists'));
            } else {
                dispatch(signUpFailure('Error in signUp'));
            }
        }
    };
}

