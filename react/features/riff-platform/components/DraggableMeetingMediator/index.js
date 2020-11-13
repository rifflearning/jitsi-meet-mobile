import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Draggable from 'react-draggable';

// eslint-disable-next-line import/order
import { connect } from '../../../base/redux';

// eslint-disable-next-line max-len
import { MeetingMediator } from '../../../riff-dashboard-page/src/components/Chat/Meeting/MeetingSidebar/MeetingMediator';

const DraggableMeetingMediator = ({ displayName, webRtcPeers }) => {
    const size = useWindowSize();
    const bounds = { left: -200,
        top: -250,
        right: size.width - 26,
        bottom: size.height - 26 };

    return (
        <Draggable bounds = { bounds }>
            <div
                id = 'meeting-mediator-wrapper'>
                <MeetingMediator
                    displayName = { displayName }
                    isEnabled = { true }
                    webRtcPeers = { webRtcPeers } />
            </div>
        </Draggable>
    );
};

DraggableMeetingMediator.propTypes = {
    displayName: PropTypes.string,
    webRtcPeers: PropTypes.object
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
        displayName: state['features/riff-metrics'].userData.displayName || '',
        webRtcPeers: state['features/base/participants'].map((p, i) => {
            if (i === 0) {
                const { uid, displayName } = state['features/riff-metrics'].userData;

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
