import {
  Calendar,
  Clock,
  User,
  MapPin,
  Package,
  ArrowRight,
  CheckCircle2,
  PlayCircle,
  Edit2,
  Trash2,
  Link2,
  AlertTriangle,
  Award,
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
  en_proceso: {
    label: 'En Proceso',
    color: 'text-orange-600 bg-orange-50',
    icon: PlayCircle,
  },
  completado: {
    label: 'Completado',
    color: 'text-green-600 bg-green-50',
    icon: CheckCircle2,
  },
};

const sourceTypeLabels: Record<string, string> = {
  cosecha: 'Cosecha (materia prima fresca)',
  lote_anterior: 'Lote anterior (proceso previo)',
};

export default function ProcessingBatchDetailModal({
  open,
  onOpenChange,
  batch,
  onEdit,
}: ProcessingBatchDetailModalProps) {
  const deleteMutation = useDeleteProcessingBatch();

  if (!batch) return null;

  const status = statusConfig[batch.status] || statusConfig.en_proceso;
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
      description={batch.batchCode || 'Lote en proceso (sin codigo asignado)'}
      size="lg"
    >
      <div className="space-y-6">
        {/* Header with Status and Badges */}
        <div className="flex items-center flex-wrap gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
            <StatusIcon className="w-4 h-4" />
            {status.label}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-600">
            {batch.processTypeName}
          </span>
          {batch.isFinalProduct && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200">
              <Award className="w-4 h-4" />
              Producto Final
            </span>
          )}
        </div>

        {/* Product Flow */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Input */}
            <div className="flex-1 min-w-[150px]">
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <Package className="w-3 h-3" />
                Entrada
              </p>
              <p className="font-semibold text-gray-900">{batch.inputProduct}</p>
              <p className="text-sm text-gray-600">{batch.inputQuantity} {batch.inputUnit}</p>
              <p className="text-xs text-gray-400 mt-1">
                {sourceTypeLabels[batch.inputSourceType]}
              </p>
            </div>

            {/* Arrow */}
            <ArrowRight className="w-6 h-6 text-gray-400 flex-shrink-0" />

            {/* Output */}
            <div className="flex-1 min-w-[150px]">
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <Package className="w-3 h-3" />
                Salida
              </p>
              {batch.status === 'completado' && batch.outputProduct ? (
                <>
                  <p className="font-semibold text-gray-900">{batch.outputProduct}</p>
                  <p className="text-sm text-gray-600">{batch.outputQuantity} {batch.outputUnit}</p>
                </>
              ) : (
                <p className="text-sm text-gray-400 italic">Pendiente de completar</p>
              )}
            </div>

            {/* Merma (if completed) */}
            {batch.status === 'completado' && batch.merma !== undefined && (
              <div className="flex-shrink-0 text-center bg-white rounded-lg p-3 border border-gray-200">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1 justify-center">
                  <AlertTriangle className="w-3 h-3" />
                  Merma
                </p>
                <p className={`text-xl font-bold ${batch.merma > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {batch.merma} {batch.inputUnit}
                </p>
                {batch.inputQuantity > 0 && (
                  <p className="text-xs text-gray-500">
                    ({((batch.merma / batch.inputQuantity) * 100).toFixed(1)}%)
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Source Batch Link (if from previous batch) */}
        {batch.inputSourceType === 'lote_anterior' && batch.inputSourceBatchCode && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2">
              <Link2 className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">Lote de Origen</p>
                <p className="text-sm text-blue-600">{batch.inputSourceBatchCode}</p>
              </div>
            </div>
          </div>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Process Date */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Fecha del Proceso</p>
              <p className="font-medium text-gray-900">{formatDate(batch.processDate)}</p>
            </div>
          </div>

          {/* Completion Date */}
          {batch.completionDate && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha de Finalizacion</p>
                <p className="font-medium text-gray-900">{formatDate(batch.completionDate)}</p>
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

          {/* Storage Location */}
          {batch.storageLocation && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-teal-50 rounded-lg">
                <MapPin className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Almacenamiento</p>
                <p className="font-medium text-gray-900">{batch.storageLocation}</p>
              </div>
            </div>
          )}

          {/* Batch Code (if completed) */}
          {batch.batchCode && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Clock className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Codigo de Lote</p>
                <p className="font-mono font-medium text-gray-900">{batch.batchCode}</p>
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        {batch.notes && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Notas</h3>
            <p className="text-gray-700 bg-gray-50 rounded-lg p-3">{batch.notes}</p>
          </div>
        )}

        {/* RG06/RG07 Info (if final product) */}
        {batch.isFinalProduct && batch.status === 'completado' && (
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-start gap-3">
              <Award className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">Producto Final Listo para Venta</p>
                <p className="text-sm text-green-600 mt-1">
                  Este lote esta habilitado para generar boletas RG06 (Registro de Procesamiento)
                  y puede usarse en ventas de productos procesados (RG07).
                </p>
              </div>
            </div>
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
