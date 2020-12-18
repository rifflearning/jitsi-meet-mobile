/* eslint-disable require-jsdoc */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/jsx-no-bind */

import { Button, CircularProgress, Grid } from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import { connect } from '../../../base/redux';
import { getMeetings, getMeetingsByGroup } from '../../actions/meetings';
import * as ROUTES from '../../constants/routes';
import { groupMeetingsByDays } from '../../functions';
import StyledPaper from '../StyledPaper';

import MeetingTabPanel from './MeetingTabPanel';
import MeetingsTable from './MeetingsTable';

const meetingListTypeMap = {
    0: 'upcoming',
    1: 'previous'
};

// eslint-disable-next-line react-native/no-inline-styles
const Loader = () => (<div style = {{ marginTop: '100px' }}>
    <Grid
        container = { true }
        item = { true }
        justify = 'center'
        xs = { 12 }><CircularProgress /></Grid>
</div>);


const MeetingsList = ({ groupedMeetings = [] }) => (
    <Grid
        container = { true }
        spacing = { 3 }>
        {Object.keys(groupedMeetings).map(date => (<Grid
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

MeetingsList.propTypes = {
    groupedMeetings: PropTypes.object
};

function Meetings({ meetingsLists = [], getMeetingsLists, getMeetingsListByGroup, groupName, loading }) {
    const [ selectedListTypeIndex, setSelectedListTypeIndex ] = useState(0);

    const history = useHistory();
    const handleScheduleClick = useCallback(() => history.push(ROUTES.SCHEDULE), [ history ]);

    useEffect(() => {
        if (groupName) {
            getMeetingsListByGroup(groupName, meetingListTypeMap[selectedListTypeIndex]);
        } else {
            getMeetingsLists(meetingListTypeMap[selectedListTypeIndex]);
        }
    }, [ selectedListTypeIndex ]);

    const groupedMeetings = groupMeetingsByDays(meetingsLists);

    return (
        <Grid
            container = { true }
            spacing = { 3 }>
            <Grid
                item = { true }
                xs = { 12 }>
                <Grid
                    container = { true }
                    item = { true }
                    justify = 'space-between'
                    spacing = { 1 }
                    xs = { 12 }>
                    <Grid
                        item = { true }>
                        <Tabs
                            onChange = { (_event, type) => setSelectedListTypeIndex(type) }
                            value = { selectedListTypeIndex }>
                            <Tab label = 'Upcoming' />
                            <Tab label = 'Previous' />
                        </Tabs>
                    </Grid>
                    <Grid
                        item = { true }>
                        <Button
                            color = 'primary'
                            onClick = { handleScheduleClick }
                            variant = 'outlined'>
                        Schedule meeting
                        </Button>
                    </Grid>
                </Grid>
                {loading
                    ? <Loader />
                    : <Grid
                        container = { true }
                        item = { true }
                        xs = { 12 }>
                        <MeetingTabPanel
                            index = { 0 }
                            value = { selectedListTypeIndex }>
                            <MeetingsList groupedMeetings = { groupedMeetings } />
                        </MeetingTabPanel>
                        <MeetingTabPanel
                            index = { 1 }
                            value = { selectedListTypeIndex }>
                            <MeetingsList groupedMeetings = { groupedMeetings } />
                        </MeetingTabPanel>
                    </Grid>}
            </Grid>
        </Grid>
    );
}

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
        getMeetingsListByGroup: (groupName, listType) => dispatch(getMeetingsByGroup(groupName, listType)),
        getMeetingsLists: listType => dispatch(getMeetings(listType))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Meetings);
