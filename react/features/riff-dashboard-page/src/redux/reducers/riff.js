/* ******************************************************************************
 * riff.js                                                                      *
 * *************************************************************************/ /**
 *
 * @fileoverview Riffdata redux reducer function
 *
 * Handler for redux actions which modify the riffdata server redux state.
 *
 * Created on       August 15, 2018
 * @author          Dan Calacci
 *
 * @copyright (c) 2018-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import {
    RIFF_AUTHENTICATE_FAIL,
    RIFF_AUTHENTICATE_SUCCESS,
    RIFF_IS_MEETING_STARTED_UPDATE,
    RIFF_MEETING_ID_UPDATE,
    RIFF_PARTICIPANTS_CHANGED,
    RIFF_TURN_UPDATE,
} from '../constants/ActionTypes';

const initialState = {
    meetingId: null,
    authToken: null,
    authError: null,
    isMeetingStarted: false,
    participants: [],
    turns: [],
    transitions: []
};

const riff = (state = initialState, action) => {
    switch (action.type) {
        case RIFF_AUTHENTICATE_SUCCESS:
            return { ...state, authToken: action.token, authError: null };

        case RIFF_AUTHENTICATE_FAIL:
            return { ...state, authToken: null, authError: action.error };

        case RIFF_IS_MEETING_STARTED_UPDATE:
            return { ...state, isMeetingStarted: action.isMeetingStarted };

        case RIFF_PARTICIPANTS_CHANGED:
            return { ...state, participants: action.participants };

        case RIFF_TURN_UPDATE:
            return { ...state, turns: action.turns, transitions: action.transitions };

        case RIFF_MEETING_ID_UPDATE:
            return { ...state, meetingId: action.meetingId };

        default:
            return state;
    }
};

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    riff,
};
