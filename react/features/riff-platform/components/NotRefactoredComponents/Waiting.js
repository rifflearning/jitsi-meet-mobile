/* eslint-disable */

import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import {useHistory, useParams} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { connect } from '../../../base/redux';
import { useEffect } from 'react';
import api from '../../api';
import { checkMeeting } from '../../actions/meeting';
import * as ROUTES from '../../constants/routes';

const useStyles = makeStyles((theme) => ({
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
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function SignIn({ doJoin, meetingError, loading, checkMeeting }) {
  const classes = useStyles();
  const history = useHistory();
  const params = useParams();
  console.log({params})
  const [ room, setRoom ] = useState('');
  const [ roomError, setRoomError ] = useState('');
  
  const [isHost, setIsHost] = useState(false);
  
  const onChangeRoom = (e) => setRoom(e.target.value);

  const isRoomValid = () => Boolean(room.length);
  
  const isFormValid = () => {
    let isValid = true;
    setRoomError('');

    if (!isRoomValid()) {
      isValid = false;
      setRoomError('Please, enter room')
    }

    return isValid;
  }

  const handleSubmit = e => {
    e.preventDefault();

    if (!isFormValid()) return;

    doJoin({room});
  };

  const processToMeeting = async (name) => {
    try {
      const meeting = await api.fetchMeeting(name);
      
      // check if room exists - get meeting my meetingId
      
      // const isAnonymous = true;
      // if ( isAnonymous && !meeting.allowAnonymous ) {
      //   return console.error('no anonymous');
      // }
      // check if allow for anonymous users - look in meeting obj
      // create anonymous userId - create some unique ID

      // check if user host (if authed?)
      const myMockUserId = '1' || 'userId123';
      if (meeting.host === myMockUserId) {
        setIsHost(true);
        // can go to meeting?
        // show redirect to meeting
        window.location.href = name;
      } else {
        // setIsWaitingForMeeting(5);
        // wait untill if it's meeting time(5 minutes?)
        // wait untill if host on the meeting
        // redirect to meeting
        setTimeout(() => {
          window.location.href = name;
        },5000)
      }
        
    } catch (error) {
      console.error('no such meeting');
    }
  }

  useEffect(() => {
    checkMeeting(params.meetingId).then((meeting) => {
      if (!meeting) {
        history.push(ROUTES.JOIN);
      } else { 
        // if(meeting.startTime more than in 5 min) {
          // setState('start in severalMinutes-5min, meeting time is');
          // setTimeout(()=> checkMeeting, severalMinutes-5min)
        //}
        //join meeting
        window.location.href = params.meetingId;
      }
    });
  }, [])

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h4" >
          Waiting Room ...
          Meeting is set for 14:30, today
          
        </Typography>
        {isHost
          ? 'im host of the meeting, can edit it, can go to meeting directly, can send invitation?'
          : 'You will be able to join the meeting 5 minutes before the meeting.'
        }
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          {/* <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="room"
            label="Meeting ID or personal link name"
            name="room"
            autoComplete="room"
            autoFocus
            value={room}
            onChange={onChangeRoom}
            error={Boolean(roomError)}
            helperText={roomError}
          /> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={loading}
          >
            Join
          </Button>
          <Typography color="error">
            {meetingError}
          </Typography>
        </form>
      </div>
    </Container>
  );
}


const mapStateToProps = state => {
  return {
      roomError: state['features/riff-platform'].signIn.error,
      loading: state['features/riff-platform'].signIn.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    checkMeeting: (meetingId) => dispatch(checkMeeting(meetingId)),
    doJoin: obj => {
      // dispatch(signIn(obj))
      // check if meeting exists, if yes, then redirect to waiting room
      // if anonym, generate anonymID
      window.location.href = '/' + obj.room;
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
