import { useState } from 'react';
import {
  Tag,
  Calendar,
  MapPin,
  FileText,
  Pencil,
  Trash2,
  Crown,
  Layers,
  Thermometer,
  ArrowRightLeft,
  Grid3X3,
} from 'lucide-react';
import { Modal, ConfirmModal } from '../common/Modals';
import { useDeleteBeehive } from '../../hooks/usePecuarioMutations';
import type { Beehive } from '../../types/pecuario.types';

interface BeehiveDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  beehive: Beehive | null;
  onEdit?: (beehive: Beehive) => void;
  onDeleteSuccess?: () => void;
}

// Colors by beehive type
const typeColors: Record<string, string> = {
  langstroth: 'bg-blue-100 text-blue-700',
  top_bar: 'bg-amber-100 text-amber-700',
  warre: 'bg-green-100 text-green-700',
  traditional: 'bg-purple-100 text-purple-700',
  other: 'bg-gray-100 text-gray-700',
};

const typeLabels: Record<string, string> = {
  langstroth: 'Langstroth',
  top_bar: 'Top Bar',
  warre: 'Warré',
  traditional: 'Tradicional',
  other: 'Otro',
};

function getStatusInfo(status: Beehive['status']): { label: string; color: string } {
  const statusMap = {
    active: { label: 'Activa', color: 'bg-green-100 text-green-700' },
    inactive: { label: 'Inactiva', color: 'bg-gray-100 text-gray-600' },
    dead: { label: 'Muerta', color: 'bg-red-100 text-red-700' },
    sold: { label: 'Vendida', color: 'bg-blue-100 text-blue-700' },
    merged: { label: 'Fusionada', color: 'bg-purple-100 text-purple-700' },
  };
  return statusMap[status] || statusMap.active;
}

const strengthLabels: Record<string, string> = {
  strong: 'Fuerte',
  medium: 'Media',
  weak: 'Débil',
};

const strengthColors: Record<string, string> = {
  strong: 'text-green-700 bg-green-50',
  medium: 'text-amber-700 bg-amber-50',
  weak: 'text-red-700 bg-red-50',
};

const queenStatusLabels: Record<string, string> = {
  present: 'Presente',
  absent: 'Ausente',
  virgin: 'Virgen',
  laying: 'Poniendo',
  unknown: 'Desconocido',
};

const queenOriginLabels: Record<string, string> = {
  swarm: 'Enjambre',
  purchased: 'Comprada',
  raised: 'Criada',
  unknown: 'Desconocido',
};

const temperamentLabels: Record<string, string> = {
  calm: 'Tranquila',
  moderate: 'Moderada',
  aggressive: 'Agresiva',
};

const entryReasonLabels: Record<string, string> = {
  purchase: 'Compra',
  swarm_capture: 'Captura de enjambre',
  split: 'División',
  transfer: 'Transferencia',
  nucleus: 'Núcleo',
};

const exitReasonLabels: Record<string, string> = {
  sale: 'Venta',
  death: 'Muerte',
  merge: 'Fusión',
  transfer: 'Transferencia',
  absconded: 'Abandono',
};

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

export default function BeehiveDetailModal({
  open,
  onOpenChange,
  beehive,
  onEdit,
  onDeleteSuccess,
}: BeehiveDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteMutation = useDeleteBeehive();

  if (!beehive) return null;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(beehive.id);
      setShowDeleteConfirm(false);
      onOpenChange(false);
      onDeleteSuccess?.();
    } catch (error) {
      console.error('Error deleting beehive:', error);
    }
  };

  const handleEdit = () => {
    onOpenChange(false);
    onEdit?.(beehive);
  };

  const statusInfo = getStatusInfo(beehive.status);

  return (
    <>
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title={beehive.name || beehive.code}
        description={beehive.name ? beehive.code : beehive.apiaryName}
        size="lg"
      >
        <div className="space-y-1">
          {/* Status Badges */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${typeColors[beehive.type] || 'bg-gray-100 text-gray-700'}`}
            >
              {typeLabels[beehive.type] || beehive.type}
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
              <p className="text-xs text-blue-600 uppercase tracking-wide">Marcos</p>
              <p className="text-lg font-bold text-blue-700 mt-1">
                {beehive.frameCount}
              </p>
            </div>
            <div className={`rounded-lg p-3 text-center ${strengthColors[beehive.strength]}`}>
              <p className="text-xs uppercase tracking-wide">Fuerza</p>
              <p className="text-lg font-bold mt-1">
                {strengthLabels[beehive.strength]}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <DetailRow
              icon={<Tag className="w-4 h-4" />}
              label="Código"
              value={beehive.code}
            />
            <DetailRow
              icon={<Grid3X3 className="w-4 h-4" />}
              label="Tipo de Colmena"
              value={typeLabels[beehive.type] || beehive.type}
            />
            <DetailRow
              icon={<MapPin className="w-4 h-4" />}
              label="Apiario"
              value={`${beehive.apiaryName}${beehive.position ? ` - ${beehive.position}` : ''}`}
            />
            <DetailRow
              icon={<Calendar className="w-4 h-4" />}
              label="Fecha de Instalación"
              value={`${formatDate(beehive.installationDate)} (${entryReasonLabels[beehive.entryReason]})`}
            />
            <DetailRow
              icon={<Crown className="w-4 h-4" />}
              label="Reina"
              value={
                <div className="space-y-1">
                  <span>{queenStatusLabels[beehive.queenStatus]}</span>
                  {beehive.queenMarked && (
                    <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                      Marcada{beehive.queenColor ? ` (${beehive.queenColor})` : ''}
                    </span>
                  )}
                  {beehive.queenAge !== undefined && (
                    <span className="ml-2 text-xs text-gray-500">
                      {beehive.queenAge} {beehive.queenAge === 1 ? 'año' : 'años'}
                    </span>
                  )}
                  {beehive.queenOrigin && (
                    <span className="ml-2 text-xs text-gray-500">
                      ({queenOriginLabels[beehive.queenOrigin]})
                    </span>
                  )}
                </div>
              }
            />
            <DetailRow
              icon={<Thermometer className="w-4 h-4" />}
              label="Temperamento"
              value={temperamentLabels[beehive.temperament]}
            />
            <DetailRow
              icon={<Layers className="w-4 h-4" />}
              label="Alzas / Excluidor"
              value={`${beehive.superCount} alzas${beehive.hasQueenExcluder ? ' - Con excluidor de reina' : ' - Sin excluidor'}`}
            />
            {beehive.parentHiveCode && (
              <DetailRow
                icon={<ArrowRightLeft className="w-4 h-4" />}
                label="Colmena Madre"
                value={beehive.parentHiveCode}
              />
            )}
            {beehive.exitDate && (
              <DetailRow
                icon={<Calendar className="w-4 h-4" />}
                label="Fecha de Salida"
                value={`${formatDate(beehive.exitDate)}${beehive.exitReason ? ` (${exitReasonLabels[beehive.exitReason]})` : ''}`}
              />
            )}
          </div>

          {/* Notes */}
          {beehive.notes && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-amber-600" />
                <p className="text-xs text-amber-600 uppercase tracking-wide">Notas</p>
              </div>
              <p className="text-sm text-amber-800">{beehive.notes}</p>
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
        description={`¿Estás seguro de que deseas eliminar "${beehive.name || beehive.code}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        variant="danger"
      />
    </>
  );
}
