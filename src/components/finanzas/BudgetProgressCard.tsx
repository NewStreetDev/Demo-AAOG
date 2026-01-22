import type { BudgetComparison } from '../../types/finanzas.types';

interface BudgetProgressCardProps {
  budget: BudgetComparison;
}

const statusConfig = {
  on_track: { bg: 'bg-green-100', text: 'text-green-700', label: 'En Orden', bar: 'bg-green-500' },
  warning: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Alerta', bar: 'bg-amber-500' },
  exceeded: { bg: 'bg-red-100', text: 'text-red-700', label: 'Excedido', bar: 'bg-red-500' },
};

export default function BudgetProgressCard({ budget }: BudgetProgressCardProps) {
  const config = statusConfig[budget.status];
  const variance = Math.abs(budget.variance);

  return (
    <div className="card p-4 animate-fade-in">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-bold text-gray-900">{budget.category}</h4>
            <p className="text-xs text-gray-500 mt-0.5">
              {budget.percentageUsed.toFixed(1)}% utilizado
            </p>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
            {config.label}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${config.bar}`}
              style={{ width: `${Math.min(budget.percentageUsed, 100)}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <p className="text-gray-500">Presupuesto</p>
            <p className="font-semibold text-gray-900">₡{(budget.budgeted / 1000000).toFixed(1)}M</p>
          </div>
          <div>
            <p className="text-gray-500">Gastado</p>
            <p className="font-semibold text-gray-900">₡{(budget.actual / 1000000).toFixed(1)}M</p>
          </div>
          <div>
            <p className="text-gray-500">Variación</p>
            <p className={`font-semibold ${budget.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {budget.variance >= 0 ? '+' : '-'}₡{(variance / 1000000).toFixed(1)}M
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
