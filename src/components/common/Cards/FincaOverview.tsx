import { ChevronRight } from 'lucide-react';
import type { FarmSummary } from '../../../types/dashboard.types';

interface FincaOverviewProps {
  farms: FarmSummary[];
}

export default function FincaOverview({ farms }: FincaOverviewProps) {
  return (
    <div className="card p-6 animate-fade-in h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          Visión General
        </h3>
        <button className="btn-ghost text-xs gap-1 px-3 py-2">
          Ver Más
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Farm list */}
      <div className="space-y-3 flex-1">
        {farms.map((farm, index) => (
          <div
            key={farm.id}
            className="group flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-200 cursor-pointer animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Color indicator */}
            <div
              className="w-3 h-3 rounded-sm flex-shrink-0"
              style={{ backgroundColor: farm.color }}
            />

            {/* Farm info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-gray-950">
                {farm.name}
              </p>
              <p className="text-xs text-gray-500">
                Producción: {farm.production.toLocaleString()} {farm.productionUnit}
              </p>
            </div>

            {/* Production value */}
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-gray-900">
                {farm.production.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">{farm.productionUnit}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
