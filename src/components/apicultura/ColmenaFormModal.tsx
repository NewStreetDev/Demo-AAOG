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
  colmenaFormSchema,
  colmenaStatusOptions,
  queenStatusOptions,
  populationOptions,
  weightOptions,
  type ColmenaFormData,
} from '../../schemas/apicultura.schema';
import { useCreateColmena, useUpdateColmena } from '../../hooks/useApiculturaMutations';
import { useApiarios } from '../../hooks/useApicultura';
import type { Colmena } from '../../types/apicultura.types';

interface ColmenaFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  colmena?: Colmena | null;
  defaultApiarioId?: string;
  onSuccess?: () => void;
}

export default function ColmenaFormModal({
  open,
  onOpenChange,
  colmena,
  defaultApiarioId,
  onSuccess,
}: ColmenaFormModalProps) {
  const isEditing = !!colmena;
  const createMutation = useCreateColmena();
  const updateMutation = useUpdateColmena();
  const { data: apiarios = [] } = useApiarios();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const apiarioOptions = apiarios.map((a) => ({
    value: a.id,
    label: a.name,
  }));

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ColmenaFormData>({
    resolver: zodResolver(colmenaFormSchema),
    defaultValues: {
      code: '',
      apiarioId: defaultApiarioId || '',
      queenAge: '',
      queenStatus: undefined,
      population: undefined,
      health: '',
      weight: undefined,
      honeyMaturity: '',
      status: undefined,
      notes: '',
    },
  });

  useEffect(() => {
    if (open && colmena) {
      reset({
        code: colmena.code,
        apiarioId: colmena.apiarioId,
        queenAge: colmena.queenAge.toString(),
        queenStatus: colmena.queenStatus,
        population: colmena.population,
        health: colmena.health.toString(),
        weight: colmena.weight,
        honeyMaturity: colmena.honeyMaturity.toString(),
        status: colmena.status,
        notes: colmena.notes || '',
      });
    } else if (open && !colmena) {
      reset({
        code: '',
        apiarioId: defaultApiarioId || '',
        queenAge: '',
        queenStatus: undefined,
        population: undefined,
        health: '',
        weight: undefined,
        honeyMaturity: '',
        status: undefined,
        notes: '',
      });
    }
  }, [open, colmena, defaultApiarioId, reset]);

  const onSubmit = async (data: ColmenaFormData) => {
    try {
      if (isEditing && colmena) {
        await updateMutation.mutateAsync({ id: colmena.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving colmena:', error);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar Colmena' : 'Nueva Colmena'}
      description={
        isEditing
          ? 'Modifica los datos de la colmena'
          : 'Registra una nueva colmena'
      }
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Row 1: Code, Apiario, Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Código" required error={errors.code?.message}>
            <FormInput
              {...register('code')}
              placeholder="Ej: COL-001"
              error={errors.code?.message}
            />
          </FormField>
          <FormField label="Apiario" required error={errors.apiarioId?.message}>
            <Controller
              name="apiarioId"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={apiarioOptions}
                  placeholder="Seleccionar..."
                  error={errors.apiarioId?.message}
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
                  options={colmenaStatusOptions}
                  placeholder="Seleccionar..."
                  error={errors.status?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 2: Queen Age, Queen Status, Population */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Edad Reina (meses)" required error={errors.queenAge?.message}>
            <FormInput
              {...register('queenAge')}
              type="number"
              placeholder="Ej: 6"
              error={errors.queenAge?.message}
            />
          </FormField>
          <FormField label="Estado Reina" required error={errors.queenStatus?.message}>
            <Controller
              name="queenStatus"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={queenStatusOptions}
                  placeholder="Seleccionar..."
                  error={errors.queenStatus?.message}
                />
              )}
            />
          </FormField>
          <FormField label="Población" required error={errors.population?.message}>
            <Controller
              name="population"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={populationOptions}
                  placeholder="Seleccionar..."
                  error={errors.population?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 3: Health, Weight, Honey Maturity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Salud (1-10)" required error={errors.health?.message}>
            <FormInput
              {...register('health')}
              type="number"
              min="1"
              max="10"
              placeholder="Ej: 8"
              error={errors.health?.message}
            />
          </FormField>
          <FormField label="Peso" required error={errors.weight?.message}>
            <Controller
              name="weight"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={weightOptions}
                  placeholder="Seleccionar..."
                  error={errors.weight?.message}
                />
              )}
            />
          </FormField>
          <FormField label="Madurez Miel (%)" required error={errors.honeyMaturity?.message}>
            <FormInput
              {...register('honeyMaturity')}
              type="number"
              min="0"
              max="100"
              placeholder="Ej: 75"
              error={errors.honeyMaturity?.message}
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
            {isEditing ? 'Guardar Cambios' : 'Crear Colmena'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
