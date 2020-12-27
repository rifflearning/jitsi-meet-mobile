/* eslint-disable require-jsdoc */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/jsx-no-bind */

import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import { connect } from '../../../base/redux';
import { schedulerReset } from '../../actions/scheduler';
import SchedulerForm from '../Scheduler/SchedulerForm';
import StyledPaper from '../StyledPaper';


const EditMeeting = ({ scheduledMeeting, resetScheduleMeeting }) => {
    useEffect(() => () => resetScheduleMeeting(), []);

    return (
        <Grid
            container = { true }
            spacing = { 3 }>
            <Grid
                item = { true }
                xs = { 12 }>
                <StyledPaper title = 'Edit a meeting'>
                    {scheduledMeeting
                        ? `Meeting ${scheduledMeeting.name} updated!`
                        : <SchedulerForm isEditing = { true } />
                    }
                </StyledPaper>
            </Grid>
        </Grid>
    );
};

EditMeeting.propTypes = {
    resetScheduleMeeting: PropTypes.func,
    scheduledMeeting: PropTypes.object
};

const mapStateToProps = state => {
    return {
        scheduledMeeting: state['features/riff-platform'].scheduler.meeting
    };
};
const mapDispatchToProps = dispatch => {
    return {
        resetScheduleMeeting: () => dispatch(schedulerReset())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditMeeting);
