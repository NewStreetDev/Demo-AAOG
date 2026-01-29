import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Modal } from '../common/Modals';
import { FormInput, FormField, FormTextArea } from '../common/Forms';
import { annualPlanFormSchema, type AnnualPlanFormData } from '../../schemas/finca.schema';
import { useCreateAnnualPlan, useUpdateAnnualPlan } from '../../hooks/useAnnualPlan';
import type { AnnualPlan } from '../../types/finca.types';

interface AnnualPlanFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  annualPlan?: AnnualPlan | null;
  onSuccess?: () => void;
}

export default function AnnualPlanFormModal({
  open,
  onOpenChange,
  annualPlan,
  onSuccess,
}: AnnualPlanFormModalProps) {
  const isEditing = !!annualPlan;
  const nextYear = new Date().getFullYear() + 1;

  const createMutation = useCreateAnnualPlan();
  const updateMutation = useUpdateAnnualPlan();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AnnualPlanFormData>({
    resolver: zodResolver(annualPlanFormSchema),
    defaultValues: {
      year: nextYear,
      name: `Planificacion ${nextYear}`,
      description: '',
    },
  });

  // Watch the year field to auto-fill the name
  const yearValue = watch('year');

  useEffect(() => {
    if (!isEditing && yearValue) {
      setValue('name', `Planificacion ${yearValue}`);
    }
  }, [yearValue, isEditing, setValue]);

  useEffect(() => {
    if (open && annualPlan) {
      reset({
        year: annualPlan.year,
        name: annualPlan.name,
        description: annualPlan.description || '',
      });
    } else if (open && !annualPlan) {
      reset({
        year: nextYear,
        name: `Planificacion ${nextYear}`,
        description: '',
      });
    }
  }, [open, annualPlan, nextYear, reset]);

  const onSubmit = async (data: AnnualPlanFormData) => {
    try {
      if (isEditing && annualPlan) {
        await updateMutation.mutateAsync({ id: annualPlan.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving annual plan:', error);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar Plan Anual' : 'Crear Plan Anual'}
      description={isEditing ? 'Modifica los datos del plan anual' : 'Crea un nuevo plan de planificacion anual'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormField label="Ano" required error={errors.year?.message}>
          <FormInput
            type="number"
            min={2020}
            max={2100}
            {...register('year', { valueAsNumber: true })}
            placeholder="Ej: 2026"
            error={errors.year?.message}
          />
        </FormField>

        <FormField label="Nombre" required error={errors.name?.message}>
          <FormInput
            {...register('name')}
            placeholder="Ej: Planificacion 2026"
            error={errors.name?.message}
          />
        </FormField>

        <FormField label="Descripcion">
          <FormTextArea
            {...register('description')}
            placeholder="Descripcion opcional del plan anual..."
            rows={3}
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
