import {
  Settings,
  CheckCircle,
  Pause,
  AlertTriangle,
  MapPin,
  Gauge,
  User,
  Factory,
} from 'lucide-react';
import type { ProcessingLine } from '../../types/procesamiento.types';

interface ProcessingLineListProps {
  lines: ProcessingLine[];
  onLineClick?: (line: ProcessingLine) => void;
}

const statusConfig = {
  active: {
    label: 'Activa',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    icon: CheckCircle,
  },
  idle: {
    label: 'Inactiva',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    icon: Pause,
  },
  maintenance: {
    label: 'Mantenimiento',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    icon: Settings,
  },
  calibration: {
    label: 'Calibracion',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    icon: AlertTriangle,
  },
};

const productTypeLabels: Record<string, string> = {
  tomate: 'Tomate',
  chile: 'Chile',
  pepino: 'Pepino',
  leche: 'Leche',
  carne: 'Carne',
  miel: 'Miel',
  cera: 'Cera',
  polen: 'Polen',
};

export default function ProcessingLineList({ lines, onLineClick }: ProcessingLineListProps) {
  if (lines.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Factory className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Lineas de Procesamiento</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <Factory className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No hay lineas de procesamiento registradas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Factory className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Lineas de Procesamiento</h3>
        <span className="ml-auto text-sm text-gray-500">
          {lines.filter(l => l.status === 'active').length} activas de {lines.length}
        </span>
      </div>

      <div className="space-y-3">
        {lines.map((line) => {
          const status = statusConfig[line.status];
          const StatusIcon = status.icon;

          return (
            <div
              key={line.id}
              onClick={() => onLineClick?.(line)}
              className="p-4 rounded-lg border border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${status.bgColor} ${status.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">{line.lineCode}</span>
                  </div>
                  <h4 className="font-medium text-gray-900">{line.name}</h4>
                  {line.description && (
                    <p className="text-sm text-gray-500 mt-0.5 truncate">{line.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5" />
                      {line.capacity} {line.capacityUnit}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {line.location}
                    </span>
                    {line.operator && (
                      <span className="inline-flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {line.operator}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Utilizacion</p>
                    <p className="text-lg font-bold text-gray-900">{line.utilizationPercentage}%</p>
                  </div>
                  <div className="w-20 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        line.utilizationPercentage > 80 ? 'bg-green-500' :
                        line.utilizationPercentage > 40 ? 'bg-blue-500' : 'bg-gray-400'
                      }`}
                      style={{ width: `${line.utilizationPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
              {/* Product Types */}
              <div className="mt-3 pt-2 border-t border-gray-100">
                <div className="flex flex-wrap gap-1.5">
                  {line.productTypes.map((type) => (
                    <span
                      key={type}
                      className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600"
                    >
                      {productTypeLabels[type] || type}
                    </span>
                  ))}
                  {line.currentBatchCode && (
                    <span className="ml-auto text-xs text-blue-600 font-medium">
                      Lote: {line.currentBatchCode}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
