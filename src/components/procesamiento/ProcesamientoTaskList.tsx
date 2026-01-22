import { ChevronRight, Calendar, CheckCircle, Settings, Factory, Gauge } from 'lucide-react';
import type { ProcesamientoTask } from '../../types/procesamiento.types';

interface ProcesamientoTaskListProps {
  tasks: ProcesamientoTask[];
}

const typeIcons = {
  quality_control: CheckCircle,
  line_maintenance: Settings,
  batch_processing: Factory,
  equipment_calibration: Gauge,
};

const typeColors = {
  quality_control: 'bg-purple-100 text-purple-600',
  line_maintenance: 'bg-amber-100 text-amber-600',
  batch_processing: 'bg-blue-100 text-blue-600',
  equipment_calibration: 'bg-indigo-100 text-indigo-600',
};

const priorityColors = {
  high: 'bg-red-500',
  medium: 'bg-amber-500',
  low: 'bg-gray-400',
};

export default function ProcesamientoTaskList({ tasks }: ProcesamientoTaskListProps) {
  const pendingTasks = tasks.filter((t) => t.status !== 'completed').slice(0, 5);

  return (
    <div className="card p-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          Tareas Pendientes
        </h3>
        <button className="btn-ghost text-xs gap-1 px-3 py-2">
          Ver Todas
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {pendingTasks.length > 0 ? (
          pendingTasks.map((task) => {
            const IconComponent = typeIcons[task.type] || Factory;
            const iconColor = typeColors[task.type] || typeColors.batch_processing;
            const priorityColor = priorityColors[task.priority];

            return (
              <div key={task.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                {/* Priority indicator */}
                <div className={`w-1.5 h-1.5 rounded-full mt-2 ${priorityColor}`} />

                {/* Icon */}
                <div className={`p-2 rounded-lg ${iconColor}`}>
                  <IconComponent className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {task.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(task.dueDate).toLocaleDateString('es-CR', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </div>
                    {task.assignedTo && (
                      <span className="text-xs text-gray-500">{task.assignedTo}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-sm text-gray-500 py-4">Sin tareas pendientes</p>
        )}
      </div>
    </div>
  );
}
