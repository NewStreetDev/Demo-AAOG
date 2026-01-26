import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Modal } from '../common/Modals';
import {
  FormInput,
  FormField,
  FormSelect,
  FormTextArea,
} from '../common/Forms';
import {
  workPlanFormSchema,
  workPlanStatusOptions,
  workPlanActivityTypeOptions,
  workPlanPriorityOptions,
  type WorkPlanFormData,
} from '../../schemas/apicultura.schema';
import { useCreateWorkPlan, useUpdateWorkPlan } from '../../hooks/useApiculturaMutations';
import { useApiarios, useColmenas } from '../../hooks/useApicultura';
import type { WorkPlan } from '../../types/apicultura.types';

interface WorkPlanFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workPlan?: WorkPlan | null;
  onSuccess?: () => void;
}

export default function WorkPlanFormModal({
  open,
  onOpenChange,
  workPlan,
  onSuccess,
}: WorkPlanFormModalProps) {
  const isEditing = !!workPlan;
  const createMutation = useCreateWorkPlan();
  const updateMutation = useUpdateWorkPlan();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const { data: apiarios } = useApiarios();
  const { data: colmenas } = useColmenas();

  const apiarioOptions = apiarios?.map(a => ({ value: a.id, label: a.name })) || [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<WorkPlanFormData>({
    resolver: zodResolver(workPlanFormSchema),
    defaultValues: {
      title: '',
      description: '',
      apiarioId: '',
      colmenaId: '',
      activityType: undefined,
      scheduledDate: '',
      estimatedDuration: '',
      assignedTo: '',
      priority: undefined,
      status: 'pending',
      notes: '',
    },
  });

  const selectedApiarioId = watch('apiarioId');
  const filteredColmenas = colmenas?.filter(c =>
    !selectedApiarioId || c.apiarioId === selectedApiarioId
  ) || [];
  const filteredColmenaOptions = filteredColmenas.map(c => ({
    value: c.id,
    label: `${c.code}${selectedApiarioId ? '' : ` - ${c.apiarioName}`}`
  }));

  useEffect(() => {
    if (open && workPlan) {
      reset({
        title: workPlan.title,
        description: workPlan.description || '',
        apiarioId: workPlan.apiarioId || '',
        colmenaId: workPlan.colmenaId || '',
        activityType: workPlan.activityType,
        scheduledDate: workPlan.scheduledDate
          ? new Date(workPlan.scheduledDate).toISOString().split('T')[0]
          : '',
        estimatedDuration: workPlan.estimatedDuration?.toString() || '',
        assignedTo: workPlan.assignedTo || '',
        priority: workPlan.priority,
        status: workPlan.status,
        notes: workPlan.notes || '',
      });
    } else if (open && !workPlan) {
      reset({
        title: '',
        description: '',
        apiarioId: '',
        colmenaId: '',
        activityType: undefined,
        scheduledDate: '',
        estimatedDuration: '',
        assignedTo: '',
        priority: undefined,
        status: 'pending',
        notes: '',
      });
    }
  }, [open, workPlan, reset]);

  const onSubmit = async (data: WorkPlanFormData) => {
    try {
      if (isEditing && workPlan) {
        await updateMutation.mutateAsync({ id: workPlan.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving work plan:', error);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar Plan de Trabajo' : 'Nuevo Plan de Trabajo'}
      description={
        isEditing
          ? 'Modifica los datos del plan de trabajo'
          : 'Registra un nuevo plan de trabajo'
      }
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Row 1: Title */}
        <FormField label="Titulo" required error={errors.title?.message}>
          <FormInput
            {...register('title')}
            placeholder="Ej: Revisión general del apiario"
            error={errors.title?.message}
          />
        </FormField>

        {/* Row 2: Activity Type and Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Tipo de Actividad" required error={errors.activityType?.message}>
            <Controller
              name="activityType"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={workPlanActivityTypeOptions}
                  placeholder="Seleccionar..."
                  error={errors.activityType?.message}
                />
              )}
            />
          </FormField>
          <FormField label="Prioridad" required error={errors.priority?.message}>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={workPlanPriorityOptions}
                  placeholder="Seleccionar..."
                  error={errors.priority?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 3: Apiario and Colmena */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Apiario" error={errors.apiarioId?.message}>
            <Controller
              name="apiarioId"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={apiarioOptions}
                  placeholder="Todos los apiarios"
                  error={errors.apiarioId?.message}
                />
              )}
            />
          </FormField>
          <FormField label="Colmena (opcional)" error={errors.colmenaId?.message}>
            <Controller
              name="colmenaId"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={filteredColmenaOptions}
                  placeholder="Todas las colmenas"
                  error={errors.colmenaId?.message}
                  disabled={filteredColmenaOptions.length === 0}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 4: Date and Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Fecha Programada" required error={errors.scheduledDate?.message}>
            <FormInput
              {...register('scheduledDate')}
              type="date"
              error={errors.scheduledDate?.message}
            />
          </FormField>
          <FormField label="Duración Estimada (horas)" error={errors.estimatedDuration?.message}>
            <FormInput
              {...register('estimatedDuration')}
              type="number"
              step="0.5"
              placeholder="Ej: 2.5"
              error={errors.estimatedDuration?.message}
            />
          </FormField>
        </div>

        {/* Row 5: Assigned To and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Asignado a" error={errors.assignedTo?.message}>
            <FormInput
              {...register('assignedTo')}
              placeholder="Ej: Juan Pérez"
              error={errors.assignedTo?.message}
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
                  options={workPlanStatusOptions}
                  placeholder="Seleccionar..."
                  error={errors.status?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Description */}
        <FormField label="Descripción" error={errors.description?.message}>
          <FormTextArea
            {...register('description')}
            placeholder="Descripción detallada del trabajo a realizar..."
            rows={2}
            error={errors.description?.message}
          />
        </FormField>

        {/* Notes */}
        <FormField label="Notas" error={errors.notes?.message}>
          <FormTextArea
            {...register('notes')}
            placeholder="Observaciones adicionales..."
            rows={2}
            error={errors.notes?.message}
          />
        </FormField>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary inline-flex items-center gap-2"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEditing ? 'Guardar Cambios' : 'Crear Plan'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
