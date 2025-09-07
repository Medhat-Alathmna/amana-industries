'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Dashboard from './components/dashboard';

// Dynamically import the Map component to avoid SSR issues with Leaflet
const FactoryMap = dynamic(() => import('./components/FactoryMap'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">Loading map...</div>
});

interface Factory {
  id: number;
  name: string;
  location: {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    address: string;
  };
  status: string;
  established: string;
  employees: number;
  specialization: string[];
  production_capacity_monthly: number;
  production_level_2024?: Array<{
    month: string;
    value: number;
  }>;
  inventory_level_2024?: Array<{
    month: string;
    value: number;
  }>;
  contact: {
    manager: string;
    phone: string;
    email: string;
  };
}

interface ApiResponse {
  message: string;
  company_info: {
    name: string;
    founded: string;
    headquarters: string;
    industry: string;
    description: string;
  };
  factory_data: Factory[];
}

export default function Home() {
  const [factories, setFactories] = useState<Factory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const loadFactoryData = async () => {
      try {
        // Import the local JSON data
        const factoryData = await import('./data/factories.json');
        setFactories(factoryData.factory_data);
      } catch (err) {
        console.error('Failed to load factory data:', err);
        setError('Failed to load factory data');
      } finally {
        setLoading(false);
      }
    };

    loadFactoryData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
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
        
        {/* Mobile menu */}
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

      {/* Company Title Section */}
      <div className="bg-yellow-400 py-8 px-4 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black">
          Amana Industries
        </h1>
      </div>

      {/* Factory Statuses Section */}
      <div className="bg-yellow-100 py-4 px-4 text-center border-b-2 border-yellow-200">
        <h2 className="text-xl sm:text-2xl font-semibold text-black">
          Factory Statuses
        </h2>
      </div>

      {/* Map Section */}
      <div className="min-h-screen p-4">
        {loading && (
          <div className="h-screen bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Loading factory data...</span>
          </div>
        )}
        
        {error && (
          <div className="h-screen bg-red-50 rounded-lg flex items-center justify-center">
            <span className="text-red-600">Error: {error}</span>
          </div>
        )}
        
   {!loading && factories.length > 0 && (
  <>
    <FactoryMap factories={factories} />
    <Dashboard />
  </>
)}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4 px-4">
        <p className="text-sm sm:text-base">
          Copyright 2025 Amana Industries
        </p>
      </footer>
    </div>
  );
}
