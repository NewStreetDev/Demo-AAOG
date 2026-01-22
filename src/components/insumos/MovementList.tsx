import { ChevronRight, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import type { InsumoMovement } from '../../types/insumos.types';

interface MovementListProps {
  movements: InsumoMovement[];
  maxItems?: number;
  onViewAll?: () => void;
}

export default function MovementList({ movements, maxItems = 5, onViewAll }: MovementListProps) {
  const displayMovements = movements.slice(0, maxItems);
  const hasMore = movements.length > maxItems;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-CR', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="card p-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          Movimientos Recientes
        </h3>
      </div>

      {/* List */}
      <div className="space-y-3">
        {displayMovements.map((movement) => {
          const isEntry = movement.type === 'entrada';

          return (
            <div
              key={movement.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              {/* Icon */}
              <div className={`p-2 rounded-full ${isEntry ? 'bg-green-100' : 'bg-orange-100'}`}>
                {isEntry ? (
                  <ArrowDownLeft className="w-4 h-4 text-green-600" />
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-orange-600" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {movement.insumoName}
                </p>
                <p className="text-xs text-gray-500">
                  {isEntry ? 'Entrada' : 'Salida'} • {movement.performer}
                </p>
              </div>

              {/* Quantity and Date */}
              <div className="text-right">
                <p className={`text-sm font-bold ${isEntry ? 'text-green-600' : 'text-orange-600'}`}>
                  {isEntry ? '+' : '-'}{movement.quantity} {movement.unit}
                </p>
                <p className="text-xs text-gray-500">{formatDate(movement.date)}</p>
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
            Ver todos los movimientos
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
