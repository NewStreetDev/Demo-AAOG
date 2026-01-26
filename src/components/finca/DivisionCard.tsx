import { MapPin, Square, ChevronRight } from 'lucide-react';
import type { Division } from '../../types/finca.types';

interface DivisionCardProps {
  division: Division;
  onClick: () => void;
}

const typeLabels: Record<string, string> = {
  potrero: 'Potrero',
  lote_agricola: 'Lote Agricola',
  apiario: 'Apiario',
  infraestructura: 'Infraestructura',
  reserva: 'Reserva Natural',
  bosque: 'Bosque',
  agua: 'Cuerpo de Agua',
  otro: 'Otro',
};

const typeColors: Record<string, { bg: string; text: string; border: string }> = {
  potrero: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  lote_agricola: { bg: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-200' },
  apiario: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  infraestructura: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
  reserva: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  bosque: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  agua: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  otro: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
};

const statusLabels: Record<string, string> = {
  active: 'Activo',
  inactive: 'Inactivo',
  maintenance: 'Mantenimiento',
  resting: 'En Descanso',
};

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-700',
  maintenance: 'bg-amber-100 text-amber-700',
  resting: 'bg-blue-100 text-blue-700',
};

export default function DivisionCard({ division, onClick }: DivisionCardProps) {
  const colors = typeColors[division.type] || typeColors.otro;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border ${colors.border} ${colors.bg} hover:shadow-md transition-all duration-200`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.text} bg-white/50`}>
              {typeLabels[division.type]}
            </span>
            <span className="text-xs text-gray-500 font-mono">{division.code}</span>
          </div>

          <h4 className="font-semibold text-gray-900 truncate">{division.name}</h4>

          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Square className="w-4 h-4" />
              <span>{division.area} ha</span>
            </div>
            {division.coordinates && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="w-4 h-4" />
                <span className="text-xs">
                  {division.coordinates.lat.toFixed(2)}, {division.coordinates.lng.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[division.status]}`}>
            {statusLabels[division.status]}
          </span>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {division.description && (
        <p className="mt-2 text-sm text-gray-600 line-clamp-1">
          {division.description}
        </p>
      )}
    </button>
  );
}
