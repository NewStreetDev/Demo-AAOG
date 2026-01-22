import { MapPin, Droplets, Layers } from 'lucide-react';
import type { Lote } from '../../types/agro.types';

interface LoteCardProps {
  lote: Lote;
  onClick?: () => void;
}

function getStatusInfo(status: Lote['status']): { label: string; color: string } {
  const statusMap = {
    active: { label: 'Activo', color: 'bg-green-100 text-green-700' },
    resting: { label: 'Descanso', color: 'bg-amber-100 text-amber-700' },
    preparation: { label: 'Preparación', color: 'bg-blue-100 text-blue-700' },
  };
  return statusMap[status] || statusMap.active;
}

function getIrrigationLabel(type?: Lote['irrigationType']): string {
  if (!type) return 'Sin riego';
  const labels = {
    drip: 'Goteo',
    sprinkler: 'Aspersión',
    flood: 'Inundación',
    none: 'Sin riego',
  };
  return labels[type];
}

export default function LoteCard({ lote, onClick }: LoteCardProps) {
  const statusInfo = getStatusInfo(lote.status);
  const irrigationLabel = getIrrigationLabel(lote.irrigationType);

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
            <h4 className="font-semibold text-gray-900">{lote.name}</h4>
            <p className="text-xs text-gray-500">{lote.code}</p>
          </div>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
          {statusInfo.label}
        </span>
      </div>

      {/* Info */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-gray-500">
            <Layers className="w-3.5 h-3.5" />
            <span>Área</span>
          </div>
          <span className="font-medium text-gray-900">{lote.area} ha</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-gray-500">
            <Droplets className="w-3.5 h-3.5" />
            <span>Riego</span>
          </div>
          <span className="font-medium text-gray-700">{irrigationLabel}</span>
        </div>

        {lote.soilType && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Suelo</span>
            <span className="font-medium text-gray-700">{lote.soilType}</span>
          </div>
        )}
      </div>
    </div>
  );
}
