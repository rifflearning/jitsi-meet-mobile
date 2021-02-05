import { createShortcutEvent, sendAnalytics } from '../../../analytics';
import { APP_WILL_UNMOUNT } from '../../../base/app/actionTypes';
import { CONFERENCE_JOINED, CONFERENCE_WILL_LEAVE } from '../../../base/conference/actionTypes';
import { toggleDialog } from '../../../base/dialog/actions';
import { i18next } from '../../../base/i18n';
import { SET_AUDIO_MUTED } from '../../../base/media/actionTypes';
import { MiddlewareRegistry } from '../../../base/redux';
import { SETTINGS_UPDATED } from '../../../base/settings/actionTypes';
import { TRACK_ADDED } from '../../../base/tracks/actionTypes';
import { LocalRecordingInfoDialog } from '../../../local-recording/components';
import { showNotification } from '../../../notifications/actions';
import { statsUpdate, localRecordingEngaged, localRecordingUnengaged } from '../../actions/localRecording';

import { recordingController } from './LocalRecorderController';
import WebmAdapter from './WebmAdapter';


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
        recordingController.onStateChanged = isEngaged => {
            if (isEngaged) {
                const nowTime = new Date();

                dispatch(localRecordingEngaged(nowTime));
                dispatch(statsUpdate(recordingController.getParticipantsStats()));
            } else {
                dispatch(localRecordingUnengaged());
                dispatch(statsUpdate(recordingController.getParticipantsStats()));
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

        typeof APP === 'object' && typeof APP.keyboardshortcut === 'object'
            && APP.keyboardshortcut.registerShortcut('L', null, () => {
                sendAnalytics(createShortcutEvent('local.recording'));
                dispatch(toggleDialog(LocalRecordingInfoDialog));
            }, 'keyboardShortcuts.localRecording');

        if (localRecording.format) {
            recordingController.switchFormat(localRecording.format);
        }

        const { conference } = getState()['features/base/conference'];

        recordingController.registerEvents(conference);
        dispatch(statsUpdate(recordingController.getParticipantsStats()));

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
        const { isEngaged } = getState()['features/riff-platform'].localRecording;
        const { conference } = getState()['features/base/conference'];

        conference && dispatch(statsUpdate(recordingController.getParticipantsStats()));

        const { track } = action;

        if (!track || track.local || !isEngaged) {
            return;
        }

        if (track.jitsiTrack && track.jitsiTrack.getType() === 'audio') {
            const webmRecordingController = new WebmAdapter();

            webmRecordingController._addNewParticipantAudioStream(track.jitsiTrack.stream);
        }
        break;
    }
    case CONFERENCE_WILL_LEAVE: {
        const { isEngaged } = getState()['features/riff-platform'].localRecording;

        if (!isEngaged) {
            return;
        }
        recordingController.stopRecording();
        break;
    }
    }

    return result;
});
