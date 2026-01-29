import { useState } from 'react';
import { Edit, Trash2, Play, CheckCircle, Calendar, FileText, Flag } from 'lucide-react';
import { ConfirmModal } from '../common/Modals';
import { cn } from '../../utils/cn';
import { useUpdateAnnualPlan, useActivateAnnualPlan, useCompleteAnnualPlan, useDeleteAnnualPlan } from '../../hooks/useAnnualPlan';
import type { AnnualPlan, AnnualPlanStatus } from '../../types/finca.types';

interface AnnualPlanHeaderProps {
  annualPlan: AnnualPlan | null;
  onEdit: () => void;
  onActivate: () => void;
  onComplete: () => void;
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

export default function AnnualPlanHeader({
  annualPlan,
  onEdit,
  onActivate,
  onComplete,
  onDelete,
}: AnnualPlanHeaderProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPlanningConfirm, setShowPlanningConfirm] = useState(false);
  const [showActivateConfirm, setShowActivateConfirm] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);

  const updateMutation = useUpdateAnnualPlan();
  const activateMutation = useActivateAnnualPlan();
  const completeMutation = useCompleteAnnualPlan();
  const deleteMutation = useDeleteAnnualPlan();

  if (!annualPlan) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 text-gray-500">
          <Calendar className="w-6 h-6" />
          <div>
            <p className="text-lg font-medium text-gray-700">No hay plan seleccionado</p>
            <p className="text-sm">Selecciona o crea un plan anual para comenzar</p>
          </div>
        </div>
      </div>
    );
  }

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
    } catch (error) {
      console.error('Error activating plan:', error);
    }
  };

  const handleCompletePlan = async () => {
    try {
      await completeMutation.mutateAsync(annualPlan.id);
      setShowCompleteConfirm(false);
      onComplete();
    } catch (error) {
      console.error('Error completing plan:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(annualPlan.id);
      setShowDeleteConfirm(false);
      onDelete();
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  const renderActions = () => {
    switch (annualPlan.status) {
      case 'draft':
        return (
          <>
            <button
              onClick={onEdit}
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
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="btn-ghost text-red-600 hover:bg-red-50 inline-flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </button>
          </>
        );
      case 'planning':
        return (
          <>
            <button
              onClick={onEdit}
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
        return (
          <button
            onClick={() => setShowCompleteConfirm(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Flag className="w-4 h-4" />
            Completar Plan
          </button>
        );
      case 'completed':
        return (
          <span className="text-sm text-gray-500 italic">
            Plan completado - historico
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={cn('p-3 rounded-lg', statusColors[annualPlan.status])}>
              <StatusIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900">{annualPlan.name}</h2>
                <span className={cn('px-3 py-1 rounded-full text-sm font-medium', statusColors[annualPlan.status])}>
                  {statusLabels[annualPlan.status]}
                </span>
              </div>
              <p className="text-gray-600 mt-1">
                Ano: <span className="font-semibold">{annualPlan.year}</span>
                {annualPlan.description && (
                  <> - {annualPlan.description}</>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {renderActions()}
          </div>
        </div>
      </div>

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

      {/* Complete Plan Confirmation */}
      <ConfirmModal
        open={showCompleteConfirm}
        onOpenChange={setShowCompleteConfirm}
        title="Completar Plan Anual"
        description="Esta accion marcara el plan como completado. El plan quedara en modo historico y no podra ser modificado. Desea continuar?"
        confirmLabel="Completar Plan"
        onConfirm={handleCompletePlan}
        isLoading={completeMutation.isPending}
        variant="warning"
      />
    </>
  );
}
