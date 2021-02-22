import { recordingController } from '../components/LocalRecorder/LocalRecorderController';
import * as actionTypes from '../constants/actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
    case actionTypes.LOCAL_RECORDING_ENGAGED: {
        return {
            ...state,
            isEngaged: action.isEngaged,
            encodingFormat: recordingController._format
        };
    }
    case actionTypes.LOCAL_RECORDING_STATS:
        return {
            ...state,
            stats: action.stats
        };
    case actionTypes.LOCAL_RECORDING_SET_SHARED_VIDEO_ID:
        return {
            ...state,
            sharedVideoId: action.id
        };
    default:
        return state;
    }
};
