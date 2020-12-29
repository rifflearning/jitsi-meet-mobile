/* eslint-disable require-jsdoc */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/jsx-no-bind */

import {
    Button,
    Grid,
    Typography, Box } from '@material-ui/core';
import { CheckCircleOutline, HighlightOffOutlined } from '@material-ui/icons';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';

import { connect } from '../../../base/redux';
import { getMeeting } from '../../actions/meeting';
import * as ROUTES from '../../constants/routes';
import { formatDurationTime } from '../../functions';
import StyledPaper from '../StyledPaper';


function Meeting({
    meeting = {},
    fetchMeeting,
    loading
}) {

    const [ isLinkCopied, setLinkCopied ] = useState(false);


    const history = useHistory();
    const { meetingId } = useParams();

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

    const defineIcon = {
        true: <CheckCircleOutline />,
        false: <HighlightOffOutlined />
    };

    return (
        <Grid
            container = { true }
            spacing = { 3 }>
            <Grid
                item = { true }
                xs = { 12 }>
                <StyledPaper title = 'Meeting information'>
                    <Box pt = { 3 }>
                        <Grid
                            alignItems = 'center'
                            container = { true }
                            spacing = { 3 } >
                            <Grid
                                alignItems = 'center'
                                container = { true }
                                item = { true }
                                spacing = { 1 }>
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
                            <Grid
                                alignItems = 'center'
                                container = { true }
                                item = { true }
                                spacing = { 1 }>
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
                            <Grid
                                alignItems = 'center'
                                container = { true }
                                item = { true }
                                spacing = { 1 }>
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
                            <Grid
                                alignItems = 'center'
                                container = { true }
                                item = { true }
                                spacing = { 1 }>
                                <Grid
                                    item = { true }
                                    xs = { 12 }
                                    md = { 2 }
                                    sm = { 3 }>
                                    <Typography>
                                Meeting ID
                                    </Typography>
                                </Grid>
                                <Grid
                                    item = { true }
                                    xs = { 12 }
                                    sm = { 8 }
                                    md = { 10 } >
                                    <Typography>
                                        {meetingId}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid
                                alignItems = 'center'
                                container = { true }
                                item = { true }
                                spacing = { 1 }>
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

                                            // className = { classes.meetingButton }
                                            color = { isLinkCopied ? 'default' : 'primary' }
                                            onClick = { () => handleLinkCopy(meetingId) }
                                            variant = { isLinkCopied ? 'text' : 'outlined' }>{isLinkCopied ? 'Copied!' : 'Copy link'}</Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid
                                alignItems = 'center'
                                container = { true }
                                item = { true }
                                spacing = { 1 }>
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
                        </Grid>
                    </Box>
                </StyledPaper>
            </Grid>
        </Grid>
    );
}

Meeting.propTypes = {
    fetchMeeting: PropTypes.func,
    loading: PropTypes.bool,
    meeting: PropTypes.object
};

const mapStateToProps = state => {
    return {
        loading: state['features/riff-platform'].meeting.loading,
        meeting: state['features/riff-platform'].meeting.meeting
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchMeeting: id => dispatch(getMeeting(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Meeting);
