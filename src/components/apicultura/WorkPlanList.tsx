import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  PlayCircle,
  XCircle,
  ClipboardList,
} from 'lucide-react';
import type { WorkPlan } from '../../types/apicultura.types';

interface WorkPlanListProps {
  workPlans: WorkPlan[];
  onWorkPlanClick?: (workPlan: WorkPlan) => void;
}

const activityTypeLabels: Record<string, string> = {
  medication: 'Medicamentos',
  panel_change: 'Cambio Panales',
  feeding: 'Alimentación',
  revision: 'Revisión',
  queen_change: 'Cambio Reinas',
  reproduction: 'Reproducción',
  harvest: 'Cosecha',
  maintenance: 'Mantenimiento',
  other: 'Otros',
};

const priorityConfig = {
  high: { label: 'Alta', color: 'bg-red-100 text-red-700 border-red-200' },
  medium: { label: 'Media', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  low: { label: 'Baja', color: 'bg-green-100 text-green-700 border-green-200' },
};

const statusConfig = {
  pending: {
    label: 'Pendiente',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    icon: Clock,
  },
  in_progress: {
    label: 'En Progreso',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    icon: PlayCircle,
  },
  completed: {
    label: 'Completado',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    icon: CheckCircle2,
  },
  cancelled: {
    label: 'Cancelado',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    icon: XCircle,
  },
};

export default function WorkPlanList({ workPlans, onWorkPlanClick }: WorkPlanListProps) {
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (d.toDateString() === today.toDateString()) {
      return 'Hoy';
    }
    if (d.toDateString() === tomorrow.toDateString()) {
      return 'Mana';
    }
    return d.toLocaleDateString('es-CR', {
      day: 'numeric',
      month: 'short',
    });
  };

  const isOverdue = (date: Date | string, status: string) => {
    if (status === 'completed' || status === 'cancelled') return false;
    return new Date(date) < new Date();
  };

  if (workPlans.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-100 rounded-lg">
            <ClipboardList className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Planes de Trabajo</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No hay planes de trabajo registrados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-amber-100 rounded-lg">
          <ClipboardList className="w-5 h-5 text-amber-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Planes de Trabajo</h3>
        <span className="ml-auto text-sm text-gray-500">
          {workPlans.filter(wp => wp.status === 'pending' || wp.status === 'in_progress').length} activos
        </span>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {workPlans.map((workPlan) => {
          const status = statusConfig[workPlan.status];
          const priority = priorityConfig[workPlan.priority];
          const StatusIcon = status.icon;
          const overdue = isOverdue(workPlan.scheduledDate, workPlan.status);

          return (
            <div
              key={workPlan.id}
              onClick={() => onWorkPlanClick?.(workPlan)}
              className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                overdue
                  ? 'border-red-200 bg-red-50/50'
                  : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${status.bgColor} ${status.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${priority.color}`}>
                      {priority.label}
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900 truncate">
                    {workPlan.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-sm text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className={`w-3.5 h-3.5 ${overdue ? 'text-red-500' : ''}`} />
                      <span className={overdue ? 'text-red-600 font-medium' : ''}>
                        {formatDate(workPlan.scheduledDate)}
                        {overdue && ' (Atrasado)'}
                      </span>
                    </span>
                    {workPlan.apiarioName && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {workPlan.apiarioName}
                        {workPlan.colmenaCode && ` - ${workPlan.colmenaCode}`}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600">
                    {activityTypeLabels[workPlan.activityType]}
                  </span>
                </div>
              </div>
              {workPlan.assignedTo && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    Asignado a: <span className="font-medium text-gray-700">{workPlan.assignedTo}</span>
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
