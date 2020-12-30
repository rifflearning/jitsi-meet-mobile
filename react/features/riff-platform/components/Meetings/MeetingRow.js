/* eslint-disable react/jsx-no-bind */

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
    groupName,
    meetingsListType }) => {
    const classes = useStyles();
    const history = useHistory();

    const [ isLinkCopied, setLinkCopied ] = useState(false);
    const [ multipleRoom, setmultipleRooms ] = useState(1);
    const [ isOpenDeleteDialog, setisOpenDeleteDialog ] = useState(false);
    const [ isOpenEditDialog, setIsOpenEditDialog ] = useState(false);

    const handleLinkCopy = () => {
        const id = meeting.multipleRoomsQuantity ? `${meeting.roomId}-${multipleRoom}` : meeting.roomId;

        // onclick Copy button copy meeting link + description, Beth's request
        const description = meeting.description ? ` ${meeting.description}` : '';

        navigator.clipboard.writeText(`${window.location.origin}/${id}${description}`);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 1000);
    };
    const handleStartClick = () => {
        const id = meeting.multipleRoomsQuantity ? `${meeting.roomId}-${multipleRoom}` : meeting.roomId;

        return history.push(`${ROUTES.WAITING}/${id}`);
    };

    const handleDeleteClick = () => setisOpenDeleteDialog(true);

    const handleEditClick = () => setIsOpenEditDialog(true);

    const onDeleteDialogClose = value => {
        if (value === 'Delete all recurring meetings') {
            return removeMeetingsRecurring(meeting.roomId);
        } else if (value === 'Delete one meeting' || value === 'Delete groupped meetings') {
            return removeMeeting(meeting._id);
        }
        setisOpenDeleteDialog(false);
    };

    const onEditDialogClose = value => {
        const url = `${ROUTES.MEETING}/${meeting._id}/edit`;

        if (value === 'Edit one meeting' && !meeting.recurringParentMeetingId) {
            return history.push(url);
        } else if (value === 'Edit all recurring meetings') {
            return history.push(`${url}?mode=all`);
        } else if (value === 'Edit one meeting' && meeting.recurringParentMeetingId) {
            return history.push(`${url}?mode=one`);
        } else if (value === 'Edit groupped meetings') {
            const selectedMultipleRoomId = meeting.multipleRooms.find(m => m.name === multipleRoom)?._id;

            return history.push(`${ROUTES.MEETING}/${selectedMultipleRoomId}/edit?mode=group`);
        }

        setIsOpenEditDialog(false);
    };

    const durationTime = formatDurationTime(meeting.dateStart, meeting.dateEnd);

    const dialogDeleteValues = [ 'Delete one meeting',
        meeting.recurringParentMeetingId ? 'Delete all recurring meetings' : undefined ];

    const dialogEditValues = [ 'Edit one meeting',
        meeting.recurringParentMeetingId ? 'Edit all recurring meetings' : undefined ];

    const getNumberArr = length => Array.from(Array(length).keys(), n => n + 1);

    const roomsNumbersArr = getNumberArr(meeting.multipleRoomsQuantity);

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

                {meeting.multipleRoomsQuantity
                    ? <TextField
                        id = 'room-names'
                        select = { true }
                        // eslint-disable-next-line react/jsx-sort-props
                        SelectProps = {{ MenuProps }}
                        value = { multipleRoom }
                        // eslint-disable-next-line react/jsx-no-bind, react/jsx-sort-props
                        onChange = { e => setmultipleRooms(e.target.value) }>
                        {roomsNumbersArr.map(el => (<MenuItem
                            key = { el }
                            value = { el }>
                            {meeting.name}-{el}
                        </MenuItem>))}
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
                    && <>
                        { meetingsListType === 'upcoming'
                        && <Button
                            className = { classes.meetingButton }
                            color = 'default'
                            // eslint-disable-next-line react/jsx-no-bind
                            onClick = { handleEditClick }
                            variant = 'outlined'>
                        Edit
                        </Button>
                        }
                        <Button
                            className = { classes.meetingButton }
                            // eslint-disable-next-line react/jsx-no-bind
                            onClick = { handleDeleteClick }>
                        Delete
                        </Button>
                   </>
                }
                <ConfirmationDialogRaw
                    onClose = { onDeleteDialogClose }
                    open = { isOpenDeleteDialog }
                    title = 'Delete meeting?'
                    value = { dialogDeleteValues } />
                <ConfirmationDialogRaw
                    onClose = { onEditDialogClose }
                    open = { isOpenEditDialog }
                    title = 'Edit meeting'
                    value = { dialogEditValues } />
            </TableCell>
        </TableRow>
    );
};


MeetingsRow.propTypes = {
    // groupName - external prop for separate group (harvard), disable 'delete', 'edit' buttons, fetch groupped meeting.
    groupName: PropTypes.string,
    meeting: PropTypes.object,
    meetingsListType: PropTypes.string,
    removeMeeting: PropTypes.func,
    removeMeetingsMultipleRooms: PropTypes.func,
    removeMeetingsRecurring: PropTypes.func
};

const mapStateToProps = state => {
    return {
        meetingsListType: state['features/riff-platform'].meetings.listType
    };
};

const mapDispatchToProps = dispatch => {
    return {
        removeMeeting: id => dispatch(deleteMeeting(id)),
        removeMeetingsMultipleRooms: id => dispatch(deleteMeetingsMultipleRooms(id)),
        removeMeetingsRecurring: roomId => dispatch(deleteMeetingsRecurring(roomId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MeetingsRow);
