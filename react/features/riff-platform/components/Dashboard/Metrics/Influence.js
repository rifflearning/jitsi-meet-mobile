/* eslint-disable valid-jsdoc */
/* ******************************************************************************
 * influence.js                                                                *
 * *************************************************************************/ /**
 *
 * @fileoverview React component to visualize the influence of and to
 * a participant in a meeting.
 *
 * Created on       August 13, 2020
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2020 Riff Analytics,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { metricsRedux, GraphDatasetTypes, GraphTypes } from '@rifflearning/riff-metrics';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { EventTypes } from '../config';

import { StackedBarGraph } from './StackedBarGraph';

const { metricGraphLoaded } = metricsRedux.actions;
const { getSelectedMeeting, getMetricDataset, getDatasetStatus } = metricsRedux.selectors;

/* ******************************************************************************
 * Influence                                                               */ /**
 *
 * React component to visualize the influence of/to a participant in a meeting.
 *
 ********************************************************************************/
class Influence extends React.PureComponent {
    static propTypes = {
        /** meeting whose relevant data will be in graphDataset */
        dashboardGraphLoaded: PropTypes.func.isRequired,

        /** ID of the logged in user so their data can be distinguished */
        datasetStatus: PropTypes.string.isRequired,

        /** The dataset needed for this pie chart
         *  - the potential datasets are defined in constants/Graphs (GraphDatasets)
         */
        graphDataset: PropTypes.object.isRequired,

        /** The request status of the graphDataset */
        meeting: PropTypes.shape({
            _id: PropTypes.string.isRequired,
            participants: PropTypes.instanceOf(Set).isRequired
        }),

        /** sets a graphical rendering status for a graph type to loaded */
        participantId: PropTypes.string.isRequired
    };

    /** The GraphType of this component */
    static graphType = GraphTypes.GROUPED_INFLUENCES;

    /** The GraphDatasetType of the graphDataset property */
    static datasetType = GraphDatasetTypes.INFLUENCES;

    /* **************************************************************************
     * render                                                              */ /**
     *
     * Required method of a React component.
                                                                               *
     * @see {@link https://reactjs.org/docs/react-component.html#render|React.Component.render}
     */
    render() {
        return (
            <StackedBarGraph
                graphType = { Influence.graphType }
                stackedEventTypes = { [
                    EventTypes.MY_INFLUENCE,
                    EventTypes.THEIR_INFLUENCE
                ] }
                { ...this.props } />
        );
    }
}

const mapStateToProps = state => {
    return {
        participantId: state['features/riff-platform'].signIn.user.uid,
        meeting: getSelectedMeeting(state),
        graphDataset: getMetricDataset(state, Influence.datasetType),
        datasetStatus: getDatasetStatus(state, Influence.datasetType)
    };
};

const mapDispatchToProps = dispatch => {
    return {
        dashboardGraphLoaded: graphType => dispatch(metricGraphLoaded(graphType))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Influence);
