import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import api from '../../../../../riff-platform/api';

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
  const [graphData, setGraphData] = useState([]);  
  
  const mapUserNamesToData = async () => {
    // emotions data reduced by users: { [userId]: [arrayOfData] }
    const dataFormatted = data.reduce((acc, el) => {
      if(acc[el.participant_id]){
        acc[el.participant_id].push(el);
      } else {
        acc[el.participant_id] = [el];
      }
      return acc;
    }, {});

    const arrUids = Object.keys(dataFormatted);

    if (!arrUids.length) return setGraphData([]);

    try {
      const res = await api.fetchUserNames(arrUids);
      const arrData = res.map(({ _id, name }) => ({ id: _id, name, data: dataFormatted[_id] }));
      setGraphData(arrData);
    } catch (error) {
      console.error('Error in fetchUserNames', error);
      setGraphData([]);
    }
  };

  useEffect(() => {
    mapUserNamesToData();
  }, [data])

    return (
      <ResponsiveContainer height={300}>
        <LineChart
          margin={{left: 20, right: 20, top: 50, bottom: 5}}
        >
          <XAxis
            dataKey="timestamp"
            tickFormatter={el => new Date(el).toLocaleTimeString()} />
          <YAxis
            padding={{ bottom: 10, top: 10 }}
            domain={[ -1, 1 ]}
            dataKey="classification"
            tickCount={3}
            tickFormatter={el => el > 0 ? 'Positive' : el < 0 ? 'Negative' : 'Neutral'} />
          <Tooltip
            formatter={(v, name, entry) => [entry.payload.compound, name]}
            labelFormatter={el => new Date(el).toLocaleTimeString()} />
          <Legend />
          {graphData.map((user, i) => (
            <Line dot={false}
              dataKey="classification"
              data={user.data}
              name={user.name || user.id}
              key={user.id}
              stroke={getColor(i)} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
}
