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
  milkProductionFormSchema,
  milkShiftOptions,
  milkQualityOptions,
  milkDestinationOptions,
  type MilkProductionFormData,
} from '../../schemas/pecuario.schema';
import { useCreateMilkProduction, useUpdateMilkProduction } from '../../hooks/usePecuarioMutations';
import type { MilkProduction } from '../../types/pecuario.types';

interface MilkProductionFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  milkProduction?: MilkProduction | null;
  onSuccess?: () => void;
}

export default function MilkProductionFormModal({
  open,
  onOpenChange,
  milkProduction,
  onSuccess,
}: MilkProductionFormModalProps) {
  const isEditing = !!milkProduction;
  const createMutation = useCreateMilkProduction();
  const updateMutation = useUpdateMilkProduction();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MilkProductionFormData>({
    resolver: zodResolver(milkProductionFormSchema),
    defaultValues: {
      date: '',
      shift: undefined,
      totalLiters: '',
      cowsMilked: '',
      avgPerCow: '',
      temperature: '',
      quality: undefined,
      destination: undefined,
      notes: '',
    },
  });

  const watchedTotalLiters = watch('totalLiters');
  const watchedCowsMilked = watch('cowsMilked');

  // Auto-calculate average per cow
  useEffect(() => {
    const total = parseFloat(watchedTotalLiters);
    const cows = parseInt(watchedCowsMilked);
    if (!isNaN(total) && !isNaN(cows) && cows > 0) {
      const avg = (total / cows).toFixed(2);
      setValue('avgPerCow', avg);
    }
  }, [watchedTotalLiters, watchedCowsMilked, setValue]);

  useEffect(() => {
    if (open && milkProduction) {
      reset({
        date: milkProduction.date
          ? new Date(milkProduction.date).toISOString().split('T')[0]
          : '',
        shift: milkProduction.shift,
        totalLiters: milkProduction.totalLiters.toString(),
        cowsMilked: milkProduction.cowsMilked.toString(),
        avgPerCow: milkProduction.avgPerCow.toString(),
        temperature: milkProduction.temperature?.toString() || '',
        quality: milkProduction.quality || undefined,
        destination: milkProduction.destination || undefined,
        notes: milkProduction.notes || '',
      });
    } else if (open && !milkProduction) {
      // Determine default shift based on current time
      const currentHour = new Date().getHours();
      const defaultShift = currentHour < 12 ? 'morning' : 'afternoon';

      reset({
        date: new Date().toISOString().split('T')[0],
        shift: defaultShift,
        totalLiters: '',
        cowsMilked: '28', // Default number of cows
        avgPerCow: '',
        temperature: '4',
        quality: 'A',
        destination: 'sale',
        notes: '',
      });
    }
  }, [open, milkProduction, reset]);

  const onSubmit = async (data: MilkProductionFormData) => {
    try {
      if (isEditing && milkProduction) {
        await updateMutation.mutateAsync({ id: milkProduction.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving milk production:', error);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar Produccion de Leche' : 'Nueva Produccion de Leche'}
      description={
        isEditing
          ? 'Modifica los datos del registro de produccion'
          : 'Registra la produccion de leche del turno'
      }
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Row 1: Date and Shift */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Fecha" required error={errors.date?.message}>
            <FormInput
              {...register('date')}
              type="date"
              error={errors.date?.message}
            />
          </FormField>
          <FormField label="Turno" required error={errors.shift?.message}>
            <Controller
              name="shift"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={milkShiftOptions}
                  placeholder="Seleccionar turno..."
                  error={errors.shift?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 2: Total Liters and Cows Milked */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Litros Totales" required error={errors.totalLiters?.message}>
            <FormInput
              {...register('totalLiters')}
              type="number"
              step="0.1"
              placeholder="Ej: 150"
              error={errors.totalLiters?.message}
            />
          </FormField>
          <FormField label="Vacas Ordenadas" required error={errors.cowsMilked?.message}>
            <FormInput
              {...register('cowsMilked')}
              type="number"
              placeholder="Ej: 28"
              error={errors.cowsMilked?.message}
            />
          </FormField>
        </div>

        {/* Row 3: Average per Cow (calculated) */}
        <FormField label="Promedio por Vaca (L)" error={errors.avgPerCow?.message}>
          <FormInput
            {...register('avgPerCow')}
            type="number"
            step="0.01"
            placeholder="Calculado automaticamente"
            readOnly
            className="bg-gray-50"
            error={errors.avgPerCow?.message}
          />
        </FormField>

        {/* Row 4: Temperature and Quality */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Temperatura (C)" error={errors.temperature?.message}>
            <FormInput
              {...register('temperature')}
              type="number"
              step="0.1"
              placeholder="Ej: 4.5"
              error={errors.temperature?.message}
            />
          </FormField>
          <FormField label="Calidad" error={errors.quality?.message}>
            <Controller
              name="quality"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value || ''}
                  onValueChange={field.onChange}
                  options={milkQualityOptions}
                  placeholder="Seleccionar calidad..."
                  error={errors.quality?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 5: Destination */}
        <FormField label="Destino" error={errors.destination?.message}>
          <Controller
            name="destination"
            control={control}
            render={({ field }) => (
              <FormSelect
                value={field.value || ''}
                onValueChange={field.onChange}
                options={milkDestinationOptions}
                placeholder="Seleccionar destino..."
                error={errors.destination?.message}
              />
            )}
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
            {isEditing ? 'Guardar Cambios' : 'Registrar Produccion'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
