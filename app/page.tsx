'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Lazy load map
const FactoryMap = dynamic(() => import('./components/FactoryMap'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
      Loading map...
    </div>
  ),
});

interface Factory {
  id: number;
  name: string;
  status: string;
  production_level_2024?: Array<{ month: string; value: number }>;
  location: {
    latitude: number;
    longitude: number;
    city: string;
    country: string;
  };
}

interface ApiResponse {
  factory_data: Factory[];
}

export default function Dashboard() {
  const [factories, setFactories] = useState<Factory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchFactories = async () => {
      try {
       const factoryData = await import('./data/factories.json');
setFactories(factoryData.factory_data);
      } catch (err) {
        console.error('Error loading factory data:', err);
        setError('Failed to load factory data');
      } finally {
        setLoading(false);
      }
    };
    fetchFactories();
  }, []);

  // --- Build chart data (grouped by month, each factory separate) ---
  const months = factories[0]?.production_level_2024?.map(d => d.month) || [];
  const chartData = months.map((month, i) => {
    const entry: any = { month };
    factories.forEach(f => {
      entry[f.name] = f.production_level_2024?.[i]?.value || 0;
    });
    return entry;
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-black text-white px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">AM Inc</div>
          <button
            className="sm:hidden flex flex-col space-y-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-0.5 bg-white"></div>
            <div className="w-6 h-0.5 bg-white"></div>
            <div className="w-6 h-0.5 bg-white"></div>
          </button>
          <div className="hidden sm:block">
            <span className="text-gray-300">Menu</span>
          </div>
        </div>
        {menuOpen && (
          <div className="sm:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-2">
              <a href="#" className="text-gray-300 hover:text-white">Home</a>
              <a href="#" className="text-gray-300 hover:text-white">Factories</a>
              <a href="#" className="text-gray-300 hover:text-white">About</a>
              <a href="#" className="text-gray-300 hover:text-white">Contact</a>
            </div>
          </div>
        )}
      </nav>

      {/* Title */}
      <div className="bg-yellow-400 py-8 px-4 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black">
          Amana Industries
        </h1>
      </div>

      {/* Subsection */}
      <div className="bg-yellow-100 py-4 px-4 text-center border-b-2 border-yellow-200">
        <h2 className="text-xl sm:text-2xl font-semibold text-black">
          Factory Statuses
        </h2>
      </div>

      {/* Map */}
      <div className="min-h-[500px] p-4">
        {loading && (
          <div className="h-96 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Loading factory data...</span>
          </div>
        )}
        {error && (
          <div className="h-96 bg-red-50 rounded-lg flex items-center justify-center">
            <span className="text-red-600">Error: {error}</span>
          </div>
        )}
        {!loading && !error && factories.length > 0 && (
          <FactoryMap factories={factories} />
        )}
      </div>

      {/* Monthly Performance - One Chart */}
      {!loading && !error && factories.length > 0 && (
        <div className="bg-yellow-100 py-6 px-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-black mb-4 text-center">
            Monthly Performance
          </h2>
          <div className="bg-white rounded-xl shadow p-4">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                {factories.map((f, index) => (
                  <Bar
                    key={f.id}
                    dataKey={f.name}
                    fill={['#8884d8', '#82ca9d', '#ffc658', '#ff8042'][index % 4]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4 px-4 mt-auto">
        <p className="text-sm sm:text-base">
          Copyright 2025 Amana Industries
        </p>
      </footer>
    </div>
  );
}
