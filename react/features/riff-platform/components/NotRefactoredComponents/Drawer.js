/* eslint-disable */

import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { MainListItems, secondaryListItems } from './listItems';
import useStyles from './useStyles';

export default function Component({handleDrawerClose, open}) {
  const classes = useStyles();

  return (
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <img src="/images/watermark.png" height="54" />
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List><MainListItems /></List>
        <Divider />
        <List>{secondaryListItems}</List>
      </Drawer>
  );
}