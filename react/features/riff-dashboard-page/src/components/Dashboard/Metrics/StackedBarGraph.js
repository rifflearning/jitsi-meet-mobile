/* ******************************************************************************
 * StackedBarGraph.js                                                           *
 * *************************************************************************/ /**
 *
 * @fileoverview React component to visualize binary relations calculated with
 * the computePairwiseRelation() function in libs/utils/index.js
 *
 * Created on       October 28, 2019
 * @author          Brec Hanson
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import React from 'react';
import PropTypes from 'prop-types';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as d3 from 'd3-array';

import { ScaleLoader } from 'react-spinners';
import { logger } from 'libs/utils';
import { Colors } from './colorsHelpers';

import { EStatus, GraphConfigs, GraphTypes } from 'libs/utils/constants';

import { ChartCard } from './ChartCard';

/* ******************************************************************************
 * StackedBarGraph                                                         */ /**
 *
 * React component to visualize binary relations calculated with the
 * computePairwiseRelation() function in libs/utils/index.js
 *
 ********************************************************************************/
class StackedBarGraph extends React.PureComponent {
    static propTypes = {
        /** meeting whose relevant data will be in dataset */
        meeting: PropTypes.shape({
            _id: PropTypes.string.isRequired,
            participants: PropTypes.instanceOf(Set).isRequired,
        }),

        /** ID of the logged in user so their data can be distinguished */
        participantId: PropTypes.string.isRequired,

        /** The dataset that is used for this graph
         *  - the keys of this object are defined in constants/Graphs (GraphDatasets)
         *
         */
        graphDataset: PropTypes.shape({
            data: PropTypes.object,
            status: PropTypes.oneOf(Object.values(EStatus)).isRequired,
        }).isRequired,

        /** The graph types we're embedding in this stacked bar graph
         *  - the keys of this object are defined in constants/Graphs (GraphTypes)
         */
        embeddedGraphTypes: PropTypes.arrayOf(PropTypes.oneOf(Object.values(GraphTypes))).isRequired,

        /** A unique graph type for this graph
         *  - used for fetching configs for this graph
         *  - the potential graph types are defined in constants/Graphs (GraphTypes)
         */
        graphType: PropTypes.oneOf(Object.values(GraphTypes)).isRequired,

        /** sets a graphical rendering status for a graph type to loaded */
        dashboardGraphLoaded: PropTypes.func.isRequired,
    };

    /* **************************************************************************
     * constructor                                                         */ /**
     */
    constructor(props) {
        super(props);

        this.state = {
            updatedLegendAt: null,
        };

        this.chart = null;
        this.series = [];
        this.avrAxisRange = 0;

        this.toggleSeries = this.toggleSeries.bind(this);
    }

    /* **************************************************************************
     * componentDidMount                                                   */ /**
     */
    componentDidMount() {
        this.initGraph();
    }

    /* **************************************************************************
     * componentWillUnmount                                                */ /**
     */
    componentWillUnmount() {
        this.disposeChart();
        this.chart = null;
        logger.debug(`StackedBarGraph-${this.props.graphType}-.willUnmount: disposed of chart`);
    }

    /* **************************************************************************
     * componentDidUpdate                                                  */ /**
     */
    componentDidUpdate(prevProps, prevState) {
        const { isLoaded } = this.getDatasetStatus(prevProps);

        // If the dataset's current status is 'loaded', then draw graph
        // Also, don't re-draw graph if we only want to update the legend
        if (isLoaded && this.state.updatedLegendAt === prevState.updatedLegendAt) {
            logger.debug('StackedBarGraph.didUpdate: drawing graph', this.props.graphType, this.props);
            this.drawGraph();
        }       
    }

    /* **************************************************************************
     * render                                                              */ /**
     *
     * Required method of a React component.
     * @see {@link https://reactjs.org/docs/react-component.html#render|React.Component.render}
     */
    render() {
        // get the config for this graph type
        const config = GraphConfigs[this.props.graphType];
        const meetingId = this.props.meeting ? this.props.meeting._id : 'no-selected-meeting';
        const chartCardId = `cc-${meetingId}-${config.title.replace(' ', '-')}`;

        const { isLoaded } = this.getDatasetStatus();

        // TODO: Determine empty dataset better.
        // getGraphData is called in drawGraph as well, but we don't want to set
        // state there because it will cause a re-render.
        
        let emptyGraphText = null;
        const graphData = this.getGraphData();

        if (graphData.length === 0) {
            emptyGraphText = <div className='empty-graph-text'>{config.empty}</div>;
        }

        let loadingDisplay = null;
        if (!isLoaded) {
            loadingDisplay = (
                <div className='loading-overlay'>
                    {<ScaleLoader color={Colors.lightRoyal}/>}
                </div>
            );
        }

        return (
            <ChartCard
                title={config.title}
                chartInfo={config.info}
                longDescription={config.info.length > 250}
                chartCardId={chartCardId}
            >
                {loadingDisplay}
                {emptyGraphText}
                <div
                    className={`amcharts-graph-container ${this.props.graphType}-grouped-bar-graph-div`}
                />
            </ChartCard>
        );
    }

    /* ******************************************************************************
     * toggleSeries                                                            */ /**
     *
     * Toggle an event series in the bar graph chart on or off.
     *
     * @param {object} series the event series object that we want to toggle
     */
    toggleSeries(series) {
        // If the series has no data, don't do anything on toggle
        if (series.noData) {
            return;
        }

        if (series.isHidden || series.isHiding) {
            series.show(); // show this data in chart
        }
        else {
            series.hide(); // hide this data in chart
        }

        // Update legend
        this.setState({ updatedLegendAt: new Date() });
    }

    /* ******************************************************************************
     * getGraphData                                                            */ /**
     *
     * For each embedded graph type passed in props, parse through the data and
     * organise it under participant names.
     *
     * @returns {Array} containing the prepared data for the graph
     */
    getGraphData() {
        if (!this.props.graphDataset.data) {
            return [];
        }

        logger.debug('StackedBarGraph: graphDataset', this.props.graphDataset);

        let chartData = {};
        const events = this.props.graphDataset.data.events;

        this.props.embeddedGraphTypes.forEach((series) => {
            const seriesEvents = GraphConfigs[series].eventsFilter(events, this.props.participantId);

            seriesEvents.forEach((event) => {

                const participantName = event.otherParticipantName.split(' ')[0];
                // If an entry hasn't been created for the participant that this event took place with,
                // create one
                if (!chartData[event.otherUtt.participant]) {
                    chartData[event.otherUtt.participant] = {
                        name: participantName,
                        participant: event.otherParticipantName,
                        totalRelations: 0,
                    };
                }

                // If this relation type doesn't have an entry yet for this participant,
                // add and initialize to 0
                if (!chartData[event.otherUtt.participant][GraphConfigs[series].legendLabel]) {
                    chartData[event.otherUtt.participant][GraphConfigs[series].legendLabel] = 0;
                }
                chartData[event.otherUtt.participant][GraphConfigs[series].legendLabel]++;
                chartData[event.otherUtt.participant].totalRelations++;
            });

            logger.debug(`StackedBarGraph: ${series}`, { seriesEvents });
        });

        chartData = Object.values(chartData)
        .flat()
        .filter(participant => participant.totalRelations > 0);

        logger.debug('StackedBarGraph: chartData', { chartData });

        return chartData;
    }

    /* ******************************************************************************
     * drawGraph                                                               */ /**
     *
     * Initialise the graph, add the axes, and populate with data.
     * - if an empty dataset is passed, return
     *
     */
    drawGraph() {
        // Force each series in the chart to refresh its data
        this.series.forEach(series => series.invalidateData());

        logger.debug('StackedBarGraph: drawGraph', this.props.graphType);
        const chart = this.chart;

        const chartData = this.getGraphData();

        // Is this component trying to visualise an empty dataset?
        const emptyDataset = chartData.length === 0;

        if (emptyDataset) {
            chart.hide();
            this.props.dashboardGraphLoaded(this.props.graphType);
            return;
        }
        chart.show();

        // See of any series in this graph (ie. no 'THEIR_INFLUENCE') is empty.
        // => For each series, map through all participants and check if every participant
        //    doesn't have this relation type
        this.series.forEach((series) => {
            const emptySeries = chartData.every((participant) => {
                return !participant[GraphConfigs[series.graphType].legendLabel];
            });

            if (emptySeries) {
                series.noData = true;
                series.hide();
            }
            else {
                series.show();
            }
        });

        // show average
        const yAxisAverage = this.getYAxisAverage(chartData);
        this.avrAxisRange.value = yAxisAverage;

        chart.data = chartData;
    }

    /* ******************************************************************************
     * createSeries                                                            */ /**
     *
     * Create the graph series for an embedded graph type ex. MY_INFLUENCE
     *
     * For more info on amcharts ColumnSeries, see:
     * https://www.amcharts.com/docs/v4/reference/columnseries/
     *
     * @param {object} chart - the chart object for this StackedBarGraph
     * @param {object} graphType - the graph type for this series
     *
     */
    createSeries(chart, graphType) {
        const config = GraphConfigs[graphType];
        const series = chart.series.push(new am4charts.ColumnSeries());

        series.graphType = graphType;
        series.dataFields.valueY = config.legendLabel;
        series.dataFields.categoryX = 'name';
        series.name = config.legendLabel;
        series.columns.template.fill = config.color;
        series.columns.template.stroke = config.color;
        series.columns.template.tooltipText = config.getTooltip();
        series.stacked = true;
        series.columns.template.width = am4core.percent(95);
        series.columns.template.maxWidth = 150;

        const rgm = new am4core.LinearGradientModifier();
        rgm.brightnesses.push(0, -0.07, -0.18);
        series.columns.template.fillModifier = rgm;

        this.series.push(series);
    }

    /* ******************************************************************************
     * createYAxis                                                             */ /**
     *
     * Create the y-axis for the graph
     *
     * @param {object} chart - the chart object for this StackedBarGraph
     *
     * @returns {object} containing the y-axis for the graph
     */
    createYAxis(chart) {
        const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 0;
        valueAxis.maxPrecision = 0; // Makes the axis steps integers
        valueAxis.title.disabled = true;

        valueAxis.renderer.grid.template.disabled = true;
        valueAxis.renderer.labels.template.disabled = true;

        const range = valueAxis.axisRanges.create();
        range.grid.stroke = am4core.color(Colors.mineShaft);
        range.grid.strokeDasharray = '4, 4';
        range.grid.strokeWidth = 2;
        range.label.fill = am4core.color(Colors.tundora);
        range.label.text = `[text-transform: uppercase]average`;
        range.label.verticalCenter = "middle";

        this.avrAxisRange = range;

        return valueAxis;
    }

    /* ******************************************************************************
     * createXAxis                                                             */ /**
     *
     * Create the x-axis for the graph
     *
     * For info on amcharts CategoryAxis, view:
     * https://www.amcharts.com/docs/v4/reference/categoryaxis/
     * https://www.amcharts.com/docs/v4/concepts/axes/category-axis/
     *
     * @param {object} chart the chart object for this StackedBarGraph
     *
     * @returns {object} containing the x-axis for the graph
     */
    createXAxis(chart) {
        // TODO - the axis doesn't properly resize the cell width when
        // switching between meetings, which results in improperly truncated
        // names, etc. need to address this but not sure how
        // - jr 05.08.20
        const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = 'name';
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.grid.template.disabled = true;
        categoryAxis.renderer.minGridDistance = 20;
        categoryAxis.renderer.cellStartLocation = 0.1;
        categoryAxis.renderer.cellEndLocation = 0.9;
        categoryAxis.renderer.line.strokeOpacity = 1;
        categoryAxis.renderer.line.strokeWidth = 2;
        categoryAxis.renderer.line.stroke = am4core.color(Colors.scorpion);

        const label = categoryAxis.renderer.labels.template;
        label.fontSize = 10;
        label.truncate = true;
        label.fill = am4core.color(Colors.mineShaft);
        label.tooltipText = '{participant}';

        label.adapter.add("textOutput", function(text) {
            return `[font-weight: 600 text-transform: uppercase]${text}`
          });

        categoryAxis.events.on('sizechanged', (ev) => {
            const axis = ev.target;
            const cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
            axis.renderer.labels.template.maxWidth = cellWidth;
        });

        return categoryAxis;
    }

    /* ******************************************************************************
     * initGraph                                                               */ /**
     *
     * Initialise the chart and bind to the appropriate html element.
     *
     * For more info on amcharts XYChart, see:
     * https://www.amcharts.com/docs/v4/reference/XYChart/
     * https://www.amcharts.com/docs/v4/chart-types/xy-chart/
     *
     * @returns {object} containing a reference to the chart
     */
    initGraph() {
        logger.debug('StackedBarGraph.initGraph', this.props.graphType);

        // Hide am-charts logo (paid version)
        am4core.options.commercialLicense = true;

        // Create chart and place it inside the html element with id {graphType}-grouped-bar-graph-div
        const chart = am4core.create(`${this.props.graphType}-grouped-bar-graph-div`, am4charts.XYChart);

        chart.background.fill = Colors.white;

        // Fired when graph's data gets updated
        chart.events.on('datavalidated', () => {
            this.props.dashboardGraphLoaded(this.props.graphType);
            // Update legend
            this.setState({ updatedLegendAt: new Date() });
        });

        // Create categoryAxis axis
        // Disable lint because this variable might be useful in future
        // eslint-disable-next-line no-unused-vars
        const categoryAxis = this.createXAxis(chart);

        // Create valueAxis axis
        // Disable lint because this variable might be useful in future
        // eslint-disable-next-line no-unused-vars
        const valueAxis = this.createYAxis(chart);

        // Create a graph series for each embedded graph type
        this.props.embeddedGraphTypes.forEach((graphType) => {
            this.createSeries(chart, graphType);
        });

        this.createLegend(chart);

        this.chart = chart;
        return chart;
    }


    /* ******************************************************************************
     * createLegend                                                            */ /**
     *
     * Create the graph legend
     *
     * For more info on amcharts createLegend, see:
     * https://www.amcharts.com/docs/v4/concepts/legend/
     *
     * @param {object} chart - the chart object for this StackedBarGraph
     *
     */
     createLegend(chart) {
        chart.legend = new am4charts.Legend();

        // disabling toggling of items in legend
        chart.legend.itemContainers.template.clickable = false;
        chart.legend.itemContainers.template.focusable = false;
        chart.legend.itemContainers.template.cursorOverStyle = am4core.MouseCursorStyle.default;

        chart.legend.parent = chart.tooltipContainer;
        chart.legend.contentAlign = "left";
        chart.legend.position = "absolute";
        chart.legend.valign = "bottom";
        chart.legend.labels.template.fill = am4core.color(Colors.tundora);
        chart.legend.labels.template.text = "[font-size: 10px]{name}";
        chart.legend.width = 130;

        // legend positioning
        chart.legend.dx = -10;
        chart.legend.dy = -35;

        const markerTemplate = chart.legend.markers.template;
        markerTemplate.width = 10;
        markerTemplate.height = 10;
    }

    /* ******************************************************************************
     * disposeChart                                                            */ /**
     *
     * This is called when it is appropriate to dispose of the chart, for efficiency.
     *
     */
    disposeChart() {
        if (this.chart) {
            this.chart.dispose();
            this.chart = null;
            logger.debug(`StackedBarGraph: disposed of chart - ${this.props.graphType}`);
        }
    }

    /* ******************************************************************************
     * getDatasetStatus                                                        */ /**
     *
     * Check if the dataset passed in this.props.graphDataset is loaded.
     *
     * @param {object} prevProps - optional, containing the previous props
     *
     * @returns {object} containing three booleans:
     *      1. wasLoading     - Was the dataset previously loading?
     *      2. isLoaded       - Is the dataset loaded?
     *      3. loadingNewData - Is new data being fetched?
     */
    getDatasetStatus(prevProps) {
        const wasLoading = prevProps && prevProps.graphDataset.status === EStatus.LOADING;
        const isLoaded = this.props.graphDataset.status === EStatus.LOADED;
        const wasLoaded = prevProps && prevProps.graphDataset.status !== EStatus.LOADED;

        const loadingNewData = wasLoaded && !isLoaded;

        return { wasLoading, isLoaded, loadingNewData };
    }
    
    /* ******************************************************************************
     * getYAxisAverage                                                        */ /**
     *
     * Create the average y-axis for the graph
     *
     * @param {object} chartData - the chart data for this StackedBarGraph
     *
     * @returns {number} average y-axis value for the graph
     */
    getYAxisAverage(chartData) {
        const sum = d3.sum(chartData, d => d.totalRelations || 0);
        const count = chartData.length + 1
        const avr = sum / count;

        return avr;
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    StackedBarGraph,
};
