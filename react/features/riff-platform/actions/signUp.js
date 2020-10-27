/* eslint-disable */
import * as actionTypes from '../actionTypes';
import api from '../api';
import { signInSuccess } from './signIn';

function signUpRequest(){
  return {
    type: actionTypes.REGISTER_REQUEST
  }
}

function signUpSuccess(token) {
  return (dispatch) => {

    dispatch(signInSuccess(token))
    
    dispatch({
      type: actionTypes.REGISTER_SUCCESS,
      token
    })
  }
}

function signUpFailure(error){
  return {
    type: actionTypes.REGISTER_FAILURE,
    error
  }
}

export function signUp({email, password, name}) {
  return async (dispatch) => {
    dispatch(signUpRequest());

    try {
      const res = await api.signUp({name, email, password})

      dispatch(signUpSuccess(res.token));
    } catch (e) {
      dispatch(signUpFailure(e.message));
    }
  }
}

