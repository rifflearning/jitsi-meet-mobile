import * as actionTypes from '../constants/actionTypes';

const initialState = {
    meetingsLists: [],
    listType: 'upcoming'
};

export default (state = initialState, action) => {
    switch (action.type) {
    case actionTypes.MEETINGS_REQUEST:
        return { ...state,
            loading: true };
    case actionTypes.MEETINGS_SUCCESS:
        return { ...state,
            loading: false,
            meetingsLists: action.meetingsLists };
    case actionTypes.MEETINGS_FAILURE:
        return { error: action.error };
    case actionTypes.SET_MEETINGS_LIST_TYPE:
        return { ...state,
            listType: action.listType };
    default:
        return state;
    }
};
