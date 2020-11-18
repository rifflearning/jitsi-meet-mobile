import * as actionTypes from '../constants/actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
    case actionTypes.LOGIN_REQUEST:
        return { loading: true };
    case actionTypes.LOGIN_SUCCESS:
        return {
            loggedIn: true,
            user: action.user
        };
    case actionTypes.LOGIN_FAILURE:
        return { error: action.error };
    case actionTypes.LOGOUT:
        return {};

    default:
        return state;
    }
};
