/* @flow */
/* global process */

import React, { Component } from 'react';

import { getParticipantCount } from '../../../base/participants/functions';
import { connect } from '../../../base/redux';
import { isToolboxVisible } from '../../../toolbox';
import ConferenceTimer from '../ConferenceTimer';

import ParticipantsCount from './ParticipantsCount';

/**
 * The type of the React {@code Component} props of {@link Subject}.
 */
type Props = {

    /**
     * Whether then participant count should be shown or not.
     */
    _showParticipantCount: boolean,

    /**
     * The subject or the of the conference.
     * Falls back to conference name.
     */
    _subject: string,

    /**
     * Indicates whether the component should be visible or not.
     */
    _visible: boolean
};

/**
 * Subject react component.
 *
 * @class Subject
 */
class Subject extends Component<Props> {

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { _showParticipantCount, _subject, _visible } = this.props;

        return (
            <div className = { `subject ${_visible ? 'visible' : ''}` }>
                <span className = 'subject-text'>{ _subject }</span>
                { _showParticipantCount && <ParticipantsCount /> }
                <ConferenceTimer />
            </div>
        );
    }
}

/**
 * Maps (parts of) the Redux state to the associated
 * {@code Subject}'s props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _subject: string,
 *     _visible: boolean
 * }}
 */
function _mapStateToProps(state) {
    const participantCount = getParticipantCount(state);

    return {
        _showParticipantCount: participantCount > 2,
        _subject: state['features/riff-platform']?.meeting?.meeting?.name,
        _visible: (process.env.TOP_TOOLBAR_ALWAYS_VISIBLE || isToolboxVisible(state)) && participantCount > 1
    };
}

export default connect(_mapStateToProps)(Subject);
