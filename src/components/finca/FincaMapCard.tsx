import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import type { Finca } from '../../types/finca.types';

interface FincaMapCardProps {
  finca: Finca;
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

export default function FincaMapCard({ finca }: FincaMapCardProps) {
  const center: [number, number] = [finca.location.lat, finca.location.lng];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-green-100 rounded-lg">
            <MapPin className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Ubicacion de la Finca</h3>
            <p className="text-xs text-gray-500">
              {finca.location.address || `${finca.location.lat.toFixed(4)}, ${finca.location.lng.toFixed(4)}`}
            </p>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="h-48 relative">
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full z-0"
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={center} icon={farmIcon}>
            <Popup>
              <div className="text-sm">
                <p className="font-bold text-gray-900">{finca.name}</p>
                <p className="text-gray-600">{finca.totalArea} hectareas</p>
                {finca.location.municipality && (
                  <p className="text-gray-500 text-xs">
                    {finca.location.municipality}, {finca.location.department}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
