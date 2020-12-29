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
    deleteMeetingsMultipleRooms,
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
            marginLeft: '10px'
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
    removeMeetingsMultipleRooms,
    removeMeetingsRecurring,
    groupName
}) {

    const [ isLinkCopied, setLinkCopied ] = useState(false);
    const [ isOpenDeleteDialog, setisOpenDeleteDialog ] = useState(false);

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

    const handleLinkCopy = id => {
        navigator.clipboard.writeText(`${window.location.origin}/${id}`);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 1000);
    };
    const handleStartClick = id => history.push(`${ROUTES.WAITING}/${id}`);

    const handleDeleteClick = () => setisOpenDeleteDialog(true);

    const defineIcon = {
        true: <CheckCircleOutline />,
        false: <HighlightOffOutlined />
    };

    const onDialogClose = (e, value) => {
        if (value === 'Delete all recurring meetings') {
            return removeMeetingsRecurring(meeting.roomId);
        } else if (value === 'Delete groupped meetings') {
            return removeMeetingsMultipleRooms(meeting._id);
        } else if (value === 'Delete one meeting') {
            return removeMeeting(meeting._id);
        }
        setisOpenDeleteDialog(false);
    };

    const dialogValues = [
        meeting.multipleRoomsParentId ? 'Delete groupped meetings' : 'Delete one meeting',
        meeting.recurringParentMeetingId ? 'Delete all recurring meetings' : undefined ];

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
                        className = { classes.container }
                        alignItems = 'center'
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
                                xs = { 12 }
                                md = { 2 }
                                sm = { 3 }>
                                <Typography>
                                Name
                                </Typography>
                            </Grid>
                            <Grid
                                item = { true }
                                xs = { 12 }
                                md = { 10 }
                                sm = { 8 } >
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
                                xs = { 12 }
                                md = { 2 }
                                sm = { 3 }>
                                <Typography>
                    Description
                                </Typography>
                            </Grid>
                            <Grid
                                item = { true }
                                xs = { 12 }
                                sm = { 8 }
                                md = { 10 } >
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
                                xs = { 12 }
                                md = { 2 }
                                sm = { 3 }>
                                <Typography>
                    Time
                                </Typography>
                            </Grid>
                            <Grid
                                item = { true }
                                xs = { 12 }
                                sm = { 8 }
                                md = { 10 } >
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
                                xs = { 12 }
                                md = { 2 }
                                sm = { 3 }>
                                <Typography>
                                Invite Link
                                </Typography>
                            </Grid>
                            <Grid
                                container = { true }
                                item = { true }
                                justify = 'space-between'
                                alignItems = 'center'
                                spacing = { 1 }
                                xs = { 12 }
                                sm = { 8 }
                                md = { 10 }>
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
                                xs = { 12 }
                                md = { 2 }
                                sm = { 3 }>
                                <Typography>
                                    Meeting Options
                                </Typography>
                            </Grid>
                            <Grid
                                container = { true }
                                direction = 'column'
                                item = { true }
                                alignItems = 'center'
                                spacing = { 2 }
                                xs = { 12 }
                                sm = { 8 }
                                md = { 10 }>
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
                                    && <Button
                                        className = { classes.meetingButton }
                                        onClick = { handleDeleteClick }>
                                        Delete
                                    </Button>
                            }
                            <ConfirmationDialogRaw

                                onClose = { onDialogClose }
                                open = { isOpenDeleteDialog }
                                value = { dialogValues } />
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
    removeMeetingsMultipleRooms: PropTypes.func,
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
        removeMeetingsMultipleRooms: id => dispatch(deleteMeetingsMultipleRooms(id)),
        removeMeetingsRecurring: roomId => dispatch(deleteMeetingsRecurring(roomId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Meeting);
