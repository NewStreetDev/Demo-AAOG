import { useState } from 'react';
import { ChevronRight, Filter, AlertTriangle } from 'lucide-react';
import type { Insumo, InsumoCategoryType } from '../../types/insumos.types';

interface InsumosListProps {
  insumos: Insumo[];
  maxItems?: number;
  onViewAll?: () => void;
  onInsumoClick?: (insumo: Insumo) => void;
}

const categoryLabels: Record<InsumoCategoryType, string> = {
  semillas: 'Semillas',
  fertilizantes: 'Fertilizantes',
  pesticidas: 'Pesticidas',
  herbicidas: 'Herbicidas',
  alimentos: 'Alimentos',
  medicamentos: 'Medicamentos',
  herramientas: 'Herramientas',
  otros: 'Otros',
};

const statusColors = {
  en_stock: 'bg-green-100 text-green-700',
  bajo: 'bg-orange-100 text-orange-700',
  critico: 'bg-red-100 text-red-700',
};

const statusLabels = {
  en_stock: 'En Stock',
  bajo: 'Bajo',
  critico: 'Crítico',
};

export default function InsumosList({ insumos, maxItems = 8, onViewAll, onInsumoClick }: InsumosListProps) {
  const [selectedCategory, setSelectedCategory] = useState<InsumoCategoryType | 'all'>('all');

  const filteredInsumos = selectedCategory === 'all'
    ? insumos
    : insumos.filter(i => i.category === selectedCategory);

  const displayInsumos = filteredInsumos.slice(0, maxItems);
  const hasMore = filteredInsumos.length > maxItems;

  const categories: (InsumoCategoryType | 'all')[] = ['all', 'semillas', 'fertilizantes', 'pesticidas', 'alimentos', 'medicamentos', 'herramientas'];

  return (
    <div className="card p-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          Inventario de Insumos
        </h3>
        <span className="text-sm text-gray-500">{filteredInsumos.length} items</span>
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
                Insumo
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-2">
                Categoría
              </th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-2">
                Stock
              </th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-2">
                Valor
              </th>
              <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider py-2">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {displayInsumos.map(insumo => (
              <tr
                key={insumo.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onInsumoClick?.(insumo)}
              >
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    {insumo.status === 'critico' && (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">{insumo.name}</p>
                      <p className="text-xs text-gray-500">{insumo.code}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-sm text-gray-600">
                  {categoryLabels[insumo.category]}
                </td>
                <td className="py-3 text-sm text-right">
                  <span className="font-medium text-gray-900">{insumo.currentStock}</span>
                  <span className="text-gray-500"> {insumo.unit}</span>
                </td>
                <td className="py-3 text-sm text-right font-medium text-gray-900">
                  ₡{(insumo.totalValue / 1000).toFixed(0)}K
                </td>
                <td className="py-3 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[insumo.status]}`}>
                    {statusLabels[insumo.status]}
                  </span>
                </td>
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
