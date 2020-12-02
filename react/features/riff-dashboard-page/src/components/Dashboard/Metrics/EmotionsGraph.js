import React, { memo, PureComponent } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

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

export default ({ data = [] }) => {
  const seriesEmotions = data.reduce((acc, el) => {
    console.warn('COMPUTED!')
    if(acc[el.participant_id]){
      acc[el.participant_id].push(el);
    } else {
      acc[el.participant_id] = [el];
    }
    return acc;
   }, {});

    return (
      <ResponsiveContainer height={300}>
        <LineChart
          margin={{left: 20, right: 20, top: 50, bottom: 5}}
        >
          <XAxis dataKey="timestamp" tickFormatter={el=>el.split(/[T|.]/)[1]}/>
          <YAxis domain={[-1,1]} dataKey="classification" tickCount={3} tickFormatter={el => {
            if (el > 0) return 'Emotional';
            if (el < 0) return 'Neutral';
            if (el === 0) return '0';
          }} />
          <Tooltip labelFormatter={el=>el.split(/[T|.]/)[1]} />
          <Legend />
          {Object.keys(seriesEmotions).map((el, i) => (
            <Line dot={false} dataKey="classification" data={seriesEmotions[el]} name={seriesEmotions[el][0].userName || el} key={el} stroke={getColor(i)} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
}
