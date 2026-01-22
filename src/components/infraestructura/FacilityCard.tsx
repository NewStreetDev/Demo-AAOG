import { MapPin, Calendar, ChevronRight, Maximize2 } from 'lucide-react';
import type { Facility } from '../../types/infraestructura.types';

interface FacilityCardProps {
  facility: Facility;
  onClick?: () => void;
}

function getStatusBadgeColor(status: Facility['status']): string {
  const colors = {
    operational: 'bg-green-100 text-green-700',
    maintenance: 'bg-amber-100 text-amber-700',
    out_of_service: 'bg-red-100 text-red-700',
    under_construction: 'bg-blue-100 text-blue-700',
  };
  return colors[status] || colors.operational;
}

function getStatusLabel(status: Facility['status']): string {
  const labels = {
    operational: 'Operativo',
    maintenance: 'Mantenimiento',
    out_of_service: 'Fuera de Servicio',
    under_construction: 'En Construcción',
  };
  return labels[status];
}

function getTypeLabel(type: Facility['type']): string {
  const labels: Record<Facility['type'], string> = {
    building: 'Edificio',
    storage: 'Almacén',
    processing: 'Procesamiento',
    housing: 'Vivienda',
    greenhouse: 'Invernadero',
    barn: 'Establo',
    water_reservoir: 'Reservorio de Agua',
    tank: 'Tanque',
    irrigation_system: 'Sistema de Riego',
    well: 'Pozo',
    water_intake: 'Captación de Agua',
    other: 'Otro',
  };
  return labels[type];
}

export default function FacilityCard({ facility, onClick }: FacilityCardProps) {
  const statusColor = getStatusBadgeColor(facility.status);

  return (
    <div
      className="card p-5 hover:shadow-lg transition-all duration-300 cursor-pointer animate-fade-in"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-lg">
            {facility.name}
          </h3>
          <p className="text-sm text-gray-600 mt-0.5">{getTypeLabel(facility.type)}</p>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColor}`}>
          {getStatusLabel(facility.status)}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>{facility.location}</span>
        </div>
        {facility.area && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Maximize2 className="w-4 h-4 text-gray-400" />
            <span>{facility.area.toLocaleString()} m²</span>
          </div>
        )}
        {facility.nextMaintenanceDate && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>Próx. mant: {new Date(facility.nextMaintenanceDate).toLocaleDateString('es-CR', { day: 'numeric', month: 'short' })}</span>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
        {facility.capacity && (
          <div className="text-xs text-gray-500">
            Capacidad: <span className="font-medium text-gray-700">{facility.capacity}</span>
          </div>
        )}
        <button className="btn-ghost text-xs gap-1 px-2 py-1 ml-auto">
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
