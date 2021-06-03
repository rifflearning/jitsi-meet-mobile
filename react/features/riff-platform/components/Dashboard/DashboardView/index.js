/* ******************************************************************************
 * index.ts                                                                     *
 * *************************************************************************/ /**
 *
 * @fileoverview Hook up the Dashboard to redux state and actions
 *
 * Created on       August 27, 2018
 * @author          Dan Calacci
 * @author          Michael Jay Lippert
 * @author          Brec Hanson
 *
 * @copyright (c) 2018-present Riff Analytics,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { metricsRedux } from '@rifflearning/riff-metrics';
import { connect } from 'react-redux';

import { Dashboard } from './Dashboard';

const {
    loadMetricDatasets,
    loadUserMeetings,
    selectMeeting,
    metricGraphLoaded
} = metricsRedux.actions;
const {
    getAreAllChartsLoaded,
    getSelectedMeeting,
    getUserMeetings,
    getUserMeetingsError,
    getUserMeetingsStatus
} = metricsRedux.selectors;

const dashboardMapProps = {
    mapStateToProps: state => {
        return {
            // fix it
            isRiffConnected: true,
            meetings: getUserMeetings(state),
            selectedMeeting: getSelectedMeeting(state),
            fetchMeetingsStatus: getUserMeetingsStatus(state),
            fetchMeetingsMessage: getUserMeetingsError(state)?.message,
            areAllChartsRendered: getAreAllChartsLoaded(state, Dashboard.graphTypes)
        };
    },

    mapDispatchToProps: dispatch => {
        return {
            loadRecentMeetings: () => {
                dispatch(loadUserMeetings());
            },

            onSelectionChanged: meeting => {
                dispatch(selectMeeting(meeting));
            },

            loadMetricDatasets: () => {
                dispatch(loadMetricDatasets(Dashboard.datasetTypes));
            },
            dashboardGraphLoaded: graphType => dispatch(metricGraphLoaded(graphType))
        };
    }
};


const ConnectedDashboard = connect(dashboardMapProps.mapStateToProps,
                                    dashboardMapProps.mapDispatchToProps)(Dashboard);

/* **************************************************************************** *
  * Module exports                                                               *
  * **************************************************************************** */
export {
    ConnectedDashboard as Dashboard
};
