import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, CartesianGrid
} from 'recharts';
import './TopCauses.css'; 

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', 
  '#a4de6c', '#d0ed57', '#ffc0cb', '#d88884', '#84d8b0'
];

const TopCausesChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/deaths/top-causes')
      .then(response => setData(response.data))
      .catch(error => console.error('Erreur lors du chargement des données :', error));
  }, []);

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-value">
            <span className="tooltip-data">{payload[0].value.toLocaleString()}</span> décès
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip pie-tooltip">
          <p className="tooltip-label">{payload[0].payload.cause}</p>
          <p className="tooltip-value">
            <span className="tooltip-data">{payload[0].value.toLocaleString()}</span> décès
            <br />
            <span className="tooltip-percent">
              {((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}%
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="top-causes-container">
      <div className="chart-header">
        <h2 className="chart-title">Top 10 des causes de mortalité</h2>
        <p className="chart-subtitle">Analyse comparative des principales causes de décès</p>
      </div>

      <div className="chart-section">
        <h3 className="section-title">Répartition par nombre de décès</h3>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              layout="vertical"
            >
              <CartesianGrid horizontal={true} vertical={false} strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                tickFormatter={(value) => value.toLocaleString()}
              />
              <YAxis 
                dataKey="cause" 
                type="category" 
                width={120}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Legend />
              <Bar 
                dataKey="totalDeaths" 
                name="Nombre de décès"
                radius={[0, 4, 4, 0]}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-section">
        <h3 className="section-title">Répartition en pourcentage</h3>
        <div className="pie-chart-wrapper">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                dataKey="totalDeaths"
                nameKey="cause"
                cx="50%"
                cy="50%"
                outerRadius={120}
                innerRadius={60}
                paddingAngle={2}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    stroke="#fff"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend 
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{ paddingLeft: '20px' }}
                formatter={(value, entry, index) => (
                  <span style={{ color: '#333' }}>
                    {data[index].cause}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TopCausesChart;