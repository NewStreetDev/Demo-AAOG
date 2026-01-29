import {
  Calendar,
  Clock,
  User,
  MapPin,
  Thermometer,
  Package,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Pause,
  PlayCircle,
  AlertCircle,
  Shield,
  Edit2,
  Trash2,
  ListOrdered,
  Circle,
  Loader2,
  SkipForward,
} from 'lucide-react';
import { Modal } from '../common/Modals';
import { useDeleteProcessingBatch } from '../../hooks/useProcesamientoMutations';
import type { ProcessingBatch } from '../../types/procesamiento.types';

interface ProcessingBatchDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batch: ProcessingBatch | null;
  onEdit?: (batch: ProcessingBatch) => void;
}

const statusConfig = {
  pending: { label: 'Pendiente', color: 'text-gray-600 bg-gray-100', icon: Clock },
  in_progress: { label: 'En Proceso', color: 'text-orange-600 bg-orange-50', icon: PlayCircle },
  quality_control: { label: 'Control de Calidad', color: 'text-purple-600 bg-purple-50', icon: Shield },
  completed: { label: 'Completado', color: 'text-green-600 bg-green-50', icon: CheckCircle2 },
  rejected: { label: 'Rechazado', color: 'text-red-600 bg-red-50', icon: XCircle },
  paused: { label: 'Pausado', color: 'text-amber-600 bg-amber-50', icon: Pause },
};

const sourceModuleLabels: Record<string, string> = {
  agro: 'Agricola',
  pecuario: 'Pecuario',
  apicultura: 'Apicultura',
};

const gradeColors: Record<string, string> = {
  A: 'bg-green-100 text-green-700',
  B: 'bg-blue-100 text-blue-700',
  C: 'bg-amber-100 text-amber-700',
  descarte: 'bg-red-100 text-red-700',
};

const stageStatusConfig = {
  pending: { label: 'Pendiente', color: 'text-gray-500', bgColor: 'bg-gray-100', icon: Circle },
  in_progress: { label: 'En Proceso', color: 'text-orange-600', bgColor: 'bg-orange-100', icon: Loader2 },
  completed: { label: 'Completada', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle2 },
  skipped: { label: 'Omitida', color: 'text-gray-400', bgColor: 'bg-gray-50', icon: SkipForward },
};

export default function ProcessingBatchDetailModal({
  open,
  onOpenChange,
  batch,
  onEdit,
}: ProcessingBatchDetailModalProps) {
  const deleteMutation = useDeleteProcessingBatch();

  if (!batch) return null;

  const status = statusConfig[batch.status];
  const StatusIcon = status.icon;

  const handleDelete = async () => {
    if (window.confirm('Esta seguro de que desea eliminar este lote de procesamiento?')) {
      try {
        await deleteMutation.mutateAsync(batch.id);
        onOpenChange(false);
      } catch (error) {
        console.error('Error deleting processing batch:', error);
      }
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-CR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Detalle del Lote de Procesamiento"
      description={batch.batchCode}
      size="lg"
    >
      <div className="space-y-6">
        {/* Header with Status */}
        <div className="flex items-center flex-wrap gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
            <StatusIcon className="w-4 h-4" />
            {status.label}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-600">
            {sourceModuleLabels[batch.sourceModule]}
          </span>
          {batch.outputGrade && (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${gradeColors[batch.outputGrade]}`}>
              Grado {batch.outputGrade}
            </span>
          )}
        </div>

        {/* Product Flow */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex-1 min-w-[120px]">
              <p className="text-xs text-gray-500 mb-1">Entrada</p>
              <p className="font-semibold text-gray-900">{batch.inputProductName}</p>
              <p className="text-sm text-gray-600">{batch.inputQuantity} {batch.inputUnit}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div className="flex-1 min-w-[120px]">
              <p className="text-xs text-gray-500 mb-1">Salida</p>
              <p className="font-semibold text-gray-900">{batch.outputProductName || 'Procesando...'}</p>
              {batch.outputQuantity && (
                <p className="text-sm text-gray-600">{batch.outputQuantity} {batch.outputUnit}</p>
              )}
            </div>
            {batch.yieldPercentage !== undefined && (
              <div className="flex-shrink-0 text-center">
                <p className="text-xs text-gray-500 mb-1">Rendimiento</p>
                <p className="text-2xl font-bold text-blue-600">{batch.yieldPercentage.toFixed(1)}%</p>
              </div>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Processing Line */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Linea de Procesamiento</p>
              <p className="font-medium text-gray-900">{batch.processingLineName}</p>
            </div>
          </div>

          {/* Start Date */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Fecha de Inicio</p>
              <p className="font-medium text-gray-900">{formatDate(batch.startDate)}</p>
            </div>
          </div>

          {/* Expected End */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Fecha Esperada de Fin</p>
              <p className="font-medium text-gray-900">{formatDate(batch.expectedEndDate)}</p>
            </div>
          </div>

          {/* Actual End */}
          {batch.actualEndDate && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha Real de Fin</p>
                <p className="font-medium text-gray-900">{formatDate(batch.actualEndDate)}</p>
              </div>
            </div>
          )}

          {/* Operator */}
          {batch.operator && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Operador</p>
                <p className="font-medium text-gray-900">{batch.operator}</p>
              </div>
            </div>
          )}

          {/* Supervisor */}
          {batch.supervisor && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <User className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Supervisor</p>
                <p className="font-medium text-gray-900">{batch.supervisor}</p>
              </div>
            </div>
          )}

          {/* Temperature */}
          {batch.temperature !== undefined && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <Thermometer className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Temperatura</p>
                <p className="font-medium text-gray-900">{batch.temperature} C</p>
              </div>
            </div>
          )}

          {/* Source Location */}
          {batch.sourceLocation && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-teal-50 rounded-lg">
                <MapPin className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Origen</p>
                <p className="font-medium text-gray-900">{batch.sourceLocation}</p>
              </div>
            </div>
          )}

          {/* Storage Location */}
          {batch.storageLocation && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-cyan-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Almacenamiento</p>
                <p className="font-medium text-gray-900">{batch.storageLocation}</p>
              </div>
            </div>
          )}
        </div>

        {/* Processing Stages */}
        {batch.stages && batch.stages.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ListOrdered className="w-5 h-5 text-gray-500" />
              <h3 className="text-sm font-medium text-gray-700">
                Procesos ({batch.stages.filter(s => s.status === 'completed').length}/{batch.stages.length} completados)
              </h3>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {batch.stages.map((stage, idx) => {
                const stageStatus = stageStatusConfig[stage.status];
                return (
                  <div
                    key={stage.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      stage.status === 'in_progress'
                        ? 'border-orange-200 bg-orange-50'
                        : stage.status === 'completed'
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium ${stageStatus.bgColor} ${stageStatus.color}`}>
                      {stage.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : stage.status === 'in_progress' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${stage.status === 'completed' ? 'text-green-700' : stage.status === 'in_progress' ? 'text-orange-700' : 'text-gray-700'}`}>
                        {stage.name}
                      </p>
                      {/* Product transformation */}
                      {(stage.inputProductName || stage.outputProductName) && (
                        <div className="flex items-center gap-1 text-xs mt-0.5">
                          {stage.inputProductName && (
                            <span className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{stage.inputProductName}</span>
                          )}
                          {stage.inputProductName && stage.outputProductName && (
                            <span className="text-gray-400">→</span>
                          )}
                          {stage.outputProductName && (
                            <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{stage.outputProductName}</span>
                          )}
                        </div>
                      )}
                      {stage.description && (
                        <p className="text-xs text-gray-500 truncate mt-0.5">{stage.description}</p>
                      )}
                    </div>
                    {(stage.outputQuantity !== undefined || stage.inputQuantity !== undefined) && (
                      <div className="text-right text-sm flex items-center gap-1 flex-shrink-0">
                        {stage.inputQuantity !== undefined && (
                          <span className="text-gray-500">{stage.inputQuantity}</span>
                        )}
                        {stage.inputQuantity !== undefined && stage.outputQuantity !== undefined && (
                          <span className="text-gray-400">→</span>
                        )}
                        {stage.outputQuantity !== undefined && (
                          <span className="text-gray-700 font-medium">{stage.outputQuantity}</span>
                        )}
                        {stage.unit && (
                          <span className="text-gray-500 text-xs">{stage.unit}</span>
                        )}
                        {stage.inputQuantity !== undefined && stage.outputQuantity !== undefined && stage.inputQuantity > 0 && (
                          <span className={`text-xs ml-1 ${stage.outputQuantity < stage.inputQuantity ? 'text-red-500' : 'text-green-500'}`}>
                            ({stage.outputQuantity < stage.inputQuantity ? '-' : '+'}{Math.abs(((stage.outputQuantity - stage.inputQuantity) / stage.inputQuantity) * 100).toFixed(0)}%)
                          </span>
                        )}
                      </div>
                    )}
                    <span className={`text-xs px-2 py-1 rounded-full ${stageStatus.bgColor} ${stageStatus.color}`}>
                      {stageStatus.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Notes */}
        {batch.notes && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Notas</h3>
            <p className="text-gray-700 bg-gray-50 rounded-lg p-3">{batch.notes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            className="btn-danger inline-flex items-center gap-2"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => onOpenChange(false)}
            >
              Cerrar
            </button>
            {onEdit && (
              <button
                type="button"
                className="btn-primary inline-flex items-center gap-2"
                onClick={() => {
                  onOpenChange(false);
                  onEdit(batch);
                }}
              >
                <Edit2 className="w-4 h-4" />
                Editar
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
