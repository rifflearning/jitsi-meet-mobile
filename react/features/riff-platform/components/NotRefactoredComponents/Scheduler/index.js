/* eslint-disable */

import React, { useEffect, useRef, useState } from 'react';
import Title from '../Title';
import { Button, Grid, Paper, Typography } from '@material-ui/core';
import useStyles from '../useStyles';
import SchedulerForm from './SchedulerForm';
import { connect } from '../../../../base/redux';
import { schedulerReset } from '../../../actions/scheduler';
import Snackbar from '../SnackBar';

const Scheduler = ({scheduledMeeting, resetScheduledMeeting}) => {
  const classes = useStyles();
  const linkRef = useRef(null);

  useEffect(() => {
    // temprorary, then redirect to meetings/meetingID
    resetScheduledMeeting();
  }, []);

  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  return (
      <Grid
        container = { true }
        spacing={3}>
        <Grid
            item = { true }
            xs = { 12 }>
            <Paper className = { classes.paper }>
              <React.Fragment>
                <Title>Schedule a meeting</Title>
                {scheduledMeeting
              ? <>
                <p>
                  Meeting scheduled! Share the link with other participants:
                </p>
                <p ref={linkRef} style={{ userSelect: 'text' }} onClick={() => {
                  window.getSelection().selectAllChildren(linkRef.current);
                  navigator.clipboard.writeText(`${window.location.origin}/${scheduledMeeting._id}`);
                  setOpen(true);
                }}>
                  {window.location.origin}/{scheduledMeeting._id}
                </p>
                <Snackbar propsOpen={open} propsHandleClose={handleClose} text="Link copied!" />
                <hr />
                <Button onClick={resetScheduledMeeting} color="primary">Schedule a new meeting</Button>
              </>
                  : <SchedulerForm />
                }
              </React.Fragment>
            </Paper>
        </Grid>
      </Grid>
  );
}



const mapStateToProps = state => {
  return {
    scheduledMeeting: state['features/riff-platform'].scheduler.meeting,
  };
};

const mapDispatchToProps = dispatch => {
  return {
      resetScheduledMeeting: () => dispatch(schedulerReset())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Scheduler);