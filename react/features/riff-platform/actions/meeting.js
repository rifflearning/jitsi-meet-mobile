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

    const meeting = await api.fetchMeeting(meetingId); //api.getMeeting();

    if (!meeting) {
      dispatch(meetingFailure('No meeting with this ID'));
    } else {
      dispatch(meetingSuccess(meeting));
    }
    return meeting;

    /*

    //--- do it later
    // if(notAuth){
    //   if(meeting.allowAnonymous){
    //     generateRandomUserId();
    //   } else {
    //     setJoinError('Meeting not allowed anonymous users, please login or sign in');
    //     history.push('Join');
    //   };
    // }


    */    
    // if meeting exists,
    // and not allowAnonymous
    // if no auth
    // redir to auth, then to meeting/waiting room(if time isn't ok)
    
    // if meeting exists
    // and allowAnonymous
    // bypass auth, redir to meeting/waiting room(if time is'nt ok)

    // if no meeting,
    // redir to join room, say 'no meeting', propose to sign in/ sign up.

    // waiting room states: meeting exists, waiting time to meeting, authed
    // waiting room states: meeting exists, waiting time to meeting, no auth, propose to sign-up
    // join room states: meeting no exists, no auth/auth, propose to sign-up
  }
}

