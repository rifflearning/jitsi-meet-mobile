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

const streamsMixer = (audioStream, videoStream) => {
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

};

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

const getUserAudioTracks = participantsTrack => participantsTrack.map(tracks => tracks.jitsiTrack.stream);

const mixer = streamsArr => {

    const ctx = new AudioContext();
    const dest = ctx.createMediaStreamDestination();

    streamsArr.map(s => ctx.createMediaStreamSource(s).connect(dest)
    );

    return dest.stream.getAudioTracks();
};

export const getCombinedStream = async (audioStream, participantStreams) => {
    /* const auSteam = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
    });
    let recorderStream = auSteam;*/

    const videoStream = await navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: 'browser' },
        audio: false });


    // console.log('recorderStream', recorderStream);
    const tracks = new MediaStream([ ...videoStream.getVideoTracks(), ...mixer(getUserAudioTracks(participantStreams)) ]);

    return { mediaStream: new MediaRecorder(tracks, { mimeType: 'video/webm' }),
    recorderStream: tracks };
};

export const stopLocalVideo = async recorderStream => {
    console.log('recorderStream', recorderStream);
    recorderStream.getTracks().forEach(async track => {
        track.stop();
    });
};
