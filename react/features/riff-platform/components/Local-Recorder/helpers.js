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

export const getCombinedStream = async (audioStream, isModerator) => {
    let recorderStream = audioStream;

    if (isModerator) {
        const videoStream = await navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: 'browser' },
            audio: true });

        recorderStream = streamsMixer(audioStream, videoStream);
    }

    // console.log('recorderStream', recorderStream);

    return { mediaStream: new MediaRecorder(recorderStream, { mimeType: 'video/webm' }),
        recorderStream };
};

export const stopLocalVideo = async recorderStream => {
    console.log('recorderStream', recorderStream);
    recorderStream.getTracks().forEach(async track => {
        track.stop();
    });
};
