import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import PropTypes from 'prop-types';
import React from 'react';

import Title from '../Title';
import useStyles from '../useStyles';

import MeetingRow from './MeetingRow';

const MeetingsTabele = ({ date = 'no date', meetingsList = [] }) => {
    const classes = useStyles();

    return (
        <React.Fragment>
            <Title>{date}</Title>
            <Table >
                <TableBody>
                    {meetingsList.map(meeting =>
                        (<MeetingRow
                            key = { meeting._id }
                            meeting = { meeting } />)
                    )}
                </TableBody>
            </Table>
            <div className = { classes.seeMore } /> {/* prevents scrollbar in table */}
        </React.Fragment>
    );
};

MeetingsTabele.propTypes = {
    date: PropTypes.string,
    meetingsList: PropTypes.array
};

export default MeetingsTabele;
