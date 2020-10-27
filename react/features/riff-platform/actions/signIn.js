/* eslint-disable */
import * as actionTypes from '../actionTypes';
import api from '../api';
import { setJwt, removeJwt, getPrevPath } from '../functions';
import { _getRouteToRender } from '../../app/getRouteToRender';
import { customHistory } from '../components';
import { _navigate } from '../../app/middleware';

function signInRequest(){
  return {
    type: actionTypes.LOGIN_REQUEST
  }
}

export function signInSuccess(token) {
  return (dispatch, getState) => {
    setJwt(token)

    const prevPathname = getPrevPath();
    const isPrevPathRoomName = () => prevPathname && prevPathname?.split('/')[1] !== 'app';
    if (isPrevPathRoomName()) {
      // navigate to room name
      customHistory.push(getPrevPath());
      _navigate({getState})
    } else {
      // set token, what will redirect main app to /app root
      dispatch({
        type: actionTypes.LOGIN_SUCCESS,
        token
      })
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


      dispatch(signInSuccess(res.token));
    } catch (e) {
      dispatch(signInFailure(e.message));
    }
  }
}
