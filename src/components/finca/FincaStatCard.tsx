import {
  Home,
  MapPin,
  Wheat,
  Beef,
  Bug,
  Users,
  Package,
  Building,
  Landmark,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

type IconType =
  | 'finca'
  | 'area'
  | 'agro'
  | 'pecuario'
  | 'apicultura'
  | 'workers'
  | 'insumos'
  | 'infraestructura'
  | 'activos'
  | 'income'
  | 'expense'
  | 'profit';

interface FincaStatCardProps {
  label: string;
  value: string | number;
  icon: IconType;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

const iconComponents: Record<IconType, typeof Home> = {
  finca: Home,
  area: MapPin,
  agro: Wheat,
  pecuario: Beef,
  apicultura: Bug,
  workers: Users,
  insumos: Package,
  infraestructura: Building,
  activos: Landmark,
  income: DollarSign,
  expense: DollarSign,
  profit: TrendingUp,
};

const iconColors: Record<IconType, string> = {
  finca: 'bg-green-100 text-green-600',
  area: 'bg-blue-100 text-blue-600',
  agro: 'bg-lime-100 text-lime-600',
  pecuario: 'bg-orange-100 text-orange-600',
  apicultura: 'bg-amber-100 text-amber-600',
  workers: 'bg-indigo-100 text-indigo-600',
  insumos: 'bg-purple-100 text-purple-600',
  infraestructura: 'bg-slate-100 text-slate-600',
  activos: 'bg-cyan-100 text-cyan-600',
  income: 'bg-emerald-100 text-emerald-600',
  expense: 'bg-red-100 text-red-600',
  profit: 'bg-green-100 text-green-600',
};

export default function FincaStatCard({
  label,
  value,
  icon,
  subValue,
  trend,
  trendValue,
}: FincaStatCardProps) {
  const IconComponent = iconComponents[icon] || Home;
  const iconColor = iconColors[icon] || iconColors.finca;

  return (
    <div className="card p-5 animate-fade-in hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-1 flex-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {label}
          </p>
          <p className="text-2xl font-bold text-gray-900 tracking-tight">
            {value}
          </p>
          {subValue && (
            <p className="text-xs text-gray-500">
              {subValue}
            </p>
          )}
          {trend && trendValue && (
            <div className="flex items-center gap-1 mt-1">
              {trend === 'up' ? (
                <TrendingUp className="w-3 h-3 text-green-500" />
              ) : trend === 'down' ? (
                <TrendingDown className="w-3 h-3 text-red-500" />
              ) : null}
              <span className={`text-xs font-medium ${
                trend === 'up' ? 'text-green-600' :
                trend === 'down' ? 'text-red-600' :
                'text-gray-500'
              }`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>

        <div className={`p-2.5 rounded-xl ${iconColor}`}>
          <IconComponent className="w-5 h-5" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}
