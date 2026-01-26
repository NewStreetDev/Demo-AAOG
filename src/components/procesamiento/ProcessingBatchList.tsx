import { useState } from 'react';
import {
  Clock,
  PlayCircle,
  Shield,
  CheckCircle2,
  XCircle,
  Pause,
  User,
  Calendar,
  ArrowRight,
  Package,
  Filter,
} from 'lucide-react';
import type { ProcessingBatch } from '../../types/procesamiento.types';

interface ProcessingBatchListProps {
  batches: ProcessingBatch[];
  onBatchClick?: (batch: ProcessingBatch) => void;
}

const statusConfig = {
  pending: {
    label: 'Pendiente',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    icon: Clock,
  },
  in_progress: {
    label: 'En Proceso',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    icon: PlayCircle,
  },
  quality_control: {
    label: 'Control QC',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    icon: Shield,
  },
  completed: {
    label: 'Completado',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    icon: CheckCircle2,
  },
  rejected: {
    label: 'Rechazado',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    icon: XCircle,
  },
  paused: {
    label: 'Pausado',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    icon: Pause,
  },
};

const sourceModuleLabels: Record<string, string> = {
  agro: 'Agricola',
  pecuario: 'Pecuario',
  apicultura: 'Apicultura',
};

type StatusFilter = 'all' | ProcessingBatch['status'];

export default function ProcessingBatchList({ batches, onBatchClick }: ProcessingBatchListProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const filteredBatches = statusFilter === 'all'
    ? batches
    : batches.filter(b => b.status === statusFilter);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-CR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusFilterOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'pending', label: 'Pendientes' },
    { value: 'in_progress', label: 'En Proceso' },
    { value: 'quality_control', label: 'Control QC' },
    { value: 'completed', label: 'Completados' },
    { value: 'rejected', label: 'Rechazados' },
    { value: 'paused', label: 'Pausados' },
  ];

  if (batches.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Package className="w-5 h-5 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Lotes de Procesamiento</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No hay lotes de procesamiento registrados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-orange-100 rounded-lg">
          <Package className="w-5 h-5 text-orange-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Lotes de Procesamiento</h3>
        <span className="ml-auto text-sm text-gray-500">
          {filteredBatches.length} {statusFilter === 'all' ? 'total' : ''}
        </span>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Filter className="w-4 h-4 text-gray-400" />
        {statusFilterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setStatusFilter(option.value as StatusFilter)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              statusFilter === option.value
                ? 'bg-blue-100 text-blue-700 border-blue-300'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {filteredBatches.length > 0 ? (
          filteredBatches.map((batch) => {
            const status = statusConfig[batch.status];
            const StatusIcon = status.icon;

            return (
              <div
                key={batch.id}
                onClick={() => onBatchClick?.(batch)}
                className="p-4 rounded-lg border border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${status.bgColor} ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                      <span className="text-xs text-gray-500 font-mono">{batch.batchCode}</span>
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600">
                        {sourceModuleLabels[batch.sourceModule]}
                      </span>
                    </div>

                    {/* Product Flow */}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-medium text-gray-900">{batch.inputProductName}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-700">{batch.outputProductName || 'Procesando...'}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(batch.startDate)}
                      </span>
                      {batch.processingLineName && (
                        <span className="inline-flex items-center gap-1">
                          <Package className="w-3.5 h-3.5" />
                          {batch.processingLineName}
                        </span>
                      )}
                      {batch.operator && (
                        <span className="inline-flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          {batch.operator}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {batch.inputQuantity} {batch.inputUnit}
                    </p>
                    {batch.yieldPercentage !== undefined && (
                      <p className="text-xs text-blue-600 font-medium">
                        Rend: {batch.yieldPercentage.toFixed(1)}%
                      </p>
                    )}
                    {batch.outputGrade && (
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        batch.outputGrade === 'A' ? 'bg-green-100 text-green-700' :
                        batch.outputGrade === 'B' ? 'bg-blue-100 text-blue-700' :
                        batch.outputGrade === 'C' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        Grado {batch.outputGrade}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-sm text-gray-500 py-4">
            No hay lotes con el filtro seleccionado
          </p>
        )}
      </div>
    </div>
  );
}
