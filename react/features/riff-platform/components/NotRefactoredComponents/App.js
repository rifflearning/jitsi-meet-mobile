/* eslint-disable */

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Header from './Header'
import Main from './Main'
import Drawer from './Drawer'
import { useRouteMatch } from 'react-router';
import useStyles from './useStyles';

export default () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const isDrawerEnabled = !useRouteMatch('/login') && !useRouteMatch('/signup');

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Header handleDrawerOpen={handleDrawerOpen} open={open} isDrawerEnabled={isDrawerEnabled} />
      {isDrawerEnabled && <Drawer handleDrawerClose={handleDrawerClose} open={open} />}
      <Main />
    </div>
  );
}