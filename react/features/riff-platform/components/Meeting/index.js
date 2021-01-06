/* eslint-disable require-jsdoc */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/jsx-no-bind */

import {
    Button,
    Grid,
    Typography,
    Box,
    Divider,
    makeStyles
} from '@material-ui/core';
import { CheckCircleOutline, HighlightOffOutlined } from '@material-ui/icons';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';

import { connect } from '../../../base/redux';
import { getMeeting } from '../../actions/meeting';
import { deleteMeeting,
    deleteMeetingsRecurring } from '../../actions/meetings';
import * as ROUTES from '../../constants/routes';
import { formatDurationTime } from '../../functions';
import { ConfirmationDialogRaw } from '../Meetings/Dialog';
import StyledPaper from '../StyledPaper';

const useStyles = makeStyles(theme => {
    return {
        paper: {
            marginTop: theme.spacing(4),
            display: 'flex',
            alignItems: 'center'
        },
        meetingButton: {
            marginLeft: '10px',
            marginTop: '10px'
        },
        infoDivider: {
            width: '100%'
        },
        container: {
            margin: '0px' // fix scroll
        }
    };
});


function Meeting({
    meeting = {},
    fetchMeeting,
    loading,
    removeMeeting,
    removeMeetingsRecurring,
    groupName
}) {

    const [ isLinkCopied, setLinkCopied ] = useState(false);
    const [ isOpenDeleteDialog, setisOpenDeleteDialog ] = useState(false);
    const [ isOpenEditDialog, setIsOpenEditDialog ] = useState(false);

    const history = useHistory();
    const { meetingId } = useParams();
    const classes = useStyles();

    useEffect(() => {
        if (meetingId) {
            fetchMeeting(meetingId);
        }
    }, [ meetingId ]);
    console.log('mmeting', meeting);

    const getFormattedDate = () => {
        const duration = formatDurationTime(meeting.dateStart, meeting.dateEnd);
        const date = moment(meeting.dateStart).format('MMM dd, YYYY ');

        return `${duration}, ${date}`;
    };

    const handleLinkCopy = () => {
        const id = meeting.multipleRoomsQuantity
            ? `${meeting.roomId}-${meeting.multipleRoomsQuantity}`
            : meeting.roomId;

        // onclick Copy button copy meeting link + description, Beth's request
        const description = meeting.description ? ` ${meeting.description}` : '';

        navigator.clipboard.writeText(`${window.location.origin}/${id}${description}`);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 1000);
    };

    const handleStartClick = id => history.push(`${ROUTES.WAITING}/${id}`);

    const handleDeleteClick = () => setisOpenDeleteDialog(true);

    const handleEditClick = () => setIsOpenEditDialog(true);

    const defineIcon = {
        true: <CheckCircleOutline />,
        false: <HighlightOffOutlined />
    };

    const onDeleteDialogClose = value => {
        if (value === 'Delete all recurring meetings') {
            return removeMeetingsRecurring(meeting.roomId);
        } else if (value === 'Delete one meeting' || value === 'Delete groupped meetings') {
            return removeMeeting(meeting._id);
        }
        setisOpenDeleteDialog(false);
    };

    const onEditDialogClose = value => {
        let id = meeting.multipleRoomsQuantity ? `${meeting.roomId}-${meeting.multipleRoomsQuantity}` : meeting.roomId;
        const url = `${ROUTES.MEETING}/${id}/edit`;

        if (value === 'Edit one meeting' && !meeting.recurringParentMeetingId) {
            return history.push(url);
        } else if (value === 'Edit all recurring meetings') {
            return history.push(`${url}?mode=all`);
        } else if (value === 'Edit one meeting' && meeting.recurringParentMeetingId) {
            id = meeting.multipleRoomsQuantity ? `${meeting._id}-${meeting.multipleRoomsQuantity}` : meeting._id;

            return history.push(`${ROUTES.MEETING}/${id}/edit?mode=one`);
        }
        setIsOpenEditDialog(false);
    };

    const dialogDeleteValues = [ 'Delete one meeting',
        meeting.recurringParentMeetingId ? 'Delete all recurring meetings' : undefined ];

    const dialogEditValues = [ 'Edit one meeting',
        meeting.recurringParentMeetingId ? 'Edit all recurring meetings' : undefined ];


    console.log('loading', loading);

    return (
        <Grid
            container = { true }
            spacing = { 3 }>
            <Grid
                item = { true }
                xs = { 12 }>
                <StyledPaper title = 'Meeting information'>
                    <Grid
                        alignItems = 'center'
                        className = { classes.container }
                        container = { true }
                        item = { true }
                        spacing = { 4 }
                        xs = { 12 } >
                        <Grid
                            alignItems = 'center'
                            container = { true }
                            item = { true }>
                            <Grid
                                item = { true }
                                md = { 2 }
                                sm = { 3 }
                                xs = { 12 }>
                                <Typography>
                                Name
                                </Typography>
                            </Grid>
                            <Grid
                                item = { true }
                                md = { 10 }
                                sm = { 8 }
                                xs = { 12 } >
                                <Typography>
                                    {meeting.name}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Divider className = { classes.infoDivider } />
                        <Grid
                            alignItems = 'center'
                            container = { true }
                            item = { true }>
                            <Grid
                                item = { true }
                                md = { 2 }
                                sm = { 3 }
                                xs = { 12 }>
                                <Typography>
                    Description
                                </Typography>
                            </Grid>
                            <Grid
                                item = { true }
                                md = { 10 }
                                sm = { 8 }
                                xs = { 12 }>
                                <Typography>
                                    {meeting.description}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Divider className = { classes.infoDivider } />
                        <Grid
                            alignItems = 'center'
                            container = { true }
                            item = { true }>
                            <Grid
                                item = { true }
                                md = { 2 }
                                sm = { 3 }
                                xs = { 12 }>
                                <Typography>
                    Time
                                </Typography>
                            </Grid>
                            <Grid
                                item = { true }
                                md = { 10 }
                                sm = { 8 }
                                xs = { 12 }>
                                <Typography>
                                    {getFormattedDate()}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Divider className = { classes.infoDivider } />
                        <Grid
                            alignItems = 'center'
                            container = { true }
                            item = { true }>
                            <Grid
                                item = { true }
                                md = { 2 }
                                sm = { 3 }
                                xs = { 12 }>
                                <Typography>
                                Invite Link
                                </Typography>
                            </Grid>
                            <Grid
                                alignItems = 'center'
                                container = { true }
                                item = { true }
                                justify = 'space-between'
                                md = { 10 }
                                sm = { 8 }
                                spacing = { 1 }
                                xs = { 12 }>
                                <Grid
                                    item = { true }>
                                    <Typography>
                                        {`${window.location.origin}/${meetingId}`}
                                    </Typography>
                                </Grid>
                                <Grid
                                    item = { true } >
                                    <Button
                                        color = { isLinkCopied ? 'default' : 'primary' }
                                        onClick = { () => handleLinkCopy(meetingId) }
                                        variant = { isLinkCopied ? 'text' : 'outlined' }>{isLinkCopied ? 'Copied!' : 'Copy link'}</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Divider className = { classes.infoDivider } />
                        <Grid
                            alignItems = 'center'
                            container = { true }
                            item = { true }>
                            <Grid
                                item = { true }
                                md = { 2 }
                                sm = { 3 }
                                xs = { 12 }>
                                <Typography>
                                    Meeting Options
                                </Typography>
                            </Grid>
                            <Grid
                                alignItems = 'center'
                                container = { true }
                                direction = 'column'
                                item = { true }
                                md = { 10 }
                                sm = { 8 }
                                spacing = { 2 }
                                xs = { 12 }>
                                <Grid
                                    container = { true }
                                    item = { true }>
                                    <Box pr = { 1 }>{defineIcon[meeting.waitForHost]}</Box>
                                    <Typography>
                                       Wait for a host of the meeting
                                    </Typography>
                                </Grid>
                                <Grid
                                    container = { true }
                                    item = { true }>
                                    <Box pr = { 1 }>{defineIcon[meeting.forbidNewParticipantsAfterDateEnd]}</Box>
                                    <Typography>
                                        Forbid new participants after the meeting is over
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Divider className = { classes.infoDivider } />
                        <Grid
                            alignItems = 'center'
                            container = { true }
                            item = { true }
                            spacing = { 3 }>

                            <Button
                                className = { classes.meetingButton }
                                color = 'primary'
                                onClick = { () => handleStartClick(meetingId) }
                                variant = 'contained'>Start</Button>
                            {!groupName
                            && <>
                                <Button
                                    className = { classes.meetingButton }
                                    color = 'default'
                                    onClick = { handleEditClick }
                                    variant = 'outlined'>
                             Edit
                                </Button>
                                <Button
                                    className = { classes.meetingButton }
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
                        </Grid>
                    </Grid>
                </StyledPaper>
            </Grid>
        </Grid>
    );
}

Meeting.propTypes = {
    // groupName - external prop for separate group (harvard), disable 'delete' button, fetch groupped meeting.
    fetchMeeting: PropTypes.func,
    groupName: PropTypes.string,
    loading: PropTypes.bool,
    meeting: PropTypes.object,
    removeMeeting: PropTypes.func,
    removeMeetingsRecurring: PropTypes.func
};

const mapStateToProps = state => {
    return {
        loading: state['features/riff-platform'].meeting.loading,
        meeting: state['features/riff-platform'].meeting.meeting
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchMeeting: id => dispatch(getMeeting(id)),
        removeMeeting: id => dispatch(deleteMeeting(id)),
        removeMeetingsRecurring: roomId => dispatch(deleteMeetingsRecurring(roomId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Meeting);
