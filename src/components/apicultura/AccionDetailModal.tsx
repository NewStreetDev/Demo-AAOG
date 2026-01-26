import {
  Calendar,
  User,
  MapPin,
  Pill,
  Droplet,
  Utensils,
  Heart,
  Crown,
  Edit2,
  Trash2,
  Package,
  Clock,
} from 'lucide-react';
import { Modal } from '../common/Modals';
import { useDeleteAccion } from '../../hooks/useApiculturaMutations';
import type { AccionApicultura } from '../../types/apicultura.types';

interface AccionDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accion: AccionApicultura | null;
  onEdit?: (accion: AccionApicultura) => void;
}

const typeConfig: Record<string, { label: string; color: string; bgColor: string; icon: typeof Pill }> = {
  medication: {
    label: 'Aplicacion de Medicamentos',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    icon: Pill,
  },
  panel_change: {
    label: 'Cambio de Panales',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    icon: Package,
  },
  feeding: {
    label: 'Alimentacion',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    icon: Utensils,
  },
  revision: {
    label: 'Revision',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    icon: Calendar,
  },
  queen_change: {
    label: 'Cambio de Reinas',
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
    icon: Crown,
  },
  reproduction: {
    label: 'Reproduccion y Crias',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    icon: Heart,
  },
  harvest: {
    label: 'Cosecha',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    icon: Droplet,
  },
};

const reproductionTypeLabels: Record<string, string> = {
  free_mating: 'Apareamiento Libre',
  insemination: 'Inseminacion',
  queen_introduction: 'Introduccion de Reinas',
  queen_raising: 'Crianza Do Little',
};

const feedingTypeLabels: Record<string, string> = {
  sugar_syrup: 'Jarabe de Azucar',
  raw_sugar: 'Azucar Cruda',
  candy: 'Candy/Pasta',
  pollen_substitute: 'Sustituto de Polen',
  other: 'Otro',
};

const applicationMethodLabels: Record<string, string> = {
  spray: 'Aspersion',
  drip: 'Goteo',
  strips: 'Tiras',
  fumigation: 'Fumigacion',
  feeding: 'En Alimentacion',
  other: 'Otro',
};

export default function AccionDetailModal({
  open,
  onOpenChange,
  accion,
  onEdit,
}: AccionDetailModalProps) {
  const deleteMutation = useDeleteAccion();

  if (!accion) return null;

  const typeInfo = typeConfig[accion.type] || {
    label: accion.type,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    icon: Calendar,
  };
  const TypeIcon = typeInfo.icon;

  const handleDelete = async () => {
    if (window.confirm('Esta seguro de que desea eliminar esta accion?')) {
      try {
        await deleteMutation.mutateAsync(accion.id);
        onOpenChange(false);
      } catch (error) {
        console.error('Error deleting accion:', error);
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

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Detalle de Accion"
      description={accion.description}
      size="md"
    >
      <div className="space-y-6">
        {/* Header with Type */}
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${typeInfo.bgColor}`}>
            <TypeIcon className={`w-6 h-6 ${typeInfo.color}`} />
          </div>
          <div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${typeInfo.bgColor} ${typeInfo.color}`}>
              {typeInfo.label}
            </span>
          </div>
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
                {formatDate(accion.date)}
              </p>
            </div>
          </div>

          {/* Performed By */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <User className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Realizado por</p>
              <p className="font-medium text-gray-900">{accion.performedBy}</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <MapPin className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ubicacion</p>
              <p className="font-medium text-gray-900">
                {accion.apiarioName}
                {accion.colmenaCode && ` - ${accion.colmenaCode}`}
              </p>
            </div>
          </div>
        </div>

        {/* Type-specific Details */}
        {accion.type === 'medication' && (
          <div className="bg-blue-50 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-medium text-blue-800">Detalles del Medicamento</h3>
            <div className="grid grid-cols-2 gap-4">
              {accion.medication && (
                <div>
                  <p className="text-xs text-blue-600">Medicamento</p>
                  <p className="font-medium text-blue-900">{accion.medication}</p>
                </div>
              )}
              {accion.dosage && (
                <div>
                  <p className="text-xs text-blue-600">Dosis</p>
                  <p className="font-medium text-blue-900">{accion.dosage}</p>
                </div>
              )}
              {accion.applicationMethod && (
                <div>
                  <p className="text-xs text-blue-600">Metodo de Aplicacion</p>
                  <p className="font-medium text-blue-900">
                    {applicationMethodLabels[accion.applicationMethod] || accion.applicationMethod}
                  </p>
                </div>
              )}
              {accion.nextApplicationDate && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-xs text-blue-600">Proxima Aplicacion</p>
                    <p className="font-medium text-blue-900">
                      {formatDate(accion.nextApplicationDate)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {accion.type === 'panel_change' && (
          <div className="bg-amber-50 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-medium text-amber-800">Detalles del Cambio de Panales</h3>
            <div className="grid grid-cols-2 gap-4">
              {accion.panelCount && (
                <div>
                  <p className="text-xs text-amber-600">Cantidad de Panales</p>
                  <p className="font-medium text-amber-900">{accion.panelCount}</p>
                </div>
              )}
              {accion.waxOrigin && (
                <div>
                  <p className="text-xs text-amber-600">Origen de Laminas de Cera</p>
                  <p className="font-medium text-amber-900">{accion.waxOrigin}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {accion.type === 'feeding' && (
          <div className="bg-green-50 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-medium text-green-800">Detalles de Alimentacion</h3>
            <div className="grid grid-cols-2 gap-4">
              {accion.feedingType && (
                <div>
                  <p className="text-xs text-green-600">Tipo de Alimento</p>
                  <p className="font-medium text-green-900">
                    {feedingTypeLabels[accion.feedingType] || accion.feedingType}
                  </p>
                </div>
              )}
              {accion.insumoUsed && (
                <div>
                  <p className="text-xs text-green-600">Insumo</p>
                  <p className="font-medium text-green-900">{accion.insumoUsed}</p>
                </div>
              )}
              {accion.quantity && (
                <div>
                  <p className="text-xs text-green-600">Cantidad</p>
                  <p className="font-medium text-green-900">
                    {accion.quantity} {accion.unit}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {accion.type === 'reproduction' && (
          <div className="bg-red-50 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-medium text-red-800">Detalles de Reproduccion</h3>
            {accion.reproductionType && (
              <div>
                <p className="text-xs text-red-600">Tipo</p>
                <p className="font-medium text-red-900">
                  {reproductionTypeLabels[accion.reproductionType] || accion.reproductionType}
                </p>
              </div>
            )}
            {accion.reproductionDetails && (
              <div>
                <p className="text-xs text-red-600">Detalles</p>
                <p className="font-medium text-red-900">{accion.reproductionDetails}</p>
              </div>
            )}
          </div>
        )}

        {accion.type === 'queen_change' && accion.reproductionDetails && (
          <div className="bg-pink-50 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-medium text-pink-800">Detalles del Cambio de Reina</h3>
            <p className="text-pink-900">{accion.reproductionDetails}</p>
          </div>
        )}

        {/* Notes */}
        {accion.notes && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Notas</h3>
            <p className="text-gray-700 bg-gray-50 rounded-lg p-3">
              {accion.notes}
            </p>
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
                  onEdit(accion);
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
