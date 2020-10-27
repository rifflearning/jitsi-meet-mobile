/* eslint-disable */
import * as actionTypes from '../actionTypes';
import api from '../api';

function signInRequest(){
  return {
    type: actionTypes.LOGIN_REQUEST
  }
}

export function signInSuccess(token) {
  localStorage.setItem('jwt-token', token);

  // const pathName = localStorage.getItem('prevPathname');
  // if ( pathName && (pathName !== window.location.pathname)) {
  //   window.location.pathname = pathName;
  // } else {
  //   window.location.pathname = '/';
  // }

  return {
    type: actionTypes.LOGIN_SUCCESS,
    token
  }
}

function signInFailure(error){
  return {
    type: actionTypes.LOGIN_FAILURE,
    error
  }
}

export function logout() {
  localStorage.removeItem('jwt-token');

  return {
    type: actionTypes.LOGOUT
  }
}

export function signIn({email, password}) {
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
