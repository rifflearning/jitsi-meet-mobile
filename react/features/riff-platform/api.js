/* eslint-disable */
import { getJwt, removeJwt } from './functions';

const API_URL = "https://localhost:4445/api";

class ApiService {
    getHeaders = () => ({
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + (getJwt())
        }
    })

    fetchWithJwt = async (url, options) => {
        const r = await fetch(API_URL + url, { ...this.getHeaders(), ...options });
        
        if (!r.ok) throw r;
        return await r.json();
    }

    postWithJwt = (url, body) => this.fetchWithJwt(url, { method: 'post', body: JSON.stringify(body) });

    signIn = async ({ email, password }) =>{
        try {
            return await this.postWithJwt('/login', {
                email,
                password
            });
        } catch (e) {
            throw new Error('Error in signIn');
        }
    }

    signUp = async ({ name, email, password }) => {
        try {
            return await this.postWithJwt('/register', {
                name,
                email,
                password
            });
        } catch (e) {
            if(e.status === 401) throw new Error('User already exists');
            throw new Error('Error in signUp');
        }
    }

    fetchProfile = async () => {
        try {
            return await this.fetchWithJwt('/profile');
        } catch (e) {
            throw new Error('Error in fetchProfile');
        }
    }

    isAuth = async () => {
        if (!getJwt()) return null;

        let user;
        try {
            const { uid, email, name: displayName } = await this.fetchProfile() // name: "r", email: "r"

            user = { uid, email, displayName };
            // user = { uid:'XYU5l9PRibST29m7oYQ9GWGoCwN2', email:'denys@riffanalytics.ai', displayName:'Denys Savisko' };
        } catch (error) {
            user = null;
            removeJwt();
        }
        return user;
    }

    fetchMeetings = async () => await this.fetchWithJwt('/meetings');

    fetchMeeting = async (name) =>  await this.fetchWithJwt('/meetings/' + name);
    
    scheduleMeeting = async (meeting) => {
        try {
            return await this.postWithJwt('/meetings', {
                meeting
            });
        } catch (e) {
            throw new Error('Error in scheduleMeeting');
        }
    }

    deleteMeeting = async (id) =>  await this.fetchWithJwt('/meetings/' + id, {method: 'delete'});
}

export default new ApiService();


/**
 * Add two numbers.
 *
 * @returns {Array} Mock meeting list.
 */
function getMockMeetings() {
    const mockMeetingList1 = [
        {
            id: 0,            
            creator: 'myUserId',
            name: 'Meeting urgent',
            date: '12:00 pm - 01:00 pm',
            description: 0,
            time:0,
            hours:0,
            minutes:0,
            timezone:0,
            allowAnonymous:0
        },
        {
            id:1,            
            creator: 'myUserId',
            name: 'Some another meeting',
            date:'04:00 pm - 05:00 pm',
        }
    ];

    const mockMeetingList2 = [
        {
            id: 0,            
            creator: 'myUserId',
            name: 'Meeting2',
            date: '12:00 pm - 01:00 pm',
        },
        {
            id:1,            
            creator: 'myUserId',
            name: 'Meeting standup',
            date:'04:00 pm - 05:00 pm',
        }
    ];
  
    const mockMeetingsLists = [
        {
            date: 'Today',
            meetingList: mockMeetingList1
        },
        {
            date: 'Thu, Nov 29',
            meetingList: mockMeetingList2
        }
    ];

    return mockMeetingsLists;
}
