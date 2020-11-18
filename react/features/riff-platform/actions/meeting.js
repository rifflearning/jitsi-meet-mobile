/* eslint-disable */
import * as actionTypes from '../constants/actionTypes';
import api from '../api';

function meetingRequest(){
  return {
    type: actionTypes.MEETING_REQUEST
  }
}

function meetingSuccess(meeting) {    
  return {
    type: actionTypes.MEETING_SUCCESS,
    meeting
  }
}

function meetingFailure(error){
  return {
    type: actionTypes.MEETING_FAILURE,
    error
  }
}

export function checkMeeting(meetingId) {
  return async (dispatch) => {
    dispatch(meetingRequest());
    try {
      const meeting = await api.fetchMeeting(meetingId);
      if (!meeting) {
        dispatch(meetingFailure('No meeting with this ID'));
      } else {
        dispatch(meetingSuccess(meeting));
      }
      return meeting;
      
    } catch (error) {
      dispatch(meetingFailure('No meeting with this ID'));
      console.error(error);
      return null;
    }
  }
}

export function checkIsMeetingAllowed(meetingId) {
  return async (dispatch) => {
    try {
      const meeting = await dispatch(checkMeeting(meetingId));
      
      if (!meeting) return null;
      
      const timeToMeeting = new Date(meeting.dateStart).getTime() - Date.now();
      if (timeToMeeting > 5 * 60 * 1000) {
        return { error: 'not a meeting time', meeting };
      }
      
      return meeting;
    } catch (error) {
      return { error };
    }
  }
}