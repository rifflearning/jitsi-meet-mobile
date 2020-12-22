/* eslint-disable require-jsdoc */

import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import React from 'react';

function MeetingTabPanel({ children, value, index }) {
    return (
        <div
            aria-labelledby = { `meeting-tab-${index}` }
            hidden = { value !== index }
            id = { `meeting-tabpanel-${index}` }
            // eslint-disable-next-line react-native/no-inline-styles
            style = {{ width: '100%' }}>
            {value === index && (
                <Box pt = { 2 }>
                    {children}
                </Box>
            )}
        </div>
    );
}

MeetingTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

export default MeetingTabPanel;
