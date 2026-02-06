import { useState } from 'react';
import {
  PlayCircle,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Package,
  Filter,
  Award,
  Link2,
} from 'lucide-react';
import type { ProcessingBatch } from '../../types/procesamiento.types';

interface ProcessingBatchListProps {
  batches: ProcessingBatch[];
  onBatchClick?: (batch: ProcessingBatch) => void;
}

const statusConfig = {
  en_proceso: {
    label: 'En Proceso',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    icon: PlayCircle,
  },
  completado: {
    label: 'Completado',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    icon: CheckCircle2,
  },
};

type StatusFilter = 'all' | ProcessingBatch['status'] | 'producto_final';

export default function ProcessingBatchList({ batches, onBatchClick }: ProcessingBatchListProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const filteredBatches = statusFilter === 'all'
    ? batches
    : statusFilter === 'producto_final'
    ? batches.filter(b => b.isFinalProduct && b.status === 'completado')
    : batches.filter(b => b.status === statusFilter);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-CR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const statusFilterOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'en_proceso', label: 'En Proceso' },
    { value: 'completado', label: 'Completados' },
    { value: 'producto_final', label: 'Productos Finales' },
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
          <p className="text-sm mt-1">Cree un nuevo lote para comenzar</p>
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
            const status = statusConfig[batch.status] || statusConfig.en_proceso;
            const StatusIcon = status.icon;

            return (
              <div
                key={batch.id}
                onClick={() => onBatchClick?.(batch)}
                className="p-4 rounded-lg border border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Status and Badges Row */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${status.bgColor} ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600">
                        {batch.processType}
                      </span>
                      {batch.isFinalProduct && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          <Award className="w-3 h-3" />
                          Producto Final
                        </span>
                      )}
                      {batch.inputSourceType === 'lote_anterior' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-600">
                          <Link2 className="w-3 h-3" />
                          Encadenado
                        </span>
                      )}
                    </div>

                    {/* Product Flow */}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-medium text-gray-900">{batch.inputProduct}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span className={batch.outputProduct ? 'text-gray-700' : 'text-gray-400 italic'}>
                        {batch.outputProduct || 'Pendiente...'}
                      </span>
                    </div>

                    {/* Info Row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(batch.processDate)}
                      </span>
                      {batch.batchCode && (
                        <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">
                          {batch.batchCode}
                        </span>
                      )}
                      {batch.operator && (
                        <span className="text-xs text-gray-400">
                          Op: {batch.operator}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right side: Quantities */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0 text-right">
                    <div className="text-sm">
                      <span className="text-gray-500">Entrada: </span>
                      <span className="font-semibold text-gray-900">
                        {batch.inputQuantity} {batch.inputUnit}
                      </span>
                    </div>
                    {batch.status === 'completado' && batch.outputQuantity !== undefined && (
                      <>
                        <div className="text-sm">
                          <span className="text-gray-500">Salida: </span>
                          <span className="font-semibold text-green-600">
                            {batch.outputQuantity} {batch.outputUnit}
                          </span>
                        </div>
                        {batch.merma !== undefined && batch.merma > 0 && (
                          <div className="text-xs text-red-500">
                            Merma: {batch.merma} {batch.inputUnit} ({((batch.merma / batch.inputQuantity) * 100).toFixed(1)}%)
                          </div>
                        )}
                      </>
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
