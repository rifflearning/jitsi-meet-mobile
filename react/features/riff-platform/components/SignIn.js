/* eslint-disable */

import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import {Link as LinkTo} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { connect } from '../../base/redux';
import { signIn } from '../actions/signIn';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
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

function SignIn({ doLogin, loginError, loggingIn }) {
  const classes = useStyles();
  const [ email, setEmail ] = useState('');
  const [ emailError, setEmailError ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ passwordError, setPasswordError ] = useState('');

  const onChangeEmail = (e) => setEmail(e.target.value);
  const onChangePassword = (e) => setPassword(e.target.value);

  const isEmailValid = () => Boolean(email.length);
  const isPasswordValid = () => Boolean(password.length);
  
  const isFormValid = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    if (!isEmailValid()) {
      isValid = false;
      setEmailError('Please, enter email')
    }
    if (!isPasswordValid()) {
      isValid = false;
      setPasswordError('Please, enter password')
    }

    return isValid;
  }

  const handleSubmit = e => {
    e.preventDefault();

    if (!isFormValid()) return;

    doLogin({
        email,
        password
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" >
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={onChangeEmail}
            error={Boolean(emailError)}
            helperText={emailError}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={onChangePassword}
            error={Boolean(passwordError)}
            helperText={passwordError}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={loggingIn}
          >
            Sign In
          </Button>
          <Typography color="error">
            {loginError}
          </Typography>
          <Grid container>
            <Grid item xs>
              {/* <Link href="#" variant="body2"> */}
                <LinkTo to='/reset'>
                  Forgot password?
                </LinkTo>
              {/* </Link> */}
            </Grid>
            <Grid item>
              {/* <Link href="#" variant="body2"> */}
                <LinkTo to='/signup'>
                  Don't have an account? Sign Up
                </LinkTo>
              {/* </Link> */}
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}


const mapStateToProps = state => {
  return {
      loginError: state['features/riff-platform'].signIn.error,
      loggingIn: state['features/riff-platform'].signIn.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
      doLogin: obj => dispatch(signIn(obj))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
