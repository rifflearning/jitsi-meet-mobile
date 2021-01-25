import logger from '../logger';

import { RecordingAdapter } from './RecordingAdapter';
import  {getCombinedStream } from '../../riff-platform/components/Local-Recorder/helpers';

/**
 * Recording adapter that uses {@code MediaRecorder} (default browser encoding
 * with Opus codec).
 */
export class OggAdapter extends RecordingAdapter {

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
     * The recorded audio file.
     * @private
     */
    _recordedData = null;

    /**
     * Implements {@link RecordingAdapter#start()}.
     *
     * @inheritdoc
     */
    start(micDeviceId) {
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
        return new Promise(
            resolve => {
                this._mediaRecorder.onstop = () => resolve();
                this._mediaRecorder.stop();
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
               // format: 'ogg'.
               format: 'webm'
            });
        }

        return Promise.reject('No audio data recorded.');
    }

    /**
     * Implements {@link RecordingAdapter#setMuted()}.
     *
     * @inheritdoc
     */
    setMuted(muted) {
        const shouldEnable = !muted;

       // console.log('this._stream', this._stream)

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
                this._stream = stream;
                const recorderStream = await getCombinedStream(stream);

                 //this._mediaRecorder = new MediaRecorder(stream);
                this._mediaRecorder = recorderStream;
                this._mediaRecorder.ondataavailable
                    = e => this._saveMediaData(e.data);
                resolve();
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
        this._recordedData = data;
    }
}
