import { useState } from 'react';
import {
  MapPin,
  Layers,
  Calendar,
  Leaf,
  FileText,
  Pencil,
  Trash2,
  ArrowRightLeft,
} from 'lucide-react';
import { Modal, ConfirmModal } from '../common/Modals';
import { useDeletePotrero } from '../../hooks/usePecuarioMutations';
import type { Potrero } from '../../types/pecuario.types';

interface PotreroDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  potrero: Potrero | null;
  onEdit?: (potrero: Potrero) => void;
  onDeleteSuccess?: () => void;
}

function getStatusInfo(status: Potrero['status']): { label: string; color: string } {
  const statusMap = {
    active: { label: 'Activo', color: 'bg-green-100 text-green-700' },
    resting: { label: 'En Descanso', color: 'bg-amber-100 text-amber-700' },
    maintenance: { label: 'En Mantenimiento', color: 'bg-gray-100 text-gray-600' },
  };
  return statusMap[status] || statusMap.active;
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

function getOccupancyColor(current: number, capacity: number): string {
  const percentage = (current / capacity) * 100;
  if (percentage >= 90) return 'bg-red-500';
  if (percentage >= 70) return 'bg-amber-500';
  return 'bg-green-500';
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

export default function PotreroDetailModal({
  open,
  onOpenChange,
  potrero,
  onEdit,
  onDeleteSuccess,
}: PotreroDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteMutation = useDeletePotrero();

  if (!potrero) return null;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(potrero.id);
      setShowDeleteConfirm(false);
      onOpenChange(false);
      onDeleteSuccess?.();
    } catch (error) {
      console.error('Error deleting potrero:', error);
    }
  };

  const handleEdit = () => {
    onOpenChange(false);
    onEdit?.(potrero);
  };

  const statusInfo = getStatusInfo(potrero.status);
  const occupancyPercentage = Math.round((potrero.currentOccupancy / potrero.capacity) * 100);
  const occupancyColor = getOccupancyColor(potrero.currentOccupancy, potrero.capacity);

  return (
    <>
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title={potrero.name}
        description={`${potrero.area} hectáreas`}
        size="md"
      >
        <div className="space-y-1">
          {/* Status Badge and Icon */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <MapPin className="w-6 h-6 text-emerald-600" />
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.color}`}
            >
              {statusInfo.label}
            </span>
          </div>

          {/* Occupancy Bar */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Ocupación</span>
              <span className="text-sm font-bold text-gray-900">
                {potrero.currentOccupancy} / {potrero.capacity} cabezas ({occupancyPercentage}%)
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${occupancyColor} transition-all duration-300`}
                style={{ width: `${occupancyPercentage}%` }}
              />
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-emerald-50 rounded-lg p-3 text-center">
              <p className="text-xs text-emerald-600 uppercase tracking-wide">Área Total</p>
              <p className="text-lg font-bold text-emerald-700 mt-1">
                {potrero.area} <span className="text-sm">ha</span>
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-xs text-blue-600 uppercase tracking-wide">Capacidad</p>
              <p className="text-lg font-bold text-blue-700 mt-1">
                {potrero.capacity} <span className="text-sm">cabezas</span>
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            {potrero.grassType && (
              <DetailRow
                icon={<Leaf className="w-4 h-4" />}
                label="Tipo de Pasto"
                value={potrero.grassType}
              />
            )}
            <DetailRow
              icon={<Layers className="w-4 h-4" />}
              label="Área"
              value={`${potrero.area} hectáreas`}
            />
            {potrero.lastRotation && (
              <DetailRow
                icon={<ArrowRightLeft className="w-4 h-4" />}
                label="Última Rotación"
                value={formatDate(potrero.lastRotation)}
              />
            )}
            {potrero.nextRotation && (
              <DetailRow
                icon={<Calendar className="w-4 h-4" />}
                label="Próxima Rotación"
                value={formatDate(potrero.nextRotation)}
              />
            )}
          </div>

          {/* Notes */}
          {potrero.notes && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-amber-600" />
                <p className="text-xs text-amber-600 uppercase tracking-wide">Notas</p>
              </div>
              <p className="text-sm text-amber-800">{potrero.notes}</p>
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
        title="Eliminar Potrero"
        description={`¿Estás seguro de que deseas eliminar "${potrero.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        variant="danger"
      />
    </>
  );
}
