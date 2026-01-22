import { Hexagon, Heart, Calendar, Package } from 'lucide-react';

interface ApiculturaStatCardProps {
  label: string;
  value: string | number;
  icon?: 'apiarios' | 'colmenas' | 'health' | 'revisions' | 'production';
  subValue?: string;
}

const iconComponents = {
  apiarios: Hexagon,
  colmenas: Hexagon,
  health: Heart,
  revisions: Calendar,
  production: Package,
};

const iconColors = {
  apiarios: 'bg-amber-100 text-amber-600',
  colmenas: 'bg-amber-100 text-amber-600',
  health: 'bg-green-100 text-green-600',
  revisions: 'bg-blue-100 text-blue-600',
  production: 'bg-orange-100 text-orange-600',
};

export default function ApiculturaStatCard({
  label,
  value,
  icon = 'colmenas',
  subValue,
}: ApiculturaStatCardProps) {
  const IconComponent = iconComponents[icon] || Hexagon;
  const iconColor = iconColors[icon] || iconColors.colmenas;

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
