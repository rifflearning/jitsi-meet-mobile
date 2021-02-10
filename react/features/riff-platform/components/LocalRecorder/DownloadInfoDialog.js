/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable require-jsdoc */
/* global interfaceConfig */

import { Typography } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

import { hideDialog, Dialog } from '../../../base/dialog';
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


function DownloadInfoDialog({ isMemoryLimitExceeded, onClose }) {

    const classes = useStyles();
    const onSubmit = () => {
        recordingController.onMemoryExceededDownload();
        onClose();
    };

    if (!isMemoryLimitExceeded) {
        return null;
    }

    return (
        <Dialog
            className = { classes.root }
            isModal = { true }
            maxWidth = 'md'
            okKey = 'Download recording'
            onSubmit = { onSubmit }
            open = { true }>
            <Typography style = {{ fontSize: '1.5rem' }}>Local Recording</Typography>
            <DialogContent dividers = { true }>
                <Typography>
                    Memory limit exceeded.
                    The recording has paused.
                    To continue recording, please download the recording file.
                </Typography>
            </DialogContent>
        </Dialog>
    );
}

DownloadInfoDialog.propTypes = {
    isMemoryLimitExceeded: PropTypes.bool,
    onClose: PropTypes.func
};

const mapStateToProps = state => {
    const {
        recordingEngagedAt,
        isMemoryLimitExceeded
    } = state['features/riff-platform'].localRecording;

    return {
        recordingEngagedAt,
        isMemoryLimitExceeded
    };
};
const mapDispatchToProps = dispatch => {
    return {
        onClose: () => dispatch(hideDialog())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadInfoDialog);
