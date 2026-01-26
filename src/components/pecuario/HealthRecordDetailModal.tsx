import {
  Calendar,
  Syringe,
  Pill,
  User,
  DollarSign,
  FileText,
  Tag,
  Edit2,
  Trash2,
  Stethoscope,
  Bug,
  Scissors,
  ClipboardCheck,
} from 'lucide-react';
import { Modal } from '../common/Modals';
import { useDeleteHealthRecord } from '../../hooks/usePecuarioMutations';
import type { HealthRecord } from '../../types/pecuario.types';

interface HealthRecordDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  healthRecord: HealthRecord | null;
  onEdit?: (healthRecord: HealthRecord) => void;
}

const typeConfig: Record<string, { label: string; color: string; icon: typeof Syringe }> = {
  vaccination: {
    label: 'Vacunacion',
    color: 'text-blue-600 bg-blue-50',
    icon: Syringe,
  },
  treatment: {
    label: 'Tratamiento',
    color: 'text-amber-600 bg-amber-50',
    icon: Pill,
  },
  deworming: {
    label: 'Desparasitacion',
    color: 'text-green-600 bg-green-50',
    icon: Bug,
  },
  checkup: {
    label: 'Revision',
    color: 'text-purple-600 bg-purple-50',
    icon: ClipboardCheck,
  },
  surgery: {
    label: 'Cirugia',
    color: 'text-red-600 bg-red-50',
    icon: Scissors,
  },
};

export default function HealthRecordDetailModal({
  open,
  onOpenChange,
  healthRecord,
  onEdit,
}: HealthRecordDetailModalProps) {
  const deleteMutation = useDeleteHealthRecord();

  if (!healthRecord) return null;

  const typeInfo = typeConfig[healthRecord.type] || {
    label: healthRecord.type,
    color: 'text-gray-600 bg-gray-100',
    icon: Stethoscope,
  };
  const TypeIcon = typeInfo.icon;

  const handleDelete = async () => {
    if (window.confirm('Esta seguro de que desea eliminar este registro de salud?')) {
      try {
        await deleteMutation.mutateAsync(healthRecord.id);
        onOpenChange(false);
      } catch (error) {
        console.error('Error deleting health record:', error);
      }
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-CR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Detalle del Registro de Salud"
      description={`Animal: ${healthRecord.livestockTag}`}
      size="md"
    >
      <div className="space-y-6">
        {/* Header with Type Badge */}
        <div className="flex items-center justify-center">
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${typeInfo.color}`}>
            <TypeIcon className="w-5 h-5" />
            {typeInfo.label}
          </span>
        </div>

        {/* Animal Tag */}
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Tag className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-500">Animal</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{healthRecord.livestockTag}</p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Fecha</p>
              <p className="font-medium text-gray-900">
                {formatDate(healthRecord.date)}
              </p>
            </div>
          </div>

          {/* Veterinarian */}
          {healthRecord.veterinarian && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Veterinario</p>
                <p className="font-medium text-gray-900">{healthRecord.veterinarian}</p>
              </div>
            </div>
          )}

          {/* Medication */}
          {healthRecord.medication && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-50 rounded-lg">
                <Pill className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Medicamento</p>
                <p className="font-medium text-gray-900">
                  {healthRecord.medication}
                  {healthRecord.dosage && ` - ${healthRecord.dosage}`}
                </p>
              </div>
            </div>
          )}

          {/* Cost */}
          {healthRecord.cost && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Costo</p>
                <p className="font-medium text-gray-900">{formatCurrency(healthRecord.cost)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Next Checkup */}
        {healthRecord.nextCheckup && (
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Proxima revision: {formatDate(healthRecord.nextCheckup)}
              </span>
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Descripcion</h3>
          <p className="text-gray-700 bg-gray-50 rounded-lg p-3">
            {healthRecord.description}
          </p>
        </div>

        {/* Notes */}
        {healthRecord.notes && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Notas</h3>
            <div className="flex items-start gap-2 bg-amber-50 rounded-lg p-3">
              <FileText className="w-4 h-4 text-amber-600 mt-0.5" />
              <p className="text-amber-800">{healthRecord.notes}</p>
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
                  onEdit(healthRecord);
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
