import { AlertTriangle, ShoppingCart } from 'lucide-react';
import type { LowStockAlert } from '../../types/insumos.types';

interface LowStockAlertListProps {
  alerts: LowStockAlert[];
}

const priorityColors = {
  high: 'border-l-red-500 bg-red-50',
  medium: 'border-l-orange-500 bg-orange-50',
  low: 'border-l-yellow-500 bg-yellow-50',
};

const priorityLabels = {
  high: 'Crítico',
  medium: 'Bajo',
  low: 'Advertencia',
};

export default function LowStockAlertList({ alerts }: LowStockAlertListProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="card p-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          Alertas de Stock Bajo
        </h3>
        <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
          {alerts.length}
        </span>
      </div>

      {/* List */}
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-3 rounded-lg border-l-4 ${priorityColors[alert.priority]}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900">{alert.insumoName}</p>
                  <span className="text-xs text-gray-500 bg-white px-1.5 py-0.5 rounded">
                    {priorityLabels[alert.priority]}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Stock: <span className="font-bold text-red-600">{alert.currentStock}</span>
                  <span className="text-gray-400"> / </span>
                  <span>Mín: {alert.minStock}</span>
                </p>
              </div>

              {alert.reorderQuantity && (
                <button className="flex items-center gap-1 text-xs font-medium text-primary hover:bg-primary/10 px-2 py-1 rounded transition-colors">
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Pedir {alert.reorderQuantity}
                </button>
              )}
            </div>

            {alert.supplier && (
              <p className="text-xs text-gray-500 mt-2">
                Proveedor: {alert.supplier}
                {alert.costPerReorder && (
                  <span> • Costo estimado: ₡{(alert.costPerReorder / 1000).toFixed(0)}K</span>
                )}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
