import { useState } from 'react';
import {
  MapPin,
  Calendar,
  Heart,
  FileText,
  Pencil,
  Trash2,
  DollarSign,
} from 'lucide-react';
import { Modal, ConfirmModal } from '../common/Modals';
import { useDeleteApiario } from '../../hooks/useApiculturaMutations';
import type { Apiario } from '../../types/apicultura.types';

interface ApiarioDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiario: Apiario | null;
  onEdit?: (apiario: Apiario) => void;
  onDeleteSuccess?: () => void;
}

function getHealthColor(health: number): string {
  if (health >= 9) return 'text-green-600 bg-green-100';
  if (health >= 7) return 'text-blue-600 bg-blue-100';
  if (health >= 5) return 'text-amber-600 bg-amber-100';
  return 'text-red-600 bg-red-100';
}

function getHealthLabel(health: number): string {
  if (health >= 9) return 'Excelente';
  if (health >= 7) return 'Buena';
  if (health >= 5) return 'Regular';
  return 'Crítica';
}

function formatDate(date: Date | string | undefined): string {
  if (!date) return '-';
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString('es-CR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatCurrency(amount: number | undefined): string {
  if (amount === undefined) return '-';
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
}

function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="text-gray-400 mt-0.5">{icon}</div>
      <div className="flex-1">
        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium text-gray-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function ApiarioDetailModal({
  open,
  onOpenChange,
  apiario,
  onEdit,
  onDeleteSuccess,
}: ApiarioDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteMutation = useDeleteApiario();

  if (!apiario) return null;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(apiario.id);
      setShowDeleteConfirm(false);
      onOpenChange(false);
      onDeleteSuccess?.();
    } catch (error) {
      console.error('Error deleting apiario:', error);
    }
  };

  const handleEdit = () => {
    onOpenChange(false);
    onEdit?.(apiario);
  };

  const healthColor = getHealthColor(apiario.healthAverage);

  return (
    <>
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title={apiario.name}
        description={apiario.location.address || 'Sin ubicación'}
        size="md"
      >
        <div className="space-y-1">
          {/* Status Badge */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                apiario.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {apiario.status === 'active' ? 'Activo' : 'Inactivo'}
            </span>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-amber-50 rounded-lg p-3 text-center">
              <p className="text-xs text-amber-600 uppercase tracking-wide">Colmenas</p>
              <p className="text-xl font-bold text-amber-700 mt-1">{apiario.colmenasCount}</p>
              <p className="text-xs text-amber-500">{apiario.activeColmenas} activas</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3 text-center">
              <p className="text-xs text-yellow-600 uppercase tracking-wide">Miel</p>
              <p className="text-xl font-bold text-yellow-700 mt-1">{apiario.production.honey}</p>
              <p className="text-xs text-yellow-500">kg</p>
            </div>
            <div className={`rounded-lg p-3 text-center ${healthColor.split(' ')[1]}`}>
              <p className={`text-xs uppercase tracking-wide ${healthColor.split(' ')[0]}`}>Salud</p>
              <p className={`text-xl font-bold mt-1 ${healthColor.split(' ')[0]}`}>
                {apiario.healthAverage.toFixed(1)}
              </p>
              <p className={`text-xs ${healthColor.split(' ')[0]}`}>{getHealthLabel(apiario.healthAverage)}</p>
            </div>
          </div>

          {/* Production Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Producción</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-sm font-semibold text-gray-900">{apiario.production.honey} kg</p>
                <p className="text-xs text-gray-500">Miel</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{apiario.production.wax} kg</p>
                <p className="text-xs text-gray-500">Cera</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{apiario.production.pollen} kg</p>
                <p className="text-xs text-gray-500">Polen</p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <DetailRow
              icon={<MapPin className="w-4 h-4" />}
              label="Ubicación"
              value={apiario.location.address || 'Sin ubicación'}
            />
            {(apiario.location.lat || apiario.location.lng) && (
              <DetailRow
                icon={<MapPin className="w-4 h-4" />}
                label="Coordenadas"
                value={`${apiario.location.lat}, ${apiario.location.lng}`}
              />
            )}
            <DetailRow
              icon={<Calendar className="w-4 h-4" />}
              label="Última Revisión"
              value={formatDate(apiario.lastRevision)}
            />
            <DetailRow
              icon={<Heart className="w-4 h-4" />}
              label="Salud Promedio"
              value={`${apiario.healthAverage.toFixed(1)} - ${getHealthLabel(apiario.healthAverage)}`}
            />
            {apiario.costPerHour && (
              <DetailRow
                icon={<DollarSign className="w-4 h-4" />}
                label="Costo por Hora"
                value={formatCurrency(apiario.costPerHour)}
              />
            )}
            {apiario.costPerKm && (
              <DetailRow
                icon={<DollarSign className="w-4 h-4" />}
                label="Costo por Km"
                value={formatCurrency(apiario.costPerKm)}
              />
            )}
          </div>

          {/* Notes */}
          {apiario.notes && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-amber-600" />
                <p className="text-xs text-amber-600 uppercase tracking-wide">Notas</p>
              </div>
              <p className="text-sm text-amber-800">{apiario.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between gap-3 pt-5 mt-5 border-t border-gray-100">
            <button
              type="button"
              className="btn-ghost text-red-600 hover:bg-red-50 inline-flex items-center gap-2"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </button>
            <button
              type="button"
              className="btn-primary inline-flex items-center gap-2"
              onClick={handleEdit}
            >
              <Pencil className="w-4 h-4" />
              Editar
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Eliminar Apiario"
        description={`¿Estás seguro de que deseas eliminar "${apiario.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        variant="danger"
      />
    </>
  );
}
