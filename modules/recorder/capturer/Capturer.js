import io from 'socket.io-client';


class Capturer {
    constructor(participantId, dispatcherUrl, stream) {
        this._socket = null;
        this._connectionEstablished = false;
        this._participantId = participantId;
        this._capturer = new ImageCapture(stream.getVideoTracks()[0]);

        // temporary
        this._capturer.getPhotoCapabilities().then(capabilities => {
            console.log("Photo capabilities: ");
            console.log(capabilities);
        });

        let response = await fetch(`${dispatcherUrl}/job/${participantId}`);
        if (response.ok) { 
            let json = await response.json();
            this._socket = io(`${json.data.ip}:${json.data.port}`);
            
            this._socket.on('connect', () => {
                this._connectionEstablished = true;
            });
        } 
        else {
            console.error(`Cannot establish connection with server: ${dispatcherUrl}`);
        }
    }

    /**
     * Sends message to the socket with frame 
     * if socket is open, otherwise just drops it
     * 
     * @returns {void}
     */
    send = async () => {
        if (this._connectionEstablished) {
            try {
                const blob = await this._capturer.takePhoto();
                // temporary
                console.log(`Generated frame for ${this._participantId}, url: ${URL.createObjectURL(blob)}`);
                this._socket.send(blob);
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
