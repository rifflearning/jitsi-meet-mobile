/* eslint-disable react/jsx-sort-props */
/* eslint-disable react/jsx-no-bind */

import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import React from 'react';

const SimpleSnackbar = ({ propsOpen, propsHandleClose, text = 'default text' }) => {
    const [ open, setOpen ] = React.useState(false);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        if (propsHandleClose !== undefined) {
            return propsHandleClose();
        }

        setOpen(false);
    };

    return (
        <Snackbar
            anchorOrigin = {{
                vertical: 'bottom',
                horizontal: 'left'
            }}
            open = { propsOpen === undefined ? open : propsOpen }
            autoHideDuration = { 6000 }
            onClose = { handleClose }
            message = { text }
            action = {
                <React.Fragment>
                    <IconButton
                        size = 'small'
                        aria-label = 'close'
                        color = 'inherit'
                        onClick = { handleClose }>
                        <CloseIcon fontSize = 'small' />
                    </IconButton>
                </React.Fragment>
            } />
    );
};

SimpleSnackbar.propTypes = {
    propsHandleClose: PropTypes.func,
    propsOpen: PropTypes.bool,
    text: PropTypes.string
};

export default SimpleSnackbar;
