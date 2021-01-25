import React from 'react';

import { CircularLabel } from '../../../base/label/index';
import { connect } from '../../base/redux';


const LocalRecordingIcon = isRecording => {

    if (!isRecording) {
        return null;
    }

    return (
        <CircularLabel
            className = 'local-rec'
            label = 'LOR' />
    );
};

const mapStateToProps = state => {
    const { isEngaged } = state['features/local-recording'];

    return {
        isRecording: true
    };
};

export default connect(mapStateToProps)(LocalRecordingIcon);
