/* eslint-disable require-jsdoc */

import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import React from 'react';

function MeetingTabPanel({ children, value, index }) {
    return (
        <div
            aria-labelledby = { `meeting-tab-${index}` }
            hidden = { value !== index }
            id = { `meeting-tabpanel-${index}` }>
            {value === index && (
                <Box p = { 3 }>
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
