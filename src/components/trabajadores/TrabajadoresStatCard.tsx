import { Users, BarChart3, Clock, CheckCircle } from 'lucide-react';

interface TrabajadoresStatCardProps {
  label: string;
  value: string | number;
  icon?: 'workers' | 'attendance' | 'hours' | 'tasks';
  subValue?: string;
}

const iconComponents = {
  workers: Users,
  attendance: BarChart3,
  hours: Clock,
  tasks: CheckCircle,
};

const iconColors = {
  workers: 'bg-blue-100 text-blue-600',
  attendance: 'bg-green-100 text-green-600',
  hours: 'bg-purple-100 text-purple-600',
  tasks: 'bg-amber-100 text-amber-600',
};

export default function TrabajadoresStatCard({
  label,
  value,
  icon = 'workers',
  subValue,
}: TrabajadoresStatCardProps) {
  const IconComponent = iconComponents[icon] || Users;
  const iconColor = iconColors[icon] || iconColors.workers;

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
