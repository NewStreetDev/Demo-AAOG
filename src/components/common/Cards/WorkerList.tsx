import { ChevronRight } from 'lucide-react';
import type { WorkerSummary } from '../../../types/dashboard.types';

interface WorkerListProps {
  workers: WorkerSummary[];
}

export default function WorkerList({ workers }: WorkerListProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Mis Trabajadores</h3>
        <button className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
          Ver Todos
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-3">
        {workers.map((worker) => (
          <div
            key={worker.id}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-semibold">
              {worker.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{worker.name}</p>
              <p className="text-xs text-gray-500">{worker.role}</p>
            </div>
            {worker.status === 'active' && (
              <div className="w-2 h-2 rounded-full bg-green-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
