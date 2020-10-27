export const getJwt = () => localStorage.getItem('jwt-token');

export const setJwt = token => {
    localStorage.setItem('jwt-token', token);
};

export const removeJwt = () => {
    localStorage.removeItem('jwt-token');
};

export const getPrevPath = () => sessionStorage.getItem('prevPathname');

export const setPrevPath = pathName => {
    sessionStorage.setItem('prevPathname', pathName);
};

