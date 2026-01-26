import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Modal } from '../common/Modals';
import { FormInput, FormField, FormSelect, FormTextArea, FormDatePicker } from '../common/Forms';
import {
  generalPlanFormSchema,
  planActionTypeOptions,
  priorityOptions,
  planStatusOptions,
  moduleAssociationOptions,
  type GeneralPlanFormData,
} from '../../schemas/finca.schema';
import { useCreateGeneralPlan, useUpdateGeneralPlan } from '../../hooks/useFincaMutations';
import { useDivisions } from '../../hooks/useFinca';
import type { GeneralPlan } from '../../types/finca.types';

interface GeneralPlanFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan?: GeneralPlan | null;
  onSuccess?: () => void;
}

function formatDateForInput(date: Date | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

export default function GeneralPlanFormModal({
  open,
  onOpenChange,
  plan,
  onSuccess,
}: GeneralPlanFormModalProps) {
  const isEditing = !!plan;

  const { data: divisions } = useDivisions();
  const createMutation = useCreateGeneralPlan();
  const updateMutation = useUpdateGeneralPlan();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<GeneralPlanFormData>({
    resolver: zodResolver(generalPlanFormSchema),
    defaultValues: {
      title: '',
      description: '',
      actionType: 'otro',
      targetModule: undefined,
      targetDivisionId: '',
      scheduledDate: '',
      dueDate: '',
      estimatedDuration: '',
      estimatedCost: '',
      actualCost: '',
      assignedTo: '',
      priority: 'medium',
      status: 'pending',
      notes: '',
    },
  });

  const selectedStatus = watch('status');

  useEffect(() => {
    if (open && plan) {
      reset({
        title: plan.title,
        description: plan.description || '',
        actionType: plan.actionType,
        targetModule: plan.targetModule || undefined,
        targetDivisionId: plan.targetDivisionId || '',
        scheduledDate: formatDateForInput(plan.scheduledDate),
        dueDate: formatDateForInput(plan.dueDate),
        estimatedDuration: plan.estimatedDuration ? String(plan.estimatedDuration) : '',
        estimatedCost: plan.estimatedCost ? String(plan.estimatedCost) : '',
        actualCost: plan.actualCost ? String(plan.actualCost) : '',
        assignedTo: plan.assignedTo || '',
        priority: plan.priority,
        status: plan.status,
        notes: plan.notes || '',
      });
    } else if (open && !plan) {
      const today = new Date().toISOString().split('T')[0];
      reset({
        title: '',
        description: '',
        actionType: 'otro',
        targetModule: undefined,
        targetDivisionId: '',
        scheduledDate: today,
        dueDate: '',
        estimatedDuration: '',
        estimatedCost: '',
        actualCost: '',
        assignedTo: '',
        priority: 'medium',
        status: 'pending',
        notes: '',
      });
    }
  }, [open, plan, reset]);

  const onSubmit = async (data: GeneralPlanFormData) => {
    try {
      if (isEditing && plan) {
        await updateMutation.mutateAsync({ id: plan.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving plan:', error);
    }
  };

  // Build division options
  const divisionOptions = [
    { value: '', label: 'Ninguna' },
    ...(divisions || []).map(d => ({ value: d.id, label: `${d.name} (${d.code})` })),
  ];

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar Plan' : 'Nuevo Plan General'}
      description={isEditing ? 'Modifica los datos del plan' : 'Crea un plan de accion transversal'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormField label="Titulo" required error={errors.title?.message}>
          <FormInput
            {...register('title')}
            placeholder="Ej: Mantenimiento de cercas"
            error={errors.title?.message}
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Tipo de Accion" required error={errors.actionType?.message}>
            <Controller
              name="actionType"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={planActionTypeOptions}
                  placeholder="Seleccionar tipo..."
                  error={errors.actionType?.message}
                />
              )}
            />
          </FormField>

          <FormField label="Modulo Destino">
            <Controller
              name="targetModule"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value || ''}
                  onValueChange={field.onChange}
                  options={[
                    { value: '', label: 'General (todos)' },
                    ...moduleAssociationOptions,
                  ]}
                  placeholder="Seleccionar modulo..."
                />
              )}
            />
          </FormField>
        </div>

        <FormField label="Division Especifica">
          <Controller
            name="targetDivisionId"
            control={control}
            render={({ field }) => (
              <FormSelect
                value={field.value || ''}
                onValueChange={field.onChange}
                options={divisionOptions}
                placeholder="Seleccionar division..."
              />
            )}
          />
        </FormField>

        <FormField label="Descripcion">
          <FormTextArea
            {...register('description')}
            placeholder="Descripcion detallada del plan..."
            rows={3}
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Fecha Programada" required error={errors.scheduledDate?.message}>
            <FormDatePicker
              {...register('scheduledDate')}
              error={errors.scheduledDate?.message}
            />
          </FormField>

          <FormField label="Fecha Limite">
            <FormDatePicker
              {...register('dueDate')}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Duracion Estimada (horas)">
            <FormInput
              type="number"
              step="0.5"
              {...register('estimatedDuration')}
              placeholder="Ej: 8"
            />
          </FormField>

          <FormField label="Costo Estimado">
            <FormInput
              type="number"
              {...register('estimatedCost')}
              placeholder="Ej: 150000"
            />
          </FormField>

          {selectedStatus === 'completed' && (
            <FormField label="Costo Real">
              <FormInput
                type="number"
                {...register('actualCost')}
                placeholder="Ej: 145000"
              />
            </FormField>
          )}
        </div>

        <FormField label="Asignado a">
          <FormInput
            {...register('assignedTo')}
            placeholder="Nombre del responsable"
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Prioridad" required error={errors.priority?.message}>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={priorityOptions}
                  placeholder="Seleccionar prioridad..."
                  error={errors.priority?.message}
                />
              )}
            />
          </FormField>

          <FormField label="Estado" required error={errors.status?.message}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={planStatusOptions}
                  placeholder="Seleccionar estado..."
                  error={errors.status?.message}
                />
              )}
            />
          </FormField>
        </div>

        <FormField label="Notas">
          <FormTextArea
            {...register('notes')}
            placeholder="Notas adicionales..."
            rows={2}
          />
        </FormField>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="btn-secondary"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary inline-flex items-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEditing ? 'Guardar Cambios' : 'Crear Plan'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
