'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Factory {
  production_level_2024?: { month: string; value: number }[];
  inventory_level_2024?: { month: string; value: number }[];
}

export default function Dashboard() {
  const [factories, setFactories] = useState<Factory[]>([]);

  useEffect(() => {
    import('../data/factories.json').then((data) => {
      setFactories(data.factory_data);
    });
  }, []);

  if (!factories.length) return <div className="p-10 text-center text-gray-500">Loading chart...</div>;

  const months = factories[0]?.production_level_2024?.map(d => d.month) || [];

  const data = months.map((month, i) => ({
    month,
    production: factories.reduce((sum, f) => sum + (f.production_level_2024?.[i]?.value || 0), 0),
    inventory: factories.reduce((sum, f) => sum + (f.inventory_level_2024?.[i]?.value || 0), 0),
  }));

  return (
    <div className="bg-white rounded-xl shadow p-4 mt-6">
      <h3 className="text-lg font-semibold mb-4">Production vs Inventory (2024)</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="production" stroke="#8884d8" name="Production" />
          <Line type="monotone" dataKey="inventory" stroke="#82ca9d" name="Inventory" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
