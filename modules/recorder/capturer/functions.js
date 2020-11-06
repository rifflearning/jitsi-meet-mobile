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
}
