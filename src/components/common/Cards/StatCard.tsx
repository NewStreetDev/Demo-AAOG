import { Home, Users, Package, DollarSign } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: 'farms' | 'workers' | 'production' | 'income';
  color?: string;
}

const iconComponents = {
  farms: Home,
  workers: Users,
  production: Package,
  income: DollarSign,
};

const iconColors = {
  farms: 'bg-green-100 text-green-600',
  workers: 'bg-blue-100 text-blue-600',
  production: 'bg-amber-100 text-amber-600',
  income: 'bg-purple-100 text-purple-600',
};

export default function StatCard({ label, value, icon = 'farms' }: StatCardProps) {
  const IconComponent = iconComponents[icon] || Home;
  const iconColor = iconColors[icon] || iconColors.farms;

  return (
    <div className="card p-6 animate-fade-in hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between">
        {/* Content */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {label}
          </p>
          <p className="text-3xl font-bold text-gray-900 tracking-tight">
            {value}
          </p>
        </div>

        {/* Icon */}
        <div className={`p-3 rounded-xl ${iconColor}`}>
          <IconComponent className="w-6 h-6" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}
