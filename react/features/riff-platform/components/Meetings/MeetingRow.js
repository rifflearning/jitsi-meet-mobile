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

import { ConfirmationDialogRaw } from './Dialog';

const useStyles = makeStyles(() => {
    return {
        meetingButton: {
            marginLeft: '10px',
            visibility: 'hidden',
            '@media (max-width: 768px)': {
                marginTop: '5px'
            }
        },
        tableRow: {
            '&:hover': {
                boxShadow: '-1px 10px 5px -6px rgba(46,45,46,1)',
                cursor: 'pointer',
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
    const [ isOpenDeleteDialog, setisOpenDeleteDialog ] = useState(false);

    const handleLinkCopy = e => {
        e.stopPropagation();
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
    const handleStartClick = e => {
        e.stopPropagation();
        let id = meeting._id;

        if (meeting.multipleRooms) {
            const _id = meeting.multipleRooms.find(m => m.name === multipleRoom)?._id;

            if (_id) {
                id = _id;
            }
        }

        return history.push(`${ROUTES.WAITING}/${id}`);
    };

    const onDialogClose = (e, value) => {
        e.stopPropagation();
        if (value === 'Delete all recurring meetings') {
            return removeMeetingsRecurring(meeting.roomId);
        } else if (value === 'Delete groupped meetings') {
            return removeMeetingsMultipleRooms(meeting._id);
        } else if (value === 'Delete one meeting') {
            return removeMeeting(meeting._id);
        }
        setisOpenDeleteDialog(false);
    };

    const handleDeleteClick = e => {
        e.stopPropagation();
        setisOpenDeleteDialog(true);
    };

    const durationTime = formatDurationTime(meeting.dateStart, meeting.dateEnd);

    const dialogValues = [
        multipleRoom ? 'Delete groupped meetings' : 'Delete one meeting',
        meeting.recurringParentMeetingId ? 'Delete all recurring meetings' : undefined ];


    const handleMeetingItemClick = e => {
        e.preventDefault();
        let id = meeting._id;

        if (meeting.multipleRooms) {
            const _id = meeting.multipleRooms.find(m => m.name === multipleRoom)?._id;

            if (_id) {
                id = _id;
            }
        }
        history.push(`${ROUTES.MEETING}/${id}`);
    };

    return (
        <TableRow
            className = { classes.tableRow }
            key = { meeting._id }
            // eslint-disable-next-line react/jsx-no-bind
            onClick = { handleMeetingItemClick }>
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
                        onChange = { e => {
                            e.stopPropagation();
                            setmultipleRooms(e.target.value);
                        } }>
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
                <ConfirmationDialogRaw
                    // eslint-disable-next-line react/jsx-no-bind
                    onClose = { onDialogClose }
                    open = { isOpenDeleteDialog }
                    value = { dialogValues } />
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
