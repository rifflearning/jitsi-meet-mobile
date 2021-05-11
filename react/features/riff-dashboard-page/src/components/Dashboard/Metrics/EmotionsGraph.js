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
  Symbols,
  ZAxis
} from 'recharts';
import moment from 'moment'
import * as d3 from 'd3-array';

function getBollingerBands(n, k, data) {
  if (n >= data.length) {
    return [];
  }
  const bands = []; //{ ma: 0, area:[0, 0] }
  for (let i = n - 1, len = data.length; i < len; i++) {
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
  userData.forEach(el => {
    const date = moment(el.timestamp).format('HH:mm:ss');
    const sameTimeArr = data.filter(el => moment(el.timestamp).format('HH:mm:ss') === date);

    if (sameTimeArr.length) {
      sameTimeArr.forEach(d => {
        if (el.classification >= d.area[1]) {
          highSpike.push({
            timestamp: el.timestamp,
            classification: el.classification
          })
        } else if (el.classification <= d.area[0]) {
          lowSpike.push({
            timestamp: el.timestamp,
            classification: el.classification
          })
        }
      })
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

const n = 20;
const k = 2;

export default ({ data = [], participantId }) => {
  const [bandsData, setBandsData] = useState([]);
  const [currentUserData, setCurrentUserData] = useState([])
  const [spikes, setSpikes] = useState([]);
  const [domainY, setDomainY] = useState({});

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
    const userData = dataFormatted[participantId] || [];
    const emotionSpikes = getSpikes(bollingerBandsData, userData);
    const classificationArr = bollingerBandsData.length && userData.length
      ? bollingerBandsData
        .map(el => el.area[0])
        .concat(bollingerBandsData.map(el => el.area[1]))
        .concat(userData.map(el => el.classification))
      : [];

    setBandsData(bollingerBandsData)
    setCurrentUserData(userData);
    setSpikes(emotionSpikes)
    setDomainY(getMinMax(classificationArr))
  };

  useEffect(() => {
    mapUserNamesToData();
  }, [data, participantId]);

  const renderCusomizedLegend = ({ payload }) => {
    const renderedPayload = payload.filter(el => el.dataKey !== 'ma');

    return (
      <div className='amcharts-legend-container emotion-container'>
        {renderedPayload.map((el, i) => (
          <span key={i} className='emotion-item'>
            <Surface width={20} height={20}>
              <Symbols cx={10} cy={10} size={150} fill={el.value === 'Your Emotion Area' ? 'url(#emotionLegend)' : el.color} />
            </Surface>
            <span className='emotion-label' >{el.value}</span>
          </span>
        ))}
      </div>
    )
  }

  return (
    <ResponsiveContainer height={300}>
      <ComposedChart
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <defs>
          <linearGradient id='emotionLegend' gradientTransform='rotate(90)'>
            <stop offset='5%' stopColor='#ffdd21' />
            <stop offset='75%' stopColor='#ff1a1a' />
            <stop offset='100%' stopColor='#540d6e' />
          </linearGradient>
        </defs>
        <defs>
          <linearGradient id='emotion' x1='0%' y1='100%' x2='0%' y2='0%' gradientUnits='userSpaceOnUse'>
            <stop offset='5%' stopColor='#540d6e' />
            <stop offset='35%' stopColor='#983493' />
            <stop offset='50%' stopColor='#ff1a1a' />
            <stop offset='65%' stopColor='#ff8317' />
            <stop offset='95%' stopColor='#ffdd21' />
          </linearGradient>
        </defs>
        <YAxis
          padding={{ bottom: 10, top: 10 }}
          ticks={[-1, 0, 1]}
          domain={[domainY.min, domainY.max]}
          tickFormatter={el => el > 0 ? 'Positive' : el < 0 ? 'Negative' : 'Neutral'} />
        <XAxis
          allowDuplicatedCategory={false}
          dataKey='timestamp'
          domain={['minData', 'maxData']}
          name='Time'
          tickFormatter={(unixTime) => moment(unixTime).format('h:mm A')}
          type='number'
        />
        {/* <CartesianGrid strokeDasharray='3 3' />  */}
        {/* <Tooltip /> */}
        <Legend content={renderCusomizedLegend} />
        <Line
          data={bandsData}
          dataKey='ma'
          stroke='#93759E'
          isAnimationActive={false}
          dot={false}
          name='Average Emotion Line'
        />
        <Area
          data={bandsData}
          dataKey='area'
          fill='#93759E'
          stroke='#93759E'
          stroke='#93759E'
          fill='#93759E'
          fillOpacity='0.4'
          legendType='line'
          isAnimationActive={false}
          dot={false}
          name='Participants Emotion Area'
        />

        <Area
          dataKey='classification'
          name='Your Emotion Area'
          data={currentUserData}
          dot={false}
          fill='url(#emotion)'
          stroke='url(#emotion)'
          strokeWidth='1px'
          fillOpacity='0.6'
        />
        {/* for scatter size */}
        <ZAxis range={[40, 40]} />
        <Scatter
          name='Your Emotion Spike'
          data={spikes}
          dataKey='classification'
          //stroke='rgb(0, 157, 249)'
          strokeWidth={0}
          //fillOpacity={0.25}
          fill='#58d0ee' />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
