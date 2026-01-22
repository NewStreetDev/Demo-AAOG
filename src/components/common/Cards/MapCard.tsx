import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { FarmSummary } from '../../../types/dashboard.types';

interface MapCardProps {
  farms: FarmSummary[];
}

// Custom marker icon
const farmIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MapCard({ farms }: MapCardProps) {
  // Center on Costa Rica
  const center: [number, number] = [9.9281, -84.0907];

  return (
    <div className="card overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="p-6 pb-4">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          Resumen de Fincas
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {farms.length} fincas registradas
        </p>
      </div>

      {/* Map */}
      <div className="h-64 relative">
        <MapContainer
          center={center}
          zoom={8}
          scrollWheelZoom={false}
          className="h-full w-full z-0"
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {farms.map((farm) => (
            <Marker
              key={farm.id}
              position={[farm.location.lat, farm.location.lng]}
              icon={farmIcon}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-bold text-gray-900">{farm.name}</p>
                  <p className="text-gray-600">
                    Producción: {farm.production.toLocaleString()} {farm.productionUnit}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
