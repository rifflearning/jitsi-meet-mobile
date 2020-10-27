import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { connect } from '../../base/redux';
import { getProfile } from '../actions/profile';
import { logout } from '../actions/signIn';

const App = ({ doLogout, getProfileInfo, profileInfo, profileLoading }) => {
    useEffect(() => {
        getProfileInfo();
    }, []);

    return (
        <div>
            <p>
                Lobby
            </p>
            {profileLoading ? 'loading...' : JSON.stringify(profileInfo)}
            <button
                onClick = { doLogout }>
                logout
            </button>
            <Link to = '/dashboard'>Dashboard</Link>
        </div>
    );
};

App.propTypes = {
    doLogout: PropTypes.func,
    getProfileInfo: PropTypes.func,
    profileInfo: PropTypes.object,
    profileLoading: PropTypes.bool
};

const mapStateToProps = state => {
    return {
        profileInfo: state['features/riff-platform'].profile,
        profileLoading: state['features/riff-platform'].profile.loading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        doLogout: obj => dispatch(logout(obj)),
        getProfileInfo: () => dispatch(getProfile())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
