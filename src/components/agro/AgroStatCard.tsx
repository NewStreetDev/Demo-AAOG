import { Sprout, Map, TrendingUp, DollarSign } from 'lucide-react';

interface AgroStatCardProps {
  label: string;
  value: string | number;
  icon?: 'crops' | 'area' | 'harvest' | 'revenue';
  subValue?: string;
}

const iconComponents = {
  crops: Sprout,
  area: Map,
  harvest: TrendingUp,
  revenue: DollarSign,
};

const iconColors = {
  crops: 'bg-green-100 text-green-600',
  area: 'bg-emerald-100 text-emerald-600',
  harvest: 'bg-amber-100 text-amber-600',
  revenue: 'bg-purple-100 text-purple-600',
};

export default function AgroStatCard({
  label,
  value,
  icon = 'crops',
  subValue,
}: AgroStatCardProps) {
  const IconComponent = iconComponents[icon] || Sprout;
  const iconColor = iconColors[icon] || iconColors.crops;

  return (
    <div className="card p-5 animate-fade-in hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between">
        {/* Content */}
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {label}
          </p>
          <p className="text-3xl font-bold text-gray-900 tracking-tight">
            {value}
          </p>
          {subValue && (
            <p className="text-xs text-gray-500">{subValue}</p>
          )}
        </div>

        {/* Icon */}
        <div className={`p-3 rounded-xl ${iconColor}`}>
          <IconComponent className="w-6 h-6" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}
