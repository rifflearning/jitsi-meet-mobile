/* eslint-disable camelcase */
import * as actionTypes from '../actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
    case actionTypes.PROFILE_REQUEST:
        return { loading: true };
    case actionTypes.PROFILE_SUCCESS:
        return { profile: action.payload };
    case actionTypes.PROFILE_FAILURE:
        return { error: action.error };

    default:
        return state;
    }
};
