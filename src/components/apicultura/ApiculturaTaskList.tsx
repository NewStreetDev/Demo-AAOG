import { ChevronRight, Calendar } from 'lucide-react';
import type { ApiculturaTask } from '../../types/apicultura.types';

interface ApiculturaTaskListProps {
  tasks: ApiculturaTask[];
  maxItems?: number;
  onViewAll?: () => void;
}

function getPriorityColor(priority: ApiculturaTask['priority']): string {
  const colors = {
    high: 'bg-red-500',
    medium: 'bg-amber-500',
    low: 'bg-green-500',
  };
  return colors[priority];
}

function getTaskTypeIcon(type: ApiculturaTask['type']): string {
  const icons = {
    revision: '🔍',
    feeding: '🍯',
    medication: '💊',
    harvest: '🪣',
  };
  return icons[type];
}

export default function ApiculturaTaskList({ tasks, maxItems = 5, onViewAll }: ApiculturaTaskListProps) {
  const displayTasks = tasks.slice(0, maxItems);
  const hasMore = tasks.length > maxItems;

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const today = new Date();
    const diffDays = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Mañana';
    if (diffDays < 7) return `En ${diffDays} días`;

    return d.toLocaleDateString('es-CR', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="card p-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          Tareas Pendientes
        </h3>
        <span className="text-xs font-medium text-apicultura bg-amber-100 px-2 py-1 rounded-full">
          {tasks.length} pendientes
        </span>
      </div>

      {/* List */}
      <div className="space-y-2">
        {displayTasks.map((task) => {
          const priorityColor = getPriorityColor(task.priority);
          const typeIcon = getTaskTypeIcon(task.type);

          return (
            <div
              key={task.id}
              className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            >
              {/* Priority Indicator */}
              <div className={`w-2 h-2 rounded-full mt-2 ${priorityColor}`} />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{typeIcon}</span>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {task.title}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {task.apiarioName}
                  {task.colmenaCode && ` • ${task.colmenaCode}`}
                </p>
              </div>

              {/* Date */}
              <div className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All */}
      {hasMore && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={onViewAll}
            className="btn-ghost text-xs gap-1 w-full justify-center py-2"
          >
            Ver todas las tareas
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
