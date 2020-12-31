/* eslint-disable require-jsdoc */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/jsx-no-bind */

import { Grid } from '@material-ui/core';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import { connect } from '../../../base/redux';
import { meetingReset } from '../../actions/meeting';
import { updateSchedulerReset } from '../../actions/scheduler';
import SchedulerForm from '../Scheduler/SchedulerForm';
import StyledPaper from '../StyledPaper';


const EditMeeting = ({ updatedSheduledMeeting, resetUpdatedScheduleMeeting, resetMeeting }) => {
    useEffect(() => {
        resetUpdatedScheduleMeeting();

        return () => {
            resetUpdatedScheduleMeeting();
            resetMeeting();
        };
    }, []);

    const defineEditMode = () => {
        const params = new URLSearchParams(location.search);

        return params.get('mode');
    };

    const successDesc = type => {
        const meetingName = updatedSheduledMeeting?.name;
        const formattedMeetingDateStart = moment(updatedSheduledMeeting?.dateStart).format('MMM DD, YYYY');
        const descMap = {
            all: `All recurring meetings ${meetingName} updated!`,
            one: `Meeting ${meetingName} for date ${formattedMeetingDateStart} updated!`,
            default: `Meeting ${meetingName} for date ${formattedMeetingDateStart} updated!`
        };

        return descMap[type] || descMap.default;
    };

    return (
        <Grid
            container = { true }
            spacing = { 3 }>
            <Grid
                item = { true }
                xs = { 12 }>
                <StyledPaper title = 'Edit a meeting'>
                    {updatedSheduledMeeting
                        ? successDesc(defineEditMode())
                        : <SchedulerForm isEditing = { true } />
                    }
                </StyledPaper>
            </Grid>
        </Grid>
    );
};

EditMeeting.propTypes = {
    resetMeeting: PropTypes.func,
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
        resetUpdatedScheduleMeeting: () => dispatch(updateSchedulerReset()),
        resetMeeting: () => dispatch(meetingReset())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditMeeting);
