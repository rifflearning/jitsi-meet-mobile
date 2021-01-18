/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-sort-props */
/* @flow */
import { makeStyles, MenuItem, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

import { connect } from '../../../base/redux';

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 300,
            color: '#5e6d7a',
            fontSize: '13px',
            lineHeight: '20px'
        }
    }
};

const useStyles = makeStyles({
    root: {
        pointerEvents: 'auto',
        marginLeft: '5px',
        '& .MuiOutlinedInput-input': {
            paddingTop: '4px',
            paddingBottom: '4px',
            backgroundColor: 'white',
            color: '#5e6d7a',
            fontSize: '13px',
            lineHeight: '20px',
            borderRadius: '4px'
        },
        '& .Mui-focused .MuiOutlinedInput-notchedOutline ': {
            border: '0',
            borderRadius: '4px'
        }
    },
    selectItem: {
        color: '#5e6d7a',
        fontSize: '13px',
        lineHeight: '20px'
    }
});

const MultipleRoomsMeetingDropdown = ({ meetingId, meetingName, multipleRoomsQuantity }) => {
    const classes = useStyles();

    const redirectToMeeting = id => {
        // Need to reload page
        window.location.replace(`/${id}`);
    };

    const checkIsSameMeeting = selectedId => meetingId === selectedId;

    const onMeetingRoomChange = roomNumber => {
        const id = meetingId.split('-')[0];
        const selectedMeetingId = `${id}-${roomNumber}`;
        const isSameMeeting = checkIsSameMeeting(selectedMeetingId);

        if (!isSameMeeting) {
            redirectToMeeting(`${id}-${roomNumber}`);
        }
    };

    const getNumberArr = length => Array.from(Array(length).keys(), n => n + 1);

    const roomsNumbersArr = getNumberArr(multipleRoomsQuantity);

    const roomNumber = meetingId.split('-')[1];


    return (<TextField
        className = { classes.root }
        id = 'meeting-dropdown'
        onChange = { e => onMeetingRoomChange(e.target.value) }
        SelectProps = {{ MenuProps }}
        select = { true }
        value = { roomNumber }
        variant = 'outlined'>
        {roomsNumbersArr.map(el => (<MenuItem
            className = { classes.selectItem }
            key = { el }
            value = { el }>
            {meetingName}-{el}
        </MenuItem>))}
    </TextField>

    );
};

MultipleRoomsMeetingDropdown.propTypes = {
    meetingId: PropTypes.string,
    meetingName: PropTypes.string,
    multipleRoomsQuantity: PropTypes.number
};

const mapStateToProps = state => {
    return {
        multipleRoomsQuantity: state['features/riff-platform']?.meeting?.meeting?.multipleRoomsQuantity,
        meetingName: state['features/riff-platform']?.meeting?.meeting?.name,
        meetingId: state['features/base/conference'].room
    };
};


export default connect(mapStateToProps)(MultipleRoomsMeetingDropdown);
