import {
  Calendar,
  Tag,
  Heart,
  Baby,
  FileText,
  Edit2,
  Trash2,
  CircleDot,
  Syringe,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import { Modal } from '../common/Modals';
import { useDeleteReproductionRecord } from '../../hooks/usePecuarioMutations';
import type { ReproductionRecord } from '../../types/pecuario.types';

interface ReproductionDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reproductionRecord: ReproductionRecord | null;
  onEdit?: (record: ReproductionRecord) => void;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: {
    label: 'Pendiente confirmacion',
    color: 'text-yellow-600 bg-yellow-50',
    icon: Clock,
  },
  confirmed: {
    label: 'Prenez confirmada',
    color: 'text-blue-600 bg-blue-50',
    icon: CheckCircle,
  },
  failed: {
    label: 'Fallido',
    color: 'text-red-600 bg-red-50',
    icon: XCircle,
  },
  born: {
    label: 'Nacido',
    color: 'text-green-600 bg-green-50',
    icon: Baby,
  },
};

const typeConfig: Record<string, { label: string; color: string; icon: typeof Heart }> = {
  natural: {
    label: 'Monta natural',
    color: 'text-pink-600 bg-pink-50',
    icon: Heart,
  },
  artificial_insemination: {
    label: 'Inseminacion artificial',
    color: 'text-purple-600 bg-purple-50',
    icon: Syringe,
  },
};

export default function ReproductionDetailModal({
  open,
  onOpenChange,
  reproductionRecord,
  onEdit,
}: ReproductionDetailModalProps) {
  const deleteMutation = useDeleteReproductionRecord();

  if (!reproductionRecord) return null;

  const statusInfo = statusConfig[reproductionRecord.status] || {
    label: reproductionRecord.status,
    color: 'text-gray-600 bg-gray-100',
    icon: CircleDot,
  };
  const StatusIcon = statusInfo.icon;

  const typeInfo = typeConfig[reproductionRecord.type] || {
    label: reproductionRecord.type,
    color: 'text-gray-600 bg-gray-100',
    icon: Heart,
  };
  const TypeIcon = typeInfo.icon;

  const handleDelete = async () => {
    if (window.confirm('Esta seguro de que desea eliminar este registro de reproduccion?')) {
      try {
        await deleteMutation.mutateAsync(reproductionRecord.id);
        onOpenChange(false);
      } catch (error) {
        console.error('Error deleting reproduction record:', error);
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

  const calculateDaysUntilBirth = () => {
    if (!reproductionRecord.expectedBirthDate || reproductionRecord.status === 'born' || reproductionRecord.status === 'failed') {
      return null;
    }
    const today = new Date();
    const expected = new Date(reproductionRecord.expectedBirthDate);
    const diffTime = expected.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilBirth = calculateDaysUntilBirth();

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Detalle del Registro de Reproduccion"
      description={`Hembra: ${reproductionRecord.cowTag}`}
      size="md"
    >
      <div className="space-y-6">
        {/* Header with Status Badge */}
        <div className="flex items-center justify-center gap-3">
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusInfo.color}`}>
            <StatusIcon className="w-5 h-5" />
            {statusInfo.label}
          </span>
        </div>

        {/* Type and Animals */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-center gap-2 mb-3">
            <TypeIcon className={`w-5 h-5 ${typeInfo.color.split(' ')[0]}`} />
            <span className="text-sm font-medium text-gray-700">{typeInfo.label}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-500 mb-1">Hembra</p>
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-pink-100 rounded-full">
                <Tag className="w-3 h-3 text-pink-600" />
                <span className="text-sm font-bold text-pink-700">{reproductionRecord.cowTag}</span>
              </div>
            </div>
            {reproductionRecord.bullTag && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Macho</p>
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 rounded-full">
                  <Tag className="w-3 h-3 text-blue-600" />
                  <span className="text-sm font-bold text-blue-700">{reproductionRecord.bullTag}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Days until birth countdown */}
        {daysUntilBirth !== null && daysUntilBirth > 0 && (
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-sm text-blue-600 mb-1">Dias para el parto esperado</p>
            <p className="text-3xl font-bold text-blue-700">{daysUntilBirth}</p>
            <p className="text-xs text-blue-500">dias restantes</p>
          </div>
        )}

        {daysUntilBirth !== null && daysUntilBirth <= 0 && reproductionRecord.status === 'confirmed' && (
          <div className="bg-amber-50 rounded-lg p-4 text-center">
            <p className="text-sm text-amber-600 mb-1">Parto esperado</p>
            <p className="text-lg font-bold text-amber-700">
              {daysUntilBirth === 0 ? 'Hoy' : `Hace ${Math.abs(daysUntilBirth)} dias`}
            </p>
          </div>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Service Date */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Fecha de Servicio</p>
              <p className="font-medium text-gray-900">
                {formatDate(reproductionRecord.serviceDate)}
              </p>
            </div>
          </div>

          {/* Expected Birth Date */}
          {reproductionRecord.expectedBirthDate && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha Esperada de Parto</p>
                <p className="font-medium text-gray-900">
                  {formatDate(reproductionRecord.expectedBirthDate)}
                </p>
              </div>
            </div>
          )}

          {/* Actual Birth Date */}
          {reproductionRecord.actualBirthDate && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Baby className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha Real de Parto</p>
                <p className="font-medium text-gray-900">
                  {formatDate(reproductionRecord.actualBirthDate)}
                </p>
              </div>
            </div>
          )}

          {/* Calf Tag */}
          {reproductionRecord.calfTag && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <Tag className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Cria</p>
                <p className="font-medium text-gray-900">{reproductionRecord.calfTag}</p>
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        {reproductionRecord.notes && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Notas</h3>
            <div className="flex items-start gap-2 bg-amber-50 rounded-lg p-3">
              <FileText className="w-4 h-4 text-amber-600 mt-0.5" />
              <p className="text-amber-800">{reproductionRecord.notes}</p>
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
                  onEdit(reproductionRecord);
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
