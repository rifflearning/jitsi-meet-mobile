/* global APP, config */

import Sibilant from 'sibilant-webaudio';

import { setTileView } from '../video-layout';

import * as actionTypes from './actionTypes';
import { app, socket } from 'libs/riffdata-client';
import { subscribeToEmotionsData } from '../riff-emotions/actions';
import { sendStatsOnConnect } from './nodejs-browser-stats';
import RiffPlatform from '../riff-platform/components';
import api from '../riff-platform/api';
import { getJwt, setPrevPath } from '../riff-platform/functions';
import { navigateWithoutReload } from './functions';

export function setRiffServerRoomId(roomId) {
    return {
        type: actionTypes.SET_RIFF_SERVER_ROOM_ID,
        payload: roomId
    };
}

export function redirectToRiffMetrics() {
    return async (dispatch, getState) => {
        const { roomId, userData: { uid } } = getState()['features/riff-metrics'];

        await participantLeaveRoom(roomId, uid);

        navigateWithoutReload(RiffPlatform, '/app/dashboard');
    };
}

export function setTileViewByDefault() {
    return (dispatch, getState) => {
        if (!getState()['features/video-layout'].tileViewEnabled) {
            dispatch(setTileView(true));
        }
    };
}

export function attachSibilant(tracks) {
    return async (dispatch, getState) => {
        try {
            const stream = tracks.find(t => t.isAudioTrack())?.stream;
            if (!stream) return console.error('No audio stream. Error while attaching sibilant in attachSibilant action.');

            const speakingEvents = new Sibilant(stream);

            const { accessToken } = await loginToServerForSibilent();

            const userData = getState()['features/riff-metrics'].userData;
            const meetingUrl = getState()['features/recent-list'].pop()?.conference;
            const room = getState()['features/base/conference'].room;

            await riffAddUserToMeeting(userData, meetingUrl, room, accessToken);

            speakingEvents.bind('stoppedSpeaking', data => dispatch(sendUtteranceToServer(data, userData, room, accessToken)));      
        } catch (error) {
            console.error('Error while attachSibilant', error);
        }
    };
}

export async function riffAddUserToMeeting({ uid, displayName, email }, meetingUrl, room, token) {
    try {
        await socket.emit('meetingJoined', {
            participant: uid,
            email,
            name: displayName,
            room,
            description: 'default meeting description',
            meetingUrl,
            consent: true,
            consentDate: new Date().toISOString(),
            token
        });
    } catch (error) {
        console.error('Error while riffAddUserToMeeting action');
    }
}

export function participantLeaveRoom(meetingId, participantId) {
    return app.service('meetings').patch(meetingId, {
        remove_participants: [ participantId ]
    })
        .then(res => {
            // console.log(`Action.Riff: removed participant: ${participantId} from meeting ${meetingId}`, res);

            return true;
        })
        .catch(err => {
            console.error('Action.Riff: caught an error leaving the room:', err);

            return false;
        });
}

export async function loginToServerForSibilent() {
    try {

        const { accessToken, user: { _id: uid } } = await app.authenticate({
            strategy: 'local',
            email: 'default-user-email',
            password: 'default-user-password'
        });

        return { accessToken,
            uid
        };

    } catch (err) {
        console.error('Error while loginToServerForSibilent', err);
    }
}

function sendUtteranceToServer(data, {uid: participant}, room, token ) {
    return async (dispatch) => {
        try {
            const res = await app.service('utterances').create({
                participant,
                room,
                startTime: data.start.toISOString(),
                endTime: data.end.toISOString(),
                token
            });

            console.log({ createdUtter: res });

            dispatch(setRiffServerRoomId(res.meeting));

            return undefined;

        } catch (err) {
            console.error('Listener.WebRtc: ERROR', err);
        }
    }
}

export async function maybeRedirectToWaitingRoom() {
    return new Promise(res => {
        if (config.iAmRecorder) return res();

        api.fetchMeeting(window.location.pathname.split('/')[1]).then(meeting => {
            if (meeting === null) {
                // navigateWithoutReload(RiffPlatform);
                window.location.pathname = `/app/waiting/${window.location.pathname.split('/')[1]}`;
            } else {
                res();
            }
        });
        // if meeting exists,
        // and not allowAnonymous
        // if no auth
        // redir to auth, then to meeting/waiting room(if time isn't ok)
    
        // if meeting exists
        // and allowAnonymous
        // bypass auth, redir to meeting/waiting room(if time is'nt ok)

        // if no meeting,
        // redir to join room, say 'no meeting', propose to sign in/ sign up.

        // waiting room states: meeting exists, waiting time to meeting, authed
        // waiting room states: meet`ing exists, waiting time to meeting, no auth, propose to sign-up
        // join room states: meeting no exists, no auth/auth, propose to sign-up
    })
};

export function maybeRedirectToLoginPage() {
    return new Promise(res => {
        if (config.iAmRecorder) {
            return res()
        }
        api.isAuth().then(user => {
            if (user === null) {
                setPrevPath(window.location.pathname)
                navigateWithoutReload(RiffPlatform);
            } else {
                APP.store.dispatch({
                    type: 'LOGIN_SUCCESS',
                    token: getJwt()
                })
                
                const { uid, email, displayName } = user;

                APP.store.dispatch(setRiffFirebaseCredentials({
                    displayName: displayName || (email? email.split('@')[0] : 'Anonymous'),
                    email: email || 'anonymous',
                    uid
                }));

                res();
            }
        });
    });
};

export function setRiffFirebaseCredentials(userData) {
    return (dispatch) => {
        APP.conference.changeLocalDisplayName(`${userData.uid}|${userData.displayName}`);
        APP.conference.changeLocalEmail(userData.email);

        dispatch({
            type: actionTypes.SET_RIFF_FIREBASE_CREDENTIALS,
            payload: userData
        });
    }
};

export function startRiffServices(tracks) {
    return dispatch => {
        dispatch(setTileViewByDefault());

        maybeRedirectToLoginPage().then(() => {
            dispatch(attachSibilant(tracks));
            dispatch(subscribeToEmotionsData());

            sendStatsOnConnect();
        })
    }
};
