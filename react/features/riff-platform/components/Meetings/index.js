import { Button, CircularProgress, Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { connect } from '../../../base/redux';
import { getMeetings, getMeetingsByGroup } from '../../actions/meetings';
import * as ROUTES from '../../constants/routes';
import { groupMeetingsByDays } from '../../functions';
import StyledPaper from '../StyledPaper';

import MeetingsTable from './MeetingsTable';
import MeetingTabPanel from './MeetingTabPanel';

const meetingListTypeMap = {
    0: 'upcoming',
    1: 'previous'
};

const Meetings = ({ meetingsLists = [], getMeetingsLists, getMeetingsListByGroup, groupName, loading }) => {
   const [ selectedListTypeIndex, setSelectedListTypeIndex ] = useState(0);

    const history = useHistory();
    const handleScheduleClick = useCallback(() => history.push(ROUTES.SCHEDULE), [ history ]);

    useEffect(() => {
        if (groupName) {
            getMeetingsListByGroup(groupName);
        } else {
            getMeetingsLists(meetingListTypeMap[selectedListTypeIndex]);
        }
    }, [selectedListTypeIndex]);

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

    const MeetingsList = () => (
        <Grid
            container={true}
            spacing={3}>
            {Object.keys(groupedMeetings).map(date =>
            (<Grid
                item={true}
                key={date}
                xs={12}>
                <StyledPaper title={date}>
                    <MeetingsTable
                        meetingsList={groupedMeetings[date]} />
                </StyledPaper>
            </Grid>)
            )}
        </Grid>
    )

    const groupedMeetings = groupMeetingsByDays(meetingsLists);

    return (
        <Grid
            container={true}
            spacing={3}>
            <Grid
                item
                xs={12}>
                <Grid
                    container={true}
                    item={true}
                    justify='space-between'
                    xs={12}>
                    <Tabs value={selectedListTypeIndex} onChange={(event, type) => setSelectedListTypeIndex(type)}>
                        <Tab label='Upcoming' />
                        <Tab label='Previous' />
                    </Tabs>
                    <Button
                        color='primary'
                        onClick={handleScheduleClick}
                        variant='outlined'>
                        Schedule meeting
                    </Button>
                </Grid>
                <Grid
                    container={true}
                    item={true}
                    justify='space-between'
                    xs={12}>
                <MeetingTabPanel value={selectedListTypeIndex} index={0}>
                    <MeetingsList />
                </MeetingTabPanel>
                <MeetingTabPanel value={selectedListTypeIndex} index={1}>
                    <MeetingsList />
                </MeetingTabPanel>
                </Grid>
            </Grid>
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
        getMeetingsListByGroup: groupName => dispatch(getMeetingsByGroup(groupName)),
        getMeetingsLists: (listType) => dispatch(getMeetings(listType))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Meetings);
