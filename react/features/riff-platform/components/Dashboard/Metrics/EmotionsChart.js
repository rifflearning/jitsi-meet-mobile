/* eslint-disable jsdoc/require-description-complete-sentence */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
/* eslint-disable valid-jsdoc */
/* ******************************************************************************
 * EmotionsChart.js                                                             *
 * *************************************************************************/ /**
 *
 * @fileoverview React component to visualize meeting speaking timelines and
 * interaction events
 *
 * Created on       October 28, 2019
 * @author          Brec Hanson
 *
 * @copyright (c) 2018-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { GraphDatasetTypes } from '@rifflearning/riff-metrics';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { ScaleLoader } from 'react-spinners';

import api from '../../../api';
import ChartCard from '../ChartCard';
import { Colors } from '../colorsHelpers';
import { RequestStatus, getSelectedMeeting, getMetricDataset } from '../utils';

import EmotionsGraph from './EmotionsGraph';

/* ******************************************************************************
 * EmotionsChart                                                           */ /**
 *
 * React component to visualize the participant emotions
 *
 ********************************************************************************/
class EmotionsChart extends React.Component {
    static propTypes = {

        /** The main dataset that is used for this graph */
        graphDataset: PropTypes.any.isRequired,

        /** meeting whose relevant data will be in graphDataset */
        meeting: PropTypes.shape({
            _id: PropTypes.string.isRequired,
            participants: PropTypes.instanceOf(Map).isRequired
        }),

        /** ID of the logged in user so their data can be distinguished */
        participantId: PropTypes.string.isRequired
    };

     /** The GraphDatasetType of the graphDataset property */
     static datasetType = GraphDatasetTypes.UTTERANCE_TIMELINE;

     /* **************************************************************************
     * constructor                                                         */ /**
     */
     constructor(props) {
         super(props);

         this.state = {
             updatedLegendAt: null,
             emotionsData: [],
             emotionsDataLoading: false
         };
     }

     /* **************************************************************************
     * componentDidMount                                                   */ /**
     *
     */
     componentDidMount() {
         setTimeout(() => this.getEmotionsData(), 0); // no meetingId if call synchronously
     }

     /* **************************************************************************
     * componentDidUpdate                                                  */ /**
     *
     */
     componentDidUpdate(prevProps) {
         if (prevProps.meeting?._id !== this.props.meeting?._id) {
             this.getEmotionsData();
         }
     }

     /* **************************************************************************
     * render                                                              */ /**
     *
     * Required method of a React component.
                                                                               *
     * @see {@link https://reactjs.org/docs/react-component.html#render|React.Component.render}
     */
     render() {
         let emptyGraphText;

         const timelineData = this.props.graphDataset;

         // If there are no utts in the meeting, there are no events, and thus, no graph data
         if (this.state.emotionsData.length === 0) {
             emptyGraphText = <div className = 'empty-graph-text'>It doesn't look like emotions detection module was enabled.</div>;
         }

         let loadingDisplay = null;

         if (this.state.emotionsDataLoading) {
             loadingDisplay = (
                 <div className = 'loading-overlay'>
                     {<ScaleLoader color = { Colors.lightRoyal } />}
                 </div>
             );
         }

         return (
             <ChartCard
                 chartCardId = 'EmotionsChartId'
                 chartInfo = 'This chart shows how your emotions and the average emotional state of all the participants are changed during the meeting.'
                 title = 'Emotions Chart (experimental feature)'>
                 {loadingDisplay}
                 {emptyGraphText}
                 <EmotionsGraph
                     data = { this.state.emotionsData }
                     endTime = { timelineData?.endTime }
                     participantId = { this.props.participantId }
                     startTime = { timelineData?.startTime } />
             </ChartCard>
         );
     }

     getEmotionsData() {
         if (!this.props.meeting?._id) {
             return console.error('no meeting id for getEmotionsData');
         }
         this.setState({ emotionsDataLoading: true });
         api.fetchEmotions(this.props.meeting._id)
            .then(data => this.setState({ emotionsDataLoading: false,
                emotionsData: data }))
            .catch(() => this.setState({ emotionsDataLoading: false,
                emotionsData: [] }));
     }

     /* ******************************************************************************
    * getDatasetStatus                                                        */ /**
    *
    * Check if all of the datasets passed in this.props.graphDatasets are loaded.
    *
    * @param {object} prevProps - Optional, containing the previous props.
    * @param {object} currentProps - Containing the current or next props.
    *
    * @returns {object} containing three booleans:
    *                   1. oneWasLoading  - Was one of the datasets previously loading?
    *                   2. allAreLoaded   - Are all the datasets loaded?
    *                   3. loadingNewData - Is new data being fetched?
    */
     getDatasetStatus({ prevProps, currentProps }) {

         const getStatuses = props => [
             props.datasetStatus,
             ...Object.values(props.eventDatasetStatuses)
         ];

         // This logic doesn't take the NOT_STARTED status into account because it was
         // written when that wasn't a possible status. I think it will still work OK -mjl 2020-09-23
         const currentStatuses = currentProps ? getStatuses(currentProps) : [];
         const prevStatuses = prevProps ? getStatuses(prevProps) : [];
         const oneWasLoading = prevStatuses.some(s => s === RequestStatus.STARTED);
         const allWereLoaded = prevStatuses.every(s => s === RequestStatus.SUCCESS);
         const allAreLoaded = !currentStatuses.some(s => s === RequestStatus.STARTED
                                                        || s === RequestStatus.NOT_STARTED);

         return { oneWasLoading,
             allAreLoaded,
             allWereLoaded };
     }

}

const mapStateToProps = state => {
    return {
        participantId: state['features/riff-platform'].signIn.user.uid,
        meeting: getSelectedMeeting(state),
        graphDataset: getMetricDataset(state, EmotionsChart.datasetType)
    };
};

export default connect(mapStateToProps)(EmotionsChart);
