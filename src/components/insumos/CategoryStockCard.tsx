import { ChevronRight } from 'lucide-react';
import type { CategorySummary } from '../../types/insumos.types';

interface CategoryStockCardProps {
  category: CategorySummary;
  onClick?: () => void;
}

export default function CategoryStockCard({ category, onClick }: CategoryStockCardProps) {
  return (
    <div
      className="card p-4 hover:shadow-lg transition-all duration-300 cursor-pointer animate-fade-in"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-2xl mb-1">{category.icon}</div>
          <h4 className="font-bold text-gray-900">{category.categoryLabel}</h4>
        </div>
        <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
          {category.count}
        </span>
      </div>

      {/* Stats */}
      <div className="space-y-2 mb-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Valor</span>
          <span className="font-semibold text-gray-900">
            ₡{(category.totalValue / 1000000).toFixed(1)}M
          </span>
        </div>
        {category.bajoStock > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-orange-600">Bajo Stock</span>
            <span className="font-bold text-orange-600">{category.bajoStock}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <button className="btn-ghost text-xs w-full justify-between px-0">
        Ver todos
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
