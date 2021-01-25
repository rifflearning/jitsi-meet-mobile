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

export const getCombinedStream = async audioStream => {
    const videoStream = await navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: 'browser' },
        audio: false });

    const recorderStream = audioStream ? streamsMixer(audioStream, videoStream) : videoStream;

    // console.log('recorderStream', recorderStream);

    return new MediaRecorder(recorderStream, { mimeType: 'video/webm' });
};

export const stopLocalVideo = async streams => {
    streams.forEach(async stream => {
        stream.getTracks().forEach(async track => {
            track.stop();
        });
    });
};
