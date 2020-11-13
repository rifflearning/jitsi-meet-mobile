import { Button, Grid, Paper } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import { connect } from '../../../base/redux';
import { getMeetings } from '../../actions/meetings';
import { getProfile } from '../../actions/profile';
import { logout } from '../../actions/signIn';
import { groupMeetingsByDays } from '../../functions';


import MeetingsTable from './Meetings/MeetingsTable';
import Title from './Title';
import useStyles from './useStyles';

const App = ({ doLogout, getProfileInfo, profileInfo, profileLoading, meetingsLists = [], getMeetingsLists }) => {
    const classes = useStyles();

    useEffect(() => {
        getProfileInfo();
        getMeetingsLists();
    }, []);

    const groupedMeetings = groupMeetingsByDays(meetingsLists);

    return (
        <Grid
            container = { true }
            spacing = { 3 }>
            <Grid
                item = { true }
                xs = { 12 }>
                <Paper className = { classes.paper }>
                    <Grid
                        container = { true }
                        justify = 'space-between'>
                        <Grid
                            item = { true }>
                            <Title>User Information:</Title>
                            {profileInfo?.profile
                                ? <>{`Name: ${profileInfo?.profile?.email}`} <br />
                                    {`Email: ${profileInfo?.profile?.email}`}</>
                                : 'loading...'
                            }
                        </Grid>
                        <Grid
                            item = { true }>
                            <Button
                                color = 'primary'
                                onClick = { doLogout }
                                variant = 'outlined'>Logout</Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid
                item = { true }
                xs = { 12 }>
                <Paper className = { classes.paper }>
                    <MeetingsTable
                        date = 'Meetings for today:'
                        meetingsList = { groupedMeetings.Today } />
                </Paper>
            </Grid>
        </Grid>
    );
};

App.propTypes = {
    doLogout: PropTypes.func,
    getProfileInfo: PropTypes.func,
    profileInfo: PropTypes.object,
    profileLoading: PropTypes.bool
};

const mapStateToProps = state => {
    return {
        profileInfo: state['features/riff-platform'].profile,
        profileLoading: state['features/riff-platform'].profile.loading,
        meetingsLists: state['features/riff-platform'].meetings.meetingsLists
    };
};

const mapDispatchToProps = dispatch => {
    return {
        doLogout: obj => dispatch(logout(obj)),
        getProfileInfo: () => dispatch(getProfile()),
        getMeetingsLists: () => dispatch(getMeetings())

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
