import { Building2, Wrench, AlertTriangle, Settings } from 'lucide-react';

interface InfraestructuraStatCardProps {
  label: string;
  value: string | number;
  icon?: 'facilities' | 'equipment' | 'maintenance' | 'alerts';
  subValue?: string;
}

const iconComponents = {
  facilities: Building2,
  equipment: Settings,
  maintenance: Wrench,
  alerts: AlertTriangle,
};

const iconColors = {
  facilities: 'bg-blue-100 text-blue-600',
  equipment: 'bg-green-100 text-green-600',
  maintenance: 'bg-purple-100 text-purple-600',
  alerts: 'bg-amber-100 text-amber-600',
};

export default function InfraestructuraStatCard({
  label,
  value,
  icon = 'facilities',
  subValue,
}: InfraestructuraStatCardProps) {
  const IconComponent = iconComponents[icon] || Building2;
  const iconColor = iconColors[icon] || iconColors.facilities;

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
