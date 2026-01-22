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
  loteFormSchema,
  loteStatusOptions,
  irrigationTypeOptions,
  type LoteFormData,
} from '../../schemas/agro.schema';
import { useCreateLote, useUpdateLote } from '../../hooks/useAgroMutations';
import type { Lote } from '../../types/agro.types';

interface LoteFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lote?: Lote | null;
  onSuccess?: () => void;
}

export default function LoteFormModal({
  open,
  onOpenChange,
  lote,
  onSuccess,
}: LoteFormModalProps) {
  const isEditing = !!lote;
  const createMutation = useCreateLote();
  const updateMutation = useUpdateLote();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<LoteFormData>({
    resolver: zodResolver(loteFormSchema),
    defaultValues: {
      name: '',
      code: '',
      area: '',
      soilType: '',
      irrigationType: undefined,
      status: undefined,
      notes: '',
    },
  });

  useEffect(() => {
    if (open && lote) {
      reset({
        name: lote.name,
        code: lote.code,
        area: lote.area.toString(),
        soilType: lote.soilType || '',
        irrigationType: lote.irrigationType,
        status: lote.status,
        notes: lote.notes || '',
      });
    } else if (open && !lote) {
      reset({
        name: '',
        code: '',
        area: '',
        soilType: '',
        irrigationType: undefined,
        status: undefined,
        notes: '',
      });
    }
  }, [open, lote, reset]);

  const onSubmit = async (data: LoteFormData) => {
    try {
      if (isEditing && lote) {
        await updateMutation.mutateAsync({ id: lote.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving lote:', error);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar Lote' : 'Nuevo Lote'}
      description={
        isEditing
          ? 'Modifica los datos del lote'
          : 'Registra un nuevo lote agrícola'
      }
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Row 1: Code and Name */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Código" required error={errors.code?.message}>
            <FormInput
              {...register('code')}
              placeholder="Ej: LT-001"
              error={errors.code?.message}
            />
          </FormField>
          <div className="md:col-span-2">
            <FormField label="Nombre" required error={errors.name?.message}>
              <FormInput
                {...register('name')}
                placeholder="Ej: Lote Norte"
                error={errors.name?.message}
              />
            </FormField>
          </div>
        </div>

        {/* Row 2: Area and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Área (ha)" required error={errors.area?.message}>
            <FormInput
              {...register('area')}
              type="number"
              step="0.1"
              placeholder="Ej: 5.5"
              error={errors.area?.message}
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
                  options={loteStatusOptions}
                  placeholder="Seleccionar estado..."
                  error={errors.status?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 3: Soil Type and Irrigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Tipo de Suelo" error={errors.soilType?.message}>
            <FormInput
              {...register('soilType')}
              placeholder="Ej: Franco arcilloso"
              error={errors.soilType?.message}
            />
          </FormField>
          <FormField label="Tipo de Riego" error={errors.irrigationType?.message}>
            <Controller
              name="irrigationType"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value || ''}
                  onValueChange={field.onChange}
                  options={irrigationTypeOptions}
                  placeholder="Seleccionar riego..."
                />
              )}
            />
          </FormField>
        </div>

        {/* Notes */}
        <FormField label="Notas" error={errors.notes?.message}>
          <FormTextArea
            {...register('notes')}
            placeholder="Observaciones adicionales..."
            rows={3}
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
            {isEditing ? 'Guardar Cambios' : 'Crear Lote'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
