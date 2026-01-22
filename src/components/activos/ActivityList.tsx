import { Package, ArrowRightLeft, Wrench, TrendingUp, Trash2 } from 'lucide-react';
import type { AssetActivity } from '../../types/activos.types';

interface ActivityListProps {
  activities: AssetActivity[];
}

const activityIcons = {
  acquisition: Package,
  transfer: ArrowRightLeft,
  maintenance: Wrench,
  revaluation: TrendingUp,
  disposal: Trash2,
};

const activityColors = {
  acquisition: 'bg-green-100 text-green-600',
  transfer: 'bg-blue-100 text-blue-600',
  maintenance: 'bg-amber-100 text-amber-600',
  revaluation: 'bg-purple-100 text-purple-600',
  disposal: 'bg-red-100 text-red-600',
};

const activityLabels = {
  acquisition: 'Adquisición',
  transfer: 'Traslado',
  maintenance: 'Mantenimiento',
  revaluation: 'Revalorización',
  disposal: 'Baja',
};

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `₡${(value / 1000000).toFixed(1)}M`;
  }
  return `₡${(value / 1000).toFixed(0)}K`;
}

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
                  {activity.assetName}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {activity.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-medium text-gray-600">
                    {activityLabels[activity.type]}
                  </span>
                  {activity.amount && (
                    <>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs font-medium text-green-600">
                        {formatCurrency(activity.amount)}
                      </span>
                    </>
                  )}
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
