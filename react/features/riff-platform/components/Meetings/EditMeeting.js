/* eslint-disable require-jsdoc */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/jsx-no-bind */

import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import { connect } from '../../../base/redux';
import { schedulerReset } from '../../actions/scheduler';
import ScheduleSuccess from '../Scheduler/ScheduleSuccess';
import SchedulerForm from '../Scheduler/SchedulerForm';
import StyledPaper from '../StyledPaper';

const EditMeeting = ({ scheduledMeeting, resetScheduledMeeting }) => {
    useEffect(() => {
        resetScheduledMeeting();
    }, []);

    return (
        <Grid
            container = { true }
            spacing = { 3 }>
            <Grid
                item = { true }
                xs = { 12 }>
                <StyledPaper title = 'Edit a meeting'>
                    {scheduledMeeting
                        ? <ScheduleSuccess
                            resetScheduledMeeting = { resetScheduledMeeting }
                            scheduledMeeting = { scheduledMeeting } />
                        : <SchedulerForm isEditing = { true } />
                    }
                </StyledPaper>
            </Grid>
        </Grid>
    );
};

EditMeeting.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(EditMeeting);
