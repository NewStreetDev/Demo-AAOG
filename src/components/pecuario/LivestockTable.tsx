import { useState } from 'react';
import { ChevronRight, Filter } from 'lucide-react';
import type { Livestock, LivestockCategory } from '../../types/pecuario.types';

interface LivestockTableProps {
  livestock: Livestock[];
  maxItems?: number;
  onViewAll?: () => void;
  onLivestockClick?: (livestock: Livestock) => void;
}

const categoryLabels: Record<LivestockCategory, string> = {
  ternero: 'Ternero',
  ternera: 'Ternera',
  novillo: 'Novillo',
  novilla: 'Novilla',
  vaca: 'Vaca',
  toro: 'Toro',
};

const categoryColors: Record<LivestockCategory, string> = {
  ternero: 'bg-green-100 text-green-700',
  ternera: 'bg-amber-100 text-amber-700',
  novillo: 'bg-blue-100 text-blue-700',
  novilla: 'bg-purple-100 text-purple-700',
  vaca: 'bg-pink-100 text-pink-700',
  toro: 'bg-red-100 text-red-700',
};

export default function LivestockTable({ livestock, maxItems = 6, onViewAll, onLivestockClick }: LivestockTableProps) {
  const [selectedCategory, setSelectedCategory] = useState<LivestockCategory | 'all'>('all');

  const filteredLivestock = selectedCategory === 'all'
    ? livestock
    : livestock.filter(animal => animal.category === selectedCategory);

  const displayLivestock = filteredLivestock.slice(0, maxItems);
  const hasMore = filteredLivestock.length > maxItems;

  const categories: (LivestockCategory | 'all')[] = ['all', 'vaca', 'toro', 'novillo', 'novilla', 'ternero', 'ternera'];

  return (
    <div className="card p-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          Inventario de Ganado
        </h3>
        <span className="text-sm text-gray-500">{filteredLivestock.length} animales</span>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat === 'all' ? 'Todos' : categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-2">
                Arete
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-2">
                Categoría
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-2">
                Raza
              </th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-2">
                Peso
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-2">
                Ubicación
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {displayLivestock.map(animal => (
              <tr
                key={animal.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onLivestockClick?.(animal)}
              >
                <td className="py-3">
                  <div>
                    <p className="font-semibold text-gray-900">{animal.tag}</p>
                    {animal.name && (
                      <p className="text-xs text-gray-500">{animal.name}</p>
                    )}
                  </div>
                </td>
                <td className="py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[animal.category]}`}>
                    {categoryLabels[animal.category]}
                  </span>
                </td>
                <td className="py-3 text-sm text-gray-600">{animal.breed}</td>
                <td className="py-3 text-sm text-gray-900 text-right font-medium">
                  {animal.weight} kg
                </td>
                <td className="py-3 text-sm text-gray-600">{animal.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View All */}
      {hasMore && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={onViewAll}
            className="btn-ghost text-xs gap-1 w-full justify-center py-2"
          >
            Ver todo el inventario
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
