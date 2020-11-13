/* eslint-disable */

import React from 'react';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Join from './Join';

import {
  Switch,
  Route, Redirect
} from 'react-router-dom';

import DashboardPage from '../../../riff-dashboard-page/src/dashboard-page';

import Profile from './Profile';
import SignIn from './SignIn';
import SignUp from './SignUp';
import { getJwt } from '../../functions';
import useStyles from './useStyles';
import { connect } from '../../../base/redux';
import Meetings from './Meetings';
import Footer from './Footer';
import Scheduler from './Scheduler';
import Waiting from './Waiting';
import * as ROUTES from '../../constants/routes';

const Main = ({token, uid}) => {
  const classes = useStyles();

  const loggedInRoutes = (
    <Switch>
      <Route
          exact = { true }
          path = {ROUTES.PROFILE} >
          <Profile />
      </Route>
      <Route
          component={DashboardPage}
          path = {ROUTES.DASHBOARD} />
      <Route path = {ROUTES.MEETINGS} >
        <Meetings />
      </Route>
      <Route path = {ROUTES.SCHEDULE} >
        <Scheduler />
      </Route>
      <Redirect to = {ROUTES.PROFILE} />
    </Switch>
  );

  const authRoutes = (
    <Switch>
      <Route
          path = {ROUTES.SIGNIN} >
          <SignIn />
      </Route>
      <Route
          path = {ROUTES.SIGNUP} >
          <SignUp />
      </Route>
      <Redirect to = {ROUTES.SIGNIN} />
    </Switch>
  );

  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      <Container maxWidth="lg" className={classes.container}>
        <div className={classes.mainContainer}>
          <Switch>
            <Route
              exact = { true }
              path = {ROUTES.JOIN} >
              <Join />
            </Route>
            <Route path={`${ROUTES.WAITING}/:meetingId`} >
              <Waiting />
            </Route>

            {token ? loggedInRoutes : authRoutes}
          </Switch>
        </div>
        <Box pt={4}>
          <Footer/>
        </Box>
      </Container>
    </main>
  );
}

const mapStateToProps = state => {
  return {
    token: state['features/riff-platform'].signIn.token,
    uid: state['features/riff-metrics'].userData.uid
  };
};

export default connect(mapStateToProps)(Main)