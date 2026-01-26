import { Edit, Trash2, Calendar, Clock, User, DollarSign, Tag, MapPin, CheckCircle } from 'lucide-react';
import Modal from '../common/Modals/Modal';
import type { GeneralPlan } from '../../types/finca.types';
import { useDeleteGeneralPlan } from '../../hooks/useFincaMutations';

interface GeneralPlanDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: GeneralPlan | null;
  onEdit: (plan: GeneralPlan) => void;
  onDeleteSuccess?: () => void;
}

const actionTypeLabels: Record<string, string> = {
  mantenimiento: 'Mantenimiento',
  siembra: 'Siembra',
  cosecha: 'Cosecha',
  tratamiento: 'Tratamiento',
  vacunacion: 'Vacunacion',
  revision: 'Revision',
  compra: 'Compra',
  venta: 'Venta',
  reparacion: 'Reparacion',
  capacitacion: 'Capacitacion',
  otro: 'Otro',
};

const priorityLabels: Record<string, string> = {
  high: 'Alta',
  medium: 'Media',
  low: 'Baja',
};

const priorityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-green-100 text-green-700',
};

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  in_progress: 'En Progreso',
  completed: 'Completado',
  cancelled: 'Cancelado',
};

const statusColors: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const moduleLabels: Record<string, string> = {
  agro: 'Agricultura',
  pecuario: 'Pecuario',
  apicultura: 'Apicultura',
  procesamiento: 'Procesamiento',
  activos: 'Activos',
  infraestructura: 'Infraestructura',
  general: 'General',
};

function formatDate(date: Date | undefined): string {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('es-CR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatCurrency(value: number | undefined): string {
  if (!value) return '-';
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function GeneralPlanDetailModal({
  open,
  onOpenChange,
  plan,
  onEdit,
  onDeleteSuccess,
}: GeneralPlanDetailModalProps) {
  const deleteMutation = useDeleteGeneralPlan();

  if (!plan) return null;

  const handleDelete = async () => {
    if (!confirm('Esta seguro de eliminar este plan?')) return;

    try {
      await deleteMutation.mutateAsync(plan.id);
      onOpenChange(false);
      onDeleteSuccess?.();
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={plan.title}
      size="lg"
    >
      <div className="space-y-6">
        {/* Header with badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
            {actionTypeLabels[plan.actionType]}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[plan.status]}`}>
            {statusLabels[plan.status]}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColors[plan.priority]}`}>
            Prioridad {priorityLabels[plan.priority]}
          </span>
        </div>

        {/* Description */}
        {plan.description && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Descripcion</h4>
            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              {plan.description}
            </p>
          </div>
        )}

        {/* Dates */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">Fecha Programada</span>
            </div>
            <p className="text-sm font-medium text-gray-900">
              {formatDate(plan.scheduledDate)}
            </p>
          </div>

          {plan.dueDate && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">Fecha Limite</span>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(plan.dueDate)}
              </p>
            </div>
          )}

          {plan.completedDate && (
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">Completado</span>
              </div>
              <p className="text-sm font-medium text-green-700">
                {formatDate(plan.completedDate)}
              </p>
            </div>
          )}
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-4">
          {plan.estimatedDuration && (
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm">
                <strong>Duracion:</strong> {plan.estimatedDuration} horas
              </span>
            </div>
          )}

          {plan.assignedTo && (
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm">
                <strong>Asignado:</strong> {plan.assignedTo}
              </span>
            </div>
          )}

          {plan.targetModule && (
            <div className="flex items-center gap-2 text-gray-600">
              <Tag className="w-4 h-4 text-gray-400" />
              <span className="text-sm">
                <strong>Modulo:</strong> {moduleLabels[plan.targetModule]}
              </span>
            </div>
          )}

          {plan.targetDivisionName && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm">
                <strong>Division:</strong> {plan.targetDivisionName}
              </span>
            </div>
          )}
        </div>

        {/* Costs */}
        {(plan.estimatedCost || plan.actualCost) && (
          <div className="grid grid-cols-2 gap-4">
            {plan.estimatedCost && (
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Costo Estimado</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(plan.estimatedCost)}
                </p>
              </div>
            )}

            {plan.actualCost && (
              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-green-600 mb-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Costo Real</span>
                </div>
                <p className="text-lg font-semibold text-green-700">
                  {formatCurrency(plan.actualCost)}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        {plan.notes && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Notas</h4>
            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              {plan.notes}
            </p>
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span>Creado: {formatDate(plan.createdAt)}</span>
          <span>Actualizado: {formatDate(plan.updatedAt)}</span>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t border-gray-100">
          <button
            onClick={handleDelete}
            className="btn-ghost text-red-600 hover:bg-red-50 inline-flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </button>
          <button
            onClick={() => onEdit(plan)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Editar
          </button>
        </div>
      </div>
    </Modal>
  );
}
