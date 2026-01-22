import { ChevronRight, Calendar, Wrench } from 'lucide-react';
import type { MaintenanceRecord } from '../../types/infraestructura.types';

interface MaintenanceListProps {
  records: MaintenanceRecord[];
  maxItems?: number;
}

const priorityColors = {
  high: 'bg-red-500',
  medium: 'bg-amber-500',
  low: 'bg-green-500',
};

const statusColors = {
  scheduled: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-amber-100 text-amber-700',
  completed: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
};

const statusLabels = {
  scheduled: 'Programado',
  in_progress: 'En Progreso',
  completed: 'Completado',
  overdue: 'Atrasado',
};

export default function MaintenanceList({ records, maxItems = 5 }: MaintenanceListProps) {
  const pendingRecords = records.filter((r) => r.status !== 'completed').slice(0, maxItems);

  return (
    <div className="card p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          Mantenimientos Pendientes
        </h3>
        <button className="btn-ghost text-xs gap-1 px-3 py-2">
          Ver Todos
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {pendingRecords.length > 0 ? (
          pendingRecords.map((record) => (
            <div key={record.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full mt-2 ${priorityColors[record.priority]}`} />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">
                  {record.targetName}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  {record.description}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[record.status]}`}>
                    {statusLabels[record.status]}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {new Date(record.scheduledDate).toLocaleDateString('es-CR', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </div>
                </div>
              </div>

              <Wrench className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-gray-500 py-4">Sin mantenimientos pendientes</p>
        )}
      </div>
    </div>
  );
}
