import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './CauseEvolution.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <div className="tooltip-label">{label}</div>
        <div className="tooltip-value">{payload[0].value}%</div>
        <div className="tooltip-cause">Cause: {payload[0].payload.cause}</div>
      </div>
    );
  }
  return null;
};

export default function CauseEvolution() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/deaths/cause-evolution')
      .then(res => {
        const formatted = [
          {
            cause: res.data.causeWithMostIncrease.cause,
            diff: res.data.causeWithMostIncrease.diff,
            label: "Plus forte augmentation"
          },
          {
            cause: res.data.causeWithMostDecrease.cause,
            diff: res.data.causeWithMostDecrease.diff,
            label: "Plus forte diminution"
          }
        ];
        setData(formatted);
      })
      .catch(err => console.error(err));
  }, []);

  const colors = ['#ff7300', '#4a90e2']; 

  return (
    <div className="cause-evolution-container">
      <h2 className="cause-evolution-title">Évolution des causes de mortalité (1990 - 2019)</h2>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
            <XAxis dataKey="label" tick={{ fill: '#2c3e50' }} />
            <YAxis unit="%" tick={{ fill: '#64748b' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="diff" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}