# lib-jitsi-meet

## Purpose
We use *lib-jitsi-meet* as the core technology for our media capturing component. The Jitsi Meet APIs have been used to create Jitsi Meet video conferences 
with a custom GUI.

We intend to build a media capturing component which connects to a vidoebridge as an hidden user to aquire media tracks (video and audio) and distribute the media 
frames via a message bus to various subscribers.

![Image](https://github.com/rifflearning/riff-jitsi-platform/blob/main/docs/Jitsi-Meet-Pipeline.png)

## lib-jitsi-meet internals
### Components
* ![JitsiMeetJS](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-ljm-api#jitsimeetjs)
* ![JitsiConnection](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-ljm-api#jitsiconnection)
* ![JitsiConference](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-ljm-api#jitsiconference)
* ![JitsiTrack](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-ljm-api#jitsitrack)
* ![JitsiTrackError](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-ljm-api#jitsitrackerror)


### Build
>NOTE: you need Node.js >= 12 and npm >= 6

To build the library, just type:
```sh
npm install
```

To lint:

npm run lint

and to run unit tests:

npm test

if you need to rebuild lib-jitsi-meet.min.js

npm run postinstall

Both linting and units will also be done by a pre-commit hook.

