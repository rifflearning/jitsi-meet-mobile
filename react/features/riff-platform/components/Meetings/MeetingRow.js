import { Button, makeStyles, MenuItem, TextField, Typography } from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { connect } from '../../../base/redux';
import { deleteMeeting, deleteMeetingsMultipleRooms, deleteMeetingsRecurring } from '../../actions/meetings';
import * as ROUTES from '../../constants/routes';
import { formatDurationTime } from '../../functions';

const useStyles = makeStyles(() => {
    return {
        meetingButton: {
            marginLeft: '10px',
            visibility: 'hidden'
        },
        tableRow: {
            '&:hover': {
                '& $meetingButton': {
                    visibility: 'visible'
                }
            }
        }
    };
});


const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 300
        }
    }
};

const MeetingsRow = ({
    meeting = {},
    removeMeeting,
    removeMeetingsMultipleRooms,
    removeMeetingsRecurring,
    groupName }) => {
    const classes = useStyles();
    const history = useHistory();

    const [ isLinkCopied, setLinkCopied ] = useState(false);
    const [ multipleRoom, setmultipleRooms ] = useState(meeting.multipleRooms ? meeting.multipleRooms[0]?.name : '');

    const handleLinkCopy = () => {
        let id = meeting._id;

        if (meeting.multipleRooms) {
            const _id = meeting.multipleRooms.find(m => m.name === multipleRoom)?._id;

            if (_id) {
                id = _id;
            }
        }

        navigator.clipboard.writeText(`${window.location.origin}/${id}`);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 1000);
    };
    const handleStartClick = () => {
        let id = meeting._id;

        if (meeting.multipleRooms) {
            const _id = meeting.multipleRooms.find(m => m.name === multipleRoom)?._id;

            if (_id) {
                id = _id;
            }
        }

        return history.push(`${ROUTES.WAITING}/${id}`);
    };
    // eslint-disable-next-line no-confusing-arrow
    // const handleDeleteClick = useCallback(() => meeting.recurringParentMeetingId
    //     ? alert(meeting.roomId)
    //     : removeMeeting(meeting._id), [meeting]);

    const handleDeleteClick = () => {
        if (meeting.recurringParentMeetingId) {
            return removeMeetingsRecurring(meeting.roomId);
        }
        if (meeting.multipleRooms) {
            return removeMeetingsMultipleRooms(meeting._id);
        }

        return removeMeeting(meeting._id);
    };

    const durationTime = formatDurationTime(meeting.dateStart, meeting.dateEnd);

    return (
        <TableRow
            className = { classes.tableRow }
            key = { meeting._id }>
            <TableCell>
                <Typography
                    component = 'p'
                    variant = 'h6' >
                    {durationTime}
                </Typography>
            </TableCell>
            <TableCell>

                {meeting.multipleRooms
                    ? <TextField
                        id = 'room-names'
                        select = { true }
                        // eslint-disable-next-line react/jsx-sort-props
                        SelectProps = {{ MenuProps }}
                        value = { multipleRoom }
                        // eslint-disable-next-line react/jsx-no-bind, react/jsx-sort-props
                        onChange = { e => setmultipleRooms(e.target.value) }>
                        {meeting.multipleRooms.map(m => (<MenuItem
                            key = { m._id }
                            value = { m.name }>{m.name}</MenuItem>))}
                    </TextField>
                    : <Typography
                        component = 'p'
                        variant = 'h6' >{meeting.name}</Typography>
                }

            </TableCell>
            <TableCell align = 'right'>
                <Button
                    className = { classes.meetingButton }
                    color = 'primary'
                    // eslint-disable-next-line react/jsx-no-bind
                    onClick = { handleStartClick }
                    variant = 'contained'>Start</Button>
                <Button
                    className = { classes.meetingButton }
                    color = { isLinkCopied ? 'default' : 'primary' }
                    // eslint-disable-next-line react/jsx-no-bind
                    onClick = { handleLinkCopy }
                    variant = { isLinkCopied ? 'text' : 'outlined' }>{isLinkCopied ? 'Copied!' : 'Copy link'}</Button>
                {!groupName
                    && <Button
                        className = { classes.meetingButton }
                        // eslint-disable-next-line react/jsx-no-bind
                        onClick = { handleDeleteClick }>
                        Delete
                    </Button>
                }
            </TableCell>
        </TableRow>
    );
};


MeetingsRow.propTypes = {
    // groupName - external prop for separate group (harvard), disable 'delete' button, fetch groupped meeting.
    groupName: PropTypes.string,
    meeting: PropTypes.object,
    removeMeeting: PropTypes.func,
    removeMeetingsMultipleRooms: PropTypes.func,
    removeMeetingsRecurring: PropTypes.func
};

const mapStateToProps = () => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        removeMeeting: id => dispatch(deleteMeeting(id)),
        removeMeetingsMultipleRooms: id => dispatch(deleteMeetingsMultipleRooms(id)),
        removeMeetingsRecurring: roomId => dispatch(deleteMeetingsRecurring(roomId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MeetingsRow);
