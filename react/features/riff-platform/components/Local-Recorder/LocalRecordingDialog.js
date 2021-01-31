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
import {
    PARTICIPANT_ROLE,
    getLocalParticipant
} from '../../../base/participants';
import { connect } from '../../../base/redux';
import { recordingController } from '../../../local-recording/controller';

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


function LocalRecordingDialog(props) {
    const { onClose, handleStartRecording, open,
        isModerator,
        isEngaged,
        recordingEngagedAt } = props;

    console.log('isEngaged', isEngaged);

    const classes = useStyles();

    const handleCancel = () => {
        onClose();
    };

    const handleStart = () => {
        recordingController.startRecording();
    };


    const handleStop = () => {
        recordingController.stopRecording();
    };

    const onSubmit = () => {
        if (!isEngaged) {
            return handleStart();
        }
        handleStop();
    };


    if (!open || !isModerator) {
        return null;
    }

    return (
        <Dialog
            cancelKey = { 'dialog.close' }
            className = { classes.root }
            maxWidth = 'md'
            // eslint-disable-next-line no-negated-condition
            okKey = { !isEngaged ? 'Start Recording' : 'Stop Recording' }
            onSubmit = { onSubmit }

            // onCancel = { handleCancel }

            // onEscapeKeyDown = { handleCancel }
            open = { open }>
            <Typography style = {{ fontSize: '1.5rem' }}>Local Recording</Typography>
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
        </Dialog>
    );
}

LocalRecordingDialog.propTypes = {
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
const mapDispatchToProps = () => {
    return { };
};


export default connect(mapStateToProps, mapDispatchToProps)(LocalRecordingDialog);
