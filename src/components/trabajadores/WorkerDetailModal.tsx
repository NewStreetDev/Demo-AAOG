import { useState } from 'react';
import {
  BadgeCheck,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Building2,
  User,
  FileText,
  Pencil,
  Trash2,
} from 'lucide-react';
import { Modal, ConfirmModal } from '../common/Modals';
import { useDeleteWorker } from '../../hooks/useWorkerMutations';
import type { Worker } from '../../types/trabajadores.types';

interface WorkerDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  worker: Worker | null;
  onEdit?: (worker: Worker) => void;
  onDeleteSuccess?: () => void;
}

function getStatusBadgeColor(status: Worker['status']): string {
  const colors = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-700',
    on_leave: 'bg-amber-100 text-amber-700',
    temporary: 'bg-blue-100 text-blue-700',
  };
  return colors[status] || colors.active;
}

function getRoleLabel(role: Worker['role']): string {
  const labels = {
    jefe: 'Jefe',
    supervisor: 'Supervisor',
    trabajador: 'Trabajador',
    especialista: 'Especialista',
    practicante: 'Practicante',
  };
  return labels[role];
}

function getStatusLabel(status: Worker['status']): string {
  const labels = {
    active: 'Activo',
    inactive: 'Inactivo',
    on_leave: 'En Permiso',
    temporary: 'Temporal',
  };
  return labels[status];
}

function getModuleLabel(module: Worker['moduleAssignment']): string {
  const labels = {
    agro: 'Agricultura',
    pecuario: 'Pecuario',
    apicultura: 'Apicultura',
    procesamiento: 'Procesamiento',
    multiple: 'Múltiple',
  };
  return labels[module];
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
  if (!amount) return '-';
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    minimumFractionDigits: 0,
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

export default function WorkerDetailModal({
  open,
  onOpenChange,
  worker,
  onEdit,
  onDeleteSuccess,
}: WorkerDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const deleteMutation = useDeleteWorker();

  if (!worker) return null;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(worker.id);
      setShowDeleteConfirm(false);
      onOpenChange(false);
      onDeleteSuccess?.();
    } catch (error) {
      console.error('Error deleting worker:', error);
    }
  };

  const handleEdit = () => {
    onOpenChange(false);
    onEdit?.(worker);
  };

  return (
    <>
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title={`${worker.firstName} ${worker.lastName}`}
        description={getRoleLabel(worker.role)}
        size="md"
      >
        <div className="space-y-1">
          {/* Status Badge */}
          <div className="flex justify-center mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(
                worker.status
              )}`}
            >
              {getStatusLabel(worker.status)}
            </span>
          </div>

          {/* Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <DetailRow
              icon={<BadgeCheck className="w-4 h-4" />}
              label="Documento"
              value={worker.documentId}
            />
            <DetailRow
              icon={<User className="w-4 h-4" />}
              label="Rol"
              value={getRoleLabel(worker.role)}
            />
            <DetailRow
              icon={<Building2 className="w-4 h-4" />}
              label="Módulo Asignado"
              value={getModuleLabel(worker.moduleAssignment)}
            />
            <DetailRow
              icon={<Calendar className="w-4 h-4" />}
              label="Fecha de Contratación"
              value={formatDate(worker.hireDate)}
            />
            <DetailRow
              icon={<DollarSign className="w-4 h-4" />}
              label="Tarifa por Hora"
              value={formatCurrency(worker.hourlyRate)}
            />
            {worker.email && (
              <DetailRow
                icon={<Mail className="w-4 h-4" />}
                label="Email"
                value={
                  <a
                    href={`mailto:${worker.email}`}
                    className="text-green-600 hover:text-green-700 hover:underline"
                  >
                    {worker.email}
                  </a>
                }
              />
            )}
            {worker.phone && (
              <DetailRow
                icon={<Phone className="w-4 h-4" />}
                label="Teléfono"
                value={
                  <a
                    href={`tel:${worker.phone}`}
                    className="text-green-600 hover:text-green-700 hover:underline"
                  >
                    {worker.phone}
                  </a>
                }
              />
            )}
            {worker.notes && (
              <DetailRow
                icon={<FileText className="w-4 h-4" />}
                label="Notas"
                value={worker.notes}
              />
            )}
          </div>

          {/* Specializations */}
          {worker.specializations && worker.specializations.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                Especializaciones
              </p>
              <div className="flex flex-wrap gap-2">
                {worker.specializations.map((spec, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium"
                  >
                    {spec}
                  </span>
                ))}
              </div>
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
        title="Eliminar Trabajador"
        description={`¿Estás seguro de que deseas eliminar a ${worker.firstName} ${worker.lastName}? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        variant="danger"
      />
    </>
  );
}
