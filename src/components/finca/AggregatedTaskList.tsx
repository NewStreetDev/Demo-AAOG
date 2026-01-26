import { Calendar, Clock, User, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { AggregatedTask } from '../../types/finca.types';

interface AggregatedTaskListProps {
  tasks: AggregatedTask[];
  maxItems?: number;
}

const priorityColors = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-green-100 text-green-700',
};

const priorityLabels = {
  high: 'Alta',
  medium: 'Media',
  low: 'Baja',
};

const statusIcons = {
  pending: <Clock className="w-4 h-4 text-gray-400" />,
  in_progress: <AlertCircle className="w-4 h-4 text-blue-500" />,
  completed: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  cancelled: <CheckCircle2 className="w-4 h-4 text-gray-400" />,
};

const moduleColors: Record<string, string> = {
  agro: 'border-l-lime-500',
  pecuario: 'border-l-orange-500',
  apicultura: 'border-l-amber-500',
  procesamiento: 'border-l-purple-500',
  activos: 'border-l-cyan-500',
  infraestructura: 'border-l-slate-500',
  general: 'border-l-blue-500',
};

function formatDate(date: Date): string {
  const d = new Date(date);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (d.toDateString() === today.toDateString()) {
    return 'Hoy';
  }
  if (d.toDateString() === tomorrow.toDateString()) {
    return 'Manana';
  }

  return d.toLocaleDateString('es-CR', {
    day: 'numeric',
    month: 'short',
  });
}

function isOverdue(date: Date, status: string): boolean {
  if (status === 'completed' || status === 'cancelled') return false;
  return new Date(date) < new Date();
}

export default function AggregatedTaskList({ tasks, maxItems = 10 }: AggregatedTaskListProps) {
  const displayTasks = tasks.slice(0, maxItems);

  if (displayTasks.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tareas Pendientes</h3>
        <div className="text-center py-8 text-gray-500">
          <CheckCircle2 className="w-12 h-12 mx-auto text-green-300 mb-2" />
          <p>No hay tareas pendientes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Tareas Pendientes</h3>
        <p className="text-sm text-gray-500">De todos los modulos</p>
      </div>

      <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
        {displayTasks.map((task) => {
          const overdue = isOverdue(task.dueDate, task.status);
          const borderColor = moduleColors[task.module] || moduleColors.general;

          return (
            <div
              key={task.id}
              className={`p-4 hover:bg-gray-50 transition-colors border-l-4 ${borderColor}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {statusIcons[task.status]}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                        {task.moduleName}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>
                        {priorityLabels[task.priority]}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className={`flex items-center gap-1 text-xs ${
                    overdue ? 'text-red-600 font-medium' : 'text-gray-500'
                  }`}>
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(task.dueDate)}</span>
                  </div>
                  {task.assignedTo && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <User className="w-3 h-3" />
                      <span className="truncate max-w-[80px]">{task.assignedTo}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {tasks.length > maxItems && (
        <div className="p-3 border-t border-gray-100 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1">
            Ver todas ({tasks.length})
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
