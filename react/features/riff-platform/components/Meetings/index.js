import { Button, CircularProgress, Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router';

import { connect } from '../../../base/redux';
import { getMeetings, getMeetingsByGroup } from '../../actions/meetings';
import * as ROUTES from '../../constants/routes';
import { groupMeetingsByDays } from '../../functions';
import StyledPaper from '../StyledPaper';

import MeetingsTable from './MeetingsTable';

const Meetings = ({ meetingsLists = [], getMeetingsLists, getMeetingsListByGroup, groupName, loading }) => {
    const history = useHistory();
    const handleScheduleClick = useCallback(() => history.push(ROUTES.SCHEDULE), [ history ]);

    useEffect(() => {
        if (groupName) {
            getMeetingsListByGroup(groupName);
        } else {
            getMeetingsLists();
        }
    }, []);

    // eslint-disable-next-line react-native/no-inline-styles
    const loader = (<div style = {{ marginTop: '100px' }}>
        <Grid
            container = { true }
            item = { true }
            justify = 'center'
            xs = { 12 }><CircularProgress /></Grid>
    </div>);

    if (loading) {
        return loader;
    }

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
                            groupName = { groupName }
                            meetingsList = { groupedMeetings[date] } />
                    </StyledPaper>
                </Grid>)
            )}
        </Grid>
    );
};

Meetings.propTypes = {
    getMeetingsListByGroup: PropTypes.func,
    getMeetingsLists: PropTypes.func,

    // groupName - external prop for separate group (harvard), disable 'delete' button, fetch groupped meeting.
    groupName: PropTypes.string,
    loading: PropTypes.bool,
    meetingsLists: PropTypes.array
};

const mapStateToProps = state => {
    return {
        meetingsLists: state['features/riff-platform'].meetings.meetingsLists,
        loading: state['features/riff-platform'].meetings.loading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getMeetingsLists: () => dispatch(getMeetings()),
        getMeetingsListByGroup: groupName => dispatch(getMeetingsByGroup(groupName))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Meetings);
