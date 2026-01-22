import { Package, DollarSign, TrendingDown, AlertCircle } from 'lucide-react';

interface ActivosStatCardProps {
  label: string;
  value: string | number;
  icon?: 'assets' | 'value' | 'depreciation' | 'alerts';
  subValue?: string;
}

const iconComponents = {
  assets: Package,
  value: DollarSign,
  depreciation: TrendingDown,
  alerts: AlertCircle,
};

const iconColors = {
  assets: 'bg-blue-100 text-blue-600',
  value: 'bg-green-100 text-green-600',
  depreciation: 'bg-purple-100 text-purple-600',
  alerts: 'bg-amber-100 text-amber-600',
};

export default function ActivosStatCard({
  label,
  value,
  icon = 'assets',
  subValue,
}: ActivosStatCardProps) {
  const IconComponent = iconComponents[icon] || Package;
  const iconColor = iconColors[icon] || iconColors.assets;

  return (
    <div className="card p-5 animate-fade-in hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {label}
          </p>
          <p className="text-2xl font-bold text-gray-900 tracking-tight">
            {value}
          </p>
          {subValue && (
            <p className="text-xs text-gray-500">{subValue}</p>
          )}
        </div>

        <div className={`p-3 rounded-xl ${iconColor}`}>
          <IconComponent className="w-5 h-5" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}
