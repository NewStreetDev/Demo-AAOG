import { Star } from 'lucide-react';
import type { WorkerPerformance } from '../../types/trabajadores.types';

interface WorkerPerformanceListProps {
  workers: WorkerPerformance[];
}

function getPerformanceColor(rating: number): string {
  if (rating >= 4.5) return 'text-green-600';
  if (rating >= 4) return 'text-blue-600';
  if (rating >= 3) return 'text-amber-600';
  return 'text-red-600';
}

export default function WorkerPerformanceList({ workers }: WorkerPerformanceListProps) {
  return (
    <div className="card p-5 animate-fade-in">
      <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-4">
        Desempeño de Personal
      </h3>

      <div className="space-y-4">
        {workers.map((worker) => (
          <div key={worker.workerId} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-sm mb-2">
                {worker.workerName}
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div>
                  Tareas: <span className="font-medium text-gray-900">{worker.completedTasks}/{worker.totalTasksAssigned}</span>
                </div>
                <div>
                  Finalización: <span className="font-medium text-gray-900">{worker.completionRate.toFixed(0)}%</span>
                </div>
                <div>
                  Asistencia: <span className="font-medium text-gray-900">{worker.attendanceRate}%</span>
                </div>
                <div>
                  Promedio: <span className="font-medium text-gray-900">{worker.averageHoursPerDay.toFixed(1)} h/día</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center ml-4">
              <div className="flex items-center gap-0.5 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.round(worker.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className={`text-lg font-bold ${getPerformanceColor(worker.rating)}`}>
                {worker.rating.toFixed(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
