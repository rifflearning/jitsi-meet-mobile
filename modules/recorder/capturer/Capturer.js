import io from 'socket.io-client';


class Capturer {
    constructor(room, roomId, userId, stream) {
        this._socket = null;
        this._isLive = false;
        this._room = room;
        this._roomId = roomId;
        this._userId = userId;
        this._capturer = new ImageCapture(stream.getVideoTracks()[0]);
        // log user's frame data to be visible inside jibri
        this._capturer.getPhotoCapabilities().then(capabilities => {
            console.log(`Photo capabilities for ${this._userId}: `);
            console.log(capabilities);
        });
    }

    /**
     * Connects to socket and initializes capturing process
     * 
     * @returns {void}
     */
    connect = async (dispatcherUrl) => {
        let capabilities = await this._capturer.getPhotoCapabilities();
        this._socket = io(dispatcherUrl);
        this._socket.on('connect', () => {
            console.log(`Send server-ping ${this._userId}`);
            this._socket.emit('server-ping', this._userId);
        });
        this._socket.on('server-pong', data => {
            console.log(`Received server-pong ${this._userId}`)
            this._isLive = true;
            this._socket.emit('add', {room: this._room, roomId: this._roomId, userId: this._userId});
            this._pushNextFrame();
        });
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
                this._socket.emit('next-frame', {room: this._room, roomId: this._roomId, userId: this._userId, image: blob});
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
        if (this._isLive) {
            this._socket.emit('remove', {room: this._room, roomId: this._roomId, userId: this._userId});
        }
        this._isLive = false;
        this._socket.close();
    }
}

export default Capturer;
