import {
  Calendar,
  User,
  MapPin,
  Droplet,
  Leaf,
  Scissors,
  Bug,
  Sprout,
  Tractor,
  Package,
  Cloud,
  Edit2,
  Trash2,
  DollarSign,
} from 'lucide-react';
import { Modal } from '../common/Modals';
import { useDeleteAgroAction } from '../../hooks/useAgroMutations';
import type { AgroAction } from '../../types/agro.types';

interface AgroActionDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: AgroAction | null;
  onEdit?: (action: AgroAction) => void;
}

const typeConfig: Record<string, { label: string; color: string; bgColor: string; icon: typeof Droplet }> = {
  planting: {
    label: 'Siembra',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    icon: Sprout,
  },
  irrigation: {
    label: 'Riego',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    icon: Droplet,
  },
  fertilization: {
    label: 'Fertilizacion',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    icon: Leaf,
  },
  pesticide: {
    label: 'Aplicacion de Pesticidas',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    icon: Bug,
  },
  weeding: {
    label: 'Deshierbe',
    color: 'text-lime-600',
    bgColor: 'bg-lime-100',
    icon: Scissors,
  },
  pruning: {
    label: 'Poda',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    icon: Scissors,
  },
  harvest: {
    label: 'Cosecha',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    icon: Package,
  },
  soil_preparation: {
    label: 'Preparacion de Suelo',
    color: 'text-stone-600',
    bgColor: 'bg-stone-100',
    icon: Tractor,
  },
};

const weatherLabels: Record<string, string> = {
  sunny: 'Soleado',
  cloudy: 'Nublado',
  rainy: 'Lluvioso',
  windy: 'Ventoso',
  hot: 'Caluroso',
  cold: 'Frio',
};

export default function AgroActionDetailModal({
  open,
  onOpenChange,
  action,
  onEdit,
}: AgroActionDetailModalProps) {
  const deleteMutation = useDeleteAgroAction();

  if (!action) return null;

  const typeInfo = typeConfig[action.type] || {
    label: action.type,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    icon: Package,
  };
  const TypeIcon = typeInfo.icon;

  const handleDelete = async () => {
    if (window.confirm('Esta seguro de que desea eliminar esta accion?')) {
      try {
        await deleteMutation.mutateAsync(action.id);
        onOpenChange(false);
      } catch (error) {
        console.error('Error deleting action:', error);
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Detalle de Accion Agricola"
      description={action.description}
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
                {formatDate(action.date)}
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
              <p className="font-medium text-gray-900">{action.performedBy}</p>
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
                {action.loteName}
                {action.cropName && ` - ${action.cropName}`}
              </p>
            </div>
          </div>

          {/* Weather */}
          {action.weatherConditions && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-sky-50 rounded-lg">
                <Cloud className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Clima</p>
                <p className="font-medium text-gray-900">
                  {weatherLabels[action.weatherConditions] || action.weatherConditions}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Insumo and Quantity Details */}
        {(action.insumoUsed || action.quantity || action.cost) && (
          <div className={`rounded-lg p-4 space-y-3 ${typeInfo.bgColor}`}>
            <h3 className={`text-sm font-medium ${typeInfo.color}`}>Detalles de la Accion</h3>
            <div className="grid grid-cols-2 gap-4">
              {action.insumoUsed && (
                <div>
                  <p className={`text-xs ${typeInfo.color} opacity-70`}>Insumo Utilizado</p>
                  <p className={`font-medium ${typeInfo.color}`}>{action.insumoUsed}</p>
                </div>
              )}
              {action.quantity && (
                <div>
                  <p className={`text-xs ${typeInfo.color} opacity-70`}>Cantidad</p>
                  <p className={`font-medium ${typeInfo.color}`}>
                    {action.quantity} {action.unit}
                  </p>
                </div>
              )}
              {action.cost && (
                <div className="flex items-center gap-2">
                  <DollarSign className={`w-4 h-4 ${typeInfo.color}`} />
                  <div>
                    <p className={`text-xs ${typeInfo.color} opacity-70`}>Costo</p>
                    <p className={`font-medium ${typeInfo.color}`}>
                      {formatCurrency(action.cost)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes */}
        {action.notes && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Notas</h3>
            <p className="text-gray-700 bg-gray-50 rounded-lg p-3">
              {action.notes}
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
                  onEdit(action);
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
