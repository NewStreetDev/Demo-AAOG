import { MapPin, Calendar, ChevronRight, Tag } from 'lucide-react';
import type { Equipment } from '../../types/infraestructura.types';

interface EquipmentCardProps {
  equipment: Equipment;
  onClick?: () => void;
}

function getStatusBadgeColor(status: Equipment['status']): string {
  const colors = {
    operational: 'bg-green-100 text-green-700',
    maintenance: 'bg-amber-100 text-amber-700',
    repair: 'bg-orange-100 text-orange-700',
    out_of_service: 'bg-red-100 text-red-700',
  };
  return colors[status] || colors.operational;
}

function getStatusLabel(status: Equipment['status']): string {
  const labels = {
    operational: 'Operativo',
    maintenance: 'Mantenimiento',
    repair: 'En Reparación',
    out_of_service: 'Fuera de Servicio',
  };
  return labels[status];
}

function getTypeLabel(type: Equipment['type']): string {
  const labels = {
    vehicle: 'Vehículo',
    machinery: 'Maquinaria',
    tool: 'Herramienta',
    irrigation: 'Riego',
    electrical: 'Eléctrico',
    other: 'Otro',
  };
  return labels[type];
}

export default function EquipmentCard({ equipment, onClick }: EquipmentCardProps) {
  const statusColor = getStatusBadgeColor(equipment.status);

  return (
    <div
      className="card p-5 hover:shadow-lg transition-all duration-300 cursor-pointer animate-fade-in"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-base">
            {equipment.name}
          </h3>
          <p className="text-sm text-gray-600 mt-0.5">{getTypeLabel(equipment.type)}</p>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColor}`}>
          {getStatusLabel(equipment.status)}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {equipment.brand && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Tag className="w-4 h-4 text-gray-400" />
            <span>{equipment.brand} {equipment.model}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>{equipment.location}</span>
        </div>
        {equipment.nextMaintenanceDate && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>Próx. mant: {new Date(equipment.nextMaintenanceDate).toLocaleDateString('es-CR', { day: 'numeric', month: 'short' })}</span>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
        {equipment.value && (
          <div className="text-xs text-gray-500">
            Valor: <span className="font-medium text-gray-700">₡{(equipment.value / 1000000).toFixed(1)}M</span>
          </div>
        )}
        <button className="btn-ghost text-xs gap-1 px-2 py-1 ml-auto">
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
