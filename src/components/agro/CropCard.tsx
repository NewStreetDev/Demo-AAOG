import { MapPin, Calendar, ChevronRight, Leaf } from 'lucide-react';
import type { CropSummary, CropStatus } from '../../types/agro.types';

interface CropCardProps {
  crop: CropSummary;
  onClick?: () => void;
}

function getStatusInfo(status: CropStatus): { label: string; color: string } {
  const statusMap: Record<CropStatus, { label: string; color: string }> = {
    planned: { label: 'Planificado', color: 'bg-gray-100 text-gray-600' },
    planted: { label: 'Sembrado', color: 'bg-blue-100 text-blue-700' },
    growing: { label: 'Creciendo', color: 'bg-green-100 text-green-700' },
    flowering: { label: 'Floración', color: 'bg-pink-100 text-pink-700' },
    fruiting: { label: 'Fructificando', color: 'bg-orange-100 text-orange-700' },
    ready: { label: 'Listo', color: 'bg-amber-100 text-amber-700' },
    harvested: { label: 'Cosechado', color: 'bg-purple-100 text-purple-700' },
  };
  return statusMap[status] || statusMap.planned;
}

function getHealthColor(health: CropSummary['healthStatus']): string {
  const colors = {
    excellent: 'text-green-600',
    good: 'text-blue-600',
    fair: 'text-amber-600',
    poor: 'text-red-600',
  };
  return colors[health];
}

function getProgressColor(progress: number): string {
  if (progress >= 80) return 'bg-amber-500';
  if (progress >= 50) return 'bg-green-500';
  return 'bg-blue-500';
}

export default function CropCard({ crop, onClick }: CropCardProps) {
  const statusInfo = getStatusInfo(crop.status);
  const healthColor = getHealthColor(crop.healthStatus);
  const progressColor = getProgressColor(crop.progress);

  return (
    <div
      className="card p-5 hover:shadow-lg transition-all duration-300 cursor-pointer animate-fade-in"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900 text-lg">{crop.name}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-0.5">{crop.variety}</p>
        </div>
        <div className={`p-2 rounded-lg bg-green-50 ${healthColor}`}>
          <Leaf className="w-5 h-5" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">Progreso</span>
          <span className="font-medium text-gray-700">{crop.progress}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${progressColor} transition-all duration-300`}
            style={{ width: `${crop.progress}%` }}
          />
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>{crop.loteName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-gray-400">Área:</span>
          <span>{crop.area} ha</span>
        </div>
      </div>

      {/* Days to Harvest */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-gray-400" />
          {crop.daysToHarvest === 0 ? (
            <span className="text-amber-600 font-medium">Listo para cosechar</span>
          ) : (
            <span className="text-gray-600">{crop.daysToHarvest} días para cosecha</span>
          )}
        </div>
        <button className="btn-ghost text-xs gap-1 px-2 py-1">
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
