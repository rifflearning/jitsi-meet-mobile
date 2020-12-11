/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-sort-props */

import DateFnsUtils from '@date-io/date-fns';
import { Button, Checkbox, FormControlLabel, Grid, MenuItem, TextField, Typography, Radio, Switch } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker
} from '@material-ui/pickers';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import MomentUtils from "@date-io/moment";
import moment from 'moment';
import 'moment-recur';

import { connect } from '../../../base/redux';
import { schedule } from '../../actions/scheduler';

moment.locale("en");

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

const getNumberArr = (length) => Array.from(Array(length).keys(), n => n + 1);

const hoursArray = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
const minutesArray = [ 0, 15, 30, 45 ];
const recurrenceIntervalArray = getNumberArr(20);
const recurrenceTypeArray = ['daily', 'weekly', 'monthly'];
const daysOfWeekArray = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthlyByPositionArray = [ 'First', 'Second', 'Third', 'Fourth', 'Last' ];

const daysOfWeekMap = {
    'Mon': 1,
    'Tue': 2,
    'Wed': 3,
    'Thu': 4,
    'Fri': 5,
    'Sat': 6,
    'Sun': 7,
};

const monthlyByPositionMap = {
    'First': 0,
    'Second': 1,
    'Third': 2,
    'Fourth': 3,
    "Last": 4,
}

const repeatIntervalMap = {
    daily: {
        name: 'day(s)',
        label: 'Day',
        interval: getNumberArr(15)
    },
    weekly: {
        name: 'week',
        label: 'Week',
        interval: getNumberArr(12)
    },
    monthly: {
        name: 'month',
        label: 'Month',
        interval: getNumberArr(3)
    },
};

const recurrenceTypeMap = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
};

const getRecurringDailyEventsByOccurance = ({ startDate, daysOccurances, daysInterval }) => moment(startDate).recur().every(daysInterval, 'days').next(daysOccurances, "MM/DD/YYYY");

const getRecurringDailyEventsByEndDate = ({ startDate, endDate, daysInterval, daysOccurances }) => endDate ?
    moment(startDate).recur(endDate).every(daysInterval, 'days').all("MM/DD/YYYY") :
    moment(startDate).recur().every(daysInterval, 'days').next(daysOccurances - 1, "MM/DD/YYYY");

const getRecurringWeeklyEventsByOccurance = ({ startDate, weeksOccurances, daysOfWeek }) => moment(startDate).recur().every(daysOfWeek).daysOfWeek().next(weeksOccurances, "MM/DD/YYYY");

const getRecurringWeeklyEventsByEndDate = ({ startDate, endDate, weeksOccurances, daysOfWeek }) => endDate ?
    moment(startDate).recur(endDate).every(daysOfWeek).daysOfWeek().all("MM/DD/YYYY") :
    moment(startDate).recur().every(daysOfWeek).daysOfWeek().next(weeksOccurances - 1, "MM/DD/YYYY");

const getRecurringMonthlyEventsByOccurance = ({ startDate, monthOccurances, monthlyBy, dayOfMonth, monthlyByWeekDay, monthlyByPosition }) => monthlyBy === 'monthlyByDay' ?
    moment(startDate).recur().every(dayOfMonth).daysOfMonth().next(monthOccurances, "MM/DD/YYYY")
    :
    moment(startDate).recur().every(monthlyByWeekDay).daysOfWeek().every(monthlyByPosition).weeksOfMonthByDay().next(monthOccurances, "MM/DD/YYYY");

const getRecurringMonthlyEventsByEndDate = ({ startDate, endDate, monthOccurances, monthlyBy, dayOfMonth, monthlyByWeekDay, monthlyByPosition }) => {
    if (monthlyBy === 'monthlyByDay') {
        return endDate ?
            moment(startDate).recur(endDate).every(dayOfMonth).daysOfMonth().all("MM/DD/YYYY") :
            moment(startDate).recur().every(dayOfMonth).daysOfMonth().next(monthOccurances, "MM/DD/YYYY");
    } else {
        return endDate ?
            moment(startDate).recur(endDate).every(monthlyByWeekDay).daysOfWeek().every(monthlyByPosition).weeksOfMonthByDay().all("MM/DD/YYYY") :
            moment(startDate).recur().every(monthlyByWeekDay).daysOfWeek().every(monthlyByPosition).weeksOfMonthByDay().next(monthOccurances, "MM/DD/YYYY");
    }
};

const defaultOccurrences = 7;

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
    const [ recurrenceType, setRecurrenceType ] = useState('daily');
    const [ recurrenceInterval, setRecurrenceInterval ] = useState(1);
    const [ endDateBy, setEndDateBy ] = useState('endDateTime');
    const [ endDate, setEndDate ] = useState(moment());
    const [ endTimes, setEndTimes] = useState(7);
    const [ monthlyBy, setMonthlyBy ] = useState('monthlyByDay');
    const [ monthlyByPosition, setMonthlyByPosition ] = useState('First');
    const [ monthlyByWeekDay, setMonthlyByWeekDay ] = useState('Mon');
    const [ monthlyByDay, setMonthlyByDay ] = useState(1);
    const [ daysOfWeek, setDaysOfWeek] = useState({
        Sun: false,
        Mon: false,
        Tue: false,
        Wed: false,
        Thu: false,
        Fri: false,
        Sat: false,
        [moment(date).format("ddd")]: true,
    } );
    const [ occurrenceCount, setOccuranceCount ] = useState(defaultOccurrences);
    const [ recurrenceDate, setRecurrenceDate ] = useState([]);

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

    const getDaysOfWeekArr = (daysOfWeek) =>  Object.keys(daysOfWeek).reduce((acc, v) =>  {
        daysOfWeek[v] && acc.push(v);
        return acc;
    }, []);

    const handleSubmit = e => {
        e.preventDefault();
        if (!isFormValid()) {
            return;
        }

        const dateEnd = new Date(date);

        dateEnd.setHours(dateEnd.getHours() + hours);
        dateEnd.setMinutes(dateEnd.getMinutes() + minutes);

        const recurrence = recurringMeeting ? recurrenceDate : null;

        scheduleMeeting({
            createdBy: userId,
            name,
            description,
            dateStart: date.getTime(),
            dateEnd: dateEnd.getTime(),
            allowAnonymous,
            waitForHost,
            recurrence
        });
    };

    const recurrenceMaxEndDate = {
        daily: moment(date).add(3, 'months').endOf('month'),
        weekly: moment(date).add(1, 'years').endOf('year'),
        monthly: moment(date).add(5, 'years').endOf('year')
    }

    useEffect(() => {
        setEndDate(null);
    }, [recurrenceType]);

    useEffect(() => {
        if (recurrenceType === "daily") {
            if (endDateBy === "endDateTime") {
                const recurringEvents = getRecurringDailyEventsByEndDate({
                    startDate: date,
                    endDate,
                    daysInterval: recurrenceInterval,
                    daysOccurances: defaultOccurrences,
                });
                setOccuranceCount(recurringEvents.length);
                setRecurrenceDate(recurringEvents);
                !endDate && setEndDate(moment(recurringEvents[recurringEvents.length - 1]));
            } else {
                const recurringEvents = getRecurringDailyEventsByOccurance({
                    startDate: date,
                    daysOccurances: endTimes,
                    daysInterval: recurrenceInterval,
                });
                setRecurrenceDate(recurringEvents);
            }
        } else  if (recurrenceType === "weekly") {
            const selectedDaysOfWeek = getDaysOfWeekArr(daysOfWeek).map(
                (day) => daysOfWeekMap[day]
            );
            if (endDateBy === "endDateTime") {
                const recurringEvents = getRecurringWeeklyEventsByEndDate({
                    startDate: date,
                    endDate,
                    weeksOccurances: defaultOccurrences,
                    daysOfWeek: selectedDaysOfWeek,
                });
                setOccuranceCount(recurringEvents.length);
                setRecurrenceDate(recurringEvents);
                !endDate && setEndDate(moment(recurringEvents[recurringEvents.length - 1]));
            } else {
                const recurringEvents = getRecurringWeeklyEventsByOccurance({
                    startDate: date,
                    weeksOccurances: endTimes,
                    daysOfWeek: selectedDaysOfWeek
                });
                setRecurrenceDate(recurringEvents);
            }
        } else if (recurrenceType === "monthly") {
            if (endDateBy === "endDateTime") {
                const recurringEvents = getRecurringMonthlyEventsByEndDate({
                    startDate: date,
                    endDate,
                    monthOccurances: defaultOccurrences,
                    monthlyBy,
                    dayOfMonth: monthlyByDay,
                    monthlyByWeekDay: daysOfWeekMap[monthlyByWeekDay],
                    monthlyByPosition: monthlyByPositionMap[monthlyByPosition],
                });
                setOccuranceCount(recurringEvents.length);
                setRecurrenceDate(recurringEvents);
                !endDate && setEndDate(moment(recurringEvents[recurringEvents.length - 1]));
            } else {
                const recurringEvents = getRecurringMonthlyEventsByOccurance({
                    startDate: date,
                    monthOccurances: endTimes,
                    monthlyBy,
                    dayOfMonth: monthlyByDay,
                    monthlyByWeekDay: daysOfWeekMap[monthlyByWeekDay],
                    monthlyByPosition: monthlyByPositionMap[monthlyByPosition],
                });
                setRecurrenceDate(recurringEvents);
            }
        }
    }, [
        date,
        recurrenceInterval,
        endTimes,
        endDateBy,
        endDate,
        daysOfWeek,
        recurrenceType,
        monthlyBy,
        monthlyByDay,
        monthlyByWeekDay,
        monthlyByPosition,
    ]);

    const recurrenceDesc = () => {
        const intervalPart = `Every ${
            recurrenceType === "daily" ? recurrenceInterval : ""
        } ${repeatIntervalMap[recurrenceType].name}, `;

        const endDatePart = `${
            endDateBy === "endDateTime"
                ? `until ${moment(endDate).format("MMM DD, YYYY")}, `
                : ' '
        } `;
        const occurrencePart = `${
            endDateBy === "endDateTime" ? occurrenceCount : endTimes
        } occurrence(s)`;

        return `${intervalPart} ${endDatePart} ${occurrencePart}`;
    
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
                spacing={2}>
                <Grid
                    item
                    sm={12}
                    md={6}>
                    <FormControlLabel
                        label='Recurring meeting'
                        control={<Switch
                            name='recurringMeeting'
                            checked={recurringMeeting}
                            onChange={e => setRecurringMeeting(e.target.checked)} />
                        } />
                </Grid>
                {recurringMeeting && <Grid
                    item
                    sm={12}
                    md={6}>
                    <Typography> {recurrenceDesc()} </Typography>
                </Grid>
                }
            </Grid>
            {recurringMeeting &&
                <Grid
                    container
                    alignItems='center'
                    spacing={2}>
                    <Grid
                        item
                        xs={12}
                        sm={3}
                        md={2}>
                        <Typography>
                            Recurrence
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={8}
                        md={10}>

                        <TextField
                            id='recurrence-type'
                            select
                            value={recurrenceType}
                            onChange={e => setRecurrenceType(e.target.value)}>
                            {recurrenceTypeArray.map(el => (<MenuItem
                                key={el}
                                value={el}>{recurrenceTypeMap[el]}</MenuItem>))}
                        </TextField>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={3}
                        md={2}>
                        <Typography>
                            Repeat every
                        </Typography>
                    </Grid>

                    <Grid
                        container
                        item
                        xs={12}
                        sm={8}
                        md={10}
                        spacing={1}>
                        {recurrenceType === 'daily' &&
                            <Grid item>
                                <TextField
                                    id='recurrence-interval'
                                    select
                                    SelectProps={{ MenuProps }}
                                    label={repeatIntervalMap[recurrenceType].label}
                                    value={recurrenceInterval}
                                    onChange={e => setRecurrenceInterval(e.target.value)}>
                                    {repeatIntervalMap[recurrenceType].interval.map(el => (<MenuItem
                                        key={el}
                                        value={el}>{el}</MenuItem>))}
                                </TextField>
                            </Grid>
                        }

                        {recurrenceType === 'weekly' &&
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
                        }

                        {recurrenceType === 'monthly' &&
                            <>
                                <Grid
                                    container
                                    item
                                    alignItems='center' 
                                    spacing={1}>
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
                                            disabled={monthlyBy !== 'monthlyByDay'}
                                            value={monthlyByDay}
                                            onChange={e => setMonthlyByDay(e.target.value)}>
                                            {recurrenceIntervalArray.map(el => (<MenuItem
                                                key={el}
                                                value={el}>{el}</MenuItem>))}
                                        </TextField>
                                    </Grid>
                                    <Grid item>
                                        <Typography>of the month</Typography>
                                    </Grid>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography>
                                        or
                                    </Typography>
                                </Grid>
                                <Grid
                                    container
                                    item
                                    alignItems='center' spacing={1}>
                                    <Grid item>
                                        <FormControlLabel
                                            label='The'
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
                                            disabled={monthlyBy !== 'monthlyByWeekDay'}
                                            value={monthlyByPosition}
                                            onChange={e => setMonthlyByPosition(e.target.value)}>
                                            {monthlyByPositionArray.map(el => (<MenuItem
                                                key={el}
                                                value={el}>{el}</MenuItem>))}
                                        </TextField>
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            id='monthly-by-week-day'
                                            select
                                            margin='normal'
                                            disabled={monthlyBy !== 'monthlyByWeekDay'}
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
                            </>
                        }
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        sm={3}
                        md={2}>
                        <Typography>
                            End date
                        </Typography>
                    </Grid>
                    <Grid
                        container
                        item
                        alignItems='center'
                        xs={12}
                        sm={8}
                        md={10}
                        spacing={1}>
                        <Grid
                            container
                            item
                            alignItems='center'
                            xs={12}
                            spacing={1}>
                            <Grid item>
                                <FormControlLabel
                                    label='By'
                                    control={<Radio
                                        name='endDate'
                                        value='endDateTime'
                                        checked={endDateBy === 'endDateTime'}
                                        onChange={e => setEndDateBy(e.target.value)} />
                                    } />
                            </Grid>
                            <Grid item>
                                <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={moment.locale('en')}>
                                    <KeyboardDatePicker
                                        autoOk
                                        disableToolbar
                                        variant='inline'
                                        format='MM/DD/YYYY'
                                        margin='normal'
                                        id='date-picker-inline'
                                        disablePast={true}
                                        disabled={endDateBy !== 'endDateTime'}
                                        maxDate={recurrenceMaxEndDate[recurrenceType]}
                                        label='End Date'
                                        value={endDate || moment()}
                                        onChange={setEndDate}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date'
                                        }} />
                                </MuiPickersUtilsProvider>
                            </Grid>
                        </Grid>

                        <Grid item sm={12}>
                            <Typography>
                                or
                            </Typography>
                        </Grid>
                        <Grid
                            container
                            item
                            spacing={1}
                            alignItems='center'>
                            <Grid item>
                                <FormControlLabel
                                    label='After'
                                    control={<Radio
                                        name='endDate'
                                        value='endTimes'
                                        checked={endDateBy === 'endTimes'}
                                        onChange={e => setEndDateBy(e.target.value)} />
                                    } />
                            </Grid>
                            <TextField
                                id='end-times'
                                select
                                margin='normal'
                                label='Occurrences'
                                SelectProps={{ MenuProps }}
                                disabled={endDateBy !== 'endTimes'}
                                value={endTimes}
                                onChange={e => setEndTimes(e.target.value)}>
                                {recurrenceIntervalArray.map(el => (<MenuItem
                                    key={el}
                                    value={el}>{el}</MenuItem>))}
                            </TextField>
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
