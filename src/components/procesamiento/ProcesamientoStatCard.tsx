import { Factory, Package, CheckCircle, TrendingUp, Settings, AlertCircle } from 'lucide-react';

interface ProcesamientoStatCardProps {
  label: string;
  value: string | number;
  icon?: 'batches' | 'production' | 'quality' | 'yield' | 'lines' | 'pending';
  subValue?: string;
}

const iconComponents = {
  batches: Factory,
  production: Package,
  quality: CheckCircle,
  yield: TrendingUp,
  lines: Settings,
  pending: AlertCircle,
};

const iconColors = {
  batches: 'bg-blue-100 text-blue-600',
  production: 'bg-green-100 text-green-600',
  quality: 'bg-purple-100 text-purple-600',
  yield: 'bg-amber-100 text-amber-600',
  lines: 'bg-indigo-100 text-indigo-600',
  pending: 'bg-orange-100 text-orange-600',
};

export default function ProcesamientoStatCard({
  label,
  value,
  icon = 'batches',
  subValue,
}: ProcesamientoStatCardProps) {
  const IconComponent = iconComponents[icon] || Factory;
  const iconColor = iconColors[icon] || iconColors.batches;

  return (
    <div className="card p-5 animate-fade-in hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between">
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
        <div className={`p-3 rounded-xl ${iconColor}`}>
          <IconComponent className="w-6 h-6" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}
