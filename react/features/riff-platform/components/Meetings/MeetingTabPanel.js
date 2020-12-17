import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';

function MeetingTabPanel({ children, value, index }) {
    return (
        <div
            hidden={value !== index}
            id={`meeting-tabpanel-${index}`}
            aria-labelledby={`meeting-tab-${index}`}
            
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

MeetingTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

export default MeetingTabPanel;
