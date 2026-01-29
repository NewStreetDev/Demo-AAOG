import { useRef, useEffect, useState } from 'react';
import { X, Eye, Pencil, Calendar, AlertCircle, CalendarClock, Asterisk } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '../../../utils/cn';
import type { GeneralPlan, PlanStatus, PlanPriority } from '../../../types/finca.types';
import type { SystemModule } from '../../../types/common.types';

interface PlanPopoverProps {
  plan: GeneralPlan;
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onView: (plan: GeneralPlan) => void;
  onEdit?: (plan: GeneralPlan) => void;
}

const statusLabels: Record<PlanStatus, string> = {
  pending: 'Pendiente',
  in_progress: 'En Progreso',
  completed: 'Completado',
  cancelled: 'Cancelado',
};

const statusColors: Record<PlanStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-700',
};

const priorityLabels: Record<PlanPriority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
};

const priorityColors: Record<PlanPriority, string> = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-orange-100 text-orange-700',
  high: 'bg-red-100 text-red-700',
};

const moduleColors: Record<SystemModule | 'general', string> = {
  general: 'bg-green-500',
  agro: 'bg-blue-500',
  pecuario: 'bg-yellow-500',
  apicultura: 'bg-amber-500',
  procesamiento: 'bg-purple-500',
  activos: 'bg-gray-500',
  infraestructura: 'bg-teal-500',
};

const moduleLabels: Record<SystemModule | 'general', string> = {
  general: 'General',
  agro: 'Agricultura',
  pecuario: 'Pecuario',
  apicultura: 'Apicultura',
  procesamiento: 'Procesamiento',
  activos: 'Activos',
  infraestructura: 'Infraestructura',
};

// Helper function to check if a plan is unplanned (added during execution, not from initial planning)
function isUnplannedPlan(plan: GeneralPlan): boolean {
  return plan.planPhase === 'execution' && !plan.isFromPlanning;
}

// Helper function to check if a plan has been rescheduled (dates changed from original)
function isRescheduledPlan(plan: GeneralPlan): boolean {
  if (plan.planPhase !== 'execution' || !plan.isFromPlanning) return false;
  if (!plan.originalScheduledDate) return false;

  const currentDate = new Date(plan.scheduledDate).getTime();
  const originalDate = new Date(plan.originalScheduledDate).getTime();

  return currentDate !== originalDate;
}

export default function PlanPopover({
  plan,
  anchorEl,
  open,
  onClose,
  onView,
  onEdit,
}: PlanPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (open && anchorEl && popoverRef.current) {
      const anchorRect = anchorEl.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let top = anchorRect.bottom + 8;
      let left = anchorRect.left;

      // Adjust if popover goes off right edge
      if (left + popoverRect.width > viewportWidth - 16) {
        left = viewportWidth - popoverRect.width - 16;
      }

      // Adjust if popover goes off left edge
      if (left < 16) {
        left = 16;
      }

      // Adjust if popover goes off bottom edge
      if (top + popoverRect.height > viewportHeight - 16) {
        top = anchorRect.top - popoverRect.height - 8;
      }

      setPosition({ top, left });
    }
  }, [open, anchorEl]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        anchorEl &&
        !anchorEl.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, anchorEl, onClose]);

  if (!open) return null;

  const module = plan.targetModule || 'general';
  const scheduledDate = new Date(plan.scheduledDate);
  const dueDate = plan.dueDate ? new Date(plan.dueDate) : null;

  // Planning indicators
  const isUnplanned = isUnplannedPlan(plan);
  const isRescheduled = isRescheduledPlan(plan);
  const originalScheduledDate = plan.originalScheduledDate ? new Date(plan.originalScheduledDate) : null;

  return (
    <div
      ref={popoverRef}
      className={cn(
        'fixed z-50 w-72 bg-white rounded-xl shadow-xl border border-gray-200',
        'animate-scale-in'
      )}
      style={{ top: position.top, left: position.left }}
    >
      {/* Header with module color bar */}
      <div className={cn('h-1.5 rounded-t-xl', moduleColors[module])} />

      {/* Content */}
      <div className="p-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 pr-6 mb-2 line-clamp-2">
          {plan.title}
        </h3>

        {/* Module badge */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
          <div className={cn('w-2 h-2 rounded-full', moduleColors[module])} />
          <span>{moduleLabels[module]}</span>
        </div>

        {/* Date range */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>
            {format(scheduledDate, "d 'de' MMMM", { locale: es })}
            {dueDate && (
              <>
                {' - '}
                {format(dueDate, "d 'de' MMMM", { locale: es })}
              </>
            )}
          </span>
        </div>

        {/* Status and Priority badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className={cn(
              'px-2 py-0.5 rounded-full text-xs font-medium',
              statusColors[plan.status]
            )}
          >
            {statusLabels[plan.status]}
          </span>
          <span
            className={cn(
              'px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1',
              priorityColors[plan.priority]
            )}
          >
            {plan.priority === 'high' && <AlertCircle className="w-3 h-3" />}
            {priorityLabels[plan.priority]}
          </span>
        </div>

        {/* Planning indicators (unplanned/rescheduled) */}
        {(isUnplanned || isRescheduled) && (
          <div className="flex flex-col gap-2 mb-4 p-2 bg-gray-50 rounded-lg">
            {isUnplanned && (
              <div className="flex items-center gap-2 text-xs">
                <Asterisk className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-gray-600">Agregado durante ejecucion</span>
              </div>
            )}
            {isRescheduled && originalScheduledDate && (
              <div className="flex items-center gap-2 text-xs">
                <CalendarClock className="w-3.5 h-3.5 text-amber-600" />
                <div className="text-gray-600">
                  <span className="font-medium text-amber-700">Reprogramado</span>
                  <span className="text-gray-500 ml-1">
                    (original: {format(originalScheduledDate, "d 'de' MMM", { locale: es })})
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={() => {
              onView(plan);
              onClose();
            }}
            className={cn(
              'inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors',
              onEdit ? 'flex-1' : 'flex-1 w-full'
            )}
          >
            <Eye className="w-4 h-4" />
            Ver detalles
          </button>
          {onEdit && (
            <button
              onClick={() => {
                onEdit(plan);
                onClose();
              }}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Editar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
