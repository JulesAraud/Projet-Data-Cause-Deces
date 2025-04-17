import { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function DiabetesEvolution() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/deaths/diabetes-evolution')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Évolution des décès dus au diabète</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <XAxis dataKey="Year" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="totalDiabetesDeaths" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
