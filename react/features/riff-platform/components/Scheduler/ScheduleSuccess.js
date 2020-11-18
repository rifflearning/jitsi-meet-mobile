/* eslint-disable react/jsx-no-bind */
import { Button } from '@material-ui/core';
import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router';

import * as ROUTES from '../../constants/routes';

import Snackbar from './Snackbar';

const style = { userSelect: 'text' };

const ScheduleSuccess = ({ scheduledMeeting, resetScheduledMeeting }) => {
    const linkRef = useRef(null);
    const history = useHistory();

    const [ open, setOpen ] = useState(false);

    const handleClose = () => setOpen(false);
    const handleStartClick = () => history.push(`${ROUTES.WAITING}/${scheduledMeeting._id}`);

    const handleLinkCopy = () => {
        navigator.clipboard.writeText(`${window.location.origin}/${scheduledMeeting._id}`);
        setOpen(true);
    };

    return (
        <>
            <p>Meeting scheduled! Share the link with other participants:</p>
            <br />
            <p
                ref = { linkRef }
                style = { style }>
                {window.location.origin}/{scheduledMeeting._id}
            </p>
            <br />
            <div>
                <Button
                    onClick = { handleLinkCopy }
                    variant = 'outlined'>Copy link</Button>
                <Button
                    onClick = { handleStartClick }
                    variant = 'outlined'>Go to the meeting</Button>
                <Button
                    color = 'primary'
                    onClick = { resetScheduledMeeting }>Schedule a new meeting</Button>
            </div>
            <Snackbar
                propsHandleClose = { handleClose }
                propsOpen = { open }
                text = 'Link copied!' />
        </>
    );
};

export default ScheduleSuccess;
