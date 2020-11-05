import io from 'socket.io-client';


class Capturer {
    constructor(participantId, stream) {
        this._socket = null;
        this._isLive = false;
        this._participantId = participantId;
        this._capturer = new ImageCapture(stream.getVideoTracks()[0]);

        // log participant's frame data to be visible inside jibri
        this._capturer.getPhotoCapabilities().then(capabilities => {
            console.log(`Photo capabilities for ${participantId}: `);
            console.log(capabilities);
        });
    }

    /**
     * Connects to socket and initializes capturing process
     * 
     * @returns {void}
     */
    connect = async (dispatcherUrl) => {
        let response = await fetch(`${dispatcherUrl}/job/${participantId}`);
        if (response.ok) { 
            let json = await response.json();
            this._socket = io(`${json.data.ip}:${json.data.port}`);

            this._socket.on('connect', () => {
                this._isLive = true;
                this._pushNextFrame();
            });
        } 
        else {
            console.error(`Cannot establish connection with server: ${dispatcherUrl}`);
        }
    }

    /**
     * Infinite loop of capturing next available frame in stream
     * 
     * @returns {void}
     */
    _pushNextFrame = async () => {
        if (this._isLive) {
            try {
                const blob = await this._capturer.takePhoto();
                this._socket.send(blob);
                this._pushNextFrame(); // schedule next one
            } catch (err) {
                console.error(err);
            }
        }
    }

    /**
     * Stops frames pushing and closes socket connection
     * 
     * @returns {void}
     */
    disconnect = () => {
        this._isLive = false;
        this._socket.close();
    }
}

export default Capturer;
