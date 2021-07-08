/* ******************************************************************************
 * index.js                                                                     *
 * *************************************************************************/ /**
 *
 * @fileoverview Hook up the Navbar to redux state and actions
 *
 * Created on       August 1, 2018
 * @author          Dan Calacci
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2018-present Riff Learning, Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { connect } from 'react-redux';
import { replace } from 'connected-react-router';

import { toggleNavbarMenu } from 'redux/actions/menu';
import {logout} from '../../../../riff-platform/actions/signIn'
import { userLogout } from 'redux/actions/user';
import { getIsRiffConnected } from 'redux/selectors/riff';
import { getInviteId, getWasInvited } from 'redux/selectors/chat';
import {
    getIsUserLoggedIn,
    getUserAuthType,
    getUserName,
} from 'redux/selectors/user';
import { getIsPersonalMode } from 'redux/selectors/config';
import { Routes } from 'redux/constants';

import { NavBarView } from './NavBarView';

const navBarMapProps = {
    mapStateToProps: (state, {isUserLoggedIn = true}) => ({
        isUserLoggedIn: isUserLoggedIn, // getIsUserLoggedIn(state),
        isRiffConnected: true, // getIsRiffConnected(state),
        isPersonalMode: false, // getIsPersonalMode(),
        authType: 'firebase', // getUserAuthType(state),
        wasInvited: false, // getWasInvited(state),
        inviteId: '', // getInviteId(state),
        userName: !isUserLoggedIn || getUserName(state),
        menuOpen: state.menu.menuOpen,
        inRoom: state.chat.inRoom,
        roomName: state.dashboard.selectedMeeting?.room || '',
    }),

    mapDispatchToProps: dispatch => ({
        handleLogOut: (/* event */) => {
            APP.store.dispatch(logout());
            // dispatch(userLogout());
            // dispatch(replace(Routes.Home));
        },

        toggleMenu: (/* event */) => {
            dispatch(toggleNavbarMenu());
        },
    }),
};

const ConnectedNavBar = connect(navBarMapProps.mapStateToProps,
                                navBarMapProps.mapDispatchToProps)(NavBarView);

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    ConnectedNavBar as NavBar,
};
