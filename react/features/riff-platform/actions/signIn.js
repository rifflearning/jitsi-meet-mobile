/* eslint-disable */
import * as actionTypes from '../constants/actionTypes';
import api from '../api';
import { jwt, previousLocationRoomName } from '../functions';
import { setRiffFirebaseCredentials } from '../../riff-dashboard-page/actions';

function signInRequest(){
  return {
    type: actionTypes.LOGIN_REQUEST
  }
}

export function signInSuccess(token) {
  return async (dispatch, getState) => {
    jwt.set(token);

    const user = await api.isAuth();

    if (user === null) {
      jwt.remove();
    } else {
      dispatch({
        type: actionTypes.LOGIN_SUCCESS,
        user
      });

      const { uid, email, displayName } = user;

      dispatch(setRiffFirebaseCredentials({
        displayName: displayName || (email ? email.split('@')[0] : 'Anonymous'),
        email: email || 'anonymous',
        uid
      }));


      const prevPathname = previousLocationRoomName.get();

      if (prevPathname) {
        // navigate to room name
        return prevPathname;
      }
    }
  }
}

function signInFailure(error){
  return {
    type: actionTypes.LOGIN_FAILURE,
    error
  }
}

export function logout() {
  jwt.remove()

  return {
    type: actionTypes.LOGOUT
  }
}

export function signIn({ email, password }) {
  return async (dispatch) => {
    dispatch(signInRequest());

    try {
      const res = await api.signIn({ email, password });

      return dispatch(signInSuccess(res.token));
    } catch (e) {
      console.error('Error in signIn', e);
      dispatch(signInFailure('Error in SignIn'));
    }
  }
}
