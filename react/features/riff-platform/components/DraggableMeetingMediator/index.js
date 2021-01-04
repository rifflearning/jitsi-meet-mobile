/* global process */

import PropTypes from 'prop-types';
import React, { useEffect, useState, Fragment } from 'react';
import Draggable from 'react-draggable';

// eslint-disable-next-line import/order
import { Icon, IconClose } from '../../../base/icons';
import { connect } from '../../../base/redux';

// eslint-disable-next-line max-len
import { MeetingMediator } from '../../../riff-dashboard-page/src/components/Chat/Meeting/MeetingSidebar/MeetingMediator';

const DraggableMeetingMediator = ({ displayName, webRtcPeers }) => {
    const [ isOpened, setIsOpened ] = useState(false);

    const size = useWindowSize();
    const bounds = { left: -200,
        top: -250,
        right: size.width - 26,
        bottom: size.height - 26 };

    const onCloseMeetingMediator = () => setIsOpened(false);
    const onOpenMeetingMediator = () => !isOpened && setIsOpened(true);

    const MeetingMediatorWrapper = isOpened ? Draggable : Fragment;
    const wrapperProps = isOpened ? { bounds } : {};

    const meetingMediatorEnabled = process.env.MEETING_MEDIATOR_ENABLED === 'true';

    return (
        <MeetingMediatorWrapper { ...wrapperProps }>
            <div
                id = 'meeting-mediator-wrapper'
                className = { isOpened ? '' : 'closed' }
                onClick = { onOpenMeetingMediator }>
                { isOpened && <Icon
                    src = { IconClose }
                    className = 'meeting-mediator-close'
                    onClick = { onCloseMeetingMediator } />
                }
                <MeetingMediator
                    displayName = { displayName }
                    isEnabled = { meetingMediatorEnabled }
                    webRtcPeers = { webRtcPeers } />
            </div>
        </MeetingMediatorWrapper>
    );
};

DraggableMeetingMediator.propTypes = {
    displayName: PropTypes.string,
    webRtcPeers: PropTypes.array
};


/**
 * Maps (parts of) the Redux state to the associated props for the
 * {@code Conference} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {Props}
 */
function _mapStateToProps(state) {
    return {
        displayName: state['features/riff-platform'].signIn.user?.displayName || '',
        webRtcPeers: state['features/base/participants'].map((p, i) => {
            if (i === 0) {
                const { uid, displayName } = state['features/riff-platform'].signIn.user || {};

                return { nick: `${uid}|${displayName}` };
            }

            return { nick: p.name };
        })
    };
}

export default connect(_mapStateToProps)(DraggableMeetingMediator);


/**
 * React hook for tracking windlow resize.
 *
 * @returns {Object}
 */
function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [ windowSize, setWindowSize ] = useState({
        width: undefined,
        height: undefined
    });

    useEffect(() => {
        /**
         * Handler to call on window resize.
         *
         * @returns {void}
         */
        function handleResize() {
            // Set window width/height to state
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []); // Empty array ensures that effect is only run on mount

    return windowSize;
}
