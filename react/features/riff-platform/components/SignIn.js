/* eslint-disable react/jsx-no-bind */
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { connect } from '../../base/redux';
import { signIn } from '../actions/signIn';

const Login = ({ login, loginError, loggingIn }) => {
    const [ email, setemail ] = useState('');
    const [ password, setpassword ] = useState('');

    const handleSubmit = e => {
        login({
            email,
            password
        });
        e.preventDefault();
    };


    return (
        <div>
            <form onSubmit = { handleSubmit }>
                <input
                    required
                    autoFocus
                    // type = 'email'
                    onChange = { e => setemail(e.target.value) } />
                <input
                    required
                    // type = 'password'
                    onChange = { e => setpassword(e.target.value) } />
                <input
                    disabled = { loggingIn }
                    type = 'submit'
                    value = 'submit' />
            </form>
            {loginError && <span>{loginError}</span>}
            <div>
                New to Riff? <Link to = 'signup'>Sign Up</Link>
            </div>
        </div>
    );
};

Login.propTypes = {
    loggingIn: PropTypes.bool,
    login: PropTypes.func,
    loginError: PropTypes.string
};

const mapStateToProps = state => {
    return {
        loginError: state['features/riff-platform'].signIn.error,
        loggingIn: state['features/riff-platform'].signIn.loading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        login: obj => dispatch(signIn(obj))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
