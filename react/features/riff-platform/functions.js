export const getJwt = () => {
    let jwt;

    try {
        jwt = localStorage.getItem('jwt-token');
    } catch (e) {
        console.error(e);
        jwt = null;
    }

    return jwt;
};

export const setJwt = token => {
    localStorage.setItem('jwt-token', token);
};

export const removeJwt = () => {
    localStorage.removeItem('jwt-token');
};

