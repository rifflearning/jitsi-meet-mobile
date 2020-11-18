import { Button, makeStyles, Typography } from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { connect } from '../../../base/redux';
import { deleteMeeting } from '../../actions/meetings';
import * as ROUTES from '../../constants/routes';
import { formatDurationTime } from '../../functions';

const useStyles = makeStyles(() => {
    return {
        meetingButton: {
            marginLeft: '10px',
            visibility: 'hidden'
        },
        tableRow: {
            '&:hover': {
                '& $meetingButton': {
                    visibility: 'visible'
                }
            }
        }
    };
});

const MeetingsRow = ({ meeting = {}, removeMeeting }) => {
    const classes = useStyles();
    const history = useHistory();

    const [ isLinkCopied, setLinkCopied ] = useState(false);

    const handleLinkCopy = useCallback(() => {
        navigator.clipboard.writeText(`${window.location.origin}/${meeting._id}`);
        setLinkCopied(true);
    }, []);
    const handleStartClick = useCallback(() => history.push(`${ROUTES.WAITING}/${meeting._id}`), [ history ]);
    const handleDeleteClick = useCallback(() => removeMeeting(meeting._id), []);

    const durationTime = formatDurationTime(meeting.dateStart, meeting.dateEnd);

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
                    onClick = { handleStartClick }
                    variant = 'contained'>Start</Button>
                <Button
                    className = { classes.meetingButton }
                    color = { isLinkCopied ? 'default' : 'primary' }
                    onClick = { handleLinkCopy }
                    variant = { isLinkCopied ? 'text' : 'outlined' }>{isLinkCopied ? 'Copied!' : 'Copy link'}</Button>
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
