import Capturer from './Capturer';
import { 
    getUserIdByParticipantId, 
    getTrackByParticipantId, 
    selectUpdatedParticipants 
} from './functions';


class Capturers {
    constructor() {
        // holds a map between participant and video stream capturer
        this._capturers = new Map();

        // holds a link to dispatcher resource for analysis processes creation
        this._dispatcherUrl = null;
    }

    start = (dispatcherUrl) => {
        this._dispatcherUrl = dispatcherUrl;
        // init call to avoid waiting for first update in store
        this._handleParticipantsUpdate();

        APP.store.subscribe(this._handleParticipantsUpdate);
    }

    _handleParticipantsUpdate = () => {
        const update = selectUpdatedParticipants(Array.from(this._capturers.keys()));

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
    }

    stop = () => {
        for (let capturer of this._capturers.values()) {
            capturer.disconnect();
        }

        this._capturers.clear();
    }

}

export default new Capturers();
