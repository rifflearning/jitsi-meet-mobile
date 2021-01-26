import logger from '../../../local-recording/logger';
import { RecordingAdapter } from '../../../local-recording/recording';

import { getCombinedStream, stopLocalVideo } from './helpers';

/**
 * Recording adapter that uses {@code MediaRecorder} (default browser encoding
 * with Opus codec).
 */
export default class WebmAdapter extends RecordingAdapter {

    /**
     * Instance of MediaRecorder.
     * @private
     */
    _mediaRecorder = null;

    /**
     * Initialization promise.
     * @private
     */
    _initPromise = null;

    /**
     * The recorded media file.
     * @private
     */
    _recordedData = null;

    /**
     * The recorded  stream.
     * @private
     */
    _recorderStream = null;


    _isModerator = false;

    /**
     * Implements {@link RecordingAdapter#start()}.
     *
     * @inheritdoc
     */
    start(micDeviceId, conference) {
        this._isModerator = conference.isModerator();

        if (!this._isModerator) {
            return Promise.resolve();
        }
        if (!this._initPromise) {
            this._initPromise = this._initialize(micDeviceId);
        }

        return this._initPromise.then(() =>
            new Promise(resolve => {
                this._mediaRecorder.start();
                resolve();
            })
        );
    }

    /**
     * Implements {@link RecordingAdapter#stop()}.
     *
     * @inheritdoc
     */
    stop() {
        if (!this._isModerator) {
            return Promise.resolve();
        }

        return new Promise(
            async resolve => {
                this._mediaRecorder.onstop = () => resolve();
                this._mediaRecorder.stop(stopLocalVideo(this._recorderStream));
                //this._mediaRecorder.getVideoTracks()[0].onended = () => resolve();


                // stopLocalVideo(this._stream);
                //  this._mediaRecorder.destroy();
            }
        );
    }

    /**
     * Implements {@link RecordingAdapter#exportRecordedData()}.
     *
     * @inheritdoc
     */
    exportRecordedData() {
        if (this._recordedData !== null) {
            // console.log('this._recordedData ', this._recordedData);

            return Promise.resolve({
                data: this._recordedData,
                format: 'webm'
            });
        }

        return Promise.reject('No media data recorded.');
    }

    /**
     * Implements {@link RecordingAdapter#setMuted()}.
     *
     * @inheritdoc
     */
    setMuted(muted) {
        const shouldEnable = !muted;

        console.log('this._stream', this._stream);

        if (!this._stream) {
            return Promise.resolve();
        }

        const track = this._stream.getAudioTracks()[0];

        if (!track) {
            logger.error('Cannot mute/unmute. Track not found!');

            return Promise.resolve();
        }

        if (track.enabled !== shouldEnable) {
            track.enabled = shouldEnable;
            logger.log(muted ? 'Mute' : 'Unmute');
        }

        return Promise.resolve();
    }

    /**
     * Initialize the adapter.
     *
     * @private
     * @param {string} micDeviceId - The current microphone device ID.
     * @returns {Promise}
     */
    _initialize(micDeviceId) {
        if (this._mediaRecorder) {
            return Promise.resolve();
        }

        return new Promise((resolve, error) => {
            this._getAudioStream(micDeviceId)
            .then(async stream => {
                console.log('inside stream', stream);
                this._stream = stream;

                console.log('ISModerator------', this._isModerator);
                const { mediaStream, recorderStream } = await getCombinedStream(stream, this._isModerator);

                // this._mediaRecorder = new MediaRecorder(stream);
                this._recorderStream = recorderStream;
                this._mediaRecorder = mediaStream;
                this._mediaRecorder.ondataavailable
                    = e => this._saveMediaData(e.data);
                resolve();

                this._mediaRecorder.onended = e => {
                    console.log('Capture stream inactive');
                    stop();
                };
            })
            .catch(err => {
                logger.error(`Error calling getUserMedia(): ${err}`);
                error();
            });
        });
    }

    /**
     * Callback for storing the encoded data.
     *
     * @private
     * @param {Blob} data - Encoded data.
     * @returns {void}
     */
    _saveMediaData(data) {
        console.log('data', data);
        this._recordedData = data;
    }

    /**
     * Implements {@link RecordingAdapter#setMicDevice()}.
     *
     * @inheritdoc
     */
    setMicDevice(micDeviceId) {
        console.log('chnage micDeviceId', micDeviceId)
        return this._replaceMic(micDeviceId);
    }
}

