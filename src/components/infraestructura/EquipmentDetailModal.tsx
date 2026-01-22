import { useState } from 'react';
import {
  MapPin,
  Calendar,
  User,
  Hash,
  Wrench,
  Pencil,
  Trash2,
  Tag,
  Box,
} from 'lucide-react';
import { Modal, ConfirmModal } from '../common/Modals';
import { useDeleteEquipment } from '../../hooks/useInfraestructuraMutations';
import type { Equipment } from '../../types/infraestructura.types';

interface EquipmentDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipment: Equipment | null;
  onEdit?: (equipment: Equipment) => void;
  onDeleteSuccess?: () => void;
}

function getStatusBadgeColor(status: Equipment['status']): string {
  const colors = {
    operational: 'bg-green-100 text-green-700',
    maintenance: 'bg-amber-100 text-amber-700',
    repair: 'bg-orange-100 text-orange-700',
    out_of_service: 'bg-red-100 text-red-700',
  };
  return colors[status] || colors.operational;
}

function getStatusLabel(status: Equipment['status']): string {
  const labels = {
    operational: 'Operativo',
    maintenance: 'En Mantenimiento',
    repair: 'En Reparación',
    out_of_service: 'Fuera de Servicio',
  };
  return labels[status];
}

function getTypeLabel(type: Equipment['type']): string {
  const labels: Record<Equipment['type'], string> = {
    vehicle: 'Vehículo',
    machinery: 'Maquinaria',
    tool: 'Herramienta',
    irrigation: 'Riego',
    electrical: 'Eléctrico',
    other: 'Otro',
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

export default function EquipmentDetailModal({
  open,
  onOpenChange,
  equipment,
  onEdit,
  onDeleteSuccess,
}: EquipmentDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteMutation = useDeleteEquipment();

  if (!equipment) return null;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(equipment.id);
      setShowDeleteConfirm(false);
      onOpenChange(false);
      onDeleteSuccess?.();
    } catch (error) {
      console.error('Error deleting equipment:', error);
    }
  };

  const handleEdit = () => {
    onOpenChange(false);
    onEdit?.(equipment);
  };

  const brandModel = [equipment.brand, equipment.model].filter(Boolean).join(' ');

  return (
    <>
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title={equipment.name}
        description={brandModel || getTypeLabel(equipment.type)}
        size="md"
      >
        <div className="space-y-1">
          {/* Status Badge */}
          <div className="flex justify-center mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(
                equipment.status
              )}`}
            >
              {getStatusLabel(equipment.status)}
            </span>
          </div>

          {/* Value Summary */}
          {equipment.value && (
            <div className="grid grid-cols-1 gap-3 mb-4">
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-xs text-green-600 uppercase tracking-wide">Valor</p>
                <p className="text-lg font-bold text-green-700 mt-1">
                  {formatCurrency(equipment.value)}
                </p>
              </div>
            </div>
          )}

          {/* Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <DetailRow
              icon={<Box className="w-4 h-4" />}
              label="Tipo"
              value={getTypeLabel(equipment.type)}
            />
            <DetailRow
              icon={<MapPin className="w-4 h-4" />}
              label="Ubicación"
              value={equipment.location}
            />
            {equipment.brand && (
              <DetailRow
                icon={<Tag className="w-4 h-4" />}
                label="Marca / Modelo"
                value={brandModel}
              />
            )}
            {equipment.serialNumber && (
              <DetailRow
                icon={<Hash className="w-4 h-4" />}
                label="Número de Serie"
                value={equipment.serialNumber}
              />
            )}
            {equipment.purchaseDate && (
              <DetailRow
                icon={<Calendar className="w-4 h-4" />}
                label="Fecha de Compra"
                value={formatDate(equipment.purchaseDate)}
              />
            )}
            {equipment.lastMaintenanceDate && (
              <DetailRow
                icon={<Wrench className="w-4 h-4" />}
                label="Último Mantenimiento"
                value={formatDate(equipment.lastMaintenanceDate)}
              />
            )}
            {equipment.nextMaintenanceDate && (
              <DetailRow
                icon={<Calendar className="w-4 h-4" />}
                label="Próximo Mantenimiento"
                value={formatDate(equipment.nextMaintenanceDate)}
              />
            )}
            {equipment.assignedTo && (
              <DetailRow
                icon={<User className="w-4 h-4" />}
                label="Asignado a"
                value={equipment.assignedTo}
              />
            )}
          </div>

          {/* Notes */}
          {equipment.notes && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
              <p className="text-xs text-amber-600 uppercase tracking-wide mb-1">Notas</p>
              <p className="text-sm text-amber-800">{equipment.notes}</p>
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
        title="Eliminar Equipo"
        description={`¿Estás seguro de que deseas eliminar "${equipment.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        variant="danger"
      />
    </>
  );
}
