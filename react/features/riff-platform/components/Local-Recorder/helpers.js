/* eslint-disable require-jsdoc */
import { isScreenShareSourceAvailable } from '../../../riff-dashboard-page/src/libs/utils';

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
            console.log(this);
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
