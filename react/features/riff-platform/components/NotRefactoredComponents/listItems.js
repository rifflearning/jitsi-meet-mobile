/* eslint-disable */

import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import PersonIcon from '@material-ui/icons/Person';
import BarChartIcon from '@material-ui/icons/BarChart';
import PeopleIcon from '@material-ui/icons/People';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { useHistory, useLocation } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

export const MainListItems = () => {
  const history = useHistory();
  const { pathname } = useLocation();
  const isSelected = (path) => pathname === path;

  return (
    <div>
      <ListItem button onClick={() => history.push(ROUTES.PROFILE)} selected={isSelected(ROUTES.PROFILE)}>
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </ListItem>
      <ListItem button onClick={() => history.push(ROUTES.MEETINGS)} selected={isSelected(ROUTES.MEETINGS)}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Meetings" />
      </ListItem>
      <ListItem button onClick={() => history.push(ROUTES.DASHBOARD)} selected={isSelected(ROUTES.DASHBOARD)}>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Riff Metrics" />
      </ListItem>
    </div>
  )
};

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Saved reports</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Additional settings" />
    </ListItem>
  </div>
);