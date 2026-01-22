import { Calendar, Clock, User, Package, ChevronRight } from 'lucide-react';
import { getActionTypeLabel, moduleOptions } from '../../../schemas/action.schema';
import type { GenericAction } from '../../../types/common.types';

interface ActionCardProps {
  action: GenericAction;
  onClick?: () => void;
  showModule?: boolean;
}

function getModuleBadgeColor(module: string): string {
  const colors: Record<string, string> = {
    agro: 'bg-green-100 text-green-700',
    pecuario: 'bg-amber-100 text-amber-700',
    apicultura: 'bg-yellow-100 text-yellow-700',
    procesamiento: 'bg-purple-100 text-purple-700',
    activos: 'bg-blue-100 text-blue-700',
    infraestructura: 'bg-gray-100 text-gray-700',
    general: 'bg-slate-100 text-slate-700',
  };
  return colors[module] || colors.general;
}

function getModuleLabel(module: string): string {
  const found = moduleOptions.find(m => m.value === module);
  return found?.label || module;
}

function formatDate(date: Date | string): string {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString('es-CR', {
    day: 'numeric',
    month: 'short',
  });
}

export default function ActionCard({ action, onClick, showModule = true }: ActionCardProps) {
  const actionLabel = getActionTypeLabel(action.module, action.actionType);

  return (
    <div
      className="card p-4 hover:shadow-md transition-all duration-300 cursor-pointer animate-fade-in"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{actionLabel}</h3>
          {action.description && (
            <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
              {action.description}
            </p>
          )}
        </div>
        {showModule && (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getModuleBadgeColor(action.module)}`}>
            {getModuleLabel(action.module)}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span>{formatDate(action.date)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-gray-400" />
          <span>{action.workerName}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          <span>{action.totalHours}h</span>
        </div>
        {action.insumos.length > 0 && (
          <div className="flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-gray-400" />
            <span>{action.insumos.length} insumos</span>
          </div>
        )}
      </div>

      {action.targetName && (
        <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {action.targetName}
          </span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
      )}
    </div>
  );
}
