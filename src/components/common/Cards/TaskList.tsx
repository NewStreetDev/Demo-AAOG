import { ChevronRight } from 'lucide-react';
import type { Task } from '../../../types/dashboard.types';

interface TaskListProps {
  tasks: Task[];
}

const priorityDotColors: Record<string, string> = {
  high: 'bg-red-500',
  medium: 'bg-amber-500',
  low: 'bg-green-500',
};

export default function TaskList({ tasks }: TaskListProps) {
  const pendingTasks = tasks.filter(t => t.status !== 'completed');

  return (
    <div className="card p-6 animate-fade-in h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">
            Tareas Pendientes
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {pendingTasks.length} tareas activas
          </p>
        </div>
        <button className="btn-ghost text-xs gap-1 px-3 py-2">
          Ver Más
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Task list - compact design with color dots */}
      <div className="space-y-2 flex-1">
        {pendingTasks.slice(0, 5).map((task, index) => (
          <div
            key={task.id}
            className="group flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 cursor-pointer animate-slide-up"
            style={{ animationDelay: `${index * 40}ms` }}
          >
            {/* Priority dot */}
            <div
              className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${priorityDotColors[task.priority]}`}
            />

            {/* Task info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate group-hover:text-gray-950">
                {task.title}
              </p>
              {task.description && (
                <p className="text-xs text-gray-500 truncate">
                  {task.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
