/* eslint-disable */

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Checkbox, FormControlLabel, Grid, MenuItem, TextField, Typography } from '@material-ui/core';
import { useState } from 'react';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { connect } from '../../../../base/redux';
import { schedule } from '../../../actions/scheduler';

const useStyles2 = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '99%', // Fix IE 11 issue. and bottom scroll issue
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const hoursArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const minutesArray = [0, 15, 30, 45];

const SchedulerForm = ({userId, loading, error, scheduleMeeting}) => {
  const classes = useStyles2();

  const [name, setname] = useState('');
  const [description, setdescription] = useState('');
  const [date, setdate] = useState(new Date());
  const [hours, setHours] = useState(1);
  const [minutes, setMinutes] = useState(0);
  const [allowAnonymous, setAllowAnonymous] = useState(true);
  const [waitForHost, setWaitForHost] = useState(true);
  
  const [nameError, setnameError] = useState('');
  const [durationError, setDurationError] = useState('');

  const onChangename = (e) => setname(e.target.value);
  const onChangedescription = (e) => setdescription(e.target.value);

  const isnameValid = () => Boolean(name.length);
  const isDurationValid = () => Boolean(hours || minutes);
  
  const isFormValid = () => {
    let isValid = true;
    setnameError('');
    setDurationError('');

    if (!isnameValid()) {
      isValid = false;
      setnameError('Please, enter name')
    }

    if (!isDurationValid()) {
      isValid = false;
      setDurationError('Please, pick meeting duration')
    }

    return isValid;
  }

  const handleSubmit = e => {
    e.preventDefault();
    if (!isFormValid()) return;

    const dateEnd = new Date(date);
    dateEnd.setHours(dateEnd.getHours() + hours);
    dateEnd.setMinutes(dateEnd.getMinutes() + minutes);
  

    scheduleMeeting({
      createdBy: userId,
      name,
      description,
      dateStart: date.getTime(),
      dateEnd: dateEnd.getTime(),
      allowAnonymous
    });
  };
  
  return (
    <form className={classes.form} noValidate autoComplete="off" onSubmit={handleSubmit}>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={10} md={8}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Meeting name"
            name="name"
            autoFocus
            value={name}
            onChange={onChangename}
            error={Boolean(nameError)}
            helperText={nameError}
            />
        </Grid>
        <Grid item xs={12} sm={10} md={8}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="description"
            label="Description (Optional)"
            name="description"
            value={description}
            onChange={onChangedescription}
            />
        </Grid>
      </Grid>

      <Grid container alignItems='center' spacing={2}>
        <Grid item xs={12} sm={2}>
          <Typography>
            When
          </Typography>
        </Grid>

        <Grid item xs={12} sm={10}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container spacing={2}>
              <Grid item>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="Date"
                  value={date}
                  onChange={setdate}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </Grid>
              <Grid item>
                <KeyboardTimePicker
                  margin="normal"
                  id="time-picker"
                  label="Time"
                  value={date}
                  onChange={setdate}
                  KeyboardButtonProps={{
                    'aria-label': 'change time',
                  }}
                  />
              </Grid>
            </Grid>
          </MuiPickersUtilsProvider>
        </Grid>

        <Grid item xs={12} sm={2}>
          <Typography>
            Duration
          </Typography>
        </Grid>
        <Grid container item xs={12} sm={10} spacing={3}>
          <Grid item>
            <TextField
              id="duration-hours"
              select
              label="Hours"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              error={Boolean(durationError)}
              >
              {hoursArray.map(el=><MenuItem key={el} value={el}>{el}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item>
            <TextField
              id="duration-minutes"
              select
              label="Minutes"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              error={Boolean(durationError)}
              helperText={durationError}
            >
              {minutesArray.map(el=><MenuItem key={el} value={el}>{el}</MenuItem>)}
            </TextField>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={1}>
        <Grid item xs={12}>
          <FormControlLabel
            label="Allow anonymous users"
            control={<Checkbox
              name="allowAnonymous"
              checked={allowAnonymous}
              onChange={e => setAllowAnonymous(e.target.checked)} />
            }
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            label="Wait for a host of the meeting"
            control={<Checkbox
              name="waitForHost"
              checked={waitForHost}
              onChange={e => setWaitForHost(e.target.checked)}/>
            }
          />
        </Grid>
      </Grid>
      
      <Typography color="error">
        {/* {loginError} */}
      </Typography>
      <Grid container spacing={3}>
        <Grid item>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={loading}
          >
            Save
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            className={classes.submit}
            onClick={()=>history.back()}
          >
            Cancel
          </Button>
        </Grid>
          <Typography color="error">
            {error}
          </Typography>
      </Grid>
    </form>
  )
}

const mapStateToProps = state => {
  return {
      userId: state['features/riff-metrics'].userData.uid,
      loading: state['features/riff-platform'].scheduler.loading,
      error: state['features/riff-platform'].scheduler.error,
      meeting: state['features/riff-platform'].scheduler.meeting,
  };
};

const mapDispatchToProps = dispatch => {
  return {
      scheduleMeeting: meeting => dispatch(schedule(meeting))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SchedulerForm);