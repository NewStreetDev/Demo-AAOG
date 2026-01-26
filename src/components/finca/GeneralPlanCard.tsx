import { Calendar, Clock, User, DollarSign, ChevronRight, AlertCircle } from 'lucide-react';
import type { GeneralPlan } from '../../types/finca.types';

interface GeneralPlanCardProps {
  plan: GeneralPlan;
  onClick: () => void;
}

const actionTypeLabels: Record<string, string> = {
  mantenimiento: 'Mantenimiento',
  siembra: 'Siembra',
  cosecha: 'Cosecha',
  tratamiento: 'Tratamiento',
  vacunacion: 'Vacunacion',
  revision: 'Revision',
  compra: 'Compra',
  venta: 'Venta',
  reparacion: 'Reparacion',
  capacitacion: 'Capacitacion',
  otro: 'Otro',
};

const actionTypeColors: Record<string, string> = {
  mantenimiento: 'bg-slate-100 text-slate-700',
  siembra: 'bg-lime-100 text-lime-700',
  cosecha: 'bg-amber-100 text-amber-700',
  tratamiento: 'bg-purple-100 text-purple-700',
  vacunacion: 'bg-blue-100 text-blue-700',
  revision: 'bg-cyan-100 text-cyan-700',
  compra: 'bg-emerald-100 text-emerald-700',
  venta: 'bg-green-100 text-green-700',
  reparacion: 'bg-orange-100 text-orange-700',
  capacitacion: 'bg-indigo-100 text-indigo-700',
  otro: 'bg-gray-100 text-gray-700',
};

const priorityColors: Record<string, string> = {
  high: 'border-l-red-500',
  medium: 'border-l-amber-500',
  low: 'border-l-green-500',
};

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  in_progress: 'En Progreso',
  completed: 'Completado',
  cancelled: 'Cancelado',
};

const statusColors: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('es-CR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function isOverdue(date: Date, status: string): boolean {
  if (status === 'completed' || status === 'cancelled') return false;
  return new Date(date) < new Date();
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function GeneralPlanCard({ plan, onClick }: GeneralPlanCardProps) {
  const overdue = isOverdue(plan.scheduledDate, plan.status);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 bg-white rounded-xl border border-gray-200 border-l-4 ${priorityColors[plan.priority]} hover:shadow-md transition-all duration-200`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${actionTypeColors[plan.actionType]}`}>
              {actionTypeLabels[plan.actionType]}
            </span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[plan.status]}`}>
              {statusLabels[plan.status]}
            </span>
          </div>

          <h4 className="font-semibold text-gray-900 line-clamp-1">{plan.title}</h4>

          {plan.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{plan.description}</p>
          )}

          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <div className={`flex items-center gap-1 text-xs ${overdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(plan.scheduledDate)}</span>
              {overdue && <AlertCircle className="w-3.5 h-3.5" />}
            </div>

            {plan.estimatedDuration && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                <span>{plan.estimatedDuration}h</span>
              </div>
            )}

            {plan.assignedTo && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <User className="w-3.5 h-3.5" />
                <span className="truncate max-w-[100px]">{plan.assignedTo}</span>
              </div>
            )}

            {plan.estimatedCost && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <DollarSign className="w-3.5 h-3.5" />
                <span>{formatCurrency(plan.estimatedCost)}</span>
              </div>
            )}
          </div>

          {plan.targetDivisionName && (
            <div className="mt-2 text-xs text-gray-500">
              Division: <span className="font-medium">{plan.targetDivisionName}</span>
            </div>
          )}
        </div>

        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
      </div>
    </button>
  );
}
