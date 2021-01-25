/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable require-jsdoc */
import { Typography, List, ListItem, ListItemText } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

import { Dialog } from '../../../base/dialog';

const useStyles = makeStyles(() => {
    return {
        root: {
            width: '100%',
            maxWidth: 360,
            backgroundColor: 'none'
        },
        paper: {
            width: '80%',
            maxHeight: 435
        }
    };
});


const recordingSteps = [ 'To start recording click on start recording',
    'Select the screen type to start recording',
    'Click on share button to confirm recording',
    'To stop recording click on stop recording'
];


export function LocalRecordingDialog(props) {
    const { onClose, handleStartRecording, open, ...other } = props;

    const classes = useStyles();

    const handleCancel = () => {
        onClose();
    };

    const handleStart = () => {
        handleStartRecording();
        onClose();
    };

    return (
        <>
            {/* <Dialog
            className = { classes.root }
            maxWidth = 'md'
            okKey = 'Start Recording'
            onCancel = { handleCancel }
            onEscapeKeyDown = { handleCancel }
            onSubmit = { handleStart }
            open = { open }
        { ...other }>*/}
            <Typography >
                <span style = {{ fontSize: '1.5rem' }}>Local Recording</span>
            </Typography>
            <DialogContent dividers = { true }>
                <Typography>Follow the below steps to do screen recording:</Typography>
                <List>
                    {recordingSteps.map((el, i) => (
                        <ListItem
                            dense = { true }
                            disableGutters = { true }
                            key = { i }>
                            <ListItemText
                                primary = { `*${el}` } />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            {/* </Dialog>*/}
       </>
    );
}

LocalRecordingDialog.propTypes = {
};


export default LocalRecordingDialog;
