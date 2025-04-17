import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c', '#d0ed57', '#ffc0cb', '#d88884', '#84d8b0'];

const TopCausesChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/deaths/top-causes')
      .then(response => setData(response.data))
      .catch(error => console.error('Erreur lors du chargement des données :', error));
  }, []);

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h2>🔝 Top 10 des causes de mortalité</h2>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <XAxis dataKey="cause" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalDeaths" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <h3>🍩 Vue Camembert</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="totalDeaths"
            nameKey="cause"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopCausesChart;
