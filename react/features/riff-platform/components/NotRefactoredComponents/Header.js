/* eslint-disable */

import React from 'react';
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import useStyles from './useStyles';
import { useHistory } from 'react-router';
import { Avatar, Button } from '@material-ui/core';
import * as ROUTES from '../../constants/routes';

export default function Header({handleDrawerOpen, open, isDrawerEnabled}) {
  const classes = useStyles();
  const history = useHistory();

  return (
    <div>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, isDrawerEnabled && open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          {isDrawerEnabled &&
            <IconButton
              edge="start"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              className={clsx(classes.menuButton, isDrawerEnabled && open && classes.menuButtonHidden)}
            >
              <MenuIcon />
            </IconButton>
          }
          <Typography component="p" variant="h6" color="inherit" noWrap className={classes.title}>
            RiffAnalytics
          </Typography>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isDrawerEnabled && <Button onClick={() => history.push(ROUTES.SCHEDULE)}>Schedule a meeting</Button>}
            <Button onClick={() => history.push(ROUTES.JOIN)}>Join a meeting</Button>
            <Button onClick={() => history.push(ROUTES.WAITING)}>Host a meeting</Button>
            {!isDrawerEnabled && <>
                <Button onClick={() => history.push(ROUTES.SIGNIN)}>Sign In</Button>
                <Button onClick={() => history.push(ROUTES.SIGNUP)} variant="outlined">Sign Up</Button>
              </>
            }
            {isDrawerEnabled &&
              <IconButton color="inherit" onClick={() => history.push(ROUTES.PROFILE)}>
                  <Avatar alt="Me" src="" />
              </IconButton>
            }
            </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}