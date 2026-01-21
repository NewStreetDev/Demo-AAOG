import { Milk, Egg, Beef, Hexagon } from 'lucide-react';
import type { ProductionSummary } from '../../../types/dashboard.types';

interface ProductionCardProps {
  production: ProductionSummary;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  milk: Milk,
  egg: Egg,
  honey: Hexagon, // Honeycomb icon for apicultura
  meat: Beef,
};

const colorMap: Record<string, { bg: string; text: string }> = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
  red: { bg: 'bg-red-100', text: 'text-red-600' },
};

export default function ProductionCard({ production }: ProductionCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
      {/* Header with month */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-gray-900">
          Resumen de Producción
        </h3>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {production.month}
        </span>
      </div>

      {/* Production Items Grid */}
      <div className="grid grid-cols-2 gap-5">
        {production.items.map((item) => {
          const Icon = iconMap[item.icon || ''] || Milk;
          const colors = colorMap[item.color || 'blue'];

          return (
            <div key={item.id} className="flex items-start gap-3">
              {/* Prominent Icon */}
              <div className={`${colors.bg} p-3.5 rounded-xl flex-shrink-0`}>
                <Icon className={`w-7 h-7 ${colors.text}`} />
              </div>

              {/* Value-first layout */}
              <div className="min-w-0 flex-1">
                {/* Large, prominent value */}
                <p className="text-2xl font-bold text-gray-900 leading-tight mb-0.5">
                  {item.quantity}
                </p>
                {/* Small, subtle unit and name */}
                <p className="text-xs text-gray-500 font-medium">
                  {item.unit} · {item.name}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total value footer */}
      <div className="mt-5 pt-5 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Valor Total</span>
          <span className="text-xl font-bold text-green-700">
            ${production.totalValue.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
