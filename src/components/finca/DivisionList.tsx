import { useState } from 'react';
import { Search, Filter, Grid3X3, List } from 'lucide-react';
import type { Division, DivisionType } from '../../types/finca.types';
import DivisionCard from './DivisionCard';

interface DivisionListProps {
  divisions: Division[];
  onDivisionClick: (division: Division) => void;
  showFilters?: boolean;
}

const typeFilters: { value: DivisionType | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'potrero', label: 'Potreros' },
  { value: 'lote_agricola', label: 'Lotes Agricolas' },
  { value: 'apiario', label: 'Apiarios' },
  { value: 'infraestructura', label: 'Infraestructura' },
  { value: 'reserva', label: 'Reservas' },
  { value: 'bosque', label: 'Bosques' },
  { value: 'agua', label: 'Agua' },
  { value: 'otro', label: 'Otros' },
];

export default function DivisionList({
  divisions,
  onDivisionClick,
  showFilters = true,
}: DivisionListProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<DivisionType | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredDivisions = divisions.filter(division => {
    const matchesSearch =
      division.name.toLowerCase().includes(search.toLowerCase()) ||
      division.code.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || division.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Calculate total area
  const totalArea = filteredDivisions.reduce((sum, d) => sum + d.area, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {showFilters && (
        <div className="p-4 border-b border-gray-100 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar division..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-green-100 text-green-600'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-green-100 text-green-600'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            {typeFilters.map(filter => (
              <button
                key={filter.value}
                onClick={() => setTypeFilter(filter.value)}
                className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                  typeFilter === filter.value
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
          <span>
            {filteredDivisions.length} divisiones encontradas
          </span>
          <span>
            Area total: {totalArea.toFixed(1)} ha
          </span>
        </div>

        {filteredDivisions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No se encontraron divisiones</p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-3'
          }>
            {filteredDivisions.map(division => (
              <DivisionCard
                key={division.id}
                division={division}
                onClick={() => onDivisionClick(division)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
