import {
  Settings,
  MapPin,
  User,
  Calendar,
  Gauge,
  CheckCircle,
  Pause,
  AlertTriangle,
  Edit2,
  Trash2,
} from 'lucide-react';
import { Modal } from '../common/Modals';
import { useDeleteProcessingLine } from '../../hooks/useProcesamientoMutations';
import type { ProcessingLine } from '../../types/procesamiento.types';

interface ProcessingLineDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  line: ProcessingLine | null;
  onEdit?: (line: ProcessingLine) => void;
}

const statusConfig = {
  active: { label: 'Activa', color: 'text-green-600 bg-green-50', icon: CheckCircle },
  idle: { label: 'Inactiva', color: 'text-gray-600 bg-gray-100', icon: Pause },
  maintenance: { label: 'En Mantenimiento', color: 'text-amber-600 bg-amber-50', icon: Settings },
  calibration: { label: 'En Calibracion', color: 'text-blue-600 bg-blue-50', icon: AlertTriangle },
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

export default function ProcessingLineDetailModal({
  open,
  onOpenChange,
  line,
  onEdit,
}: ProcessingLineDetailModalProps) {
  const deleteMutation = useDeleteProcessingLine();

  if (!line) return null;

  const status = statusConfig[line.status];
  const StatusIcon = status.icon;

  const handleDelete = async () => {
    if (window.confirm('Esta seguro de que desea eliminar esta linea de procesamiento?')) {
      try {
        await deleteMutation.mutateAsync(line.id);
        onOpenChange(false);
      } catch (error) {
        console.error('Error deleting processing line:', error);
      }
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-CR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Detalle de Linea de Procesamiento"
      description={`${line.lineCode} - ${line.name}`}
      size="md"
    >
      <div className="space-y-6">
        {/* Status Badge */}
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
            <StatusIcon className="w-4 h-4" />
            {status.label}
          </span>
          {line.currentBatchCode && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-600">
              Lote: {line.currentBatchCode}
            </span>
          )}
        </div>

        {/* Description */}
        {line.description && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Descripcion</h3>
            <p className="text-gray-900">{line.description}</p>
          </div>
        )}

        {/* Utilization */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Utilizacion</h3>
            <span className="text-lg font-bold text-gray-900">{line.utilizationPercentage}%</span>
          </div>
          <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                line.utilizationPercentage > 80 ? 'bg-green-500' :
                line.utilizationPercentage > 40 ? 'bg-blue-500' : 'bg-gray-400'
              }`}
              style={{ width: `${line.utilizationPercentage}%` }}
            />
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Gauge className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Capacidad</p>
              <p className="font-medium text-gray-900">{line.capacity} {line.capacityUnit}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ubicacion</p>
              <p className="font-medium text-gray-900">{line.location}</p>
            </div>
          </div>

          {line.operator && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Operador</p>
                <p className="font-medium text-gray-900">{line.operator}</p>
              </div>
            </div>
          )}

          {line.lastMaintenance && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-50 rounded-lg">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ultimo Mantenimiento</p>
                <p className="font-medium text-gray-900">{formatDate(line.lastMaintenance)}</p>
              </div>
            </div>
          )}

          {line.nextScheduledMaintenance && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <Settings className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Proximo Mantenimiento</p>
                <p className="font-medium text-gray-900">{formatDate(line.nextScheduledMaintenance)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Product Types */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Tipos de Producto</h3>
          <div className="flex flex-wrap gap-2">
            {line.productTypes.map((type) => (
              <span
                key={type}
                className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
              >
                {productTypeLabels[type] || type}
              </span>
            ))}
          </div>
        </div>

        {/* Notes */}
        {line.notes && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Notas</h3>
            <p className="text-gray-700 bg-gray-50 rounded-lg p-3">{line.notes}</p>
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
                  onEdit(line);
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
