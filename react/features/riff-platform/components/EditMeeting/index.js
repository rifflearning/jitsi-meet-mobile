/* eslint-disable require-jsdoc */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/jsx-no-bind */

import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import { connect } from '../../../base/redux';
import { updateSchedulerReset } from '../../actions/scheduler';
import SchedulerForm from '../Scheduler/SchedulerForm';
import StyledPaper from '../StyledPaper';


const EditMeeting = ({ updatedSheduledMeeting, resetUpdatedScheduleMeeting }) => {
    useEffect(() => {
        resetUpdatedScheduleMeeting();

        return () => resetUpdatedScheduleMeeting();
    }, []);

    return (
        <Grid
            container = { true }
            spacing = { 3 }>
            <Grid
                item = { true }
                xs = { 12 }>
                <StyledPaper title = 'Edit a meeting'>
                    {updatedSheduledMeeting
                        ? `Meeting ${updatedSheduledMeeting.name} updated!`
                        : <SchedulerForm isEditing = { true } />
                    }
                </StyledPaper>
            </Grid>
        </Grid>
    );
};

EditMeeting.propTypes = {
    resetUpdatedScheduleMeeting: PropTypes.func,
    updatedSheduledMeeting: PropTypes.object
};

const mapStateToProps = state => {
    return {
        updatedSheduledMeeting: state['features/riff-platform'].scheduler.updatedMeeting
    };
};
const mapDispatchToProps = dispatch => {
    return {
        resetUpdatedScheduleMeeting: () => dispatch(updateSchedulerReset())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditMeeting);
