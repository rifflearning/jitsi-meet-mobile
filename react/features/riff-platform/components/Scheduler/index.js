import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';


import { connect } from '../../../base/redux';
import { schedulerReset } from '../../actions/scheduler';
import StyledPaper from '../StyledPaper';

import ScheduleSuccess from './ScheduleSuccess';
import SchedulerForm from './SchedulerForm';

const Scheduler = ({ scheduledMeeting, resetScheduledMeeting }) => {
    useEffect(() => {
        // temprorary, then redirect to meetings/meetingID page
        resetScheduledMeeting();
    }, []);

    return (
        <Grid
            container = { true }
            spacing = { 3 }>
            <Grid
                item = { true }
                xs = { 12 }>
                <StyledPaper title = 'Schedule a meeting'>
                    {scheduledMeeting
                        ? <ScheduleSuccess
                            resetScheduledMeeting = { resetScheduledMeeting }
                            scheduledMeeting = { scheduledMeeting } />
                        : <SchedulerForm />
                    }
                </StyledPaper>
            </Grid>
        </Grid>
    );
};

Scheduler.propTypes = {
    resetScheduledMeeting: PropTypes.func,
    scheduledMeeting: PropTypes.object
};

const mapStateToProps = state => {
    return {
        scheduledMeeting: state['features/riff-platform'].scheduler.meeting
    };
};

const mapDispatchToProps = dispatch => {
    return {
        resetScheduledMeeting: () => dispatch(schedulerReset())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Scheduler);
