import { useState } from 'react';
import {
  MapPin,
  Droplets,
  Layers,
  Calendar,
  FileText,
  Pencil,
  Trash2,
} from 'lucide-react';
import { Modal, ConfirmModal } from '../common/Modals';
import { useDeleteLote } from '../../hooks/useAgroMutations';
import type { Lote } from '../../types/agro.types';

interface LoteDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lote: Lote | null;
  onEdit?: (lote: Lote) => void;
  onDeleteSuccess?: () => void;
}

function getStatusInfo(status: Lote['status']): { label: string; color: string } {
  const statusMap = {
    active: { label: 'Activo', color: 'bg-green-100 text-green-700' },
    resting: { label: 'En Descanso', color: 'bg-amber-100 text-amber-700' },
    preparation: { label: 'En Preparación', color: 'bg-blue-100 text-blue-700' },
  };
  return statusMap[status] || statusMap.active;
}

function getIrrigationLabel(type?: Lote['irrigationType']): string {
  if (!type) return 'Sin riego';
  const labels = {
    drip: 'Goteo',
    sprinkler: 'Aspersión',
    flood: 'Inundación',
    none: 'Sin riego',
  };
  return labels[type];
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

export default function LoteDetailModal({
  open,
  onOpenChange,
  lote,
  onEdit,
  onDeleteSuccess,
}: LoteDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteMutation = useDeleteLote();

  if (!lote) return null;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(lote.id);
      setShowDeleteConfirm(false);
      onOpenChange(false);
      onDeleteSuccess?.();
    } catch (error) {
      console.error('Error deleting lote:', error);
    }
  };

  const handleEdit = () => {
    onOpenChange(false);
    onEdit?.(lote);
  };

  const statusInfo = getStatusInfo(lote.status);

  return (
    <>
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title={lote.name}
        description={lote.code}
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

          {/* Area Summary */}
          <div className="bg-emerald-50 rounded-lg p-4 text-center mb-4">
            <p className="text-xs text-emerald-600 uppercase tracking-wide">Área Total</p>
            <p className="text-2xl font-bold text-emerald-700 mt-1">
              {lote.area} <span className="text-lg">ha</span>
            </p>
          </div>

          {/* Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            {lote.soilType && (
              <DetailRow
                icon={<Layers className="w-4 h-4" />}
                label="Tipo de Suelo"
                value={lote.soilType}
              />
            )}
            <DetailRow
              icon={<Droplets className="w-4 h-4" />}
              label="Tipo de Riego"
              value={getIrrigationLabel(lote.irrigationType)}
            />
            <DetailRow
              icon={<Calendar className="w-4 h-4" />}
              label="Fecha de Creación"
              value={formatDate(lote.createdAt)}
            />
            <DetailRow
              icon={<Calendar className="w-4 h-4" />}
              label="Última Actualización"
              value={formatDate(lote.updatedAt)}
            />
          </div>

          {/* Notes */}
          {lote.notes && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-amber-600" />
                <p className="text-xs text-amber-600 uppercase tracking-wide">Notas</p>
              </div>
              <p className="text-sm text-amber-800">{lote.notes}</p>
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
        title="Eliminar Lote"
        description={`¿Estás seguro de que deseas eliminar "${lote.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        variant="danger"
      />
    </>
  );
}
