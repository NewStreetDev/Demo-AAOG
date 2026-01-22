import { Package, Clock, AlertCircle, Plus, ChevronRight } from 'lucide-react';
import type { InventoryItem } from '../../../types/dashboard.types';

interface InventoryCardProps {
  items: InventoryItem[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  en_stock: Package,
  bajo: Clock,
  critico: AlertCircle,
};

const colorMap: Record<string, {
  bg: string;
  text: string;
  badge: string;
  ring: string;
  glow: string;
  dot: string;
}> = {
  en_stock: {
    bg: 'bg-gradient-to-br from-green-50 to-emerald-50/50',
    text: 'text-green-600',
    badge: 'bg-green-100 text-green-700 ring-1 ring-green-200/50',
    ring: 'ring-green-200/50',
    glow: 'group-hover:shadow-green-100',
    dot: 'bg-green-500'
  },
  bajo: {
    bg: 'bg-gradient-to-br from-orange-50 to-amber-50/50',
    text: 'text-orange-600',
    badge: 'bg-orange-100 text-orange-700 ring-1 ring-orange-200/50',
    ring: 'ring-orange-200/50',
    glow: 'group-hover:shadow-orange-100',
    dot: 'bg-orange-500'
  },
  critico: {
    bg: 'bg-gradient-to-br from-red-50 to-rose-50/50',
    text: 'text-red-600',
    badge: 'bg-red-100 text-red-700 ring-1 ring-red-200/50',
    ring: 'ring-red-200/50',
    glow: 'group-hover:shadow-red-100',
    dot: 'bg-red-500'
  },
};

export default function InventoryCard({ items }: InventoryCardProps) {
  return (
    <div className="card p-6 animate-fade-in">
      {/* Header with action button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">
            Estado de Insumos
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {items.length} productos registrados
          </p>
        </div>
        <button className="btn-primary text-xs gap-1.5 px-3 py-2">
          <Plus className="w-3.5 h-3.5" />
          Solicitar
        </button>
      </div>

      {/* Inventory list */}
      <div className="space-y-2.5">
        {items.map((item, index) => {
          const Icon = iconMap[item.status] || Package;
          const colors = colorMap[item.status];
          const isCritical = item.status === 'critico';

          return (
            <div
              key={item.id}
              className={`group relative flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white hover:border-gray-200 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer animate-slide-up ${colors.glow}`}
              style={{ animationDelay: `${index * 40}ms` }}
            >
              {/* Left section */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Icon with gradient background */}
                <div
                  className={`relative ${colors.bg} p-3 rounded-xl ring-1 ${colors.ring} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                >
                  <Icon className={`w-5 h-5 ${colors.text}`} />

                  {/* Glow effect */}
                  <div className={`absolute inset-0 ${colors.bg} rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate group-hover:text-gray-950 transition-colors">
                    {item.name}
                  </p>
                  <p className="text-xs font-medium text-gray-500 mt-0.5 capitalize">
                    {item.category}
                  </p>
                </div>
              </div>

              {/* Quantity badge */}
              <div className="flex-shrink-0 ml-4">
                <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold ${colors.badge} transition-all duration-200 group-hover:scale-105`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} ${isCritical ? 'animate-pulse' : ''}`} />
                  {item.quantity}
                </span>
              </div>

              {/* Critical warning indicator */}
              {isCritical && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full ring-2 ring-white flex items-center justify-center animate-pulse">
                  <AlertCircle className="w-3 h-3 text-white" />
                </div>
              )}

              {/* Hover indicator */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>

              {/* Left accent for critical items */}
              {isCritical && (
                <div className="absolute left-0 top-3 bottom-3 w-1 bg-gradient-to-b from-red-500 to-red-600 rounded-r-full animate-pulse" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
