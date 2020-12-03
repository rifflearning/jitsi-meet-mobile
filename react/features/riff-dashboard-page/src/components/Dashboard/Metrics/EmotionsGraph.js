import React, { memo, PureComponent } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

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

export default ({ data = [] }) => {

  // emotions data reduced by users
  const dataFormatted = data.reduce((acc, el) => {
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
          <XAxis dataKey="timestamp" tickFormatter={el => new Date(el).toLocaleTimeString()} />
          <YAxis padding={{bottom: 10, top: 10}} domain={[-1,1]} dataKey="classification" tickCount={3} tickFormatter={el => {
            if (el > 0) return 'Emotional';
            if (el < 0) return 'Neutral';
            if (el === 0) return 'Moderate';
          }} />
          <Tooltip formatter={(v, n, entry) => entry.payload.compound} labelFormatter={el => new Date(el).toLocaleTimeString()} />
          <Legend />
          {Object.keys(dataFormatted).map((el, i) => (
            <Line dot={false} dataKey="classification" data={dataFormatted[el]} name={dataFormatted[el][0].userName || el} key={el} stroke={getColor(i)} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
}
