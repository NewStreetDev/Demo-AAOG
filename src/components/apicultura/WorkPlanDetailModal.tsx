import {
  Calendar,
  Clock,
  User,
  MapPin,
  AlertCircle,
  CheckCircle2,
  PlayCircle,
  XCircle,
  Edit2,
  Trash2,
} from 'lucide-react';
import { Modal } from '../common/Modals';
import { useDeleteWorkPlan } from '../../hooks/useApiculturaMutations';
import type { WorkPlan } from '../../types/apicultura.types';

interface WorkPlanDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workPlan: WorkPlan | null;
  onEdit?: (workPlan: WorkPlan) => void;
}

const activityTypeLabels: Record<string, string> = {
  medication: 'Aplicación de Medicamentos',
  panel_change: 'Cambio de Panales',
  feeding: 'Alimentación',
  revision: 'Revisión',
  queen_change: 'Cambio de Reinas',
  reproduction: 'Reproducción',
  harvest: 'Cosecha',
  maintenance: 'Mantenimiento',
  other: 'Otros',
};

const priorityConfig = {
  high: { label: 'Alta', color: 'text-red-600 bg-red-50' },
  medium: { label: 'Media', color: 'text-amber-600 bg-amber-50' },
  low: { label: 'Baja', color: 'text-green-600 bg-green-50' },
};

const statusConfig = {
  pending: { label: 'Pendiente', color: 'text-gray-600 bg-gray-100', icon: Clock },
  in_progress: { label: 'En Progreso', color: 'text-blue-600 bg-blue-50', icon: PlayCircle },
  completed: { label: 'Completado', color: 'text-green-600 bg-green-50', icon: CheckCircle2 },
  cancelled: { label: 'Cancelado', color: 'text-red-600 bg-red-50', icon: XCircle },
};

export default function WorkPlanDetailModal({
  open,
  onOpenChange,
  workPlan,
  onEdit,
}: WorkPlanDetailModalProps) {
  const deleteMutation = useDeleteWorkPlan();

  if (!workPlan) return null;

  const priority = priorityConfig[workPlan.priority];
  const status = statusConfig[workPlan.status];
  const StatusIcon = status.icon;

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este plan de trabajo?')) {
      try {
        await deleteMutation.mutateAsync(workPlan.id);
        onOpenChange(false);
      } catch (error) {
        console.error('Error deleting work plan:', error);
      }
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-CR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Detalle del Plan de Trabajo"
      description={workPlan.title}
      size="md"
    >
      <div className="space-y-6">
        {/* Header with Status and Priority */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
              <StatusIcon className="w-4 h-4" />
              {status.label}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${priority.color}`}>
              <AlertCircle className="w-4 h-4" />
              Prioridad {priority.label}
            </span>
          </div>
        </div>

        {/* Activity Type */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Tipo de Actividad</h3>
          <p className="text-lg font-semibold text-gray-900">
            {activityTypeLabels[workPlan.activityType] || workPlan.activityType}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Scheduled Date */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Fecha Programada</p>
              <p className="font-medium text-gray-900">
                {formatDate(workPlan.scheduledDate)}
              </p>
            </div>
          </div>

          {/* Duration */}
          {workPlan.estimatedDuration && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Duración Estimada</p>
                <p className="font-medium text-gray-900">
                  {workPlan.estimatedDuration} {workPlan.estimatedDuration === 1 ? 'hora' : 'horas'}
                </p>
              </div>
            </div>
          )}

          {/* Assigned To */}
          {workPlan.assignedTo && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Asignado a</p>
                <p className="font-medium text-gray-900">{workPlan.assignedTo}</p>
              </div>
            </div>
          )}

          {/* Location */}
          {(workPlan.apiarioName || workPlan.colmenaCode) && (
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-50 rounded-lg">
                <MapPin className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ubicación</p>
                <p className="font-medium text-gray-900">
                  {workPlan.apiarioName}
                  {workPlan.colmenaCode && ` - ${workPlan.colmenaCode}`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Completed Date */}
        {workPlan.completedDate && (
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Completado el {formatDate(workPlan.completedDate)}
              </span>
            </div>
          </div>
        )}

        {/* Description */}
        {workPlan.description && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Descripción</h3>
            <p className="text-gray-700 bg-gray-50 rounded-lg p-3">
              {workPlan.description}
            </p>
          </div>
        )}

        {/* Notes */}
        {workPlan.notes && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Notas</h3>
            <p className="text-gray-700 bg-gray-50 rounded-lg p-3">
              {workPlan.notes}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            className="btn-danger inline-flex items-center gap-2"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => onOpenChange(false)}
            >
              Cerrar
            </button>
            {onEdit && (
              <button
                type="button"
                className="btn-primary inline-flex items-center gap-2"
                onClick={() => {
                  onOpenChange(false);
                  onEdit(workPlan);
                }}
              >
                <Edit2 className="w-4 h-4" />
                Editar
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
