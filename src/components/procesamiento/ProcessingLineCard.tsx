import { Settings, AlertTriangle, CheckCircle, Pause } from 'lucide-react';
import type { ProcessingLine } from '../../types/procesamiento.types';

interface ProcessingLineCardProps {
  line: ProcessingLine;
}

const statusConfig = {
  active: { icon: CheckCircle, bg: 'bg-green-100', text: 'text-green-700', label: 'Activa' },
  idle: { icon: Pause, bg: 'bg-gray-100', text: 'text-gray-700', label: 'Inactiva' },
  maintenance: { icon: Settings, bg: 'bg-amber-100', text: 'text-amber-700', label: 'Mantenimiento' },
  calibration: { icon: AlertTriangle, bg: 'bg-blue-100', text: 'text-blue-700', label: 'Calibración' },
};

export default function ProcessingLineCard({ line }: ProcessingLineCardProps) {
  const config = statusConfig[line.status];
  const StatusIcon = config.icon;

  return (
    <div className="card p-4 animate-fade-in hover:shadow-lg transition-all duration-300">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500">{line.lineCode}</p>
            <h4 className="text-sm font-bold text-gray-900 mt-0.5">{line.name}</h4>
          </div>
          <div className={`p-2 rounded-lg ${config.bg}`}>
            <StatusIcon className={`w-4 h-4 ${config.text}`} />
          </div>
        </div>

        {/* Capacity utilization */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-500">Utilización</span>
            <span className="font-semibold text-gray-900">{line.utilizationPercentage}%</span>
          </div>
          <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                line.utilizationPercentage > 80 ? 'bg-green-500' :
                line.utilizationPercentage > 40 ? 'bg-blue-500' : 'bg-gray-400'
              }`}
              style={{ width: `${line.utilizationPercentage}%` }}
            />
          </div>
        </div>

        {/* Details */}
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Capacidad</span>
            <span className="font-medium text-gray-700">{line.capacity} {line.capacityUnit}</span>
          </div>
          {line.currentBatchCode && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Lote actual</span>
              <span className="font-medium text-blue-600">{line.currentBatchCode}</span>
            </div>
          )}
          {line.nextScheduledMaintenance && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Próx. manten.</span>
              <span className="font-medium text-gray-700">
                {new Date(line.nextScheduledMaintenance).toLocaleDateString('es-CR', {
                  day: 'numeric',
                  month: 'short',
                })}
              </span>
            </div>
          )}
        </div>

        {/* Status badge */}
        <div className="pt-2 border-t border-gray-100">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
            <StatusIcon className="w-3 h-3" />
            {config.label}
          </span>
        </div>
      </div>
    </div>
  );
}
