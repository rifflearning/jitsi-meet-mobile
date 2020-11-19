/* eslint-disable */
import * as actionTypes from '../constants/actionTypes';
import api from '../api';

function meetingsRequest(){
  return {
    type: actionTypes.MEETINGS_REQUEST
  }
}

function meetingsSuccess(meetingsLists) {    
  return {
    type: actionTypes.MEETINGS_SUCCESS,
    meetingsLists
  }
}

function meetingsFailure(error){
  return {
    type: actionTypes.MEETINGS_FAILURE,
    error
  }
}

export function getMeetings() {
  return async (dispatch) => {
    dispatch(meetingsRequest());

    try {
      const res = await api.fetchMeetings();
      dispatch(meetingsSuccess(res));
    } catch (e) {
      console.error('Error in getMeetings', e);
      dispatch(meetingsFailure(e.message));
    }
  }
}

export function deleteMeeting(id) {
  return async (dispatch) => {

    try {
      await api.deleteMeeting(id);
      dispatch(getMeetings());
    } catch (e) {
      console.error('Error in deleteMeeting', e);
    }
  }
}

