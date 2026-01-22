import { useState } from 'react';
import {
  Hexagon,
  Crown,
  Users,
  Heart,
  Scale,
  Droplets,
  Calendar,
  FileText,
  Pencil,
  Trash2,
} from 'lucide-react';
import { Modal, ConfirmModal } from '../common/Modals';
import { useDeleteColmena } from '../../hooks/useApiculturaMutations';
import type { Colmena } from '../../types/apicultura.types';

interface ColmenaDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  colmena: Colmena | null;
  onEdit?: (colmena: Colmena) => void;
  onDeleteSuccess?: () => void;
}

function getStatusInfo(status: Colmena['status']): { label: string; color: string } {
  const statusMap = {
    active: { label: 'Activa', color: 'bg-blue-100 text-blue-700' },
    producing: { label: 'Produciendo', color: 'bg-green-100 text-green-700' },
    resting: { label: 'Descanso', color: 'bg-gray-100 text-gray-600' },
    quarantine: { label: 'Cuarentena', color: 'bg-red-100 text-red-700' },
    inactive: { label: 'Inactiva', color: 'bg-gray-100 text-gray-500' },
  };
  return statusMap[status] || statusMap.inactive;
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

function getQueenStatusLabel(status: Colmena['queenStatus']): string {
  const labels = { present: 'Presente', absent: 'Ausente', new: 'Nueva' };
  return labels[status];
}

function getPopulationLabel(population: Colmena['population']): string {
  const labels = { low: 'Baja', medium: 'Media', high: 'Alta' };
  return labels[population];
}

function getWeightLabel(weight: Colmena['weight']): string {
  const labels = { bad: 'Malo', regular: 'Regular', good: 'Bueno' };
  return labels[weight];
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

export default function ColmenaDetailModal({
  open,
  onOpenChange,
  colmena,
  onEdit,
  onDeleteSuccess,
}: ColmenaDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteMutation = useDeleteColmena();

  if (!colmena) return null;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(colmena.id);
      setShowDeleteConfirm(false);
      onOpenChange(false);
      onDeleteSuccess?.();
    } catch (error) {
      console.error('Error deleting colmena:', error);
    }
  };

  const handleEdit = () => {
    onOpenChange(false);
    onEdit?.(colmena);
  };

  const statusInfo = getStatusInfo(colmena.status);
  const healthColor = getHealthColor(colmena.health);

  return (
    <>
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title={colmena.code}
        description={colmena.apiarioName || 'Sin apiario'}
        size="md"
      >
        <div className="space-y-1">
          {/* Status Badge */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.color}`}
            >
              {statusInfo.label}
            </span>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className={`rounded-lg p-3 text-center ${healthColor.split(' ')[1]}`}>
              <p className={`text-xs uppercase tracking-wide ${healthColor.split(' ')[0]}`}>Salud</p>
              <p className={`text-xl font-bold mt-1 ${healthColor.split(' ')[0]}`}>
                {colmena.health}
              </p>
              <p className={`text-xs ${healthColor.split(' ')[0]}`}>{getHealthLabel(colmena.health)}</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-3 text-center">
              <p className="text-xs text-amber-600 uppercase tracking-wide">Miel</p>
              <p className="text-xl font-bold text-amber-700 mt-1">{colmena.honeyMaturity}%</p>
              <p className="text-xs text-amber-500">madurez</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <p className="text-xs text-purple-600 uppercase tracking-wide">Reina</p>
              <p className="text-xl font-bold text-purple-700 mt-1">{colmena.queenAge}</p>
              <p className="text-xs text-purple-500">meses</p>
            </div>
          </div>

          {/* Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <DetailRow
              icon={<Hexagon className="w-4 h-4" />}
              label="Apiario"
              value={colmena.apiarioName || '-'}
            />
            <DetailRow
              icon={<Crown className="w-4 h-4" />}
              label="Estado Reina"
              value={getQueenStatusLabel(colmena.queenStatus)}
            />
            <DetailRow
              icon={<Users className="w-4 h-4" />}
              label="Población"
              value={getPopulationLabel(colmena.population)}
            />
            <DetailRow
              icon={<Heart className="w-4 h-4" />}
              label="Salud"
              value={`${colmena.health} - ${getHealthLabel(colmena.health)}`}
            />
            <DetailRow
              icon={<Scale className="w-4 h-4" />}
              label="Peso"
              value={getWeightLabel(colmena.weight)}
            />
            <DetailRow
              icon={<Droplets className="w-4 h-4" />}
              label="Madurez de Miel"
              value={`${colmena.honeyMaturity}%`}
            />
            <DetailRow
              icon={<Calendar className="w-4 h-4" />}
              label="Última Revisión"
              value={formatDate(colmena.lastRevision)}
            />
          </div>

          {/* Notes */}
          {colmena.notes && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-amber-600" />
                <p className="text-xs text-amber-600 uppercase tracking-wide">Notas</p>
              </div>
              <p className="text-sm text-amber-800">{colmena.notes}</p>
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
        title="Eliminar Colmena"
        description={`¿Estás seguro de que deseas eliminar "${colmena.code}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        variant="danger"
      />
    </>
  );
}
