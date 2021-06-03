/* eslint-disable react/jsx-handler-names */
/* eslint-disable valid-jsdoc */
/* ******************************************************************************
 * dashboard.tsx                                                                *
 * *************************************************************************/ /**
*
* @fileoverview React component container for meeting metrics (the dashboard)
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
import * as am4core from '@amcharts/amcharts4/core';
// eslint-disable-next-line camelcase
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import {
    Affirmations,

    // Influence,
    Interruptions,
    MeetingInfo,

    //  SpeakingTime,
    MeetingList,
    Timeline,
    metricsRedux
} from '@rifflearning/riff-metrics';
import React from 'react';
import { ScaleLoader } from 'react-spinners';

import Influence from '../Metrics/Influence';
import SpeakingTime from '../Metrics/SpeakingTime';
import { Colors } from '../colorsHelpers';
const { RequestStatus } = metricsRedux.constants;

/* ******************************************************************************
  * Dashboard                                                               */ /**
*
* React component to present the Riff Metrics for meetings the user attended
*
********************************************************************************/
class Dashboard extends React.Component {

    /** The top level node of this main dashboard content (the metrics) */
    mainContent = React.createRef();

    /** The graph type identifiers of the charts displayed on this dashboard */
    static graphTypes = [
        Affirmations.graphType,
        Influence.graphType,
        Interruptions.graphType,
        SpeakingTime.graphType,
        Timeline.graphType
    ];

    /** The GraphDatasetTypes used by the charts displayed on this dashboard */
    static datasetTypes = new Set([
        Affirmations.datasetType,
        Influence.datasetType,
        Interruptions.datasetType,
        SpeakingTime.datasetType,
        Timeline.datasetType

        // ...Timeline.overlayEventTypes.map(et => EventConfigs[et].datasetType)
    ]);

    /* **************************************************************************
     * constructor                                                         */ /**
    */
    constructor(props) {
        super(props);

        am4core.useTheme(am4themes_animated);
        this.onSelectionChanged = this.onSelectionChanged.bind(this);
    }

    /* **************************************************************************
     * componentDidMount                                                   */ /**
    *
    * Lifecycle method of a React component.
    * This is invoked immediately after a component is mounted (inserted into the
    * tree). Initialization that requires DOM nodes should go here.
    *
    * Load the user's list of meetings. As this may be a time consuming operation
    * we wait until this page is mounted and we know that the list is actually
    * needed.
    *
    * @see {@link https://reactjs.org/docs/react-component.html#componentdidmount|React.Component.componentDidMount}
    */
    componentDidMount() {
        if (this.props.isRiffConnected) {
            // logger.debug(`${logContext}.componentDidMount: loading recent meetings now`);
            this.props.loadRecentMeetings();
        } else {
            // logger.warn(`${logContext}.componentDidMount: `
            //  + 'riffdata server is not connected, meetings were not loaded');
        }

        // make sure window scrolling is enabled
        // setWindowScrolling(true);
    }

    /* **************************************************************************
     * componentDidUpdate                                                  */ /**
    *
    * ComponentDidUpdate() is invoked immediately after updating occurs. This
    * method is not called for the initial render.
    *
    * Use this as an opportunity to operate on the DOM when the component has
    * been updated.
    */
    componentDidUpdate(prevProps) {
        const isNewSelectedMeeting = prevProps.selectedMeeting !== this.props.selectedMeeting;

        // when the selected meeting changes update the metric datasets w/ data from that meeting
        if (isNewSelectedMeeting && this.props.selectedMeeting) {
            this.props.loadMetricDatasets();
        }

        // When the user selects a different meeting from the sidebar, scroll to the top of the main content.
        // Only do this if the user has scrolled past the top of the main content.
        // If selectedMeeting is null, this is the first load, don't scroll.
        // Add a 25 pixel buffer to the top, this is will make the first metric flush
        // with the sticky meetings list sidebar.
        const scrollTarget = this.mainContent.current ? this.mainContent.current.offsetTop - 25 : 0;

        if (prevProps.selectedMeeting?._id !== this.props.selectedMeeting?._id
            && document.documentElement.scrollTop > scrollTarget
        ) {
            window.scrollTo(0, scrollTarget);
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
        //  logger.debug(`${logContext}.render: entered`, { props: this.props });

        if (this.props.fetchMeetingsStatus === RequestStatus.STARTED) {
            return (
                <div className = 'columns is-centered has-text-centered'>
                    {this.props.children}
                    <div className = 'column'>
                        <ScaleLoader color = { Colors.lightRoyal } />
                    </div>
                </div>
            );
        }

        if (this.props.fetchMeetingsStatus === RequestStatus.FAILURE) {
            return (
                <div
                    className = 'columns is-centered has-text-centered is-vcentered'
                    style = {{ height: '92vh' }}>
                    {this.props.children}
                    <div
                        className = 'column is-vcentered'
                        style = {{ alignItems: 'center' }}>
                        <p className = 'is-size-4 is-primary'>{this.props.fetchMeetingsMessage}</p>
                        <ScaleLoader color = { Colors.lightRoyal } />
                    </div>
                </div>
            );
        }

        // Style for the metric rows used to constrain the height of the small charts
        const metricRowStyle = { height: '400px' };
        const timelineRowStyle = { height: '450px' };

        return (
            <div
                className = 'dashboard-view-component'>
                <div className = 'inner'>
                    {this.props.children}
                    <MeetingList
                        meetings = { this.props.meetings }
                        selectedMeeting = { this.props.selectedMeeting }
                        selectedMeetingIsBusy = { !this.props.areAllChartsRendered }
                        onSelectionChanged = { this.onSelectionChanged } />
                    <div className = 'dashboard-content-container'>
                        <div className = 'dashboard-header-container'>
                            <h1 className = 'header'>{'Your Conversations'}</h1>
                            <form action = 'mailto:feedback@riffanalytics.ai'>
                                <button className = 'feedback-btn'>
                                    {'Give us feedback'}
                                </button>
                            </form>
                        </div>
                        <MeetingInfo />
                        {/* <div ref={this.mainContent} /> */}
                        <div className = 'metrics-container'>
                            <div
                                className = 'metric-row'
                                style = { metricRowStyle }>
                                <div className = 'metric-container'>
                                    <SpeakingTime />
                                </div>
                                <div className = 'metric-container'>
                                    <Influence />
                                </div>
                            </div>
                            <div
                                className = 'metric-row'
                                style = { metricRowStyle }>
                                <div className = 'metric-container'>
                                    <Interruptions />
                                </div>
                                <div className = 'metric-container'>
                                    <Affirmations />
                                </div>
                            </div>
                            <div
                                className = 'metric-row'
                                style = { timelineRowStyle }>
                                <Timeline />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /* **************************************************************************
     * onSelectionChanged                                                  */ /**
    *
    * Handler for the MeetingList onSelectionChanged callback.
    * Adds special handling when the selection is "changed" to the current
    * selection to reload all metric datasets.
    */
    onSelectionChanged(meeting) {
        const currentSelectedMeeting = this.props.selectedMeeting;

        this.props.onSelectionChanged(meeting);

        if (meeting === currentSelectedMeeting) {
            this.props.loadMetricDatasets();
        }
    }
}

/* **************************************************************************** *
  * Module exports                                                               *
  * **************************************************************************** */
export {
    Dashboard
};
