import {
  Calendar,
  User,
  MapPin,
  Crown,
  Droplet,
  Users,
  Egg,
  Leaf,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Modal } from '../common/Modals';
import { useDeleteRevision } from '../../hooks/useApiculturaMutations';
import type { Revision } from '../../types/apicultura.types';

interface RevisionDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  revision: Revision | null;
  onEdit?: (revision: Revision) => void;
}

const postureStateLabels: Record<string, { label: string; color: string }> = {
  excellent: { label: 'Excelente', color: 'text-green-600' },
  good: { label: 'Buena', color: 'text-blue-600' },
  regular: { label: 'Regular', color: 'text-amber-600' },
  bad: { label: 'Mala', color: 'text-red-600' },
  none: { label: 'Sin Postura', color: 'text-gray-600' },
};

const amountLabels: Record<string, { label: string; color: string }> = {
  none: { label: 'Ninguna', color: 'text-red-600' },
  low: { label: 'Baja', color: 'text-amber-600' },
  medium: { label: 'Media', color: 'text-blue-600' },
  high: { label: 'Alta', color: 'text-green-600' },
};

const weightLabels: Record<string, { label: string; color: string }> = {
  bad: { label: 'Malo', color: 'text-red-600' },
  regular: { label: 'Regular', color: 'text-amber-600' },
  good: { label: 'Bueno', color: 'text-green-600' },
};

export default function RevisionDetailModal({
  open,
  onOpenChange,
  revision,
  onEdit,
}: RevisionDetailModalProps) {
  const deleteMutation = useDeleteRevision();

  if (!revision) return null;

  const handleDelete = async () => {
    if (window.confirm('Esta seguro de que desea eliminar esta revision?')) {
      try {
        await deleteMutation.mutateAsync(revision.id);
        onOpenChange(false);
      } catch (error) {
        console.error('Error deleting revision:', error);
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

  const getHealthColor = (value: number) => {
    if (value >= 8) return 'text-green-600 bg-green-100';
    if (value >= 6) return 'text-blue-600 bg-blue-100';
    if (value >= 4) return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };

  const postureInfo = postureStateLabels[revision.postureState] || { label: revision.postureState, color: 'text-gray-600' };
  const weightInfo = weightLabels[revision.weight] || { label: revision.weight, color: 'text-gray-600' };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Detalle de Revision"
      description={`Revision ${revision.type === 'general' ? 'General' : 'Individual'} - ${formatDate(revision.date)}`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Header Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Fecha</p>
              <p className="font-medium text-gray-900">{formatDate(revision.date)}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <User className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Inspector</p>
              <p className="font-medium text-gray-900">{revision.inspector}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <MapPin className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ubicacion</p>
              <p className="font-medium text-gray-900">
                {revision.apiarioName}
                {revision.colmenaCode && ` - ${revision.colmenaCode}`}
              </p>
            </div>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-lg ${getHealthColor(revision.generalState)}`}>
            <p className="text-xs font-medium opacity-80">Estado General</p>
            <p className="text-2xl font-bold">{revision.generalState}/10</p>
          </div>
          <div className={`p-4 rounded-lg ${getHealthColor(revision.sanity)}`}>
            <p className="text-xs font-medium opacity-80">Sanidad</p>
            <p className="text-2xl font-bold">{revision.sanity}/10</p>
          </div>
          <div className="p-4 rounded-lg bg-amber-50">
            <p className="text-xs font-medium text-amber-600">Madurez Miel</p>
            <p className="text-2xl font-bold text-amber-700">{revision.honeyMaturity}%</p>
          </div>
          <div className={`p-4 rounded-lg ${weightInfo.color === 'text-green-600' ? 'bg-green-50' : weightInfo.color === 'text-amber-600' ? 'bg-amber-50' : 'bg-red-50'}`}>
            <p className={`text-xs font-medium ${weightInfo.color}`}>Peso</p>
            <p className={`text-xl font-bold ${weightInfo.color}`}>{weightInfo.label}</p>
          </div>
        </div>

        {/* Queen Section */}
        <div className="bg-pink-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Crown className="w-5 h-5 text-pink-600" />
            <h3 className="text-sm font-semibold text-pink-800">Estado de la Reina</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              {revision.queenPresent ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span className={revision.queenPresent ? 'text-green-700' : 'text-red-700'}>
                {revision.queenPresent ? 'Presente' : 'Ausente'}
              </span>
            </div>
            {revision.queenAge !== undefined && (
              <div>
                <p className="text-xs text-pink-600">Edad</p>
                <p className="font-medium text-pink-900">{revision.queenAge} meses</p>
              </div>
            )}
            <div className="flex items-center gap-2">
              {revision.queenChanged ? (
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
              ) : (
                <XCircle className="w-5 h-5 text-gray-400" />
              )}
              <span className={revision.queenChanged ? 'text-blue-700' : 'text-gray-500'}>
                {revision.queenChanged ? 'Cambiada' : 'No Cambiada'}
              </span>
            </div>
            <div>
              <p className="text-xs text-pink-600">Estado Postura</p>
              <p className={`font-medium ${postureInfo.color}`}>{postureInfo.label}</p>
            </div>
          </div>
        </div>

        {/* Internal Revision */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Revision Interna</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-start gap-2">
              <Users className="w-4 h-4 text-gray-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Poblacion</p>
                <p className={`font-medium ${amountLabels[revision.population]?.color || 'text-gray-900'}`}>
                  {amountLabels[revision.population]?.label || revision.population}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Egg className="w-4 h-4 text-gray-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Cria por Nacer</p>
                <p className={`font-medium ${amountLabels[revision.broodAmount]?.color || 'text-gray-900'}`}>
                  {amountLabels[revision.broodAmount]?.label || revision.broodAmount}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Leaf className="w-4 h-4 text-gray-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Reservas Polen</p>
                <p className={`font-medium ${amountLabels[revision.foodReserves.pollen]?.color || 'text-gray-900'}`}>
                  {amountLabels[revision.foodReserves.pollen]?.label || revision.foodReserves.pollen}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Droplet className="w-4 h-4 text-gray-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Reservas Nectar</p>
                <p className={`font-medium ${amountLabels[revision.foodReserves.nectar]?.color || 'text-gray-900'}`}>
                  {amountLabels[revision.foodReserves.nectar]?.label || revision.foodReserves.nectar}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Comments */}
        {revision.comments && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Comentarios</h3>
            <p className="text-gray-700 bg-gray-50 rounded-lg p-3">
              {revision.comments}
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
                  onEdit(revision);
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
