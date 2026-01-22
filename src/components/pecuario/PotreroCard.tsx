import { MapPin, Leaf, ArrowRightLeft } from 'lucide-react';
import type { Potrero } from '../../types/pecuario.types';

interface PotreroCardProps {
  potrero: Potrero;
  onClick?: () => void;
}

function getStatusInfo(status: Potrero['status']): { label: string; color: string } {
  const statusMap = {
    active: { label: 'Activo', color: 'bg-green-100 text-green-700' },
    resting: { label: 'Descanso', color: 'bg-amber-100 text-amber-700' },
    maintenance: { label: 'Mantenimiento', color: 'bg-gray-100 text-gray-600' },
  };
  return statusMap[status] || statusMap.active;
}

function getOccupancyColor(current: number, capacity: number): string {
  const percentage = (current / capacity) * 100;
  if (percentage >= 90) return 'bg-red-500';
  if (percentage >= 70) return 'bg-amber-500';
  return 'bg-green-500';
}

export default function PotreroCard({ potrero, onClick }: PotreroCardProps) {
  const statusInfo = getStatusInfo(potrero.status);
  const occupancyColor = getOccupancyColor(potrero.currentOccupancy, potrero.capacity);
  const occupancyPercentage = Math.round((potrero.currentOccupancy / potrero.capacity) * 100);

  const formatDate = (date?: Date) => {
    if (!date) return 'No programada';
    return new Date(date).toLocaleDateString('es-CR', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div
      className="card p-4 hover:shadow-lg transition-all duration-300 cursor-pointer animate-fade-in"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <MapPin className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{potrero.name}</h4>
            <p className="text-xs text-gray-500">{potrero.area} ha</p>
          </div>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
          {statusInfo.label}
        </span>
      </div>

      {/* Occupancy Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">Ocupación</span>
          <span className="font-medium text-gray-700">
            {potrero.currentOccupancy}/{potrero.capacity} ({occupancyPercentage}%)
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${occupancyColor} transition-all duration-300`}
            style={{ width: `${occupancyPercentage}%` }}
          />
        </div>
      </div>

      {/* Info */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <Leaf className="w-3 h-3" />
          <span>{potrero.grassType || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-1">
          <ArrowRightLeft className="w-3 h-3" />
          <span>Rotación: {formatDate(potrero.nextRotation)}</span>
        </div>
      </div>
    </div>
  );
}
