import io from 'socket.io-client';


class Capturer {
    constructor(room, roomId, userId, track) {
        this._canvas = document.createElement('canvas');
        this._socket = null;
        this._isLive = false;
        this._room = room;
        this._roomId = roomId;
        this._userId = userId;
        this._capturer = new ImageCapture(track);
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
        //let capabilities = await this._capturer.getPhotoCapabilities();
        this._socket = io(dispatcherUrl);
        this._socket.on('connect', () => {
            console.log(`Send server-ping ${this._userId}`);
            this._socket.emit('server-ping', this._userId);
        });
        this._socket.on('server-pong', () => {
            console.log(`Received server-pong ${this._userId}`)
            this._isLive = true;
            this._socket.emit('add', { room: this._room, roomId: this._roomId, userId: this._userId });
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
                const bitmap = await this._capturer.grabFrame();
                const blob = await this._processFrame(bitmap);
                this._socket.emit('next-frame', { room: this._room, roomId: this._roomId, userId: this._userId, image: blob });
                this._pushNextFrame(); // schedule next one
            } catch (err) {
                console.error(err);
            }
        }
    }

    /**
     * Converts {ImageBitmap} to JPEG by drawing it into canvas
     * 
     * @returns {Promise}
     */
    _processFrame = (bitmap) => {
        return new Promise((resolve, reject) => {
            const context = this._canvas.getContext('2d');
            this._canvas.width = bitmap.width;
            this._canvas.height = bitmap.height;
            
            context.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height);

            this._canvas.toBlob(resolve, 'image/jpeg', 1);
        });
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
