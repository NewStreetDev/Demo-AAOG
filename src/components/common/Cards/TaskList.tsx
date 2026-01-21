import { CheckCircle2, ChevronRight, Circle } from 'lucide-react';
import type { Task } from '../../../types/dashboard.types';

interface TaskListProps {
  tasks: Task[];
}

const priorityColors: Record<string, string> = {
  high: 'text-red-600',
  medium: 'text-orange-600',
  low: 'text-gray-600',
};

export default function TaskList({ tasks }: TaskListProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-gray-900">Tareas Pendientes</h3>
        <button className="text-sm text-green-700 hover:text-green-700-dark font-medium flex items-center gap-1 px-3 py-2 -mr-3 rounded-lg hover:bg-gray-50 transition-colors">
          Ver Todas
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
          >
            <button
              className="flex-shrink-0 p-2 -m-2 text-gray-400 hover:text-green-600 transition-colors rounded-lg hover:bg-gray-100"
              aria-label={task.status === 'completed' ? 'Marcar como pendiente' : 'Marcar como completada'}
            >
              {task.status === 'completed' ? (
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              ) : (
                <Circle className="w-6 h-6" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                {task.title}
              </p>
              {task.description && (
                <p className="text-xs text-gray-500 mt-1">{task.description}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs font-medium ${priorityColors[task.priority]}`}>
                  {task.priority === 'high' && 'Alta prioridad'}
                  {task.priority === 'medium' && 'Media prioridad'}
                  {task.priority === 'low' && 'Baja prioridad'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
