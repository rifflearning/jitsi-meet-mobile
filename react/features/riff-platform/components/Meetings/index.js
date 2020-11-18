import { Button, Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router';

import { connect } from '../../../base/redux';
import { getMeetings } from '../../actions/meetings';
import * as ROUTES from '../../constants/routes';
import { groupMeetingsByDays } from '../../functions';
import StyledPaper from '../StyledPaper';

import MeetingsTable from './MeetingsTable';

const Meetings = ({ meetingsLists = [], getMeetingsLists }) => {
    const history = useHistory();
    const handleScheduleClick = useCallback(() => history.push(ROUTES.SCHEDULE), [ history ]);

    useEffect(() => {
        getMeetingsLists();
    }, []);

    // formats meetingsLists to {Today: meetingList, [otherDate]: meetingList ...}
    const groupedMeetings = groupMeetingsByDays(meetingsLists);

    return (
        <Grid
            container = { true }
            spacing = { 3 }>
            <Grid
                container = { true }
                item = { true }
                justify = 'flex-end'
                xs = { 12 }>
                <Button
                    color = 'primary'
                    onClick = { handleScheduleClick }
                    variant = 'outlined'>
                    Schedule meeting
                </Button>
            </Grid>
            {Object.keys(groupedMeetings).map(date =>
                (<Grid
                    item = { true }
                    key = { date }
                    xs = { 12 }>
                    <StyledPaper title = { date }>
                        <MeetingsTable
                            meetingsList = { groupedMeetings[date] } />
                    </StyledPaper>
                </Grid>)
            )}
        </Grid>
    );
};

Meetings.propTypes = {
    getMeetingsLists: PropTypes.func,
    meetingsLists: PropTypes.array
};

const mapStateToProps = state => {
    return {
        meetingsLists: state['features/riff-platform'].meetings.meetingsLists
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getMeetingsLists: () => dispatch(getMeetings())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Meetings);
