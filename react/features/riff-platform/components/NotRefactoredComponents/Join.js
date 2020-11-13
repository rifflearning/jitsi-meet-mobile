/* eslint-disable */

import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useHistory } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { connect } from '../../../base/redux';
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

const Join = ({meetingError, token}) => {
  const [ room, setRoom ] = useState('');
  const [roomError, setRoomError] = useState('');
  
  const classes = useStyles();
  const history = useHistory();

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

    const param = encodeURIComponent(room);
    history.push(`${ROUTES.WAITING}/${param}`);
   };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h4" >
          Join a meeting
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
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
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Join
          </Button>
          {meetingError && 
            <Typography color='error'>
              No such meeting.
            </Typography>
          }
          {meetingError && !token && 
            <Typography color='error'>
              Or anonymous users are not allowed. Please SignIn or SignUp.
            </Typography>
          }
        </form>
      </div>
    </Container>
  );
}

const mapStateToProps = state => {
  return {
    meetingError: state['features/riff-platform'].meeting.error,
    token: state['features/riff-platform'].signIn.token
  };
};

export default connect(mapStateToProps)(Join)