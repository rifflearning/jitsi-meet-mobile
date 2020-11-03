import io from 'socket.io-client';


class Capturer {
    constructor(participantId, serverUrl, stream) {
        this._participantId = participantId;
        this._socket = io(serverUrl);
        this._capturer = new ImageCapture(stream.getVideoTracks()[0]);

        // temporary
        this._capturer.getPhotoCapabilities().then(capabilities => {
            console.log("Photo capabilities: ");
            console.log(capabilities);
        });

        this._socket.on('connect', () => {
            socket.emit('participantId', this._participantId);
        });
    }

    /**
     * Sends message to the socket with frame 
     * if socket is open, otherwise just drops it
     * 
     * @returns {void}
     */
    send = async () => {
        if (socket.connected) {
            try {
                const blob = await this._capturer.takePhoto();
                // temporary
                console.log(`Generated frame for ${this._participantId}, url: ${URL.createObjectURL(blob)}`);
                this._socket.emit("frame", blob);
            } catch (err) {
                console.error(err);
            }
        }
    }

    /**
     * Closes socket connection
     * 
     * @returns {void}
     */
    stop = () => {
        this._socket.close();
    }
}

export default Capturer;
