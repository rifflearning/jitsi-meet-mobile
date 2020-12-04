import io from 'socket.io-client';
import { FRAME } from './constants';


class Capturer {
    constructor(room, roomId, userId, stream) {
        this._socket = null;
        this._room = room;
        this._roomId = roomId;
        this._userId = userId;

        // used for stream processing 
        this._video = document.createElement('video');
        this._canvas = document.createElement('canvas');

        // holds interval to cancel when capturing is terminated
        this._interval = null;

        // indicates whether or not streaming is on and we can capture frames from it
        this._streaming = false;

        // width of frame, set to the default value
        this._frameWidth = null;

        // height of frame, calculated based on the aspect ratio of the input stream
        this._frameHeight = null;

        this._video.srcObject = stream;
        this._video.addEventListener('canplay', () => {
            this._streaming = true;
            this._frameWidth = FRAME.WIDTH;
            this._frameHeight = this._video.videoHeight / (this._video.videoWidth / FRAME.WIDTH);
        }, false);
        
        this._video.play();
    }

    /**
     * Creates socket connection and initialises capturing process
     * 
     * @param {String} dispatcherUrl - The url that socket will use to connect
     * @returns {void}
     */
    connect = (dispatcherUrl) => {
        this._socket = io(dispatcherUrl);
        this._socket.on('connect', () => {
            this._socket.emit('server-ping', this._userId);
        });
        this._socket.on('server-pong', () => {
            this._socket.emit('add', { 
                room: this._room, 
                roomId: this._roomId, 
                userId: this._userId 
            });
            this._init();
        });
    }

    /**
     * Infinite loop of capturing next available frame from the stream
     * 
     * @returns {void}
     */
    _init = () => {
        this._interval = setInterval(async () => {
            try {
                const frame = await this._captureFrame();
                this._socket.emit('next-frame', { 
                    room: this._room, 
                    roomId: this._roomId, 
                    userId: this._userId, 
                    image: frame 
                });
            } catch (err) {
                console.error(err);
            }
        }, FRAME.PULLING_DELAY);
    }

    /**
     * Captures a frame from the stream by drawing it into a canvas
     * 
     * @returns {Promise}
     */
    _captureFrame = () => {
        return new Promise((resolve, reject) => {
            if (this._streaming) {
                const context = this._canvas.getContext('2d');
                this._canvas.width = this._frameWidth;
                this._canvas.height = this._frameHeight;
            
                context.drawImage(this._video, 0, 0, this._frameWidth, this._frameHeight);

                this._canvas.toBlob(resolve, 'image/jpeg', 1);
            } else {
                reject('video stream is not ready for capturing yet');
            }
        });
    }

    /**
     * Closes all resources
     * 
     * @returns {void}
     */
    disconnect = () => {
        this._socket.emit('remove', {
            room: this._room, 
            roomId: this._roomId, 
            userId: this._userId
        });
        this._socket.close();
    }
}

export default Capturer;
