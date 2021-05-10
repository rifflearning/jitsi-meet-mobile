import React, { useEffect, useState } from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter,
  Surface,
  Symbols
} from 'recharts';
import api from '../../../../../riff-platform/api';
import moment from 'moment'
import * as d3 from "d3-array";

// need to get appropriate colors from riff-dashboard?
const colors = ['#f4b642', '#93759d', '#8884d8', '#e380a1'];

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getColor(i) {
  return colors[i] || getRandomColor();
}

const n = 20;
const k = 2;

function getBollingerBands(n, k, data) {
  const bands = []; //{ ma: 0, area:[0, 0] }
  for (var i = n - 1, len = data.length; i < len; i++) {
    const slice = data.slice(i + 1 - n, i);
    const mean = d3.mean(slice, function (d) {
      return d.classification;
    });

    const stdDev = Math.sqrt(
      d3.mean(
        slice.map(function (d) {
          return Math.pow(d.classification - mean, 2);
        })
      )
    );
    bands.push({
      timestamp: new Date(data[i].timestamp).getTime(),
      ma: mean,
      area: [
        mean - k * stdDev,
        mean + k * stdDev
      ]
    });
  }
  return bands;
}

const getSpikes = (data, userData) => {
  //for future use
  let highSpike = [];
  let lowSpike = [];
  data.map(el => {
    const date = moment(el.timestamp).format('HH:mm:ss');
    const sameTime = userData && userData.find(el => moment(el.timestamp).format('HH:mm:ss') == date);

    if (sameTime) {
      if (sameTime.classification >= el.area[1]) {
        highSpike.push({
          timestamp: sameTime.timestamp,
          classification: sameTime.classification
        })
      } else if (sameTime.classification <= el.area[0]) {
        lowSpike.push({
          timestamp: sameTime.timestamp,
          classification: sameTime.classification
        })
      }
    }
  }
  )
  return highSpike.concat(lowSpike)
}

function getMinMax(arr) {
  let min = arr[0];
  let max = arr[0];
  let i = arr.length;

  while (i--) {
    min = arr[i] < min ? arr[i] : min;
    max = arr[i] > max ? arr[i] : max;
  }
  return { min, max };
}

export default ({ data = [], participantId }) => {
  const [bandsData, setBandsData] = useState([]);
  const [currentUserData, setCurrentUserData] = useState([])
  const [spikes, setSpikes] = useState([]);
  const [domainY, setDomainY] = useState({})

  const mapUserNamesToData = async () => {
    // emotions data reduced by users: { [userId]: [arrayOfData] }
    const dataFormatted = data.reduce((acc, el) => {
      // for correct timeline we need time in unix format
      const elFormatted = {
        ...el,
        timestamp: new Date(el.timestamp).getTime()
      };
      if (acc[el.participant_id]) {
        acc[el.participant_id].push(elFormatted);
      } else {
        acc[el.participant_id] = [elFormatted];
      }
      return acc;
    }, {});

    const bollingerBandsData = getBollingerBands(n, k, data);
    const userData = dataFormatted[participantId];
    const emotionSpikes = getSpikes(bollingerBandsData, userData);
    const classificationArr = bollingerBandsData.length && userData ? bollingerBandsData
      .map(el => el.area[0])
      .concat(bollingerBandsData.map(el => el.area[1]))
      .concat(userData.map(el => el.classification)) : [];

    setBandsData(bollingerBandsData)
    setCurrentUserData(userData);
    setSpikes(emotionSpikes)
    setDomainY(getMinMax(classificationArr))
  };

  useEffect(() => {
    mapUserNamesToData();
  }, [data, participantId])

  const renderCusomizedLegend = ({ payload }) => {
    const renderedPayload = payload.find(el => el.value === 'Your Emotion');
    const { value } = renderedPayload;
    return (
      <>
        <Surface width={10} height={10}>
          <Symbols cx={5} cy={5} size={50} fill="url(#emotionLegend)" />
        </Surface>
        <span >{value}</span>
      </>
    )
  }

  return (
    <ResponsiveContainer height={300}>
      <ComposedChart
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <defs>
          <linearGradient id="emotionLegend" gradientTransform="rotate(90)">
            <stop offset="5%" stopColor="#ffdd21" />
            <stop offset="75%" stopColor="#ff1a1a" />
            <stop offset="100%" stopColor="#540d6e" />
          </linearGradient>
        </defs>
        <defs>
          <linearGradient id="emotion" x1="0%" y1="100%" x2="0%" y2="0%" gradientUnits="userSpaceOnUse">
            <stop offset="25%" stopColor="#540d6e" />
            <stop offset="35%" stopColor="#c14bbb" />
            <stop offset="50%" stopColor="#ff1a1a" />
            <stop offset="65%" stopColor="#ff8317" />
            <stop offset="75%" stopColor="#ffdd21" />
          </linearGradient>
        </defs>
        <YAxis
          padding={{ bottom: 10, top: 10 }}
          ticks={[-1, 0, 1]}
          domain={[domainY.min - 0.1, domainY.max + 0.1]}
          tickFormatter={el => el > 0 ? 'Positive' : el < 0 ? 'Negative' : 'Neutral'} />
        <XAxis
          allowDuplicatedCategory={false}
          dataKey='timestamp'
          domain={['minData', 'maxData']}
          name='Time'
          tickFormatter={(unixTime) => moment(unixTime).format('h:mm A')}
          type='number'
        />
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        {/* <Tooltip /> */}
        <Legend content={renderCusomizedLegend} />
        <Line
          data={bandsData}
          type="monotone"
          dataKey="ma"
          stroke="#93759E"
          isAnimationActive={false}
          dot={false}
        />
        <Area
          data={bandsData}
          dataKey="area"
          fill="#93759E"
          stroke="#93759E"
          stroke="#93759E"
          fill="#93759E"
          fillOpacity="0.4"
          legendType="line"
          isAnimationActive={false}
          dot={false}
        />

        <Area
          dot={false}
          dataKey='classification'
          name="Your Emotion"
          data={currentUserData}
          dot={false}
          fill="url(#emotion)"
          stroke="url(#emotion)"
          strokeWidth="1px"
          fillOpacity="0.6"
        />
        {/* for scatter size */}
        {/* <ZAxis range={[100, 100]} /> */}
        <Scatter
          data={spikes}
          dataKey='classification'
          fill="#93759E"
          stroke="rgb(0, 157, 249)"
          strokeWidth={1}
          fillOpacity={0.25}
          fill="rgb(0, 157, 249)" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
