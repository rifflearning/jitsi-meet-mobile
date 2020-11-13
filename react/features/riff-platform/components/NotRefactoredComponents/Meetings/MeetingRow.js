import { Button, Typography } from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { connect } from '../../../../base/redux';
import { deleteMeeting } from '../../../actions/meetings';
import * as ROUTES from '../../../constants/routes';
import { formatDurationTime } from '../../../functions';
import useStyles from '../useStyles';

const MeetingsRow = ({ meeting = {}, removeMeeting }) => {
    const classes = useStyles();
    const history = useHistory();

    const durationTime = formatDurationTime(meeting.dateStart, meeting.dateEnd);

    const handleStartClick = useCallback(() => history.push(`${ROUTES.WAITING}/${meeting._id}`), [ history ]);
    const handleEditClick = useCallback(() => history.push(`${ROUTES.MEETINGS}/${meeting._id}`), [ history ]);
    const handleDeleteClick = useCallback(() => removeMeeting(meeting._id), []);

    return (
        <TableRow
            className = { classes.tableRow }
            key = { meeting._id }>
            <TableCell>
                <Typography
                    component = 'p'
                    variant = 'h6' >
                    {durationTime}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography
                    component = 'p'
                    variant = 'h6' >
                    {meeting.name}
                </Typography>
            </TableCell>
            <TableCell align = 'right'>
                <Button
                    className = { classes.meetingButton }
                    color = 'primary'
                    onClick = { handleStartClick }>Start</Button>
                <Button
                    className = { classes.meetingButton }
                    onClick = { handleEditClick }>Edit</Button>
                <Button
                    className = { classes.meetingButton }
                    onClick = { handleDeleteClick }>Delete</Button>
            </TableCell>
        </TableRow>
    );
};


MeetingsRow.propTypes = {
    meeting: PropTypes.object,
    removeMeeting: PropTypes.func
};

const mapStateToProps = () => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        removeMeeting: id => dispatch(deleteMeeting(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MeetingsRow);
