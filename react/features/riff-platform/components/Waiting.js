/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-sort-props */

import { CircularProgress, Grid } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { connect } from '../../base/redux';
import { checkIsMeetingAllowed } from '../actions/meeting';
import * as ROUTES from '../constants/routes';
import { msToTime } from '../functions';


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
            width: '100%', // Fix IE 11 issue.
            marginTop: theme.spacing(1)
        },
        submit: {
            margin: theme.spacing(3, 0, 2)
        }
    };
});

const Waiting = ({ meeting, checkIsMeetingAllowedProp }) => {
    const classes = useStyles();
    const history = useHistory();
    const params = useParams();
    let interval;

    const [ waitingTime, setWaitingTime ] = useState(false);

    const redirectToMeeting = () => {
        // Need to reload page
        window.location.replace(`/${params.meetingId}`);
    };

    const waitForMeeting = m => {
        setWaitingTime(Math.round((new Date(m.dateStart) - Date.now() - (5 * 60 * 1000)) / 1000));

        interval = setInterval(() => {
            setWaitingTime(prev => {
                if (prev === 0) {
                    clearInterval(interval);
                    redirectToMeeting();

                    return false;
                }

                return prev - 1;
            });
        }, 1000);
    };

    useEffect(() => {
        checkIsMeetingAllowedProp(params.meetingId).then(m => {
            if (m === null) {
                return history.push(ROUTES.JOIN);
            }
            if (m.error === 'not a meeting time') {
                return waitForMeeting(m.meeting);
            }

            redirectToMeeting();
        });

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, []);

    const loader = (<Grid
        container
        item
        justify = 'center'
        xs = { 12 }><CircularProgress /></Grid>);

    if (!meeting) {
        return loader;
    }

    const time = msToTime(waitingTime * 1000);

    return (
        <Container
            component = 'main'
            maxWidth = 'xs'>
            <div className = { classes.paper }>
                <Typography
                    component = 'h1'
                    variant = 'h4' >
                    Waiting Room
                </Typography>
                <br />
                {Boolean(waitingTime) && meeting.dateStart
                    ? <Typography
                        component = 'p'
                        variant = 'subtitle1' >
                        {`Meeting is scheduled for ${(new Date(meeting.dateStart)).toString()
                            .slice(0, 24)}`}
                    </Typography>
                    : <Typography
                        component = 'p'
                        variant = 'h5' >
                        Redirecting to the meeting...
                    </Typography>
                }

                {/* host will be able to edit meeting, can go to meeting directly, can send invitation?' */}
                <Typography color = 'error'>
                    {Boolean(waitingTime) && `You'll be able to join meeting in ${time}`}
                </Typography>
            </div>
        </Container>
    );
};

Waiting.propTypes = {
    checkIsMeetingAllowedProp: PropTypes.func,
    meeting: PropTypes.object
};

const mapStateToProps = state => {
    return {
        meeting: state['features/riff-platform'].meeting.meeting
    };
};

const mapDispatchToProps = dispatch => {
    return {
        checkIsMeetingAllowedProp: meetingId => dispatch(checkIsMeetingAllowed(meetingId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Waiting);
