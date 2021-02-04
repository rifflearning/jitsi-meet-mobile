/* global config, APP */
/* eslint-disable require-jsdoc */

import Sibilant from 'sibilant-webaudio';

import UIEvents from '../../../../service/UI/UIEvents';
import { app, socket } from '../../riff-dashboard-page/src/libs/riffdata-client';
import * as actionTypes from '../constants/actionTypes';

function setRiffServerRoomId(roomId) {
    return {
        type: actionTypes.SET_RIFF_SERVER_ROOM_ID,
        roomId
    };
}

export function attachSibilant(tracks) {
    return async (dispatch, getState) => {
        try {
            const { accessToken } = await loginToServerForSibilant();

            const userData = getState()['features/riff-platform'].signIn.user;
            const { roomId: room, name: title } = getState()['features/riff-platform'].meeting.meeting;

            await riffAddUserToMeeting(userData, room, accessToken, title);

            if (config.iAmRecorder) {
                const mockData = {
                    start: new Date(),
                    end: new Date()
                };

                dispatch(sendUtteranceToServer(mockData, userData, room, accessToken));

                return;
            }

            let oldStream = null;

            const stream = tracks.find(t => t.isAudioTrack())?.stream || null;

            // attach initialStream
            if (stream) {
                reconnectSibilant(stream);
            }

            // try attach sibilant on devicelist change
            document.addEventListener('RIFF_UPDATE_DEVICE_LIST', () => reconnectSibilant());

            // try attach sibilant on change audio device // setTimeout as a temprorary solution
            APP.UI.addListener(UIEvents.AUDIO_DEVICE_CHANGED, () => setTimeout(() => reconnectSibilant(), 1000));

            // eslint-disable-next-line no-inner-declarations
            function reconnectSibilant(initialStream) {
                // eslint-disable-next-line max-len
                const newStream = initialStream || APP.store.getState()['features/base/conference'].conference?.getLocalAudioTrack().stream;

                if (newStream && newStream !== oldStream) {
                    oldStream = newStream;
                    const speakingEvents = new Sibilant(newStream);

                    speakingEvents.bind(
                            'stoppedSpeaking',
                            data => dispatch(sendUtteranceToServer(data, userData, room, accessToken))
                    );
                }
            }
        } catch (error) {
            console.error('Error while attachSibilant', error);
        }
    };
}

async function riffAddUserToMeeting({ uid, displayName, context = '' }, room, token, title) {
    try {
        socket.emit('meetingJoined', {
            participant: uid,
            name: displayName,
            room,
            title,
            context,
            token
        });
    } catch (error) {
        console.error('Error while riffAddUserToMeeting action');
    }
}

export function participantLeaveRoom(meetingId, participantId) {
    return app.service('meetings').patch(meetingId, {
        // eslint-disable-next-line camelcase
        remove_participants: [ participantId ]
    })
        .then(() => true)
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

        return {
            accessToken,
            uid
        };
    } catch (err) {
        console.error('Error while loginToServerForSibilant', err);
    }
}

function sendUtteranceToServer(data, { uid: participant }, room, token) {
    return async dispatch => {
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
    };
}
