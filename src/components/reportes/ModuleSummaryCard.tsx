import type { ModuleComparison } from '../../types/reportes.types';

interface ModuleSummaryCardProps {
  module: ModuleComparison;
}

export default function ModuleSummaryCard({ module }: ModuleSummaryCardProps) {
  return (
    <div className="card p-4 animate-fade-in hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: module.color }}
          >
            {module.moduleName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">{module.moduleName}</h4>
            <p className="text-xs text-gray-500">
              {module.production.toLocaleString()} {module.productionUnit}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Efficiency */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-500">Eficiencia</span>
            <span className="text-xs font-bold text-gray-900">{module.efficiency}%</span>
          </div>
          <div className="bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${module.efficiency}%` }}
            />
          </div>
        </div>

        {/* Profitability */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-500">Rentabilidad</span>
            <span className="text-xs font-bold text-gray-900">{module.profitability.toFixed(1)}%</span>
          </div>
          <div className="bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${Math.min(module.profitability, 100)}%` }}
            />
          </div>
        </div>

        {/* Revenue */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Ingresos</span>
            <span className="text-sm font-bold text-gray-900">
              ₡{(module.revenue / 1000000).toFixed(1)}M
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            {module.revenuePercentage}% del total
          </p>
        </div>
      </div>
    </div>
  );
}
