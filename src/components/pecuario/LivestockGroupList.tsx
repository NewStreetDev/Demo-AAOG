import { useState } from 'react';
import {
  Users,
  MapPin,
  Search,
  Filter,
  Hash,
  Layers,
} from 'lucide-react';
import type { LivestockGroup } from '../../types/pecuario.types';
import { speciesOptions, categoryOptionsBySpecies } from '../../schemas/pecuario.schema';

interface LivestockGroupListProps {
  livestockGroups: LivestockGroup[];
  onGroupClick?: (group: LivestockGroup) => void;
  showFilters?: boolean;
  compact?: boolean;
}

const speciesColorMap: Record<string, { bg: string; text: string; badge: string }> = {
  bovine: { bg: 'bg-amber-100', text: 'text-amber-600', badge: 'bg-amber-100 text-amber-700' },
  porcine: { bg: 'bg-pink-100', text: 'text-pink-600', badge: 'bg-pink-100 text-pink-700' },
  caprine: { bg: 'bg-emerald-100', text: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700' },
  buffalo: { bg: 'bg-slate-100', text: 'text-slate-600', badge: 'bg-slate-100 text-slate-700' },
  equine: { bg: 'bg-indigo-100', text: 'text-indigo-600', badge: 'bg-indigo-100 text-indigo-700' },
  ovine: { bg: 'bg-lime-100', text: 'text-lime-600', badge: 'bg-lime-100 text-lime-700' },
  poultry: { bg: 'bg-orange-100', text: 'text-orange-600', badge: 'bg-orange-100 text-orange-700' },
};

export default function LivestockGroupList({
  livestockGroups,
  onGroupClick,
  showFilters = true,
  compact = false,
}: LivestockGroupListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState<string>('all');

  // Filter groups
  const filteredGroups = livestockGroups.filter(group => {
    const matchesSearch =
      searchTerm === '' ||
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecies = selectedSpecies === 'all' || group.species === selectedSpecies;

    return matchesSearch && matchesSpecies;
  });

  // Calculate total count
  const totalCount = filteredGroups.reduce((sum, g) => sum + g.count, 0);

  const getSpeciesLabel = (species: string) => {
    return speciesOptions.find(s => s.value === species)?.label || species;
  };

  const getCategoryLabel = (species: string, category: string) => {
    return categoryOptionsBySpecies[species]?.find(c => c.value === category)?.label || category;
  };

  if (livestockGroups.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-violet-100 rounded-lg">
            <Users className="w-5 h-5 text-violet-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Grupos de Ganado</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No hay grupos creados</p>
          <p className="text-sm mt-1">Crea un grupo para organizar tu ganado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-violet-100 rounded-lg">
          <Users className="w-5 h-5 text-violet-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Grupos de Ganado</h3>
        <span className="ml-auto text-sm text-gray-500">
          {filteredGroups.length} grupo{filteredGroups.length !== 1 ? 's' : ''} - {totalCount} animales
        </span>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, ubicacion..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white appearance-none cursor-pointer"
            >
              <option value="all">Todas las especies</option>
              {speciesOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Groups List */}
      <div className={`space-y-3 ${!compact ? 'max-h-[500px]' : 'max-h-[300px]'} overflow-y-auto`}>
        {filteredGroups.map((group) => {
          const colors = speciesColorMap[group.species] || {
            bg: 'bg-gray-100',
            text: 'text-gray-600',
            badge: 'bg-gray-100 text-gray-700',
          };

          return (
            <div
              key={group.id}
              onClick={() => onGroupClick?.(group)}
              className="p-4 rounded-lg border border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`p-2 rounded-lg ${colors.bg}`}>
                    <Users className={`w-4 h-4 ${colors.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-semibold text-gray-900">
                        {group.name}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors.badge}`}>
                        {getSpeciesLabel(group.species)}
                      </span>
                    </div>
                    {group.description && (
                      <p className="text-sm text-gray-600 truncate mb-2">
                        {group.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        {getCategoryLabel(group.species, group.category)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {group.location}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Count Badge */}
                <div className="flex-shrink-0 text-center">
                  <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full ${colors.bg}`}>
                    <Hash className={`w-3.5 h-3.5 ${colors.text}`} />
                    <span className={`text-sm font-bold ${colors.text}`}>
                      {group.count}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredGroups.length === 0 && livestockGroups.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No se encontraron grupos con los filtros aplicados</p>
        </div>
      )}
    </div>
  );
}
