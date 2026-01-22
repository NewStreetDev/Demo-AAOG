import { TrendingUp, TrendingDown, DollarSign, BarChart3, Package, Percent } from 'lucide-react';

interface ReportesStatCardProps {
  label: string;
  value: string | number;
  icon?: 'income' | 'profit' | 'production' | 'margin';
  subValue?: string;
  trend?: number;
  trendLabel?: string;
}

const iconComponents = {
  income: DollarSign,
  profit: TrendingUp,
  production: Package,
  margin: Percent,
};

const iconColors = {
  income: 'bg-green-100 text-green-600',
  profit: 'bg-blue-100 text-blue-600',
  production: 'bg-amber-100 text-amber-600',
  margin: 'bg-purple-100 text-purple-600',
};

export default function ReportesStatCard({
  label,
  value,
  icon = 'income',
  subValue,
  trend,
  trendLabel,
}: ReportesStatCardProps) {
  const IconComponent = iconComponents[icon] || BarChart3;
  const iconColor = iconColors[icon] || iconColors.income;
  const isPositiveTrend = trend && trend > 0;

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
          {trend !== undefined && (
            <div className="flex items-center gap-1 pt-1">
              {isPositiveTrend ? (
                <TrendingUp className="w-3.5 h-3.5 text-green-600" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-red-600" />
              )}
              <span className={`text-xs font-semibold ${isPositiveTrend ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(trend)}% {trendLabel || 'vs período anterior'}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${iconColor}`}>
          <IconComponent className="w-5 h-5" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}
