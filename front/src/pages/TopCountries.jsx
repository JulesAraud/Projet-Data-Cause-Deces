import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './TopContries.css';

export default function TopDeathsCountry() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/deaths/top-deaths-country')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="top-deaths-container">
      <h2 className="top-deaths-title">
        Top 10 pays avec le plus grand nombre de décès
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <XAxis dataKey="country" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="totalDeaths" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
