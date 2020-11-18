/* eslint-disable */
import * as actionTypes from '../constants/actionTypes';
import api from '../api';
import { setJwt, removeJwt, getPrevPath, setPrevPath, navigateToConference } from '../functions';
import { _getRouteToRender } from '../../app/getRouteToRender';
import { setRiffFirebaseCredentials } from '../../riff-dashboard-page/actions';

function signInRequest(){
  return {
    type: actionTypes.LOGIN_REQUEST
  }
}

export function signInSuccess(token) {
  return async (dispatch, getState) => {
    setJwt(token)

    const user = await api.isAuth();
    if (user === null) {
      removeJwt();
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


      const prevPathname = getPrevPath();
      const isPrevPathRoomName = () => prevPathname?.split('/')[1] && (prevPathname?.split('/')[1] !== 'app');
      if (isPrevPathRoomName()) {
        // navigate to room name
        setPrevPath('');
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
  removeJwt()

  return {
    type: actionTypes.LOGOUT
  }
}

export function signIn({ email, password }) {
  return async (dispatch) => {
    dispatch(signInRequest());

    try {
      const res = await api.signIn({email, password})

      return dispatch(signInSuccess(res.token));
    } catch (e) {
      dispatch(signInFailure(e.message));
    }
  }
}
