import Capturer from './Capturer';
import { getAllActiveVideoTracks } from './functions';


export default {

    /**
     * Holds a list of participant's video stream capturers
     */
    _capturers: [],

    /**
     * Holds an interval for scheduling frame pulling 
     */
    _interval: null,

    /**
     * Holds delay value in ms beetwen frame pulling
     */
    _delay: 50,

    _init(serverUrl) {
        getAllActiveVideoTracks().forEach(track => {
            const participantId = track.participantId;
            const stream = track.jitsiTrack.stream;

            this._capturers.push(new Capturer(participantId, serverUrl, stream));
        });
    },

    start(serverUrl) {
        const tracks = getAllActiveVideoTracks() || [];
        
        if (!tracks.length) {
            console.error('Error while start capturer. Will try again in 2 seconds...');
            setTimeout(() => this.start(serverUrl), 2000);
            return;
        }

        this._init(serverUrl);

        this._interval = setInterval(() => {
            this._capturers.forEach(capturer => capturer.send());
        }, this._delay);
    },

    stop() {
        clearInterval(this._interval);
        
        for (let capturer of this._capturers) {
            capturer.stop();
        }
    }

};
