/* eslint-disable react/jsx-sort-props */
/* eslint-disable react/jsx-no-bind */

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import BarChartIcon from '@material-ui/icons/BarChart';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';

export default () => {
    const history = useHistory();
    const { pathname } = useLocation();
    const isSelected = path => pathname === path;

    return (
        <div>
            <ListItem
                button = { true }
                onClick = { () => history.push(ROUTES.PROFILE) }
                selected = { isSelected(ROUTES.PROFILE) }>
                <ListItemIcon>
                    <PersonIcon />
                </ListItemIcon>
                <ListItemText primary = 'Profile' />
            </ListItem>
            <ListItem
                button = { true }
                onClick = { () => history.push(ROUTES.MEETINGS) }
                selected = { isSelected(ROUTES.MEETINGS) }>
                <ListItemIcon>
                    <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary = 'Meetings' />
            </ListItem>
            <ListItem
                button = { true }
                onClick = { () => history.push(ROUTES.DASHBOARD) }
                selected = { isSelected(ROUTES.DASHBOARD) }>
                <ListItemIcon>
                    <BarChartIcon />
                </ListItemIcon>
                <ListItemText primary = 'Riff Metrics' />
            </ListItem>
        </div>
    );
};
