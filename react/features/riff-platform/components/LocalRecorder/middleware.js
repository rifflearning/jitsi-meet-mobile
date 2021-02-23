/* @flow */

import { createShortcutEvent, sendAnalytics } from '../../../analytics';
import { APP_WILL_UNMOUNT } from '../../../base/app/actionTypes';
import { CONFERENCE_JOINED, CONFERENCE_WILL_LEAVE } from '../../../base/conference/actionTypes';
import { toggleDialog, openDialog, hideDialog } from '../../../base/dialog/actions';
import { i18next } from '../../../base/i18n';
import { SET_AUDIO_MUTED } from '../../../base/media/actionTypes';
import { PARTICIPANT_JOINED, PARTICIPANT_LEFT } from '../../../base/participants/actionTypes';
import { MiddlewareRegistry } from '../../../base/redux';
import { SETTINGS_UPDATED } from '../../../base/settings/actionTypes';
import { TRACK_ADDED } from '../../../base/tracks/actionTypes';
import { LocalRecordingInfoDialog } from '../../../local-recording/components';
import { showNotification } from '../../../notifications/actions';
import { localRecordingEngaged, localRecordingStats, setSharedVideoId } from '../../actions/localRecording';

import DownloadInfoDialog from './DownloadInfoDialog';
import { recordingController } from './LocalRecorderController';
import { createUserAudioTrack } from './helpers';

declare var APP: Object;

MiddlewareRegistry.register(({ getState, dispatch }) => next => action => {
    const result = next(action);

    switch (action.type) {
    case CONFERENCE_JOINED: {
        const { localRecording } = getState()['features/base/config'];
        const isLocalRecordingEnabled = Boolean(
            localRecording
            && localRecording.enabled
            && typeof APP === 'object'
        );

        if (!isLocalRecordingEnabled) {
            break;
        }

        // realize the delegates on recordingController, allowing the UI to
        // react to state changes in recordingController.
        recordingController.onStateChanged = isEngaged => dispatch(localRecordingEngaged(isEngaged));

        recordingController.onStatusUpdated = stats => {
            dispatch(localRecordingStats(stats));

            if (stats?.isRecording) {
                const isVideoShared = [ 'playing', 'pause', 'start' ]
                    .includes(getState()['features/shared-video'].status);
                const { sharedVideoId } = getState()['features/riff-platform'].localRecording;

                if (isVideoShared) {
                    createUserAudioTrack().then(audioStream => {
                        recordingController.onNewParticipantAudioStreamAdded(audioStream, sharedVideoId);
                        dispatch(showNotification({
                            title: i18next.t('localRecording.localRecording'),
                            description: 'Local recording use your microphone for recording YouTube audio'
                        }, 10000));
                    })
                .catch(error => Promise.reject(error));
                }
            }
        };

        recordingController.onWarning = (messageKey, messageParams) => {
            dispatch(showNotification({
                title: i18next.t('localRecording.localRecording'),
                description: i18next.t(messageKey, messageParams)
            }, 10000));
        };

        recordingController.onNotify = (messageKey, messageParams) => {
            dispatch(showNotification({
                title: i18next.t('localRecording.localRecording'),
                description: i18next.t(messageKey, messageParams)
            }, 10000));
        };

        recordingController.onMemoryExceeded = isExceeded => {
            if (isExceeded) {
                dispatch(openDialog(DownloadInfoDialog));
            } else {
                dispatch(hideDialog(DownloadInfoDialog));
            }
        };

        typeof APP === 'object' && typeof APP.keyboardshortcut === 'object'
            && APP.keyboardshortcut.registerShortcut('L', null, () => {
                sendAnalytics(createShortcutEvent('local.recording'));
                dispatch(toggleDialog(LocalRecordingInfoDialog));
            }, 'keyboardShortcuts.localRecording');

        const { conference } = getState()['features/base/conference'];
        const meetingName = getState()['features/riff-platform']?.meeting?.meeting?.name;

        recordingController.registerEvents(conference, meetingName);

        break;
    }
    case APP_WILL_UNMOUNT:
        recordingController.onStateChanged = null;
        recordingController.onNotify = null;
        recordingController.onWarning = null;
        break;
    case SET_AUDIO_MUTED:
        recordingController.setMuted(action.muted);
        break;
    case SETTINGS_UPDATED: {
        const { micDeviceId } = getState()['features/base/settings'];

        if (micDeviceId) {
            recordingController.setMicDevice(micDeviceId);
        }
        break;
    }
    case TRACK_ADDED: {
        const isRecording = getState()['features/riff-platform'].localRecording?.stats?.isRecording;
        const { conference } = getState()['features/base/conference'];
        const { track } = action;

        if (!track || track.local || !isRecording || !conference) {
            return;
        }

        if (track.jitsiTrack && track.jitsiTrack.getType() === 'audio') {
            recordingController.onNewParticipantAudioStreamAdded(track.jitsiTrack.stream, track.participantId);
        }
        break;
    }
    case CONFERENCE_WILL_LEAVE: {
        const isRecording = getState()['features/riff-platform'].localRecording?.stats?.isRecording;

        if (!isRecording) {
            return;
        }
        recordingController.stopRecording();
        break;
    }
    case PARTICIPANT_JOINED: {
        const isYoutubeJoined = action.participant.name === 'YouTube';
        const isRecording = getState()['features/riff-platform'].localRecording?.stats?.isRecording;

        dispatch(setSharedVideoId(action.participant.id));

        if (!isYoutubeJoined || !isRecording) {
            return;
        }

        createUserAudioTrack().then(audioStream => {
            recordingController.onNewParticipantAudioStreamAdded(audioStream, action.participant.id);
            dispatch(showNotification({
                title: i18next.t('localRecording.localRecording'),
                description: 'Local recording use your microphone for recording YouTube audio'
            }, 10000));
        })
        .catch(error => Promise.reject(error));

        break;
    }
    case PARTICIPANT_LEFT: {
        const isRecording = getState()['features/riff-platform'].localRecording?.stats?.isRecording;

        if (!isRecording) {
            return;
        }

        recordingController.removeParticipantAudioStream(action.participant.id);
        break;

    }
    }

    return result;
});
