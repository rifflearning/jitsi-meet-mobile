/* eslint-disable */
/* global APP, config */

import Sibilant from 'sibilant-webaudio';

import * as actionTypes from '../constants/actionTypes';
import { app, socket } from '../../riff-dashboard-page/src/libs/riffdata-client';

function setRiffServerRoomId(roomId) {
    return {
        type: actionTypes.SET_RIFF_SERVER_ROOM_ID,
        roomId
    };
}

export function attachSibilant(tracks) {
    return async (dispatch, getState) => {
        try {
            const stream = tracks.find(t => t.isAudioTrack())?.stream;
            if (!stream) return console.error('No audio stream. Error while attaching sibilant in attachSibilant action.');

            const speakingEvents = new Sibilant(stream);

            const { accessToken } = await loginToServerForSibilant();

            const userData = getState()['features/riff-platform'].signIn.user;
            const meetingUrl = getState()['features/recent-list'].pop()?.conference;
            const room = getState()['features/base/conference'].room;

            await riffAddUserToMeeting(userData, meetingUrl, room, accessToken);

            speakingEvents.bind('stoppedSpeaking', data => dispatch(sendUtteranceToServer(data, userData, room, accessToken)));      
        } catch (error) {
            console.error('Error while attachSibilant', error);
        }
    };
}

async function riffAddUserToMeeting({ uid, displayName, email }, meetingUrl, room, token) {
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

async function loginToServerForSibilant() {
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
        console.error('Error while loginToServerForSibilant', err);
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
