'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom icons for different statuses
const operationalIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const maintenanceIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
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
  contact: {
    manager: string;
    phone: string;
    email: string;
  };
}

interface FactoryMapProps {
  factories: Factory[]|any[];
}

export default function FactoryMap({ factories }: FactoryMapProps) {
  // Calculate center point of all factories
  const centerLat = factories.length > 0 
    ? factories.reduce((sum, factory) => sum + factory.location.latitude, 0) / factories.length
    : 30.0;
  const centerLng = factories.length > 0 
    ? factories.reduce((sum, factory) => sum + factory.location.longitude, 0) / factories.length
    : 32.0;

  return (
    <div className="h-screen w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={6}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {factories.map((factory) => (
          <Marker
            key={factory.id}
            position={[factory.location.latitude, factory.location.longitude]}
            icon={factory.status === 'maintenance' ? maintenanceIcon : operationalIcon}
          >
            <Popup className="factory-popup">
              <div className="p-2 min-w-64">
                <h3 className="font-bold text-lg mb-2 text-gray-800">
                  {factory.name}
                </h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-600 w-16">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      factory.status === 'operational' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {factory.status.charAt(0).toUpperCase() + factory.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex">
                    <span className="font-medium text-gray-600 w-16">Location:</span>
                    <span className="text-gray-800">
                      {factory.location.city}, {factory.location.country}
                    </span>
                  </div>
                  
                  <div className="flex">
                    <span className="font-medium text-gray-600 w-16">Address:</span>
                    <span className="text-gray-800 text-xs">
                      {factory.location.address}
                    </span>
                  </div>
                  
                  <div className="flex">
                    <span className="font-medium text-gray-600 w-16">Est:</span>
                    <span className="text-gray-800">{factory.established}</span>
                  </div>
                  
                  <div className="flex">
                    <span className="font-medium text-gray-600 w-16">Staff:</span>
                    <span className="text-gray-800">{factory.employees} employees</span>
                  </div>
                  
                  <div className="flex">
                    <span className="font-medium text-gray-600 w-16">Capacity:</span>
                    <span className="text-gray-800">{factory.production_capacity_monthly} units/month</span>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-600">Specialization:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {factory.specialization.map((spec:any, index:any) => (
                        <span 
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <div className="text-xs text-gray-600">
                      <div><strong>Manager:</strong> {factory.contact.manager}</div>
                      <div><strong>Phone:</strong> {factory.contact.phone}</div>
                      <div><strong>Email:</strong> {factory.contact.email}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
