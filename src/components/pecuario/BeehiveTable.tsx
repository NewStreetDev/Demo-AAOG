import { useState } from 'react';
import { Filter } from 'lucide-react';
import type { Beehive, BeehiveType } from '../../types/pecuario.types';

interface BeehiveTableProps {
  beehives: Beehive[];
  maxItems?: number;
  onBeehiveClick?: (beehive: Beehive) => void;
}

// Colors by beehive type
const typeColors: Record<string, string> = {
  langstroth: 'bg-blue-100 text-blue-700',
  top_bar: 'bg-amber-100 text-amber-700',
  warre: 'bg-green-100 text-green-700',
  traditional: 'bg-purple-100 text-purple-700',
  other: 'bg-gray-100 text-gray-700',
};

const typeLabels: Record<string, string> = {
  langstroth: 'Langstroth',
  top_bar: 'Top Bar',
  warre: 'Warré',
  traditional: 'Tradicional',
  other: 'Otro',
};

// Colors by strength
const strengthColors: Record<string, string> = {
  strong: 'text-green-600',
  medium: 'text-amber-600',
  weak: 'text-red-600',
};

const strengthLabels: Record<string, string> = {
  strong: 'Fuerte',
  medium: 'Media',
  weak: 'Débil',
};

const strengthDots: Record<string, string> = {
  strong: 'bg-green-500',
  medium: 'bg-amber-500',
  weak: 'bg-red-500',
};

// Colors by status
const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-600',
  dead: 'bg-red-100 text-red-700',
  sold: 'bg-blue-100 text-blue-700',
  merged: 'bg-purple-100 text-purple-700',
};

const statusLabels: Record<string, string> = {
  active: 'Activa',
  inactive: 'Inactiva',
  dead: 'Muerta',
  sold: 'Vendida',
  merged: 'Fusionada',
};

export default function BeehiveTable({ beehives, maxItems = 10, onBeehiveClick }: BeehiveTableProps) {
  const [selectedType, setSelectedType] = useState<BeehiveType | 'all'>('all');

  const filteredBeehives = selectedType === 'all'
    ? beehives
    : beehives.filter(b => b.type === selectedType);

  const displayBeehives = filteredBeehives.slice(0, maxItems);

  // Get unique types from current beehives
  const availableTypes = Array.from(new Set(beehives.map(b => b.type)));
  const typeFilters: (BeehiveType | 'all')[] = ['all', ...availableTypes];

  return (
    <div className="card p-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          Inventario de Colmenas
        </h3>
        <span className="text-sm text-gray-500">{filteredBeehives.length} colmenas</span>
      </div>

      {/* Type Filters */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
        {typeFilters.map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedType === type
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {type === 'all' ? 'Todos' : typeLabels[type]}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-2">
                Código
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-2">
                Tipo
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-2">
                Apiario
              </th>
              <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider py-2">
                Fuerza
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-2">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {displayBeehives.map(beehive => (
              <tr
                key={beehive.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onBeehiveClick?.(beehive)}
              >
                <td className="py-3">
                  <div>
                    <p className="font-semibold text-gray-900">{beehive.code}</p>
                    {beehive.name && (
                      <p className="text-xs text-gray-500">{beehive.name}</p>
                    )}
                  </div>
                </td>
                <td className="py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[beehive.type] || 'bg-gray-100 text-gray-700'}`}>
                    {typeLabels[beehive.type] || beehive.type}
                  </span>
                </td>
                <td className="py-3 text-sm text-gray-600">{beehive.apiaryName}</td>
                <td className="py-3">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${strengthDots[beehive.strength]}`} />
                    <span className={`text-xs font-medium ${strengthColors[beehive.strength]}`}>
                      {strengthLabels[beehive.strength]}
                    </span>
                  </div>
                </td>
                <td className="py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[beehive.status] || 'bg-gray-100 text-gray-700'}`}>
                    {statusLabels[beehive.status] || beehive.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {displayBeehives.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No hay colmenas registradas</p>
        </div>
      )}
    </div>
  );
}
