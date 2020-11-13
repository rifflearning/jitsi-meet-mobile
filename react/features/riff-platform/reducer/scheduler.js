import * as actionTypes from '../constants/actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
    case actionTypes.SCHEDULER_REQUEST:
        return { loading: true };
    case actionTypes.SCHEDULER_SUCCESS:
        return { meeting: action.meeting };
    case actionTypes.SCHEDULER_FAILURE:
        return { error: action.error };
    case actionTypes.SCHEDULER_RESET:
        return {};

    default:
        return state;
    }
};
