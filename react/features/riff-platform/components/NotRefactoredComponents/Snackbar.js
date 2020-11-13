/* eslint-disable */

import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

export default function SimpleSnackbar({propsOpen, propsHandleClose, text='default text'}) {
  const [open, setOpen] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    if (propsHandleClose !== undefined) return propsHandleClose();

    setOpen(false);
  };

  return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={propsOpen!== undefined? propsOpen : open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={text}
        action={
          <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
  );
}