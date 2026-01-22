import { useState } from 'react';
import {
  MapPin,
  Calendar,
  DollarSign,
  User,
  Hash,
  Building2,
  Clock,
  FileText,
  Pencil,
  Trash2,
} from 'lucide-react';
import { Modal, ConfirmModal } from '../common/Modals';
import { useDeleteAsset } from '../../hooks/useAssetMutations';
import type { Asset } from '../../types/activos.types';

interface AssetDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: Asset | null;
  onEdit?: (asset: Asset) => void;
  onDeleteSuccess?: () => void;
}

function getStatusBadgeColor(status: Asset['status']): string {
  const colors = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-700',
    disposed: 'bg-red-100 text-red-700',
    under_maintenance: 'bg-amber-100 text-amber-700',
  };
  return colors[status] || colors.active;
}

function getStatusLabel(status: Asset['status']): string {
  const labels = {
    active: 'Activo',
    inactive: 'Inactivo',
    disposed: 'Dado de Baja',
    under_maintenance: 'En Mantenimiento',
  };
  return labels[status];
}

function getCategoryLabel(category: Asset['category']): string {
  const labels: Record<Asset['category'], string> = {
    land: 'Terreno',
    building: 'Edificación',
    vehicle: 'Vehículo',
    machinery: 'Maquinaria',
    livestock: 'Semoviente',
    equipment: 'Equipo',
    seeds: 'Semillas',
    genetic_material: 'Material Genético',
    other: 'Otro',
  };
  return labels[category];
}

function getDepreciationLabel(method: Asset['depreciationMethod']): string {
  const labels = {
    straight_line: 'Línea Recta',
    declining_balance: 'Saldo Decreciente',
    none: 'Sin Depreciación',
  };
  return labels[method];
}

function getModuleLabel(module: string | undefined): string {
  if (!module) return '-';
  const labels: Record<string, string> = {
    agro: 'Agricultura',
    pecuario: 'Pecuario',
    apicultura: 'Apicultura',
    procesamiento: 'Procesamiento',
    general: 'General',
  };
  return labels[module] || module;
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

export default function AssetDetailModal({
  open,
  onOpenChange,
  asset,
  onEdit,
  onDeleteSuccess,
}: AssetDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteMutation = useDeleteAsset();

  if (!asset) return null;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(asset.id);
      setShowDeleteConfirm(false);
      onOpenChange(false);
      onDeleteSuccess?.();
    } catch (error) {
      console.error('Error deleting asset:', error);
    }
  };

  const handleEdit = () => {
    onOpenChange(false);
    onEdit?.(asset);
  };

  const depreciationPercentage = asset.acquisitionCost > 0
    ? ((asset.accumulatedDepreciation / asset.acquisitionCost) * 100).toFixed(1)
    : '0';

  return (
    <>
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title={asset.name}
        description={`${asset.code} - ${getCategoryLabel(asset.category)}`}
        size="md"
      >
        <div className="space-y-1">
          {/* Status Badge */}
          <div className="flex justify-center mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(
                asset.status
              )}`}
            >
              {getStatusLabel(asset.status)}
            </span>
          </div>

          {/* Value Summary */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-xs text-green-600 uppercase tracking-wide">Valor Actual</p>
              <p className="text-lg font-bold text-green-700 mt-1">
                {formatCurrency(asset.currentValue)}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <p className="text-xs text-purple-600 uppercase tracking-wide">Depreciación</p>
              <p className="text-lg font-bold text-purple-700 mt-1">
                {depreciationPercentage}%
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <DetailRow
              icon={<MapPin className="w-4 h-4" />}
              label="Ubicación"
              value={asset.location}
            />
            <DetailRow
              icon={<Building2 className="w-4 h-4" />}
              label="Módulo Asignado"
              value={getModuleLabel(asset.assignedModule)}
            />
            <DetailRow
              icon={<Calendar className="w-4 h-4" />}
              label="Fecha de Adquisición"
              value={formatDate(asset.acquisitionDate)}
            />
            <DetailRow
              icon={<DollarSign className="w-4 h-4" />}
              label="Costo de Adquisición"
              value={formatCurrency(asset.acquisitionCost)}
            />
            <DetailRow
              icon={<Clock className="w-4 h-4" />}
              label="Método de Depreciación"
              value={getDepreciationLabel(asset.depreciationMethod)}
            />
            {asset.usefulLifeYears && (
              <DetailRow
                icon={<Clock className="w-4 h-4" />}
                label="Vida Útil"
                value={`${asset.usefulLifeYears} años`}
              />
            )}
            {asset.responsiblePerson && (
              <DetailRow
                icon={<User className="w-4 h-4" />}
                label="Responsable"
                value={asset.responsiblePerson}
              />
            )}
            {asset.serialNumber && (
              <DetailRow
                icon={<Hash className="w-4 h-4" />}
                label="Número de Serie"
                value={asset.serialNumber}
              />
            )}
            {asset.description && (
              <DetailRow
                icon={<FileText className="w-4 h-4" />}
                label="Descripción"
                value={asset.description}
              />
            )}
          </div>

          {/* Notes */}
          {asset.notes && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
              <p className="text-xs text-amber-600 uppercase tracking-wide mb-1">Notas</p>
              <p className="text-sm text-amber-800">{asset.notes}</p>
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
        title="Eliminar Activo"
        description={`¿Estás seguro de que deseas eliminar "${asset.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        variant="danger"
      />
    </>
  );
}
