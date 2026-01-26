import {
  Calendar,
  User,
  MapPin,
  Droplet,
  Package,
  Star,
  Edit2,
  Trash2,
} from 'lucide-react';
import { Modal } from '../common/Modals';
import { useDeleteCosecha } from '../../hooks/useApiculturaMutations';
import type { Cosecha } from '../../types/apicultura.types';

interface CosechaDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cosecha: Cosecha | null;
  onEdit?: (cosecha: Cosecha) => void;
}

const productTypeConfig: Record<string, { label: string; color: string; bgColor: string; icon: typeof Droplet }> = {
  honey: {
    label: 'Miel',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    icon: Droplet,
  },
  wax: {
    label: 'Cera',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    icon: Package,
  },
  royal_jelly: {
    label: 'Jalea Real',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    icon: Droplet,
  },
  propolis: {
    label: 'Propoleo',
    color: 'text-brown-600',
    bgColor: 'bg-orange-100',
    icon: Package,
  },
  pollen: {
    label: 'Polen',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    icon: Package,
  },
  hives: {
    label: 'Colmenas',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    icon: Package,
  },
};

const qualityLabels: Record<string, { label: string; color: string }> = {
  A: { label: 'Calidad A - Excelente', color: 'text-green-600 bg-green-100' },
  B: { label: 'Calidad B - Buena', color: 'text-blue-600 bg-blue-100' },
  C: { label: 'Calidad C - Regular', color: 'text-amber-600 bg-amber-100' },
};

export default function CosechaDetailModal({
  open,
  onOpenChange,
  cosecha,
  onEdit,
}: CosechaDetailModalProps) {
  const deleteMutation = useDeleteCosecha();

  if (!cosecha) return null;

  const productInfo = productTypeConfig[cosecha.productType] || {
    label: cosecha.productType,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    icon: Package,
  };
  const ProductIcon = productInfo.icon;
  const qualityInfo = cosecha.quality ? qualityLabels[cosecha.quality] : null;

  const handleDelete = async () => {
    if (window.confirm('Esta seguro de que desea eliminar esta cosecha?')) {
      try {
        await deleteMutation.mutateAsync(cosecha.id);
        onOpenChange(false);
      } catch (error) {
        console.error('Error deleting cosecha:', error);
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
      title="Detalle de Cosecha"
      description={`${productInfo.label} - ${formatDate(cosecha.date)}`}
      size="md"
    >
      <div className="space-y-6">
        {/* Header with Product Type */}
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-xl ${productInfo.bgColor}`}>
            <ProductIcon className={`w-8 h-8 ${productInfo.color}`} />
          </div>
          <div>
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${productInfo.bgColor} ${productInfo.color}`}>
              {productInfo.label}
            </span>
            {qualityInfo && (
              <span className={`ml-2 inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${qualityInfo.color}`}>
                <Star className="w-3.5 h-3.5 mr-1" />
                {qualityInfo.label}
              </span>
            )}
          </div>
        </div>

        {/* Quantity Display */}
        <div className={`p-6 rounded-xl ${productInfo.bgColor}`}>
          <p className={`text-sm font-medium ${productInfo.color} mb-1`}>Cantidad Cosechada</p>
          <p className={`text-4xl font-bold ${productInfo.color}`}>
            {cosecha.quantity} <span className="text-2xl">{cosecha.unit}</span>
          </p>
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
                {formatDate(cosecha.date)}
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
              <p className="font-medium text-gray-900">{cosecha.performedBy}</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3 md:col-span-2">
            <div className="p-2 bg-amber-50 rounded-lg">
              <MapPin className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ubicacion</p>
              <p className="font-medium text-gray-900">
                {cosecha.apiarioName}
                {cosecha.colmenaCode && ` - ${cosecha.colmenaCode}`}
              </p>
            </div>
          </div>
        </div>

        {/* Notes */}
        {cosecha.notes && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Notas</h3>
            <p className="text-gray-700 bg-gray-50 rounded-lg p-3">
              {cosecha.notes}
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
                  onEdit(cosecha);
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
