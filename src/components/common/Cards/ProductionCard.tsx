import { Milk, Egg, Beef, Flower } from 'lucide-react';
import type { ProductionSummary } from '../../../types/dashboard.types';

interface ProductionCardProps {
  production: ProductionSummary;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  milk: Milk,
  egg: Egg,
  honey: Flower,
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
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Resumen de Producción
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {production.items.map((item) => {
          const Icon = iconMap[item.icon || ''] || Milk;
          const colors = colorMap[item.color || 'blue'];

          return (
            <div key={item.id} className="flex items-center gap-3">
              <div className={`${colors.bg} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${colors.text}`} />
              </div>
              <div>
                <p className="text-sm text-gray-600">{item.name}</p>
                <p className="text-xl font-bold text-gray-900">
                  {item.quantity} <span className="text-sm font-normal text-gray-500">{item.unit}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
