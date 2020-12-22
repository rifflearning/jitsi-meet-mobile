/* eslint-disable require-jsdoc */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/jsx-no-bind */

import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

import { connect } from '../../../base/redux';
import SchedulerForm from '../Scheduler/SchedulerForm';
import StyledPaper from '../StyledPaper';

const EditMeeting = ({ scheduledMeeting }) => (
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

EditMeeting.propTypes = {
    scheduledMeeting: PropTypes.object
};

const mapStateToProps = state => {
    return {
        scheduledMeeting: state['features/riff-platform'].scheduler.meeting
    };
};
const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(EditMeeting);
