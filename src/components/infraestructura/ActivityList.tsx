import { Wrench, AlertCircle, Search, Package } from 'lucide-react';
import type { InfrastructureActivity } from '../../types/infraestructura.types';

interface ActivityListProps {
  activities: InfrastructureActivity[];
}

const activityIcons = {
  maintenance: Wrench,
  repair: AlertCircle,
  inspection: Search,
  installation: Package,
};

const activityColors = {
  maintenance: 'bg-purple-100 text-purple-600',
  repair: 'bg-orange-100 text-orange-600',
  inspection: 'bg-blue-100 text-blue-600',
  installation: 'bg-green-100 text-green-600',
};

const statusColors = {
  completed: 'text-green-600',
  in_progress: 'text-amber-600',
  scheduled: 'text-blue-600',
};

const statusLabels = {
  completed: 'Completado',
  in_progress: 'En progreso',
  scheduled: 'Programado',
};

export default function ActivityList({ activities }: ActivityListProps) {
  return (
    <div className="card p-5 animate-fade-in">
      <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-4">
        Actividad Reciente
      </h3>

      <div className="space-y-4">
        {activities.map((activity) => {
          const IconComponent = activityIcons[activity.type];
          const iconColor = activityColors[activity.type];

          return (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${iconColor}`}>
                <IconComponent className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">
                  {activity.targetName}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {activity.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-medium ${statusColors[activity.status]}`}>
                    {statusLabels[activity.status]}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">
                    {new Date(activity.date).toLocaleDateString('es-CR', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
