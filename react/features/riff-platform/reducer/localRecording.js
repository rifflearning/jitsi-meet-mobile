import { recordingController } from '../components/LocalRecorder/LocalRecorderController';
import * as actionTypes from '../constants/actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
    case actionTypes.LOCAL_RECORDING_ENGAGED: {
        return {
            ...state,
            isEngaged: true,
            recordingEngagedAt: action.recordingEngagedAt,
            encodingFormat: recordingController._format
        };
    }
    case actionTypes.LOCAL_RECORDING_UNENGAGED:
        return {
            ...state,
            isEngaged: false,
            recordingEngagedAt: null
        };
    case actionTypes.LOCAL_RECORDING_STATS_UPDATE:
        return {
            ...state,
            stats: action.stats
        };

    case actionTypes.LOCAL_RECORDING_MEMORY_LIMIT_EXCEEDED: {
        return {
            ...state,
            isMemoryLimitExceeded: action.isMemoryLimitExceeded
        };
    }
    default:
        return state;
    }
};
