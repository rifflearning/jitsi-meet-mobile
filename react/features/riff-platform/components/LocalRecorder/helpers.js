/* eslint-disable require-jsdoc */
import { isScreenShareSourceAvailable } from '../../../riff-dashboard-page/src/libs/utils';

import { COMMAND_START, COMMAND_STOP } from './LocalRecorderController';

class AudioStreamsMixer {

    initializeAudioContext(streamsArr) {
        this.ctx = new AudioContext();
        this.dest = this.ctx.createMediaStreamDestination();
        streamsArr.length && streamsArr.forEach(stream => {
            if (stream.getAudioTracks().length) {
                this.ctx.createMediaStreamSource(stream).connect(this.dest);
            }
        });

        return this.dest.stream.getAudioTracks();
    }

    addNewStream(newUserStream) {
        if (this.ctx && newUserStream.getAudioTracks().length) {
            this.ctx.createMediaStreamSource(newUserStream).connect(this.dest);
        }

    }
}

const audioStreamsMixer = new AudioStreamsMixer();

export const addNewAudioStream = newParticipantStream => {
    audioStreamsMixer.addNewStream(newParticipantStream);
};

const createDesktopTrack = () => {

    const getDesktopStreamPromise = navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: 'browser' },
        audio: false });

    return getDesktopStreamPromise.then(desktopStream => desktopStream, error => {
        throw new Error(error);
    });
};

export const getCombinedStream = async participantStreams => {
    if (!isScreenShareSourceAvailable()) {
        throw new Error('Screen sharing is not supported in this browser.');
    }

    return createDesktopTrack().then(desktopStream => {
        const audioTrack = audioStreamsMixer.initializeAudioContext(participantStreams);
        const mediaStream = new MediaStream(desktopStream.getVideoTracks().concat(audioTrack));

        return mediaStream;
    })
    .catch(error => Promise.reject(error));
};

export const stopLocalVideo = async recorderStream => {
    recorderStream.getTracks().forEach(async track => {
        track.stop();
    });
};

export const stopLocalRecordingHandling = user => {
    const checkUserLocalRecordingStatus = JSON.parse(user._properties?.localRecStats || null);

    if (checkUserLocalRecordingStatus?.isRecording) {
        user._conference.removeCommand(COMMAND_START);
        user._conference.sendCommand(COMMAND_STOP, {
            attributes: {
                sessionToken: checkUserLocalRecordingStatus?.currentSessionToken
            }
        });
    }
};
