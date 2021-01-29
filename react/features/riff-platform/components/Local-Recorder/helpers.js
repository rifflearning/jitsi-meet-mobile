/* eslint-disable require-jsdoc */
const addStreamStopListener = (stream, callback) => {
    stream.addEventListener('ended', () => {
        callback();

        // callback = () => { };
    }, false);
    stream.addEventListener('inactive', () => {
        callback();

        // callback = () => { };
    }, false);
    stream.getTracks().forEach(track => {
        track.addEventListener('ended', () => {
            callback();

            //  callback = () => { };
        }, false);
        track.addEventListener('inactive', () => {
            callback();

            // callback = () => { };
        }, false);
    });
    stream.getVideoTracks()[0].onended = () => {
        stop();
    };
};

/*const streamsMixer = (audioStream, videoStream) => {
    const ctx = new AudioContext();
    const dest = ctx.createMediaStreamDestination();

    if (audioStream.getAudioTracks().length > 0) {
        ctx.createMediaStreamSource(audioStream).connect(dest);
    }

    if (videoStream.getAudioTracks().length > 0) {
        ctx.createMediaStreamSource(videoStream).connect(dest);
    }

    let tracks = dest.stream.getTracks();

    tracks = tracks.concat(audioStream.getVideoTracks()).concat(videoStream.getVideoTracks());

    return new MediaStream(tracks);

};*/

const invokeGetDisplayMedia = (success, error) => {
    const displaymediastreamconstraints = {
        video: { displaySurface: 'browser' },
        audio: true
    };

    if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia(displaymediastreamconstraints).then(success)
  .catch(error);
    } else {
        navigator.getDisplayMedia(displaymediastreamconstraints).then(success)
  .catch(error);
    }
};

// const ctx = new AudioContext();
// const dest = ctx.createMediaStreamDestination();


class Mixer {

    initialize(streamsArr) {
        this.ctx = new AudioContext();
        this.dest = this.ctx.createMediaStreamDestination();
        console.log('streamsArr', streamsArr)
        streamsArr.length && streamsArr.map(s => {
            if (s.getAudioTracks().length) {
                this.ctx.createMediaStreamSource(s).connect(this.dest);
            }
        });

        return this.dest.stream.getAudioTracks();
    }

    addNewStream(newUserStream) {
        if (newUserStream.getAudioTracks().length) {
            console.log(this)
             this.ctx.createMediaStreamSource(newUserStream).connect(this.dest);
        }

    }
}

const audioStreamsMixer = new Mixer();




const mixer = streamsArr => {

    const ctx = new AudioContext();
    const dest = ctx.createMediaStreamDestination();
    streamsArr.length && streamsArr.map(s => {
        if (s.getAudioTracks().length) {
            ctx.createMediaStreamSource(s).connect(dest);
        }
    }
    );

    return dest.stream.getAudioTracks();
};


export const updateAudio = newUserStream => {
    console.log('newUserStream', newUserStream);
    audioStreamsMixer.addNewStream(newUserStream);
};


export const getCombinedStream = async participantStreams => {


    /* const auSteam = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
    });
    let recorderStream = auSteam;*/

    const videoStream = await navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: 'browser' },
        audio: false });

    const audioTrack = audioStreamsMixer.initialize(participantStreams);
    const mediaStream = new MediaStream([ ...videoStream.getVideoTracks(), ...audioTrack ]);

    //  mediaStream.getTracks().forEach(track => {
    // pc.addTrack(track, mediaStream);
    // });

    // const audioTracks = mediaStream.getAudioTracks()[0];

    // console.log('audioTrack', audioTrack)

    //  const fromLocalPeerConnection = new RTCPeerConnection();
    //  const toLocalPeerConnection = new RTCPeerConnection();

    //  const audioSender = fromLocalPeerConnection.addTrack(audioTrack, mediaStream);

    // const [ playlistAudioTrack ] = audioTrack.getAudioTracks();

    // const audioSender = peerConnection.addStream(mediaStream);

    // await audioSender.replaceTrack(audioTrack);


    return { mediaStream: new MediaRecorder(mediaStream, { mimeType: 'video/webm' }),
        recorderStream: mediaStream };

};

function newParticipantAdded(stream) {
    console.log('adding');
    console.log('sharing screen');
    const newStream = stream;

    // replace video
    const audioTracks = newStream.getAudioTracks();
    const audioTrack = audioTracks[0];

    const senders = pc.getSenders();

    // console.log(senders);
    const sender = senders.find(s => s.track.kind === audioTrack.kind);

    sender.replaceTrack(audioTrack); // this is where we get issues

    // localVideo.srcObject = screenShareStream;

    return true;
}


export const stopLocalVideo = async recorderStream => {
    console.log('recorderStream', recorderStream);
    recorderStream.getTracks().forEach(async track => {
        track.stop();
    });
};
