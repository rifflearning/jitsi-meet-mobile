/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable require-jsdoc */
/* global interfaceConfig */

import { Typography, List, ListItem, ListItemText } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

import { hideDialog, Dialog } from '../../../base/dialog';
import {
    PARTICIPANT_ROLE,
    getLocalParticipant
} from '../../../base/participants';
import { connect } from '../../../base/redux';

import { recordingController } from './LocalRecorderController';

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
    // eslint-disable-next-line camelcase
    `Select ${interfaceConfig.APP_NAME} screen type to start recording`,
    'Click on share button to confirm recording',
    'To stop recording click on stop recording'
];


function LocalRecordingDialog({
    onClose,
    open,
    isModerator,
    isEngaged }) {

    const classes = useStyles();

    const handleCancel = () => {
        onClose();
    };

    const handleStart = () => {
        recordingController.startRecording();
        handleCancel();
    };


    const handleStop = () => {
        recordingController.stopRecording();
        handleCancel();
    };

    const onSubmit = () => {
        if (!isEngaged) {
            return handleStart();
        }
        handleStop();
    };


    if (!open) {
        return null;
    }

    const renderModeratorControls = (
    <>
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
    </>);

    const renderNoModeratorControls
        = <Typography>Only those with moderator access can turn on recordings in sessions</Typography>;

    // eslint-disable-next-line no-negated-condition
    const defineSubmitButtonText = !isEngaged ? 'Start Recording' : 'Stop Recording';

    return (
        <Dialog
            cancelKey = { 'dialog.close' }
            className = { classes.root }
            maxWidth = 'md'
            okKey = { defineSubmitButtonText }
            onCancel = { handleCancel }
            onSubmit = { onSubmit }
            open = { open }>
            <Typography style = {{ fontSize: '1.5rem' }}>Local Recording</Typography>
            <DialogContent dividers = { true }>
                {isModerator ? renderModeratorControls : renderNoModeratorControls}
            </DialogContent>
        </Dialog>
    );
}

LocalRecordingDialog.propTypes = {
    isEngaged: PropTypes.bool,
    isModerator: PropTypes.bool,
    onClose: PropTypes.func,
    open: PropTypes.bool,
    recordingEngagedAt: PropTypes.any
};

const mapStateToProps = state => {
    const {
        isEngaged,
        recordingEngagedAt
    } = state['features/local-recording'];
    const isModerator
        = getLocalParticipant(state).role === PARTICIPANT_ROLE.MODERATOR;

    return {
        isModerator,
        isEngaged,
        recordingEngagedAt
    };
};
const mapDispatchToProps = dispatch => {
    return {
        onClose: () => dispatch(hideDialog())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LocalRecordingDialog);
