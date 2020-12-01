import React, { PureComponent } from 'react';
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

export default ({data = []})=> {
  let participants = {};
  let translatedData = {};

  data.forEach(el => {
    const t = Math.round(new Date(el.timestamp).getTime() / 1000);
    if (translatedData[t]) {
      translatedData[t] = { ...translatedData[t], [el.participant_id]: el.classification };
    } else {
      translatedData[t] = { [el.participant_id]: el.classification };
    }
    participants[el.participant_id] = true;
  })

  translatedData = Object.keys(translatedData).map(el => {
    return {timestamp: el, ...translatedData[el]};
  })

  participants = Object.keys(participants);

    return (
      <ResponsiveContainer height={300}>
        <LineChart 
          data={translatedData}
          margin={{left: 20, right: 20, top: 50, bottom: 5}}
        >
          <YAxis tickCount={3}/>
          <Tooltip />
          <Legend />

          {participants.map((el, i) =>
            <Line dot={false} key={el} type="monotone" dataKey={el} stroke={colors[i] || getRandomColor()} />)}
        </LineChart>
      </ResponsiveContainer>
    );
}
