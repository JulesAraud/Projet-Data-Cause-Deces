import { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import './DiabetesEvolution.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="diabetes-tooltip">
        <div className="tooltip-year">Année: {label}</div>
        <div className="tooltip-deaths">Décès: {payload[0].value.toLocaleString()}</div>
      </div>
    );
  }
  return null;
};

export default function DiabetesEvolution() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/deaths/diabetes-evolution')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="diabetes-evolution-container">
      <h2 className="diabetes-evolution-title">Évolution des décès dus au diabète</h2>
      <div className="diabetes-chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 30, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="Year" 
              tick={{ fill: '#64748b' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fill: '#64748b' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="totalDiabetesDeaths"
              stroke="#8884d8"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#8884d8' }}
              activeDot={{ r: 6, strokeWidth: 3, fill: '#fff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-footer">
        <p style={{ textAlign: 'center', color: '#64748b', marginTop: '1rem', fontSize: '0.9rem' }}>
          Données montrant l'évolution des décès liés au diabète au fil des années
        </p>
      </div>
    </div>
  );
}