/* global APP */

import { MEDIA_TYPE, FEATURES } from './constants';


/**
 * Collects the list of all video streams that are not muted
 *
 * @returns {Array}
 */
export function getAllActiveVideoTracks() {
    return APP.store.getState()[FEATURES.TRACKS]
            .filter(track => track.mediaType === MEDIA_TYPE.VIDEO)
            .filter(track => !track.muted);
};

/**
 * Returns userId associated with given participantId
 *
 * @returns {String}
 */
export function getUserIdByParticipantId(participantId) {
    const participant = APP.store.getState()[FEATURES.PARTICIPANTS]
            .find(participant => participant.id === participantId); 
    
    return participant.name.split(`|`)[0];
};

/**
 * Returns track associated with given participantId
 *
 * @returns {String}
 */
export function getTrackByParticipantId(participantId) {
    return APP.store.getState()[FEATURES.TRACKS]
            .filter(track => track.mediaType === MEDIA_TYPE.VIDEO)
            .find(track => track.participantId === participantId); 
};

/**
 * Collects a list of all participants with active streams
 *
 * @returns {Array}
 */
export function getParticipantsWithActiveStreams() {
    return APP.store.getState()[FEATURES.TRACKS]
            .filter(track => track.mediaType === MEDIA_TYPE.VIDEO)
            .map(track => track.participantId);
};

/**
 * Returns an object that represents difference between
 * current participants in store and last known list of them
 *
 * @returns {Object}
 */
export function selectUpdatedParticipants(last) {
    const current = getParticipantsWithActiveStreams();

    return {
        left: new Set([...last].filter(x => !current.has(x))),
        joined: new Set([...current].filter(x => !last.has(x)))
    }
};
