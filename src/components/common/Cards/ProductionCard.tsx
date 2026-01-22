import { TrendingUp } from 'lucide-react';
import type { ProductionSummary } from '../../../types/dashboard.types';

interface ProductionCardProps {
  production: ProductionSummary;
}

const emojiMap: Record<string, string> = {
  milk: '🥛',
  egg: '🥚',
  honey: '🍯',
  meat: '🥩',
};

const colorMap: Record<string, { bg: string; text: string; ring: string; glow: string }> = {
  blue: {
    bg: 'bg-gradient-to-br from-blue-50 to-blue-100/50',
    text: 'text-blue-600',
    ring: 'ring-blue-200/50',
    glow: 'shadow-blue-100'
  },
  orange: {
    bg: 'bg-gradient-to-br from-orange-50 to-orange-100/50',
    text: 'text-orange-600',
    ring: 'ring-orange-200/50',
    glow: 'shadow-orange-100'
  },
  yellow: {
    bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100/50',
    text: 'text-yellow-600',
    ring: 'ring-yellow-200/50',
    glow: 'shadow-yellow-100'
  },
  red: {
    bg: 'bg-gradient-to-br from-red-50 to-red-100/50',
    text: 'text-red-600',
    ring: 'ring-red-200/50',
    glow: 'shadow-red-100'
  },
};

export default function ProductionCard({ production }: ProductionCardProps) {
  return (
    <div className="card p-6 animate-fade-in">
      {/* Header with improved spacing */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">
            Resumen de Producción
          </h3>
          <p className="text-xs text-gray-500 mt-1">Datos del mes actual</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 rounded-full ring-1 ring-gray-200/50">
          {production.month}
        </span>
      </div>

      {/* Production items grid with enhanced cards */}
      <div className="grid grid-cols-2 gap-3">
        {production.items.map((item, index) => {
          const emoji = emojiMap[item.icon || ''] || '🥛';
          const colors = colorMap[item.color || 'blue'];

          return (
            <div
              key={item.id}
              className={`group relative flex items-center gap-3 rounded-xl border border-gray-100 p-4 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5 cursor-pointer animate-slide-up`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Icon container with gradient and glow effect */}
              <div
                className={`relative ${colors.bg} p-3.5 rounded-xl flex items-center justify-center ring-1 ${colors.ring} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${colors.glow}`}
              >
                <span className="text-2xl transition-transform duration-300 group-hover:scale-110" role="img" aria-label={item.name}>
                  {emoji}
                </span>
                {/* Subtle glow effect */}
                <div className={`absolute inset-0 ${colors.bg} rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-700 truncate group-hover:text-gray-900 transition-colors">
                  {item.name}
                </p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <p className="text-xl font-bold text-gray-900 tracking-tight">
                    {item.quantity}
                  </p>
                  <span className="text-xs font-medium text-gray-500">
                    {item.unit}
                  </span>
                </div>
              </div>

              {/* Hover indicator */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Total value with premium styling */}
      <div className="mt-6 pt-5 border-t border-gray-100/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-600">
              Valor total estimado
            </span>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              ${production.totalValue.toLocaleString()}
            </span>
          </div>
        </div>
        {/* Progress bar visualization */}
        <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: '75%' }}
          />
        </div>
      </div>
    </div>
  );
}
