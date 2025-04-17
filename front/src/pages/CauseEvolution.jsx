import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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

  return (
    <div>
      <h2>Évolution des causes de mortalité (1990 - 2019)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="diff" fill="#ff7300" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
