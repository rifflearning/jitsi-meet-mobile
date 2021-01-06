/* eslint-disable react/jsx-no-bind */

import { Button, makeStyles, MenuItem, TextField, Typography } from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { connect } from '../../../base/redux';
import { deleteMeeting, deleteMeetingsRecurring } from '../../actions/meetings';
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
    removeMeetingsRecurring,
    groupName }) => {
    const classes = useStyles();
    const history = useHistory();

    const [ multipleRoom, setmultipleRooms ] = useState(1);
    const [ isOpenDeleteDialog, setisOpenDeleteDialog ] = useState(false);
    const [ isOpenEditDialog, setIsOpenEditDialog ] = useState(false);

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
        const id = meeting.multipleRoomsQuantity ? `${meeting.roomId}-${multipleRoom}` : meeting.roomId;
        const url = `${ROUTES.MEETING}/${id}/edit`;

        if (value === 'Edit one meeting' && !meeting.recurringParentMeetingId) {
            return history.push(url);
        } else if (value === 'Edit all recurring meetings') {
            return history.push(`${url}?mode=all`);
        } else if (value === 'Edit one meeting' && meeting.recurringParentMeetingId) {
            const meetingId = meeting.multipleRoomsQuantity ? `${meeting._id}-${multipleRoom}` : meeting._id;

            return history.push(`${ROUTES.MEETING}/${meetingId}/edit?mode=one`);
        }
        setIsOpenEditDialog(false);
    };

    const durationTime = formatDurationTime(meeting.dateStart, meeting.dateEnd);

    const dialogDeleteValues = [ 'Delete one meeting',
        meeting.recurringParentMeetingId ? 'Delete all recurring meetings' : undefined ];

    const handleMeetingDetailsClick = () => {
        const id = meeting.multipleRoomsQuantity ? `${meeting.roomId}-${multipleRoom}` : meeting.roomId;

        history.push(`${ROUTES.MEETING}/${id}`);
    };

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
                    color = 'primary'
                    // eslint-disable-next-line react/jsx-no-bind
                    onClick = { handleMeetingDetailsClick }
                    variant = 'outlined'>Details</Button>
                {!groupName
                    && <>
                        <Button
                            className = { classes.meetingButton }
                            color = 'default'
                            // eslint-disable-next-line react/jsx-no-bind
                            onClick = { handleEditClick }
                            variant = 'outlined'>
                        Edit
                        </Button>

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
    removeMeeting: PropTypes.func,
    removeMeetingsRecurring: PropTypes.func
};

const mapStateToProps = () => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        removeMeeting: id => dispatch(deleteMeeting(id)),
        removeMeetingsRecurring: roomId => dispatch(deleteMeetingsRecurring(roomId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MeetingsRow);
