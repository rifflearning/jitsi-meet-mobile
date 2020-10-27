/* eslint-disable react/jsx-no-bind */
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { connect } from '../../base/redux';
import { signUp } from '../actions/signUp';

const SignUp = ({ register, signUpError, signingUp }) => {
    const [ name, setname ] = useState('');
    const [ email, setemail ] = useState('');
    const [ password, setpassword ] = useState('');

    const handleSubmit = e => {
        register({
            email,
            password,
            name
        });
        e.preventDefault();
    };


    return (
        <div>
            <form onSubmit = { handleSubmit }>
                <input
                    required
                    // type = 'email'
                    onChange = { e => setname(e.target.value) } />
                <input
                    required
                    // type = 'email'
                    onChange = { e => setemail(e.target.value) } />
                <input
                    required
                    // type = 'password'
                    onChange = { e => setpassword(e.target.value) } />
                <input
                    disabled = { signingUp }
                    type = 'submit'
                    value = 'submit' />
            </form>
            {signUpError && <span>{signUpError}</span>}
            <div>
                Already have an account? <Link to = 'signin'>Sign In</Link>
            </div>
        </div>
    );
};

SignUp.propTypes = {
    register: PropTypes.func,
    signUpError: PropTypes.string,
    signingUp: PropTypes.bool
};

const mapStateToProps = state => {
    return {
        signUpError: state['features/riff-platform'].signUp.error,
        signingUp: state['features/riff-platform'].signUp.loading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        register: obj => dispatch(signUp(obj))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
