import { ChevronRight, Clock, User } from 'lucide-react';
import type { BatchSummary } from '../../types/procesamiento.types';

interface BatchListProps {
  batches: BatchSummary[];
}

const statusConfig = {
  pending: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Pendiente' },
  in_progress: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'En Proceso' },
  quality_control: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Control QC' },
  completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completado' },
  rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rechazado' },
  paused: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pausado' },
};

const progressBarColors = {
  pending: 'bg-gray-400',
  in_progress: 'bg-orange-500',
  quality_control: 'bg-purple-500',
  completed: 'bg-green-500',
  rejected: 'bg-red-500',
  paused: 'bg-amber-500',
};

export default function BatchList({ batches }: BatchListProps) {
  return (
    <div className="card p-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          Lotes Activos
        </h3>
        <button className="btn-ghost text-xs gap-1 px-3 py-2">
          Ver Todos
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Batch List */}
      <div className="space-y-3">
        {batches.length > 0 ? (
          batches.map((batch) => {
            const config = statusConfig[batch.status];
            const progressColor = progressBarColors[batch.status];

            return (
              <div key={batch.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-900">{batch.batchCode}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
                        {config.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {batch.inputProductName} → {batch.outputProductName || 'Procesando...'}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {batch.inputQuantity} {batch.inputUnit}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Progreso</span>
                    <span>{batch.progress}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${progressColor}`}
                      style={{ width: `${batch.progress}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {batch.processingLineName}
                    </span>
                    {batch.operator && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {batch.operator}
                      </span>
                    )}
                  </div>
                  <span>
                    {new Date(batch.expectedEndDate).toLocaleDateString('es-CR', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-sm text-gray-500 py-4">No hay lotes activos</p>
        )}
      </div>
    </div>
  );
}
