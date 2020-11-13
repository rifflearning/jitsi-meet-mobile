import * as actionTypes from '../constants/actionTypes';
import { getJwt } from '../functions';

const token = getJwt();
const initialState = token ? { loggedIn: true,
    token } : {};

export default (state = initialState, action) => {
    switch (action.type) {
    case actionTypes.LOGIN_REQUEST:
        return { loading: true };
    case actionTypes.LOGIN_SUCCESS:
        return {
            loggedIn: true,
            token: action.token
        };
    case actionTypes.LOGIN_FAILURE:
        return { error: action.error };
    case actionTypes.LOGOUT:
        return {};

    default:
        return state;
    }
};
