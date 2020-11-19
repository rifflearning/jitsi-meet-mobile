/* global process */
/* eslint-disable object-property-newline */
/* eslint-disable valid-jsdoc */
/* eslint-disable no-invalid-this */
import { jwt } from './functions';

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

    postWithJwt = (url, body) => this.fetchWithJwt(url, { method: 'post', body: JSON.stringify(body) });

    // auth
    signIn = ({ email, password }) => this.postWithJwt('/login', { email, password });
    signUp = ({ name, email, password }) => this.postWithJwt('/register', { name, email, password });
    fetchProfile = () => this.fetchWithJwt('/profile');

    // meetings
    fetchMeeting = async name => await this.fetchWithJwt(`/meetings/${name}`);
    fetchMeetings = async () => await this.fetchWithJwt('/meetings');
    scheduleMeeting = async meeting => await this.postWithJwt('/meetings', { meeting });
    deleteMeeting = async id => await this.fetchWithJwt(`/meetings/${id}`, { method: 'delete' });

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
