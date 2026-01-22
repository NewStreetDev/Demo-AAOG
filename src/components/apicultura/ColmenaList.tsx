import { ChevronRight, AlertTriangle } from 'lucide-react';
import type { Colmena } from '../../types/apicultura.types';

interface ColmenaListProps {
  colmenas: Colmena[];
  maxItems?: number;
  onViewAll?: () => void;
  onColmenaClick?: (colmena: Colmena) => void;
}

function getStatusInfo(status: Colmena['status']): { label: string; color: string } {
  const statusMap = {
    active: { label: 'Activa', color: 'bg-blue-100 text-blue-700' },
    producing: { label: 'Produciendo', color: 'bg-green-100 text-green-700' },
    resting: { label: 'Descanso', color: 'bg-gray-100 text-gray-600' },
    quarantine: { label: 'Cuarentena', color: 'bg-red-100 text-red-700' },
    inactive: { label: 'Inactiva', color: 'bg-gray-100 text-gray-500' },
  };
  return statusMap[status] || statusMap.inactive;
}

function getHealthColor(health: number): string {
  if (health >= 9) return 'bg-green-500';
  if (health >= 7) return 'bg-blue-500';
  if (health >= 5) return 'bg-amber-500';
  return 'bg-red-500';
}

function getPopulationLabel(population: Colmena['population']): string {
  const labels = { low: 'Baja', medium: 'Media', high: 'Alta' };
  return labels[population];
}

export default function ColmenaList({ colmenas, maxItems = 5, onViewAll, onColmenaClick }: ColmenaListProps) {
  const displayColmenas = colmenas.slice(0, maxItems);
  const hasMore = colmenas.length > maxItems;

  return (
    <div className="card p-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          Colmenas
        </h3>
        <span className="text-sm text-gray-500">{colmenas.length} total</span>
      </div>

      {/* List */}
      <div className="space-y-3">
        {displayColmenas.map((colmena) => {
          const statusInfo = getStatusInfo(colmena.status);
          const healthColor = getHealthColor(colmena.health);
          const isAlert = colmena.health < 6 || colmena.queenStatus === 'absent';

          return (
            <div
              key={colmena.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => onColmenaClick?.(colmena)}
            >
              <div className="flex items-center gap-3">
                {/* Health Indicator */}
                <div className={`w-2.5 h-2.5 rounded-full ${healthColor}`} />

                {/* Info */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{colmena.code}</span>
                    {isAlert && (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {colmena.apiarioName} • Pob. {getPopulationLabel(colmena.population)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Honey Maturity */}
                <div className="text-right">
                  <p className="text-sm font-semibold text-amber-600">
                    {colmena.honeyMaturity}%
                  </p>
                  <p className="text-xs text-gray-500">Miel</p>
                </div>

                {/* Status Badge */}
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All */}
      {hasMore && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={onViewAll}
            className="btn-ghost text-xs gap-1 w-full justify-center py-2"
          >
            Ver todas las colmenas
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
