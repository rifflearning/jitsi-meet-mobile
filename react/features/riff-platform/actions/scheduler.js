/* eslint-disable */
import * as actionTypes from '../constants/actionTypes';
import api from '../api';

function schedulerRequest(){
  return {
    type: actionTypes.SCHEDULER_REQUEST
  }
}

function schedulerSuccess(meeting) {    
  return {
    type: actionTypes.SCHEDULER_SUCCESS,
    meeting
  }
}

function schedulerFailure(error){
  return {
    type: actionTypes.SCHEDULER_FAILURE,
    error
  }
}

export function schedule(meeting) {
  return async (dispatch) => {
    dispatch(schedulerRequest());

    try {
      const res = await api.scheduleMeeting(meeting);

      dispatch(schedulerSuccess(res));
    } catch (e) {
      dispatch(schedulerFailure(e.message));
    }
  }
}

export function schedulerReset() {
  return {
    type: actionTypes.SCHEDULER_RESET
  }
}