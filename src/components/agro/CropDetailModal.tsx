import { useState } from 'react';
import {
  MapPin,
  Calendar,
  Leaf,
  Layers,
  Package,
  FileText,
  Pencil,
  Trash2,
} from 'lucide-react';
import { Modal, ConfirmModal } from '../common/Modals';
import { useDeleteCrop } from '../../hooks/useAgroMutations';
import type { Crop, CropStatus } from '../../types/agro.types';

interface CropDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  crop: Crop | null;
  onEdit?: (crop: Crop) => void;
  onDeleteSuccess?: () => void;
}

function getStatusInfo(status: CropStatus): { label: string; color: string } {
  const statusMap: Record<CropStatus, { label: string; color: string }> = {
    planned: { label: 'Planificado', color: 'bg-gray-100 text-gray-600' },
    planted: { label: 'Sembrado', color: 'bg-blue-100 text-blue-700' },
    growing: { label: 'En Crecimiento', color: 'bg-green-100 text-green-700' },
    flowering: { label: 'En Floración', color: 'bg-pink-100 text-pink-700' },
    fruiting: { label: 'En Fructificación', color: 'bg-orange-100 text-orange-700' },
    ready: { label: 'Listo para Cosecha', color: 'bg-amber-100 text-amber-700' },
    harvested: { label: 'Cosechado', color: 'bg-purple-100 text-purple-700' },
  };
  return statusMap[status] || statusMap.planned;
}

function getProductTypeLabel(type: Crop['productType']): string {
  const labels = {
    primary: 'Primario',
    secondary: 'Secundario',
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

function formatNumber(num: number | undefined, unit?: string): string {
  if (num === undefined) return '-';
  const formatted = new Intl.NumberFormat('es-CR').format(num);
  return unit ? `${formatted} ${unit}` : formatted;
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

export default function CropDetailModal({
  open,
  onOpenChange,
  crop,
  onEdit,
  onDeleteSuccess,
}: CropDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteMutation = useDeleteCrop();

  if (!crop) return null;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(crop.id);
      setShowDeleteConfirm(false);
      onOpenChange(false);
      onDeleteSuccess?.();
    } catch (error) {
      console.error('Error deleting crop:', error);
    }
  };

  const handleEdit = () => {
    onOpenChange(false);
    onEdit?.(crop);
  };

  const statusInfo = getStatusInfo(crop.status);

  return (
    <>
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title={crop.name}
        description={`${crop.variety} - ${getProductTypeLabel(crop.productType)}`}
        size="md"
      >
        <div className="space-y-1">
          {/* Status Badge and Icon */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.color}`}
            >
              {statusInfo.label}
            </span>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-emerald-50 rounded-lg p-3 text-center">
              <p className="text-xs text-emerald-600 uppercase tracking-wide">Área</p>
              <p className="text-lg font-bold text-emerald-700 mt-1">
                {crop.area} <span className="text-sm">ha</span>
              </p>
            </div>
            {crop.estimatedYield && (
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <p className="text-xs text-blue-600 uppercase tracking-wide">
                  Rendimiento Esperado
                </p>
                <p className="text-lg font-bold text-blue-700 mt-1">
                  {formatNumber(crop.estimatedYield, crop.yieldUnit)}
                </p>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <DetailRow
              icon={<MapPin className="w-4 h-4" />}
              label="Lote"
              value={crop.loteName || '-'}
            />
            <DetailRow
              icon={<Calendar className="w-4 h-4" />}
              label="Fecha de Siembra"
              value={formatDate(crop.plantingDate)}
            />
            <DetailRow
              icon={<Calendar className="w-4 h-4" />}
              label="Cosecha Esperada"
              value={formatDate(crop.expectedHarvestDate)}
            />
            {crop.actualHarvestDate && (
              <DetailRow
                icon={<Calendar className="w-4 h-4" />}
                label="Cosecha Real"
                value={formatDate(crop.actualHarvestDate)}
              />
            )}
            {crop.seedsUsed && (
              <DetailRow
                icon={<Package className="w-4 h-4" />}
                label="Semillas Usadas"
                value={formatNumber(crop.seedsUsed, crop.seedsUnit)}
              />
            )}
            {crop.actualYield && (
              <DetailRow
                icon={<Layers className="w-4 h-4" />}
                label="Rendimiento Real"
                value={formatNumber(crop.actualYield, crop.yieldUnit)}
              />
            )}
          </div>

          {/* Notes */}
          {crop.notes && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-amber-600" />
                <p className="text-xs text-amber-600 uppercase tracking-wide">Notas</p>
              </div>
              <p className="text-sm text-amber-800">{crop.notes}</p>
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
        title="Eliminar Cultivo"
        description={`¿Estás seguro de que deseas eliminar "${crop.name} - ${crop.variety}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        variant="danger"
      />
    </>
  );
}
