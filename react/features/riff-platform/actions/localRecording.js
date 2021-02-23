/* @flow */

import {
    LOCAL_RECORDING_ENGAGED,
    LOCAL_RECORDING_STATS,
    LOCAL_RECORDING_SET_SHARED_VIDEO_ID
} from '../constants/actionTypes';

// The following action signals state changes in local recording engagement.
// In other words, the events of the local WebWorker / MediaRecorder starting to
// record and finishing recording.
// Note that this is not the event fired when the users tries to start the
// recording in the UI.

/**
 * Signals that local recording has been engaged.
 *
 * @param {Date} isEngaged - Local recording is engaged.
 * @returns {{
 *     type: LOCAL_RECORDING_ENGAGED,
 *     isEngaged: boolean
 * }}
 */
export function localRecordingEngaged(isEngaged: Boolean) {
    return {
        type: LOCAL_RECORDING_ENGAGED,
        isEngaged
    };
}

/**
 * Local recording stats.
 *
 * @param {*} stats - The stats object.
 * @returns {{
 *     type: LOCAL_RECORDING_STATS_UPDATE,
 *     stats: Object
 * }}
 */
export function localRecordingStats(stats: Object) {
    return {
        type: LOCAL_RECORDING_STATS,
        stats
    };
}

/**
 * YouTube video id for add/remove user microphone with local recording.
 *
 * @param {string} id - The shared YouTube video id.
 * @returns {{
    *     type: LOCAL_RECORDING_SET_SHARED_VIDEO_ID,
    *     id: string
    * }}
    */
export function setSharedVideoId(id: string) {
    return {
        type: LOCAL_RECORDING_SET_SHARED_VIDEO_ID,
        id
    };
}
