import { useState } from 'react';
import {
  MapPin,
  Calendar,
  DollarSign,
  Package,
  Hash,
  Phone,
  Truck,
  Building2,
  Bell,
  FileText,
  Pencil,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { Modal, ConfirmModal } from '../common/Modals';
import { useDeleteInsumo } from '../../hooks/useInsumoMutations';
import type { Insumo } from '../../types/insumos.types';

interface InsumoDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  insumo: Insumo | null;
  onEdit?: (insumo: Insumo) => void;
  onDeleteSuccess?: () => void;
}

function getStatusBadgeColor(status: Insumo['status']): string {
  const colors = {
    en_stock: 'bg-green-100 text-green-700',
    bajo: 'bg-orange-100 text-orange-700',
    critico: 'bg-red-100 text-red-700',
  };
  return colors[status] || colors.en_stock;
}

function getStatusLabel(status: Insumo['status']): string {
  const labels = {
    en_stock: 'En Stock',
    bajo: 'Stock Bajo',
    critico: 'Stock Crítico',
  };
  return labels[status];
}

function getCategoryLabel(category: Insumo['category']): string {
  const labels: Record<Insumo['category'], string> = {
    semillas: 'Semillas',
    fertilizantes: 'Fertilizantes',
    pesticidas: 'Pesticidas',
    herbicidas: 'Herbicidas',
    alimentos: 'Alimentos',
    medicamentos: 'Medicamentos',
    herramientas: 'Herramientas',
    otros: 'Otros',
  };
  return labels[category];
}

function getCategoryIcon(category: Insumo['category']): string {
  const icons: Record<Insumo['category'], string> = {
    semillas: '🌱',
    fertilizantes: '🧪',
    pesticidas: '🐛',
    herbicidas: '🌿',
    alimentos: '🥕',
    medicamentos: '💊',
    herramientas: '🔧',
    otros: '📦',
  };
  return icons[category];
}

function getModuleLabel(module: string | undefined): string {
  if (!module) return '-';
  const labels: Record<string, string> = {
    agro: 'Agricultura',
    pecuario: 'Pecuario',
    apicultura: 'Apicultura',
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

export default function InsumoDetailModal({
  open,
  onOpenChange,
  insumo,
  onEdit,
  onDeleteSuccess,
}: InsumoDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteMutation = useDeleteInsumo();

  if (!insumo) return null;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(insumo.id);
      setShowDeleteConfirm(false);
      onOpenChange(false);
      onDeleteSuccess?.();
    } catch (error) {
      console.error('Error deleting insumo:', error);
    }
  };

  const handleEdit = () => {
    onOpenChange(false);
    onEdit?.(insumo);
  };

  const stockPercentage = insumo.maxStock
    ? Math.round((insumo.currentStock / insumo.maxStock) * 100)
    : null;

  return (
    <>
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title={insumo.name}
        description={`${insumo.code} - ${getCategoryLabel(insumo.category)}`}
        size="md"
      >
        <div className="space-y-1">
          {/* Status Badge and Category Icon */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-3xl">{getCategoryIcon(insumo.category)}</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(
                insumo.status
              )}`}
            >
              {getStatusLabel(insumo.status)}
            </span>
          </div>

          {/* Stock and Value Summary */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-xs text-blue-600 uppercase tracking-wide">Stock Actual</p>
              <p className="text-lg font-bold text-blue-700 mt-1">
                {insumo.currentStock} {insumo.unit}
              </p>
              {stockPercentage !== null && (
                <p className="text-xs text-blue-500 mt-0.5">{stockPercentage}% del máximo</p>
              )}
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-xs text-green-600 uppercase tracking-wide">Valor Total</p>
              <p className="text-lg font-bold text-green-700 mt-1">
                {formatCurrency(insumo.totalValue)}
              </p>
            </div>
          </div>

          {/* Stock Warning */}
          {insumo.status !== 'en_stock' && (
            <div className={`flex items-center gap-2 p-3 rounded-lg mb-4 ${
              insumo.status === 'critico' ? 'bg-red-50 text-red-700' : 'bg-orange-50 text-orange-700'
            }`}>
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">
                {insumo.status === 'critico'
                  ? 'Stock crítico - Reordenar urgentemente'
                  : 'Stock bajo - Considerar reorden'}
              </span>
            </div>
          )}

          {/* Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <DetailRow
              icon={<Package className="w-4 h-4" />}
              label="Stock Mínimo / Máximo"
              value={`${insumo.minStock} ${insumo.unit} / ${insumo.maxStock ? `${insumo.maxStock} ${insumo.unit}` : '-'}`}
            />
            <DetailRow
              icon={<DollarSign className="w-4 h-4" />}
              label="Costo por Unidad"
              value={formatCurrency(insumo.costPerUnit)}
            />
            {insumo.reorderQuantity && (
              <DetailRow
                icon={<Package className="w-4 h-4" />}
                label="Cantidad de Reorden"
                value={`${insumo.reorderQuantity} ${insumo.unit}`}
              />
            )}
            <DetailRow
              icon={<Building2 className="w-4 h-4" />}
              label="Módulo Relacionado"
              value={getModuleLabel(insumo.relatedModule)}
            />
            {insumo.location && (
              <DetailRow
                icon={<MapPin className="w-4 h-4" />}
                label="Ubicación"
                value={insumo.location}
              />
            )}
            {insumo.supplier && (
              <DetailRow
                icon={<Truck className="w-4 h-4" />}
                label="Proveedor"
                value={insumo.supplier}
              />
            )}
            {insumo.supplierPhone && (
              <DetailRow
                icon={<Phone className="w-4 h-4" />}
                label="Teléfono Proveedor"
                value={insumo.supplierPhone}
              />
            )}
            {insumo.expirationDate && (
              <DetailRow
                icon={<Calendar className="w-4 h-4" />}
                label="Fecha de Vencimiento"
                value={formatDate(insumo.expirationDate)}
              />
            )}
            {insumo.batchCode && (
              <DetailRow
                icon={<Hash className="w-4 h-4" />}
                label="Código de Lote"
                value={insumo.batchCode}
              />
            )}
            <DetailRow
              icon={<Bell className="w-4 h-4" />}
              label="Alertas"
              value={insumo.alertEnabled ? 'Habilitadas' : 'Deshabilitadas'}
            />
            {insumo.description && (
              <DetailRow
                icon={<FileText className="w-4 h-4" />}
                label="Descripción"
                value={insumo.description}
              />
            )}
          </div>

          {/* Notes */}
          {insumo.notes && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
              <p className="text-xs text-amber-600 uppercase tracking-wide mb-1">Notas</p>
              <p className="text-sm text-amber-800">{insumo.notes}</p>
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
        title="Eliminar Insumo"
        description={`¿Estás seguro de que deseas eliminar "${insumo.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        variant="danger"
      />
    </>
  );
}
