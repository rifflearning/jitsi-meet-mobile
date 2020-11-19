/* global config, APP */
import RiffPlatform from '../components';
import * as ROUTES from '../constants/routes';
import { navigateWithoutReload } from '../functions';

import { checkIsMeetingAllowed } from './meeting';

/**
 * Redirects from jitsi to Waiting room.
 *
 * @returns {Promise.resolve}
  * @public
  */
export async function maybeRedirectToWaitingRoom() {
    return new Promise(res => {
        const isRoomId = window.location.pathname.split('/')[1] !== 'app';

        if (!isRoomId || config.iAmRecorder) {
            return res();
        }

        const meetingId = window.location.pathname.split('/')[1];

        APP.store.dispatch(checkIsMeetingAllowed(meetingId)).then(m => {
            if (m === null || m.error) {
                navigateWithoutReload(RiffPlatform, `${ROUTES.BASENAME}${ROUTES.WAITING}/${meetingId}`);
            } else {
                res();
            }
        });
    });
}
