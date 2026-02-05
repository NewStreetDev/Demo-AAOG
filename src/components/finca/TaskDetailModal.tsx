import { Calendar, User, Tag, CheckCircle2, ExternalLink, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Modal from '../common/Modals/Modal';
import type { AggregatedTask } from '../../types/finca.types';
import type { SystemModule } from '../../types/common.types';

interface TaskDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: AggregatedTask | null;
  onComplete?: (task: AggregatedTask) => void;
  onNavigateToModule?: (module: SystemModule) => void;
}

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

const moduleColors: Record<string, string> = {
  agro: 'bg-lime-100 text-lime-700 hover:bg-lime-200',
  pecuario: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
  procesamiento: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
  finanzas: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
  general: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
};

const moduleRoutes: Record<string, string> = {
  agro: '/agro',
  pecuario: '/pecuario',
  procesamiento: '/procesamiento',
  finanzas: '/finanzas',
  general: '/finca',
};

const typeLabels: Record<string, string> = {
  // Pecuario
  health: 'Salud',
  rotation: 'Rotacion',
  reproduction: 'Reproduccion',
  sale: 'Venta',
  checkup: 'Revision',
  // Agro
  harvest: 'Cosecha',
  fertilization: 'Fertilizacion',
  irrigation: 'Riego',
  pesticide: 'Control Plagas',
  maintenance: 'Mantenimiento',
  // Finanzas
  collection_due: 'Cobro',
  payment_due: 'Pago',
  budget_alert: 'Presupuesto',
  reconciliation: 'Conciliacion',
  // Procesamiento
  quality_control: 'Control Calidad',
  line_maintenance: 'Mantenimiento',
  batch_processing: 'Procesamiento',
  equipment_calibration: 'Calibracion',
  // General
  mantenimiento: 'Mantenimiento',
  capacitacion: 'Capacitacion',
  compra: 'Compra',
  revision: 'Revision',
  otro: 'Otro',
};

function formatDate(date: Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('es-CR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function isOverdue(date: Date, status: string): boolean {
  if (status === 'completed' || status === 'cancelled') return false;
  return new Date(date) < new Date();
}

function getDaysUntil(date: Date): { days: number; label: string } {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { days: Math.abs(diffDays), label: `${Math.abs(diffDays)} dia${Math.abs(diffDays) !== 1 ? 's' : ''} vencida` };
  } else if (diffDays === 0) {
    return { days: 0, label: 'Hoy' };
  } else if (diffDays === 1) {
    return { days: 1, label: 'Manana' };
  } else {
    return { days: diffDays, label: `En ${diffDays} dias` };
  }
}

export default function TaskDetailModal({
  open,
  onOpenChange,
  task,
  onComplete,
  onNavigateToModule,
}: TaskDetailModalProps) {
  const navigate = useNavigate();

  if (!task) return null;

  const overdue = isOverdue(task.dueDate, task.status);
  const daysInfo = getDaysUntil(task.dueDate);
  const canComplete = task.status === 'pending' || task.status === 'in_progress';

  const handleNavigateToModule = () => {
    const route = moduleRoutes[task.module] || '/finca';
    if (onNavigateToModule) {
      onNavigateToModule(task.module);
    } else {
      navigate(route);
    }
    onOpenChange(false);
  };

  const handleComplete = () => {
    if (onComplete && canComplete) {
      onComplete(task);
      onOpenChange(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={task.title}
      size="md"
    >
      <div className="space-y-5">
        {/* Header with badges */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleNavigateToModule}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors cursor-pointer inline-flex items-center gap-1 ${moduleColors[task.module] || moduleColors.general}`}
          >
            {task.moduleName}
            <ExternalLink className="w-3 h-3" />
          </button>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[task.status]}`}>
            {statusLabels[task.status]}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColors[task.priority]}`}>
            Prioridad {priorityLabels[task.priority]}
          </span>
        </div>

        {/* Task type */}
        <div className="flex items-center gap-2 text-gray-600">
          <Tag className="w-4 h-4 text-gray-400" />
          <span className="text-sm">
            <strong>Tipo:</strong> {typeLabels[task.type] || task.type}
          </span>
        </div>

        {/* Description */}
        {task.description && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Descripcion</h4>
            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              {task.description}
            </p>
          </div>
        )}

        {/* Due date */}
        <div className={`rounded-lg p-4 ${overdue ? 'bg-red-50' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className={`w-5 h-5 ${overdue ? 'text-red-500' : 'text-gray-400'}`} />
              <div>
                <p className={`text-sm font-medium ${overdue ? 'text-red-700' : 'text-gray-900'}`}>
                  {formatDate(task.dueDate)}
                </p>
                <p className={`text-xs ${overdue ? 'text-red-600' : 'text-gray-500'}`}>
                  Fecha de vencimiento
                </p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              overdue
                ? 'bg-red-100 text-red-700'
                : daysInfo.days <= 2
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-green-100 text-green-700'
            }`}>
              {overdue && <AlertTriangle className="w-3 h-3 inline mr-1" />}
              {daysInfo.label}
            </div>
          </div>
        </div>

        {/* Assigned to */}
        {task.assignedTo && (
          <div className="flex items-center gap-2 text-gray-600">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-sm">
              <strong>Asignado a:</strong> {task.assignedTo}
            </span>
          </div>
        )}

        {/* Source info */}
        {task.sourceType && (
          <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
            <span>
              Origen: {task.sourceType === 'plan' ? 'Plan General' : `Modulo ${task.moduleName}`}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t border-gray-100">
          <button
            onClick={handleNavigateToModule}
            className="btn-ghost text-gray-600 hover:bg-gray-100 inline-flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Ir al modulo
          </button>

          {canComplete && onComplete && (
            <button
              onClick={handleComplete}
              className="btn-primary bg-green-600 hover:bg-green-700 inline-flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Marcar completada
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
