import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import './NonCommunicable.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="non-communicable-tooltip">
        <div className="tooltip-country">{label}</div>
        <div className="tooltip-deaths">
          {payload[0].value.toLocaleString()} décès
        </div>
      </div>
    );
  }
  return null;
};

export default function NonCommunicable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/deaths/non-communicable')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

 
  const dataWithAnimationDelay = data.map((item, index) => ({
    ...item,
    style: { '--index': index }
  }));

  return (
    <div className="non-communicable-container">
      <h2 className="non-communicable-title">
        Top 10 pays les plus touchés par les maladies non transmissibles
      </h2>
      <div className="non-communicable-chart-container">
        <ResponsiveContainer width="100%" height={450}>
          <BarChart
            data={dataWithAnimationDelay}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 100, bottom: 30 }}
          >
            <CartesianGrid horizontal={true} vertical={false} strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              tick={{ fill: '#64748b' }}
              axisLine={{ stroke: '#e8f5ee' }}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <YAxis 
              dataKey="country" 
              type="category" 
              width={100}
              tick={{ fill: '#2c3e50', fontSize: 14 }}
              axisLine={{ stroke: '#e8f5ee' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="totalNonCommunicableDeaths" 
              name="Décès"
              radius={[0, 4, 4, 0]}
            >
              {dataWithAnimationDelay.map((entry, index) => (
                <rect 
                  key={`bar-${index}`} 
                  style={entry.style}
                  fill={`rgba(77, 170, 123, ${0.6 + (index * 0.03)})`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-footer">
        Données représentant les décès dus aux maladies non transmissibles (2019)
      </div>
    </div>
  );
}