import { useState } from 'react';
import {
  Calendar,
  FileText,
  User,
  Package,
  CreditCard,
  Banknote,
  Pencil,
  Trash2,
  Tag,
} from 'lucide-react';
import { Modal, ConfirmModal } from '../common/Modals';
import { useDeleteSaleRecord } from '../../hooks/useFinanzasMutations';
import type { SaleRecord } from '../../types/finanzas.types';

interface SaleRecordDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  saleRecord: SaleRecord | null;
  onEdit?: (saleRecord: SaleRecord) => void;
  onDeleteSuccess?: () => void;
}

function getPaymentStatusInfo(status: SaleRecord['paymentStatus']): { label: string; color: string } {
  const statusMap = {
    paid: { label: 'Pagado', color: 'bg-green-100 text-green-700' },
    partial: { label: 'Parcial', color: 'bg-amber-100 text-amber-700' },
    pending: { label: 'Pendiente', color: 'bg-red-100 text-red-700' },
  };
  return statusMap[status] || statusMap.pending;
}

function getModuleInfo(module: SaleRecord['moduleSource']): { label: string; color: string } {
  const moduleMap = {
    agro: { label: 'Agricultura', color: 'bg-green-100 text-green-700' },
    pecuario: { label: 'Pecuario', color: 'bg-orange-100 text-orange-700' },
    apicultura: { label: 'Apicultura', color: 'bg-amber-100 text-amber-700' },
    general: { label: 'General', color: 'bg-gray-100 text-gray-600' },
  };
  return moduleMap[module] || moduleMap.general;
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

function formatCurrency(amount: number): string {
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

export default function SaleRecordDetailModal({
  open,
  onOpenChange,
  saleRecord,
  onEdit,
  onDeleteSuccess,
}: SaleRecordDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteMutation = useDeleteSaleRecord();

  if (!saleRecord) return null;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(saleRecord.id);
      setShowDeleteConfirm(false);
      onOpenChange(false);
      onDeleteSuccess?.();
    } catch (error) {
      console.error('Error deleting sale record:', error);
    }
  };

  const handleEdit = () => {
    onOpenChange(false);
    onEdit?.(saleRecord);
  };

  const statusInfo = getPaymentStatusInfo(saleRecord.paymentStatus);
  const moduleInfo = getModuleInfo(saleRecord.moduleSource);
  const pendingAmount = saleRecord.totalAmount - saleRecord.amountPaid;

  return (
    <>
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title={saleRecord.invoiceNumber}
        description={saleRecord.productDescription}
        size="md"
      >
        <div className="space-y-1">
          {/* Status Badges */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${moduleInfo.color}`}>
              {moduleInfo.label}
            </span>
          </div>

          {/* Amount Cards */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-xs text-blue-600 uppercase tracking-wide">Total</p>
              <p className="text-lg font-bold text-blue-700 mt-1">
                {formatCurrency(saleRecord.totalAmount)}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-xs text-green-600 uppercase tracking-wide">Pagado</p>
              <p className="text-lg font-bold text-green-700 mt-1">
                {formatCurrency(saleRecord.amountPaid)}
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
              value={formatDate(saleRecord.date)}
            />
            <DetailRow
              icon={<User className="w-4 h-4" />}
              label="Comprador"
              value={saleRecord.buyerName}
            />
            <DetailRow
              icon={<Package className="w-4 h-4" />}
              label="Producto"
              value={saleRecord.productDescription}
            />
            <DetailRow
              icon={<Tag className="w-4 h-4" />}
              label="Cantidad"
              value={`${saleRecord.quantity} ${saleRecord.unit}`}
            />
            <DetailRow
              icon={<Banknote className="w-4 h-4" />}
              label="Precio Unitario"
              value={formatCurrency(saleRecord.unitPrice)}
            />
            <DetailRow
              icon={<CreditCard className="w-4 h-4" />}
              label="Estado de Pago"
              value={statusInfo.label}
            />
            {saleRecord.dueDate && (
              <DetailRow
                icon={<Calendar className="w-4 h-4" />}
                label="Fecha de Vencimiento"
                value={formatDate(saleRecord.dueDate)}
              />
            )}
          </div>

          {/* Notes */}
          {saleRecord.notes && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-blue-600" />
                <p className="text-xs text-blue-600 uppercase tracking-wide">Notas</p>
              </div>
              <p className="text-sm text-blue-800">{saleRecord.notes}</p>
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
        title="Eliminar Venta"
        description={`¿Estás seguro de que deseas eliminar la venta "${saleRecord.invoiceNumber}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        variant="danger"
      />
    </>
  );
}
