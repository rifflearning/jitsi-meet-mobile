/* eslint-disable require-jsdoc */
import { localRecordingUnengaged } from '../../../local-recording/actions';
import { recordingController } from '../../../local-recording/controller';
import { isScreenShareSourceAvailable } from '../../../riff-dashboard-page/src/libs/utils';

import { webmController } from './WebmAdapter';

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
        if (newUserStream.getAudioTracks().length) {
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

export const stopLocalRecordingHandling = ({ dispatch, getState }, user) => {

    if (getState()['features/local-recording'].isEngaged && user._role === 'moderator') {
       // user._conference.removeCommand('localRecStart');
        webmController.handleStopNoMaderator();
    }
};
