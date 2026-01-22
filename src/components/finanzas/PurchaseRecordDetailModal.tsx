import { useState } from 'react';
import {
  Calendar,
  FileText,
  Building2,
  Package,
  CreditCard,
  Banknote,
  Pencil,
  Trash2,
  Tag,
  Layers,
} from 'lucide-react';
import { Modal, ConfirmModal } from '../common/Modals';
import { useDeletePurchaseRecord } from '../../hooks/useFinanzasMutations';
import type { PurchaseRecord } from '../../types/finanzas.types';

interface PurchaseRecordDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchaseRecord: PurchaseRecord | null;
  onEdit?: (purchaseRecord: PurchaseRecord) => void;
  onDeleteSuccess?: () => void;
}

function getPaymentStatusInfo(status: PurchaseRecord['paymentStatus']): { label: string; color: string } {
  const statusMap = {
    paid: { label: 'Pagado', color: 'bg-green-100 text-green-700' },
    partial: { label: 'Parcial', color: 'bg-amber-100 text-amber-700' },
    pending: { label: 'Pendiente', color: 'bg-red-100 text-red-700' },
  };
  return statusMap[status] || statusMap.pending;
}

function getCategoryLabel(category: PurchaseRecord['category']): string {
  const categoryMap: Record<string, string> = {
    insumos: 'Insumos',
    mano_obra: 'Mano de Obra',
    servicios_externos: 'Servicios Externos',
    mantenimiento: 'Mantenimiento',
    transporte: 'Transporte',
    otros_gastos: 'Otros Gastos',
    ventas: 'Ventas',
    devoluciones: 'Devoluciones',
    servicios: 'Servicios',
    otros_ingresos: 'Otros Ingresos',
  };
  return categoryMap[category] || category;
}

function getModuleLabel(module: PurchaseRecord['moduleUsage']): string {
  if (!module) return '-';
  const moduleMap: Record<string, string> = {
    agro: 'Agricultura',
    pecuario: 'Pecuario',
    apicultura: 'Apicultura',
    general: 'General',
  };
  return moduleMap[module] || module;
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

export default function PurchaseRecordDetailModal({
  open,
  onOpenChange,
  purchaseRecord,
  onEdit,
  onDeleteSuccess,
}: PurchaseRecordDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteMutation = useDeletePurchaseRecord();

  if (!purchaseRecord) return null;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(purchaseRecord.id);
      setShowDeleteConfirm(false);
      onOpenChange(false);
      onDeleteSuccess?.();
    } catch (error) {
      console.error('Error deleting purchase record:', error);
    }
  };

  const handleEdit = () => {
    onOpenChange(false);
    onEdit?.(purchaseRecord);
  };

  const statusInfo = getPaymentStatusInfo(purchaseRecord.paymentStatus);
  const pendingAmount = purchaseRecord.totalAmount - purchaseRecord.amountPaid;

  return (
    <>
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title={purchaseRecord.invoiceNumber}
        description={purchaseRecord.description}
        size="md"
      >
        <div className="space-y-1">
          {/* Status Badges */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-700">
              {getCategoryLabel(purchaseRecord.category)}
            </span>
          </div>

          {/* Amount Cards */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <p className="text-xs text-red-600 uppercase tracking-wide">Total</p>
              <p className="text-lg font-bold text-red-700 mt-1">
                {formatCurrency(purchaseRecord.totalAmount)}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-xs text-green-600 uppercase tracking-wide">Pagado</p>
              <p className="text-lg font-bold text-green-700 mt-1">
                {formatCurrency(purchaseRecord.amountPaid)}
              </p>
            </div>
            <div className={`rounded-lg p-3 text-center ${pendingAmount > 0 ? 'bg-amber-50' : 'bg-gray-50'}`}>
              <p className={`text-xs uppercase tracking-wide ${pendingAmount > 0 ? 'text-amber-600' : 'text-gray-500'}`}>
                Pendiente
              </p>
              <p className={`text-lg font-bold mt-1 ${pendingAmount > 0 ? 'text-amber-700' : 'text-gray-400'}`}>
                {formatCurrency(pendingAmount)}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <DetailRow
              icon={<Calendar className="w-4 h-4" />}
              label="Fecha"
              value={formatDate(purchaseRecord.date)}
            />
            <DetailRow
              icon={<Building2 className="w-4 h-4" />}
              label="Proveedor"
              value={purchaseRecord.supplierName}
            />
            <DetailRow
              icon={<Package className="w-4 h-4" />}
              label="Descripción"
              value={purchaseRecord.description}
            />
            <DetailRow
              icon={<Layers className="w-4 h-4" />}
              label="Categoría"
              value={getCategoryLabel(purchaseRecord.category)}
            />
            {purchaseRecord.quantity && purchaseRecord.unit && (
              <DetailRow
                icon={<Tag className="w-4 h-4" />}
                label="Cantidad"
                value={`${purchaseRecord.quantity} ${purchaseRecord.unit}`}
              />
            )}
            {purchaseRecord.unitCost && (
              <DetailRow
                icon={<Banknote className="w-4 h-4" />}
                label="Costo Unitario"
                value={formatCurrency(purchaseRecord.unitCost)}
              />
            )}
            <DetailRow
              icon={<CreditCard className="w-4 h-4" />}
              label="Estado de Pago"
              value={statusInfo.label}
            />
            {purchaseRecord.dueDate && (
              <DetailRow
                icon={<Calendar className="w-4 h-4" />}
                label="Fecha de Vencimiento"
                value={formatDate(purchaseRecord.dueDate)}
              />
            )}
            {purchaseRecord.moduleUsage && (
              <DetailRow
                icon={<Layers className="w-4 h-4" />}
                label="Uso en Módulo"
                value={getModuleLabel(purchaseRecord.moduleUsage)}
              />
            )}
          </div>

          {/* Notes */}
          {purchaseRecord.notes && (
            <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-purple-600" />
                <p className="text-xs text-purple-600 uppercase tracking-wide">Notas</p>
              </div>
              <p className="text-sm text-purple-800">{purchaseRecord.notes}</p>
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
        title="Eliminar Compra"
        description={`¿Estás seguro de que deseas eliminar la compra "${purchaseRecord.invoiceNumber}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        variant="danger"
      />
    </>
  );
}
