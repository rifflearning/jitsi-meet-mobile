/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-sort-props */

import DateFnsUtils from '@date-io/date-fns';
import { Button, Checkbox, FormControlLabel, Grid, MenuItem, TextField, Typography, Radio } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker
} from '@material-ui/pickers';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { connect } from '../../../base/redux';
import { schedule } from '../../actions/scheduler';

const useStyles = makeStyles(theme => {
    return {
        paper: {
            marginTop: theme.spacing(4),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        avatar: {
            margin: theme.spacing(1),
            backgroundColor: theme.palette.secondary.main
        },
        form: {
            width: '99%', // Fix IE 11 issue. and bottom scroll issue
            marginTop: theme.spacing(1)
        },
        submit: {
            margin: theme.spacing(3, 0, 2)
        }
    };
});

const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 300,
      },
    },
  };

const hoursArray = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
const minutesArray = [ 0, 15, 30, 45 ];
const recurrenceTypeArray = ['Daily', 'Weekly', 'Monthly', 'No fixed time'];
const dailyIntervalArray = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ];
const daysOfWeekArray = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthlyByWeekIndexArray = [ 'First', 'Second', 'Third', 'Fourth', 'Last' ]

const SchedulerForm = ({ userId, loading, error, scheduleMeeting }) => {
    const classes = useStyles();

    const [ name, setname ] = useState('');
    const [ description, setdescription ] = useState('');
    const [ date, setdate ] = useState(new Date());
    const [ hours, setHours ] = useState(1);
    const [ minutes, setMinutes ] = useState(0);
    const [ allowAnonymous, setAllowAnonymous ] = useState(false);
    const [ waitForHost, setWaitForHost ] = useState(true);
    const [ recurringMeeting, setRecurringMeeting ] = useState(false);
    const [ recurrenceType, setRecurrenceType ] = useState('Daily');
    const [ dailyInterval, setDailyInterval ] = useState(1);
    const [ endDateBy, setEndDateBy ] = useState('endDateTime');
    const [ endDate, setEndDate ] = useState(new Date());
    const [ endTimes, setEndTimes] = useState(1);
    const [ daysOfWeek, setDaysOfWeek ] = useState({});
    const [ monthlyBy, setMonthlyBy ] = useState('monthlyByDay');
    const [ monthlyByWeekIndex, setMonthlyByWeekIndex ] = useState('First');
    const [ monthlyByWeekDay, setMonthlyByWeekDay ] = useState('Sun');
    const [ monthlyByDay, setMonthlyByDay ] = useState(1);

    const [ nameError, setnameError ] = useState('');
    const [ durationError, setDurationError ] = useState('');


    const isnameValid = () => Boolean(name.length);
    const isDurationValid = () => Boolean(hours || minutes);

    const isFormValid = () => {
        let isValid = true;

        setnameError('');
        setDurationError('');

        if (!isnameValid()) {
            isValid = false;
            setnameError('Please, enter name');
        }

        if (!isDurationValid()) {
            isValid = false;
            setDurationError('Please, pick meeting duration');
        }

        return isValid;
    };

    const handleSubmit = e => {
        e.preventDefault();
        if (!isFormValid()) {
            return;
        }

        const dateEnd = new Date(date);

        dateEnd.setHours(dateEnd.getHours() + hours);
        dateEnd.setMinutes(dateEnd.getMinutes() + minutes);

        scheduleMeeting({
            createdBy: userId,
            name,
            description,
            dateStart: date.getTime(),
            dateEnd: dateEnd.getTime(),
            allowAnonymous,
            waitForHost
        });
    };

    return (
        <form
            className = { classes.form }
            noValidate
            autoComplete = 'off'
            onSubmit = { handleSubmit }>
            <Grid
                container
                spacing = { 1 }>
                <Grid
                    item
                    xs = { 12 }
                    sm = { 10 }
                    md = { 8 }>
                    <TextField
                        variant = 'outlined'
                        margin = 'normal'
                        required
                        fullWidth
                        id = 'name'
                        label = 'Meeting name'
                        name = 'name'
                        autoFocus
                        value = { name }
                        onChange = { e => setname(e.target.value) }
                        error = { Boolean(nameError) }
                        helperText = { nameError } />
                </Grid>
                <Grid
                    item
                    xs = { 12 }
                    sm = { 10 }
                    md = { 8 }>
                    <TextField
                        variant = 'outlined'
                        margin = 'normal'
                        fullWidth
                        id = 'description'
                        label = 'Description (Optional)'
                        name = 'description'
                        value = { description }
                        onChange = { e => setdescription(e.target.value) } />
                </Grid>
            </Grid>

            <Grid
                container
                alignItems = 'center'
                spacing = { 2 }>
                <Grid
                    item
                    xs = { 12 }
                    sm = { 2 }>
                    <Typography>
                    When
                    </Typography>
                </Grid>

                <Grid
                    item
                    xs = { 12 }
                    sm = { 10 }>
                    <MuiPickersUtilsProvider utils = { DateFnsUtils }>
                        <Grid
                            container
                            spacing = { 2 }>
                            <Grid item>
                                <KeyboardDatePicker
                                    autoOk
                                    disableToolbar
                                    variant = 'inline'
                                    format = 'MM/dd/yyyy'
                                    margin = 'normal'
                                    id = 'date-picker-inline'
                                    label = 'Date'
                                    value = { date }
                                    onChange = { setdate }
                                    KeyboardButtonProps = {{
                                        'aria-label': 'change date'
                                    }} />
                            </Grid>
                            <Grid item>
                                <KeyboardTimePicker
                                    autoOk
                                    margin = 'normal'
                                    id = 'time-picker'
                                    label = 'Time'
                                    value = { date }
                                    onChange = { setdate }
                                    KeyboardButtonProps = {{
                                        'aria-label': 'change time'
                                    }} />
                            </Grid>
                        </Grid>
                    </MuiPickersUtilsProvider>
                </Grid>

                <Grid
                    item
                    xs = { 12 }
                    sm = { 2 }>
                    <Typography>
            Duration
                    </Typography>
                </Grid>
                <Grid
                    container
                    item
                    xs = { 12 }
                    sm = { 10 }
                    spacing = { 3 }>
                    <Grid item>
                        <TextField
                            id = 'duration-hours'
                            select
                            label = 'Hours'
                            value = { hours }
                            onChange = { e => setHours(e.target.value) }
                            error = { Boolean(durationError) }>
                            {hoursArray.map(el => (<MenuItem
                                key = { el }
                                value = { el }>{el}</MenuItem>))}
                        </TextField>
                    </Grid>
                    <Grid item>
                        <TextField
                            id = 'duration-minutes'
                            select
                            label = 'Minutes'
                            value = { minutes }
                            onChange = { e => setMinutes(e.target.value) }
                            error = { Boolean(durationError) }
                            helperText = { durationError }>
                            {minutesArray.map(el => (<MenuItem
                                key = { el }
                                value = { el }>{el}</MenuItem>))}
                        </TextField>
                    </Grid>
                </Grid>
            </Grid>

            <Grid
                container
                spacing = { 1 }>
                <Grid
                    item
                    xs = { 12 }>
                    <FormControlLabel
                        label = 'Recurring meeting'
                        control = { <Checkbox
                            name = 'recurringMeeting'
                            checked = { recurringMeeting }
                            onChange = { e => setRecurringMeeting(e.target.checked) } />
                        } />
                </Grid>
            </Grid>
            {recurringMeeting &&
                <Grid
                    container
                    alignItems = 'center'
                    spacing = { 2 }>
                    <Grid
                        item
                        xs = { 12 }
                        sm = { 2 }>
                        <Typography>
                            Recurrence
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs = { 12 }
                        sm = { 10 }>
                        <Grid
                            container
                            spacing = { 2 }>
                            <Grid item>
                                <TextField
                                    id = 'recurrence-type'
                                    select
                                    //label = 'Daily interval'
                                    value = { recurrenceType }
                                    onChange = { e => setRecurrenceType(e.target.value) }>
                                    { recurrenceTypeArray.map(el => (<MenuItem
                                        key = { el }
                                        value = { el }>{ el }</MenuItem>))}
                                </TextField>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid
                        item
                        xs = { 12 }
                        sm = { 2 }>
                        <Typography>
                            Repeat every
                        </Typography>
                    </Grid>
                    <Grid
                        container
                        item
                        xs = { 12 }
                        sm = { 10 }
                        spacing = { 3 }>
                        <Grid item>
                            <TextField
                                id = 'daily-interval'
                                select
                                SelectProps={{MenuProps}}
                                label = 'Day'
                                value = { dailyInterval }
                                onChange = { e => setDailyInterval(e.target.value) }>
                                { dailyIntervalArray.map(el => (<MenuItem
                                    key = { el }
                                    value = { el }>{ el }</MenuItem>))}
                            </TextField>
                        </Grid>
                </Grid>
                {(recurrenceType === 'Weekly' || recurrenceType === 'Monthly') &&
                    <>
                        <Grid
                            item
                            xs={12}
                            sm={2}>
                            <Typography>
                                Occurs on
                        </Typography>
                        </Grid>
                        {recurrenceType === 'Weekly' &&
                            <Grid
                                container
                                item
                                xs={12}
                                sm={10}
                                spacing={3}>
                                <Grid item>
                                    {daysOfWeekArray.map(el => (<FormControlLabel
                                        key={el}
                                        label={el}
                                        control={<Checkbox
                                            name={el}
                                            checked={daysOfWeek[el]}
                                            onChange={e => setDaysOfWeek({
                                                ...daysOfWeek,
                                                [e.target.name]: e.target.checked
                                            })} />
                                        } />))}
                                </Grid>
                            </Grid>
                        } {recurrenceType === 'Monthly' &&
                            <Grid
                                container
                                item
                                alignItems='center'
                                xs={12}
                                sm={10}
                                spacing={3}>
                                <Grid item>
                                    <Grid
                                        container
                                        alignItems='center' spacing={2}>
                                        <Grid item>
                                            <FormControlLabel
                                                label='Day'
                                                control={<Radio
                                                    name='monthlyBy'
                                                    value='monthlyByDay'
                                                    checked={monthlyBy === 'monthlyByDay'}
                                                    onChange={e => setMonthlyBy(e.target.value)} />
                                                } />
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                id='monthly-by-day'
                                                select
                                                SelectProps={{ MenuProps }}
                                                label='Day'
                                                value={monthlyByDay}
                                                onChange={e => setMonthlyByDay(e.target.value)}>
                                                {dailyIntervalArray.map(el => (<MenuItem
                                                    key={el}
                                                    value={el}>{el}</MenuItem>))}
                                            </TextField>
                                        </Grid>
                                        <Grid item>
                                            <Typography>of the month</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography>
                                        or
                        </Typography>
                                </Grid>
                                <Grid item>
                                    <Grid
                                        container
                                        alignItems='center' spacing={2}>
                                        <Grid item>
                                            <FormControlLabel
                                                control={<Radio
                                                    name='monthlyBy'
                                                    value='monthlyByWeekDay'
                                                    checked={monthlyBy === 'monthlyByWeekDay'}
                                                    onChange={e => setMonthlyBy(e.target.value)} />
                                                } />
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                id='monthly-by-week-index'
                                                select
                                                margin='normal'
                                                value={monthlyByWeekIndex}
                                                onChange={e => setMonthlyByWeekIndex(e.target.value)}>
                                                {monthlyByWeekIndexArray.map(el => (<MenuItem
                                                    key={el}
                                                    value={el}>{el}</MenuItem>))}
                                            </TextField>
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                id='monthly-by-week-day'
                                                select
                                                margin='normal'
                                                value={monthlyByWeekDay}
                                                onChange={e => setMonthlyByWeekDay(e.target.value)}>
                                                {daysOfWeekArray.map(el => (<MenuItem
                                                    key={el}
                                                    value={el}>{el}</MenuItem>))}
                                            </TextField>
                                        </Grid>
                                        <Grid item>
                                            <Typography>of the month</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        }
                    </>
                }

                    <Grid
                        item
                        xs = { 12 }
                        sm = { 2 }>
                        <Typography>
                            End date
                        </Typography>
                    </Grid>
                    <Grid
                        container
                        item
                        alignItems = 'center'
                        xs = { 12 }
                        sm = { 10 }
                        spacing = { 3 }>
                        <Grid item>
                            <Grid
                                container
                                alignItems = 'center'>
                                <Grid item>
                                    <FormControlLabel
                                        label = 'By'
                                        control = {<Radio
                                            name = 'endDate'
                                            value = 'endDateTime'
                                            checked = { endDateBy === 'endDateTime' }
                                            onChange = { e => setEndDateBy(e.target.value) } />
                                        } />
                                </Grid>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        autoOk
                                        disableToolbar
                                        variant = 'inline'
                                        format = 'MM/dd/yyyy'
                                        margin = 'normal'
                                        id = 'date-picker-inline'
                                        label = 'End Date'
                                        value = { endDate }
                                        onChange = { setEndDate }
                                        KeyboardButtonProps = { {
                                            'aria-label': 'change date'
                                        } } />
                                </MuiPickersUtilsProvider>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Typography>
                                or
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Grid
                                container
                                alignItems = 'center'>
                                <Grid item>
                                    <FormControlLabel
                                        label = 'After'
                                        control = { <Radio
                                            name = 'endDate'
                                            value = 'endTimes'
                                            checked = { endDateBy === 'endTimes' }
                                            onChange = { e => setEndDateBy(e.target.value) } />
                                        } />
                                </Grid>
                                <TextField
                                    id = 'end-times'
                                    select
                                    margin = 'normal'
                                    label = 'Occurrences'
                                    value = { endTimes }
                                    onChange = { e => setEndTimes(e.target.value) }>
                                    { dailyIntervalArray.map(el => (<MenuItem
                                        key = { el }
                                        value = { el }>{ el }</MenuItem>))}
                                </TextField>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            }

            <Grid
                container
                spacing = { 1 }>
                <Grid
                    item
                    xs = { 12 }>
                    <FormControlLabel
                        label = 'Allow anonymous users'
                        control = { <Checkbox
                            name = 'allowAnonymous'
                            checked = { allowAnonymous }
                            onChange = { e => setAllowAnonymous(e.target.checked) } />
                        } />
                </Grid>

                <Grid
                    item
                    xs = { 12 }>
                    <FormControlLabel
                        label = 'Wait for a host of the meeting'
                        control = { <Checkbox
                            name = 'waitForHost'
                            checked = { waitForHost }
                            onChange = { e => setWaitForHost(e.target.checked) } />
                        } />
                </Grid>
            </Grid>

            <Typography color = 'error'>
                {/* {loginError} */}
            </Typography>
            <Grid
                container
                spacing = { 3 }>
                <Grid item>
                    <Button
                        type = 'submit'
                        variant = 'contained'
                        color = 'primary'
                        className = { classes.submit }
                        disabled = { loading }>
            Save
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant = 'outlined'
                        className = { classes.submit }
                        onClick = { () => history.back() }>
            Cancel
                    </Button>
                </Grid>
                <Typography color = 'error'>
                    {error}
                </Typography>
            </Grid>
        </form>
    );
};

SchedulerForm.propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool,
    scheduleMeeting: PropTypes.func,
    userId: PropTypes.string
};

const mapStateToProps = state => {
    return {
        userId: state['features/riff-platform'].signIn.user?.uid,
        loading: state['features/riff-platform'].scheduler.loading,
        error: state['features/riff-platform'].scheduler.error,
        meeting: state['features/riff-platform'].scheduler.meeting
    };
};

const mapDispatchToProps = dispatch => {
    return {
        scheduleMeeting: meeting => dispatch(schedule(meeting))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SchedulerForm);
