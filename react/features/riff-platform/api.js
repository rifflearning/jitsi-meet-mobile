/* global process */
/* eslint-disable object-property-newline */
/* eslint-disable valid-jsdoc */
/* eslint-disable no-invalid-this */
import { jwt } from './functions';

// import { mockFetchEmotions, mockFetchUserNames } from './mockData';

const API_GATEWAY_LINK = process.env.API_GATEWAY;

/**
 * ApiService for REST calls to api-gateway.
 */
class ApiService {
    getHeaders = () => {
        return {
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${jwt.get()}`
            }
        };
    }

    fetchWithJwt = async (url, options) => {
        const r = await fetch(API_GATEWAY_LINK + url, { ...this.getHeaders(),
            ...options });

        if (!r.ok) {
            throw r;
        }

        return await r.json();
    }

    postWithJwt = (url, body = {}) => this.fetchWithJwt(url, { method: 'post', body: JSON.stringify(body) });
    putWithJwt = (url, body = {}) => this.fetchWithJwt(url, { method: 'put', body: JSON.stringify(body) });

    // auth
    signIn = ({ email, password }) => this.postWithJwt('/login', { email, password });
    signUp = ({ name, email, password }) => this.postWithJwt('/register', { name, email, password });
    fetchProfile = () => this.fetchWithJwt('/profile');
    // eslint-disable-next-line prefer-template
    fetchUserNames = arrUids => this.fetchWithJwt(`/profiles?${arrUids.map(id => '&id=' + id).join('')}`);
    resetPassword = ({ email, password }) => this.postWithJwt('/reset', { email, password });

    // fetchUserNames = mockFetchUserNames;

    // meetings
    fetchMeeting = name => this.fetchWithJwt(`/meetings/${name}`);
    fetchMeetingByRoomId = roomId => this.fetchWithJwt(`/meetingByRoomId/${roomId}`);
    fetchMeetings = listType => this.fetchWithJwt(`/meetings?listType=${listType}`);
    fetchMeetingsByGroup = (groupName, listType) => this.fetchWithJwt(`/fetchMeetingsByGroup/${groupName}?listType=${listType}`);
    fetchMeetingsRecurring = (roomId, listType) => this.fetchWithJwt(`/fetchMeetingsRecurring/${roomId}?listType=${listType}`);
    scheduleMeeting = meeting => this.postWithJwt('/meetings', { meeting });
    deleteMeeting = id => this.fetchWithJwt(`/meetings/${id}`, { method: 'delete' });
    deleteMeetingsRecurring = roomId => this.fetchWithJwt(`/meetingsRecurring/${roomId}`, { method: 'delete' });
    updateMeeting = (id, meeting) => this.putWithJwt(`/meetings/${id}`, { meeting });


    joinMeeting = id => this.postWithJwt(`/meetings/${id}/join`);

    // emotions
    fetchEmotions = meetingId => this.fetchWithJwt(`/emotion/roomid/${meetingId}`);

    // fetchEmotions = mockFetchEmotions;

    // helper, returns userObj if authenticated, otherwise null
    isAuth = async () => {
        let user = null;

        if (!jwt.get()) {
            return user;
        }

        try {
            const { uid, email, name: displayName } = await this.fetchProfile();

            user = { uid,
                email,
                displayName };
        } catch (e) {
            console.error('Error in isAuth', e);
        }

        return user;
    }
}

export default new ApiService();
