/* eslint-disable require-jsdoc */

class AudioStreamsMixer {

    initializeAudioContext(streamsArr) {
        this.ctx = new AudioContext();
        this.dest = this.ctx.createMediaStreamDestination();
        streamsArr.length && streamsArr.map(stream => {
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


export const getCombinedStream = async participantStreams => {


    const videoStream = await navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: 'browser' },
        audio: false });

    const audioTrack = audioStreamsMixer.initializeAudioContext(participantStreams);
    const mediaStream = new MediaStream(videoStream.getVideoTracks().concat(audioTrack));

    return mediaStream;

};

export const stopLocalVideo = async recorderStream => {
    recorderStream.getTracks().forEach(async track => {
        track.stop();
    });
};
