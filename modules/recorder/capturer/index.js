import Capturer from './Capturer';
import { getAllActiveVideoTracks, getUserIdByParticipantId } from './functions';


export default {

    /**
     * Holds a map between participant and video stream capturer
     */
    _capturers: new Map(),

    start(dispatcherUrl) {
        const tracks = getAllActiveVideoTracks() || [];
        
        if (!tracks.length) {
            console.error('Error while start capturer. Will try again in 1 second...');
            setTimeout(() => this.start(dispatcherUrl), 1000);
            return;
        }
        
        tracks.forEach(track => {
            const participantId = track.participantId;
            const userId = getUserIdByParticipantId(participantId);
            const stream = track.jitsiTrack.stream;

            this._capturers.set(participantId, new Capturer(userId, stream));
        });

        for (let capturer of this._capturers.values()) {
            capturer.connect(dispatcherUrl);
        }
    },

    stop() {
        for (let capturer of this._capturers.values()) {
            capturer.disconnect();
        }
    }

};
