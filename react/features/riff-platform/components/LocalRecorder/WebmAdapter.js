/* eslint-disable require-jsdoc */
import logger from '../../../local-recording/logger';
import { RecordingAdapter } from '../../../local-recording/recording';

import { recordingController } from './LocalRecorderController';
import { getCombinedStream, stopLocalVideo, addNewAudioStream } from './helpers';

/**
 * The argument slices the recording into chunks, calling dataavailable every defined seconds.
 */
const MEDIARECORDER_TIMESLICE = 1000;

/**
 * Defined max size for blob(MB).
 */
const MEDIARECORDER_MAX_SIZE = 2;

/**
 * Recording adapter that uses {@code MediaRecorder}
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
    _recordedData = [];

    /**
     * The recorded  stream.
     * @private
     */
    _recorderStream = null;

    /**
     * The array of participant streams.
     * @private
     */
   _participatsStream = [];

    /**
     * The {@code JitsiConference} instance.
     *
     * @private
     */
    _conference = null;

    _called = 0;

    /**
     * Implements {@link RecordingAdapter#start()}.
     *
     * @inheritdoc
     */
    start(micDeviceId, conference) {
        this._conference = conference;

        this._participatsStream = this._getAudioParticipantsStream() || [];

        if (!this._initPromise) {
            this._initPromise = this._initialize(micDeviceId);
        }

        return this._initPromise.then(() =>
            new Promise(resolve => {
                this._mediaRecorder.start(MEDIARECORDER_TIMESLICE);
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
            async resolve => {
                this._mediaRecorder.onstop = () => resolve();
                this._mediaRecorder.stop(stopLocalVideo(this._recorderStream));
            }
        );
    }

    /**
     * Returns the remote participant audio stream.
     *
     * @param {Object} participant - The participant object.
     * @returns {*}
     */
    _getAudioParticipantStream(participant) {
        if (participant._tracks?.length) {

            return participant._tracks.find(t => t.mediaType === 'audio')?.stream;
        }
    }

    /**
     * Returns array of remote participants audio stream.
     *
     * @returns {*}
     */
    _getAudioParticipantsStream() {
        const participantsAudioStreamArray = this._conference.getParticipants()
          .filter(participant => this._getAudioParticipantStream(participant));

        return participantsAudioStreamArray.length || [];
    }

    /**
     * Implements {@link RecordingAdapter#exportRecordedData()}.
     *
     * @inheritdoc
     */
    exportRecordedData() {
        if (this._recordedData.length) {
            const blobData = new Blob(this._recordedData, { type: 'video/webm' });

            return Promise.resolve({
                data: blobData,
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

        this._initialize();

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
     * Add new audio stream to AudioContext.
     *
     * @private
     * @param {MediaStream} newAudioStream - The new participant audio stream.
     * @returns {void}
     */

    _addNewParticipantAudioStream(newAudioStream) {
        if (newAudioStream.getAudioTracks().length) {
            addNewAudioStream(newAudioStream);
        }
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
            .then(async userAudioStream => {

                const allParticipatsAudioStreams = this._participatsStream.concat(userAudioStream);

                getCombinedStream(allParticipatsAudioStreams)
                .then(mediaStream => {
                    this._stream = userAudioStream;
                    this._mediaRecorder = new MediaRecorder(mediaStream, { mimeType: 'video/webm' });
                    this._recorderStream = mediaStream;

                    this._mediaRecorder.ondataavailable = e => this._onMediaDataAvailable(e.data);
                    resolve();

                    this._recorderStream.getVideoTracks()[0].onended = () => {
                        logger.log('Capture stream inactive');

                        return recordingController.stopRecording();
                    };

                    // this._recorderStream.oninactive = () => recordingController.stopRecording();
                })
                .catch(err => {
                    logger.error(`Error calling getUserMedia(): ${err}`);
                    error();
                });
            })
            .catch(err => {
                logger.error(`Error calling getUserMedia(): ${err}`);
                error();
            });
        });
    }

    /**
     * Callback for checking/storing the data.
     *
     * @private
     * @param {Blob} data - Encoded data.
     * @returns {void}
     */
    _onMediaDataAvailable(data) {
        const currentRecordingBlob = new Blob(this._recordedData, { type: 'video/webm' });
        const sizeInMB = currentRecordingBlob.size / (1024 * 1024);

        if (sizeInMB < MEDIARECORDER_MAX_SIZE) {
            this._saveMediaData(data);
        } else if (this._called === 0) {
            recordingController.stopRecording();
            if (recordingController._onWarning) {
                recordingController._onWarning('Memory limit exceeded. Please start local recording again.');
            }
            this._called = this._called + 1;
        }
    }


    /**
     * Callback for storing the data.
     *
     * @private
     * @param {Blob} data - Encoded data.
     * @returns {void}
     */
    _saveMediaData(data) {
        this._recordedData.push(data);
    }

    /**
     * Implements {@link RecordingAdapter#setMicDevice()}.
     *
     * @inheritdoc
     */
    setMicDevice(micDeviceId) {
        return this._replaceMic(micDeviceId);
    }
}

export const webmController = new WebmAdapter();

