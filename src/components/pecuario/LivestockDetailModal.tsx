import { useState } from 'react';
import {
  Tag,
  Calendar,
  MapPin,
  Scale,
  FileText,
  Pencil,
  Trash2,
  Users,
} from 'lucide-react';
import { Modal, ConfirmModal } from '../common/Modals';
import { useDeleteLivestock } from '../../hooks/usePecuarioMutations';
import type { Livestock, LivestockCategory } from '../../types/pecuario.types';

interface LivestockDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  livestock: Livestock | null;
  onEdit?: (livestock: Livestock) => void;
  onDeleteSuccess?: () => void;
}

const categoryLabels: Record<LivestockCategory, string> = {
  ternero: 'Ternero',
  ternera: 'Ternera',
  novillo: 'Novillo',
  novilla: 'Novilla',
  vaca: 'Vaca',
  toro: 'Toro',
};

const categoryColors: Record<LivestockCategory, string> = {
  ternero: 'bg-green-100 text-green-700',
  ternera: 'bg-amber-100 text-amber-700',
  novillo: 'bg-blue-100 text-blue-700',
  novilla: 'bg-purple-100 text-purple-700',
  vaca: 'bg-pink-100 text-pink-700',
  toro: 'bg-red-100 text-red-700',
};

function getStatusInfo(status: Livestock['status']): { label: string; color: string } {
  const statusMap = {
    active: { label: 'Activo', color: 'bg-green-100 text-green-700' },
    sold: { label: 'Vendido', color: 'bg-blue-100 text-blue-700' },
    deceased: { label: 'Fallecido', color: 'bg-gray-100 text-gray-600' },
    transferred: { label: 'Transferido', color: 'bg-amber-100 text-amber-700' },
  };
  return statusMap[status] || statusMap.active;
}

function getGenderLabel(gender: Livestock['gender']): string {
  return gender === 'male' ? 'Macho' : 'Hembra';
}

function getEntryReasonLabel(reason: Livestock['entryReason']): string {
  const labels = {
    birth: 'Nacimiento',
    purchase: 'Compra',
    transfer: 'Transferencia',
  };
  return labels[reason];
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

function calculateAge(birthDate: Date | string): string {
  const birth = birthDate instanceof Date ? birthDate : new Date(birthDate);
  const now = new Date();
  const years = now.getFullYear() - birth.getFullYear();
  const months = now.getMonth() - birth.getMonth();

  if (years === 0) {
    return `${months < 0 ? 12 + months : months} meses`;
  }

  const adjustedYears = months < 0 ? years - 1 : years;
  const adjustedMonths = months < 0 ? 12 + months : months;

  if (adjustedYears === 0) {
    return `${adjustedMonths} meses`;
  }

  return `${adjustedYears} años, ${adjustedMonths} meses`;
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

export default function LivestockDetailModal({
  open,
  onOpenChange,
  livestock,
  onEdit,
  onDeleteSuccess,
}: LivestockDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteMutation = useDeleteLivestock();

  if (!livestock) return null;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(livestock.id);
      setShowDeleteConfirm(false);
      onOpenChange(false);
      onDeleteSuccess?.();
    } catch (error) {
      console.error('Error deleting livestock:', error);
    }
  };

  const handleEdit = () => {
    onOpenChange(false);
    onEdit?.(livestock);
  };

  const statusInfo = getStatusInfo(livestock.status);

  return (
    <>
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title={livestock.name || livestock.tag}
        description={livestock.name ? livestock.tag : livestock.breed}
        size="md"
      >
        <div className="space-y-1">
          {/* Status Badges */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${categoryColors[livestock.category]}`}
            >
              {categoryLabels[livestock.category]}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.color}`}
            >
              {statusInfo.label}
            </span>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-xs text-blue-600 uppercase tracking-wide">Peso Actual</p>
              <p className="text-lg font-bold text-blue-700 mt-1">
                {livestock.weight} <span className="text-sm">kg</span>
              </p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-3 text-center">
              <p className="text-xs text-emerald-600 uppercase tracking-wide">Edad</p>
              <p className="text-lg font-bold text-emerald-700 mt-1">
                {calculateAge(livestock.birthDate)}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <DetailRow
              icon={<Tag className="w-4 h-4" />}
              label="Raza / Género"
              value={`${livestock.breed} - ${getGenderLabel(livestock.gender)}`}
            />
            <DetailRow
              icon={<MapPin className="w-4 h-4" />}
              label="Ubicación"
              value={livestock.location}
            />
            <DetailRow
              icon={<Calendar className="w-4 h-4" />}
              label="Fecha de Nacimiento"
              value={formatDate(livestock.birthDate)}
            />
            <DetailRow
              icon={<Calendar className="w-4 h-4" />}
              label="Fecha de Entrada"
              value={`${formatDate(livestock.entryDate)} (${getEntryReasonLabel(livestock.entryReason)})`}
            />
            {(livestock.motherTag || livestock.fatherTag) && (
              <DetailRow
                icon={<Users className="w-4 h-4" />}
                label="Padres"
                value={
                  <div className="flex gap-4">
                    {livestock.motherTag && (
                      <span>Madre: <strong>{livestock.motherTag}</strong></span>
                    )}
                    {livestock.fatherTag && (
                      <span>Padre: <strong>{livestock.fatherTag}</strong></span>
                    )}
                  </div>
                }
              />
            )}
            <DetailRow
              icon={<Scale className="w-4 h-4" />}
              label="Peso"
              value={`${livestock.weight} kg`}
            />
          </div>

          {/* Notes */}
          {livestock.notes && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-amber-600" />
                <p className="text-xs text-amber-600 uppercase tracking-wide">Notas</p>
              </div>
              <p className="text-sm text-amber-800">{livestock.notes}</p>
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
        title="Eliminar Animal"
        description={`¿Estás seguro de que deseas eliminar "${livestock.name || livestock.tag}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        variant="danger"
      />
    </>
  );
}
