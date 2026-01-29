import { useState, useMemo } from 'react';
import {
  Edit,
  Trash2,
  Calendar,
  Play,
  CheckCircle,
  FileText,
  BarChart3,
  Clock,
  Tag,
} from 'lucide-react';
import { Modal, ConfirmModal } from '../common/Modals';
import { cn } from '../../utils/cn';
import { useAnnualPlanPlans, useUpdateAnnualPlan, useActivateAnnualPlan, useDeleteAnnualPlan } from '../../hooks/useAnnualPlan';
import type { AnnualPlan, AnnualPlanStatus, GeneralPlan } from '../../types/finca.types';

interface AnnualPlanDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  annualPlan: AnnualPlan | null;
  onEdit: () => void;
  onActivate: () => void;
  onDelete: () => void;
}

const statusLabels: Record<AnnualPlanStatus, string> = {
  draft: 'Borrador',
  planning: 'En Planificacion',
  active: 'Activo',
  completed: 'Completado',
};

const statusColors: Record<AnnualPlanStatus, string> = {
  draft: 'bg-gray-100 text-gray-700',
  planning: 'bg-blue-100 text-blue-700',
  active: 'bg-green-100 text-green-700',
  completed: 'bg-purple-100 text-purple-700',
};

const statusIcons: Record<AnnualPlanStatus, typeof FileText> = {
  draft: FileText,
  planning: Edit,
  active: Play,
  completed: CheckCircle,
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

function formatDate(date: Date | undefined): string {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('es-CR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatDateTime(date: Date | undefined): string {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('es-CR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AnnualPlanDetailModal({
  open,
  onOpenChange,
  annualPlan,
  onEdit,
  onActivate,
  onDelete,
}: AnnualPlanDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPlanningConfirm, setShowPlanningConfirm] = useState(false);
  const [showActivateConfirm, setShowActivateConfirm] = useState(false);

  const updateMutation = useUpdateAnnualPlan();
  const activateMutation = useActivateAnnualPlan();
  const deleteMutation = useDeleteAnnualPlan();

  // Fetch plans for this annual plan (initial phase)
  const { data: plans = [] } = useAnnualPlanPlans(annualPlan?.id, 'initial');

  // Calculate stats
  const stats = useMemo(() => {
    const byModule: Record<string, number> = {};
    const byActionType: Record<string, number> = {};

    plans.forEach((plan: GeneralPlan) => {
      const module = plan.targetModule || 'general';
      byModule[module] = (byModule[module] || 0) + 1;

      byActionType[plan.actionType] = (byActionType[plan.actionType] || 0) + 1;
    });

    return {
      total: plans.length,
      byModule,
      byActionType,
    };
  }, [plans]);

  if (!annualPlan) return null;

  const StatusIcon = statusIcons[annualPlan.status];

  const handleStartPlanning = async () => {
    try {
      await updateMutation.mutateAsync({
        id: annualPlan.id,
        data: { status: 'planning' },
      });
      setShowPlanningConfirm(false);
    } catch (error) {
      console.error('Error starting planning:', error);
    }
  };

  const handleStartExecution = async () => {
    try {
      await activateMutation.mutateAsync(annualPlan.id);
      setShowActivateConfirm(false);
      onActivate();
      onOpenChange(false);
    } catch (error) {
      console.error('Error activating plan:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(annualPlan.id);
      setShowDeleteConfirm(false);
      onDelete();
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  const handleEdit = () => {
    onOpenChange(false);
    onEdit();
  };

  const renderActions = () => {
    switch (annualPlan.status) {
      case 'draft':
        return (
          <>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="btn-ghost text-red-600 hover:bg-red-50 inline-flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </button>
            <button
              onClick={handleEdit}
              className="btn-secondary inline-flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Editar
            </button>
            <button
              onClick={() => setShowPlanningConfirm(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Iniciar Planificacion
            </button>
          </>
        );
      case 'planning':
        return (
          <>
            <button
              onClick={handleEdit}
              className="btn-secondary inline-flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Editar
            </button>
            <button
              onClick={() => setShowActivateConfirm(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Iniciar Ejecucion
            </button>
          </>
        );
      case 'active':
      case 'completed':
        return (
          <span className="text-sm text-gray-500 italic">
            {annualPlan.status === 'active' ? 'Plan en ejecucion' : 'Plan completado'} - solo lectura
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title={annualPlan.name}
        size="lg"
      >
        <div className="space-y-6">
          {/* Status and Basic Info */}
          <div className="flex flex-wrap items-center gap-3">
            <div className={cn('p-2 rounded-lg', statusColors[annualPlan.status])}>
              <StatusIcon className="w-5 h-5" />
            </div>
            <span className={cn('px-3 py-1 rounded-full text-sm font-medium', statusColors[annualPlan.status])}>
              {statusLabels[annualPlan.status]}
            </span>
            <span className="text-gray-500">|</span>
            <span className="text-lg font-semibold text-gray-900">Ano {annualPlan.year}</span>
          </div>

          {/* Description */}
          {annualPlan.description && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Descripcion</h4>
              <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                {annualPlan.description}
              </p>
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">Creado</span>
              </div>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(annualPlan.createdAt)}
              </p>
            </div>

            {annualPlan.activatedAt && (
              <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-green-600 mb-1">
                  <Play className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Activado</span>
                </div>
                <p className="text-sm font-medium text-green-700">
                  {formatDateTime(annualPlan.activatedAt)}
                </p>
              </div>
            )}

            {annualPlan.completedAt && (
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-purple-600 mb-1">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Completado</span>
                </div>
                <p className="text-sm font-medium text-purple-700">
                  {formatDateTime(annualPlan.completedAt)}
                </p>
              </div>
            )}
          </div>

          {/* Stats */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Estadisticas del Plan
            </h4>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-sm text-gray-500">Acciones Planificadas</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">
                    {Object.keys(stats.byModule).length}
                  </p>
                  <p className="text-sm text-gray-500">Modulos</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">
                    {Object.keys(stats.byActionType).length}
                  </p>
                  <p className="text-sm text-gray-500">Tipos de Accion</p>
                </div>
              </div>

              {stats.total > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  {/* By Module */}
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      Por Modulo
                    </p>
                    <div className="space-y-1">
                      {Object.entries(stats.byModule).map(([module, count]) => (
                        <div key={module} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{moduleLabels[module] || module}</span>
                          <span className="font-medium text-gray-900">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* By Action Type */}
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Por Tipo de Accion
                    </p>
                    <div className="space-y-1">
                      {Object.entries(stats.byActionType).map(([type, count]) => (
                        <div key={type} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{actionTypeLabels[type] || type}</span>
                          <span className="font-medium text-gray-900">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
            <span>Creado: {formatDate(annualPlan.createdAt)}</span>
            <span>Actualizado: {formatDate(annualPlan.updatedAt)}</span>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            {renderActions()}
          </div>
        </div>
      </Modal>

      {/* Start Planning Confirmation */}
      <ConfirmModal
        open={showPlanningConfirm}
        onOpenChange={setShowPlanningConfirm}
        title="Iniciar Planificacion"
        description="Al iniciar la planificacion podras agregar acciones al plan. Esta accion cambiara el estado del plan a 'En Planificacion'. Desea continuar?"
        confirmLabel="Iniciar Planificacion"
        onConfirm={handleStartPlanning}
        isLoading={updateMutation.isPending}
        variant="warning"
      />

      {/* Start Execution Confirmation */}
      <ConfirmModal
        open={showActivateConfirm}
        onOpenChange={setShowActivateConfirm}
        title="Iniciar Ejecucion"
        description="Esta accion copiara todas las acciones planificadas al plan de ejecucion. El plan pasara a estado 'Activo' y no podra ser modificado. Desea continuar?"
        confirmLabel="Iniciar Ejecucion"
        onConfirm={handleStartExecution}
        isLoading={activateMutation.isPending}
        variant="warning"
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Eliminar Plan Anual"
        description="Esta seguro de eliminar este plan? Esta accion no se puede deshacer y se eliminaran todas las acciones asociadas."
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        variant="danger"
      />
    </>
  );
}
