import { ArrowRight, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { SystemModule } from '../../types/common.types';

interface ModuleSummaryCardProps {
  title: string;
  module: SystemModule | 'finanzas' | 'trabajadores' | 'insumos' | 'finca';
  icon: React.ReactNode;
  mainValue: string | number;
  mainLabel: string;
  secondaryItems: {
    label: string;
    value: string | number;
  }[];
  pendingTasks?: number;
  status?: 'good' | 'warning' | 'critical';
  path: string;
  color: string;
}

export default function ModuleSummaryCard({
  title,
  icon,
  mainValue,
  mainLabel,
  secondaryItems,
  pendingTasks,
  status = 'good',
  path,
  color,
}: ModuleSummaryCardProps) {
  const statusColors = {
    good: 'text-green-600',
    warning: 'text-amber-600',
    critical: 'text-red-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${color}`}>
            {icon}
          </div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        {pendingTasks !== undefined && pendingTasks > 0 && (
          <div className={`flex items-center gap-1 text-xs ${statusColors[status]}`}>
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{pendingTasks} pendientes</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-2xl font-bold text-gray-900">{mainValue}</p>
          <p className="text-xs text-gray-500">{mainLabel}</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {secondaryItems.map((item, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-2">
              <p className="text-sm font-semibold text-gray-900">{item.value}</p>
              <p className="text-xs text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <Link
        to={path}
        className="mt-3 flex items-center justify-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium py-2 rounded-lg hover:bg-blue-50 transition-colors"
      >
        <span>Ver modulo</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
