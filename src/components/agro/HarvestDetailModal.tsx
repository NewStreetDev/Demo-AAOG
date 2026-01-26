import {
  Calendar,
  User,
  MapPin,
  Package,
  Star,
  Truck,
  DollarSign,
  Edit2,
  Trash2,
  Scale,
} from 'lucide-react';
import { Modal } from '../common/Modals';
import { useDeleteHarvest } from '../../hooks/useAgroMutations';
import type { Harvest } from '../../types/agro.types';

interface HarvestDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  harvest: Harvest | null;
  onEdit?: (harvest: Harvest) => void;
}

const qualityConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  A: {
    label: 'Calidad A - Excelente',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  B: {
    label: 'Calidad B - Buena',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  C: {
    label: 'Calidad C - Regular',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
};

const destinationConfig: Record<string, { label: string; color: string; bgColor: string; icon: typeof Truck }> = {
  sale: {
    label: 'Venta',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    icon: DollarSign,
  },
  processing: {
    label: 'Procesamiento',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    icon: Package,
  },
  storage: {
    label: 'Almacenamiento',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    icon: Package,
  },
  seeds: {
    label: 'Semillas',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    icon: Package,
  },
};

export default function HarvestDetailModal({
  open,
  onOpenChange,
  harvest,
  onEdit,
}: HarvestDetailModalProps) {
  const deleteMutation = useDeleteHarvest();

  if (!harvest) return null;

  const qualityInfo = qualityConfig[harvest.quality] || {
    label: harvest.quality,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  };

  const destinationInfo = destinationConfig[harvest.destination] || {
    label: harvest.destination,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    icon: Truck,
  };
  const DestinationIcon = destinationInfo.icon;

  const handleDelete = async () => {
    if (window.confirm('Esta seguro de que desea eliminar esta cosecha?')) {
      try {
        await deleteMutation.mutateAsync(harvest.id);
        onOpenChange(false);
      } catch (error) {
        console.error('Error deleting harvest:', error);
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
      title="Detalle de Cosecha"
      description={`${harvest.cropName} - ${formatDate(harvest.date)}`}
      size="md"
    >
      <div className="space-y-6">
        {/* Header with Crop and Quality */}
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-xl bg-green-100">
            <Package className="w-8 h-8 text-green-600" />
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-600">
              {harvest.cropName}
            </span>
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${qualityInfo.bgColor} ${qualityInfo.color}`}>
              <Star className="w-3.5 h-3.5 mr-1" />
              {qualityInfo.label}
            </span>
          </div>
        </div>

        {/* Quantity Display */}
        <div className="p-6 rounded-xl bg-green-100">
          <div className="flex items-center gap-2 mb-1">
            <Scale className="w-5 h-5 text-green-600" />
            <p className="text-sm font-medium text-green-600">Cantidad Cosechada</p>
          </div>
          <p className="text-4xl font-bold text-green-600">
            {harvest.quantity.toLocaleString()} <span className="text-2xl">{harvest.unit}</span>
          </p>
        </div>

        {/* Value Display (if available) */}
        {harvest.totalValue && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600">Precio por Unidad</p>
                <p className="text-lg font-semibold text-emerald-700">
                  {formatCurrency(harvest.pricePerUnit || 0)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-emerald-600">Valor Total</p>
                <p className="text-2xl font-bold text-emerald-700">
                  {formatCurrency(harvest.totalValue)}
                </p>
              </div>
            </div>
          </div>
        )}

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
                {formatDate(harvest.date)}
              </p>
            </div>
          </div>

          {/* Destination */}
          <div className="flex items-start gap-3">
            <div className={`p-2 ${destinationInfo.bgColor} rounded-lg`}>
              <DestinationIcon className={`w-5 h-5 ${destinationInfo.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Destino</p>
              <p className="font-medium text-gray-900">{destinationInfo.label}</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <MapPin className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ubicacion</p>
              <p className="font-medium text-gray-900">{harvest.loteName}</p>
            </div>
          </div>

          {/* Harvested By */}
          {harvest.harvestedBy && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Cosechado por</p>
                <p className="font-medium text-gray-900">{harvest.harvestedBy}</p>
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        {harvest.notes && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Notas</h3>
            <p className="text-gray-700 bg-gray-50 rounded-lg p-3">
              {harvest.notes}
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
                  onEdit(harvest);
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
