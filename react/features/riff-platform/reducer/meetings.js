import * as actionTypes from '../constants/actionTypes';

const initialState = { meetingsLists: [] };

export default (state = initialState, action) => {
    switch (action.type) {
    case actionTypes.MEETINGS_REQUEST:
        return { loading: true };
    case actionTypes.MEETINGS_SUCCESS:
        return { meetingsLists: action.meetingsLists };
    case actionTypes.MEETINGS_FAILURE:
        return { error: action.error };

    default:
        return state;
    }
};
