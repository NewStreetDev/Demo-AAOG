import { Package, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import type { InventoryItem } from '../../../types/dashboard.types';

interface InventoryCardProps {
  items: InventoryItem[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  en_stock: Package,
  bajo: Clock,
  critico: AlertCircle,
};

const colorMap: Record<string, { bg: string; text: string; badge: string }> = {
  en_stock: { bg: 'bg-green-50', text: 'text-green-600', badge: 'bg-green-100 text-green-700' },
  bajo: { bg: 'bg-orange-50', text: 'text-orange-600', badge: 'bg-orange-100 text-orange-700' },
  critico: { bg: 'bg-red-50', text: 'text-red-600', badge: 'bg-red-100 text-red-700' },
};

export default function InventoryCard({ items }: InventoryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Estado de Insumos</h3>
        <button className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium">
          Solicitar Insumos
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item) => {
          const Icon = iconMap[item.status] || Package;
          const colors = colorMap[item.status];

          return (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`${colors.bg} p-2 rounded-lg`}>
                  <Icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.category}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colors.badge}`}>
                {item.quantity}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
