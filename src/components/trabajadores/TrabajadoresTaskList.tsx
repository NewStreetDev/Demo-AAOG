import { ChevronRight, Calendar } from 'lucide-react';
import type { TrabajadoresTask } from '../../types/trabajadores.types';

interface TrabajadoresTaskListProps {
  tasks: TrabajadoresTask[];
  maxItems?: number;
}

const priorityColors = {
  high: 'bg-red-500',
  medium: 'bg-amber-500',
  low: 'bg-green-500',
};

const statusColors = {
  pending: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusLabels = {
  pending: 'Pendiente',
  in_progress: 'En progreso',
  completed: 'Completada',
  cancelled: 'Cancelada',
};

export default function TrabajadoresTaskList({ tasks, maxItems = 5 }: TrabajadoresTaskListProps) {
  const pendingTasks = tasks.filter((t) => t.status !== 'completed').slice(0, maxItems);

  return (
    <div className="card p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          Tareas Asignadas
        </h3>
        <button className="btn-ghost text-xs gap-1 px-3 py-2">
          Ver Todas
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {pendingTasks.length > 0 ? (
          pendingTasks.map((task) => (
            <div key={task.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full mt-2 ${priorityColors[task.priority]}`} />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">
                  {task.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {task.assignedTo}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[task.status]}`}>
                    {statusLabels[task.status]}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {new Date(task.dueDate).toLocaleDateString('es-CR', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-gray-500 py-4">Sin tareas pendientes</p>
        )}
      </div>
    </div>
  );
}
