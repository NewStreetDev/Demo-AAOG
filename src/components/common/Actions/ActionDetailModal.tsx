import { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Package,
  MapPin,
  FileText,
  Pencil,
  Trash2,
} from 'lucide-react';
import { Modal, ConfirmModal } from '../Modals';
import { useDeleteAction } from '../../../hooks/useActions';
import { getActionTypeLabel, moduleOptions } from '../../../schemas/action.schema';
import type { GenericAction } from '../../../types/common.types';

interface ActionDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: GenericAction | null;
  onEdit?: (action: GenericAction) => void;
  onDeleteSuccess?: () => void;
}

function formatDate(date: Date | string | undefined): string {
  if (!date) return '-';
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString('es-CR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getModuleLabel(module: string): string {
  const found = moduleOptions.find(m => m.value === module);
  return found?.label || module;
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

export default function ActionDetailModal({
  open,
  onOpenChange,
  action,
  onEdit,
  onDeleteSuccess,
}: ActionDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteMutation = useDeleteAction();

  if (!action) return null;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(action.id);
      setShowDeleteConfirm(false);
      onOpenChange(false);
      onDeleteSuccess?.();
    } catch (error) {
      console.error('Error deleting action:', error);
    }
  };

  const handleEdit = () => {
    onOpenChange(false);
    onEdit?.(action);
  };

  return (
    <>
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title={getActionTypeLabel(action.module, action.actionType)}
        description={getModuleLabel(action.module)}
        size="md"
      >
        <div className="space-y-1">
          {/* Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <DetailRow
              icon={<Calendar className="w-4 h-4" />}
              label="Fecha"
              value={formatDate(action.date)}
            />
            <DetailRow
              icon={<User className="w-4 h-4" />}
              label="Trabajador"
              value={action.workerName}
            />
            <DetailRow
              icon={<Clock className="w-4 h-4" />}
              label="Horas Totales"
              value={`${action.totalHours} horas`}
            />
            {action.targetName && (
              <DetailRow
                icon={<MapPin className="w-4 h-4" />}
                label="Área/Objeto"
                value={action.targetName}
              />
            )}
            {action.description && (
              <DetailRow
                icon={<FileText className="w-4 h-4" />}
                label="Descripción"
                value={action.description}
              />
            )}
          </div>

          {/* Insumos Used */}
          {action.insumos && action.insumos.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-gray-400" />
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Insumos Utilizados
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                {action.insumos.map((insumo, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-white rounded-md px-3 py-2 border border-gray-200"
                  >
                    <span className="text-sm font-medium">{insumo.insumoName}</span>
                    <span className="text-sm text-gray-600">
                      {insumo.quantity} {insumo.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {action.notes && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
              <p className="text-xs text-amber-600 uppercase tracking-wide mb-1">Notas</p>
              <p className="text-sm text-amber-800">{action.notes}</p>
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
        title="Eliminar Acción"
        description={`¿Estás seguro de que deseas eliminar esta acción de ${getActionTypeLabel(action.module, action.actionType)}? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        variant="danger"
      />
    </>
  );
}
