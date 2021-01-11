import * as actionTypes from '../constants/actionTypes';

const initialState = {
    isOpen: false
};

export default (state = initialState, action) => {
    switch (action.type) {
    case actionTypes.TOGGLE_MEETING_MEDIATOR:
        return { ...state,
            isOpen: !state.isOpen };
    default:
        return state;
    }
};
