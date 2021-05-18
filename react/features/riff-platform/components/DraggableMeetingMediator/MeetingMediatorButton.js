/* eslint-disable max-len */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/order*/

import EqualizerIcon from '@material-ui/icons/Equalizer';
import PropTypes from 'prop-types';
import React from 'react';

import { connect } from '../../../base/redux';
import ToolbarButton from '../../../toolbox/components/web/ToolbarButton';
import { toggleMeetingMediator } from '../../actions/meetingMediator';

const MeetingMediatorButton = ({ isOpen, toggleMediator }) => {

    const doToggleMeetingMediator = () => toggleMediator();

    return (
        <ToolbarButton
            accessibilityLabel = 'Toggle meeting mediator'
            icon = { EqualizerIcon }
            onClick = { doToggleMeetingMediator }
            toggled = { isOpen }
            tooltip = 'Open / Close Meeting Mediator' />
    );
};

MeetingMediatorButton.propTypes = {
    isOpen: PropTypes.bool,
    toggleMediator: PropTypes.func
};


const mapStateToProps = state => {
    return {
        isOpen: state['features/riff-platform'].meetingMediator.isOpen
    };
};

const mapDispatchToProps = dispatch => {
    return {
        toggleMediator: () => dispatch(toggleMeetingMediator())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MeetingMediatorButton);
