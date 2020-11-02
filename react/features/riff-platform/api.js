/* eslint-disable */
import { getJwt } from './functions';

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

    post = (url, body) => this.fetchWithJwt(url, { method: 'post', body: JSON.stringify(body) });

    signIn = async ({ email, password }) =>{
        try {
            return await this.post('/login', {
                email,
                password
            });
        } catch (e) {
            throw new Error('Error in signIn');
        }
    }

    signUp = async ({ name, email, password }) => {
        try {
            return await this.post('/register', {
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
            const { email: uid, email, name: displayName } = await this.fetchProfile() // name: "r", email: "r"

            user = { uid, email, displayName };
        } catch (error) {
            user = null;
        }
        return user;
    }
}

export default new ApiService();