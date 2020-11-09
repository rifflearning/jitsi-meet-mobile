import Capturer from './Capturer';
import { 
    getUserIdByParticipantId, 
    getTrackByParticipantId, 
    selectUpdatedParticipants 
} from './functions';


export default {

    /**
     * Holds a map between participant and video stream capturer
     */
    _capturers: new Map(),

    /**
     * Holds a link to dispatcher resource for analysis processes creation
     */
    _dispatcherUrl: null,

    start(dispatcherUrl) {
        this._dispatcherUrl = dispatcherUrl;
        this._handleParticipantsUpdate(); // init call to avoid waiting for first update in store

        APP.store.subscribe(this._handleParticipantsUpdate);
    },

    _handleParticipantsUpdate() {
        const update = selectUpdatedParticipants(this._capturers.keys());

        for (let participantId of update.left) {
            this._capturers.get(participantId).disconnect();
            this._capturers.delete(participantId);
        }

        for (let participantId of update.joined) {
            const track = getTrackByParticipantId(participantId);
            const userId = getUserIdByParticipantId(participantId);
            const stream = track.jitsiTrack.stream;
            const capturer = new Capturer(userId, stream);
            
            this._capturers.set(participantId, capturer);
            capturer.connect(this._dispatcherUrl);
        }
    },

    stop() {
        for (let capturer of this._capturers.values()) {
            capturer.disconnect();
        }

        this._capturers.clear();
    }

};
