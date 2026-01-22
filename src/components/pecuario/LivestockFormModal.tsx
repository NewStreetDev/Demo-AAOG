import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Modal } from '../common/Modals';
import {
  FormInput,
  FormField,
  FormSelect,
  FormDatePicker,
  FormTextArea,
} from '../common/Forms';
import {
  livestockFormSchema,
  categoryOptions,
  genderOptions,
  livestockStatusOptions,
  entryReasonOptions,
  exitReasonOptions,
  type LivestockFormData,
} from '../../schemas/pecuario.schema';
import { useCreateLivestock, useUpdateLivestock } from '../../hooks/usePecuarioMutations';
import type { Livestock } from '../../types/pecuario.types';

interface LivestockFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  livestock?: Livestock | null;
  onSuccess?: () => void;
}

function formatDateForInput(date: Date | string | undefined): string {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().split('T')[0];
}

export default function LivestockFormModal({
  open,
  onOpenChange,
  livestock,
  onSuccess,
}: LivestockFormModalProps) {
  const isEditing = !!livestock;
  const createMutation = useCreateLivestock();
  const updateMutation = useUpdateLivestock();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<LivestockFormData>({
    resolver: zodResolver(livestockFormSchema),
    defaultValues: {
      tag: '',
      name: '',
      category: undefined,
      breed: '',
      birthDate: '',
      gender: undefined,
      weight: '',
      status: 'active',
      location: '',
      motherId: '',
      motherTag: '',
      fatherId: '',
      fatherTag: '',
      entryDate: '',
      entryReason: undefined,
      exitDate: '',
      exitReason: undefined,
      notes: '',
    },
  });

  useEffect(() => {
    if (open && livestock) {
      reset({
        tag: livestock.tag,
        name: livestock.name || '',
        category: livestock.category,
        breed: livestock.breed,
        birthDate: formatDateForInput(livestock.birthDate),
        gender: livestock.gender,
        weight: livestock.weight.toString(),
        status: livestock.status,
        location: livestock.location,
        motherId: livestock.motherId || '',
        motherTag: livestock.motherTag || '',
        fatherId: livestock.fatherId || '',
        fatherTag: livestock.fatherTag || '',
        entryDate: formatDateForInput(livestock.entryDate),
        entryReason: livestock.entryReason,
        exitDate: formatDateForInput(livestock.exitDate),
        exitReason: livestock.exitReason,
        notes: livestock.notes || '',
      });
    } else if (open && !livestock) {
      reset({
        tag: '',
        name: '',
        category: undefined,
        breed: '',
        birthDate: '',
        gender: undefined,
        weight: '',
        status: 'active',
        location: '',
        motherId: '',
        motherTag: '',
        fatherId: '',
        fatherTag: '',
        entryDate: '',
        entryReason: undefined,
        exitDate: '',
        exitReason: undefined,
        notes: '',
      });
    }
  }, [open, livestock, reset]);

  const onSubmit = async (data: LivestockFormData) => {
    try {
      if (isEditing && livestock) {
        await updateMutation.mutateAsync({ id: livestock.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving livestock:', error);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar Animal' : 'Nuevo Animal'}
      description={
        isEditing
          ? 'Modifica los datos del animal'
          : 'Registra un nuevo animal en el inventario'
      }
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Row 1: Tag, Name */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Arete" required error={errors.tag?.message}>
            <FormInput
              {...register('tag')}
              placeholder="Ej: BOV-001"
              error={errors.tag?.message}
            />
          </FormField>
          <div className="md:col-span-2">
            <FormField label="Nombre" error={errors.name?.message}>
              <FormInput
                {...register('name')}
                placeholder="Ej: Estrella"
                error={errors.name?.message}
              />
            </FormField>
          </div>
        </div>

        {/* Row 2: Category, Gender, Breed */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Categoría" required error={errors.category?.message}>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={categoryOptions}
                  placeholder="Seleccionar..."
                  error={errors.category?.message}
                />
              )}
            />
          </FormField>
          <FormField label="Género" required error={errors.gender?.message}>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={genderOptions}
                  placeholder="Seleccionar..."
                  error={errors.gender?.message}
                />
              )}
            />
          </FormField>
          <FormField label="Raza" required error={errors.breed?.message}>
            <FormInput
              {...register('breed')}
              placeholder="Ej: Holstein"
              error={errors.breed?.message}
            />
          </FormField>
        </div>

        {/* Row 3: Birth Date, Weight, Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Fecha de Nacimiento" required error={errors.birthDate?.message}>
            <FormDatePicker
              {...register('birthDate')}
              error={errors.birthDate?.message}
            />
          </FormField>
          <FormField label="Peso (kg)" required error={errors.weight?.message}>
            <FormInput
              {...register('weight')}
              type="number"
              placeholder="Ej: 520"
              error={errors.weight?.message}
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
                  options={livestockStatusOptions}
                  placeholder="Seleccionar..."
                  error={errors.status?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 4: Location */}
        <FormField label="Ubicación" required error={errors.location?.message}>
          <FormInput
            {...register('location')}
            placeholder="Ej: Potrero Norte"
            error={errors.location?.message}
          />
        </FormField>

        {/* Row 5: Entry Date, Entry Reason */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Fecha de Entrada" required error={errors.entryDate?.message}>
            <FormDatePicker
              {...register('entryDate')}
              error={errors.entryDate?.message}
            />
          </FormField>
          <FormField label="Razón de Entrada" required error={errors.entryReason?.message}>
            <Controller
              name="entryReason"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={entryReasonOptions}
                  placeholder="Seleccionar..."
                  error={errors.entryReason?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 6: Mother, Father */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Arete de la Madre" error={errors.motherTag?.message}>
            <FormInput
              {...register('motherTag')}
              placeholder="Ej: BOV-001"
              error={errors.motherTag?.message}
            />
          </FormField>
          <FormField label="Arete del Padre" error={errors.fatherTag?.message}>
            <FormInput
              {...register('fatherTag')}
              placeholder="Ej: BOV-002"
              error={errors.fatherTag?.message}
            />
          </FormField>
        </div>

        {/* Row 7: Exit Date, Exit Reason (optional) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Fecha de Salida" error={errors.exitDate?.message}>
            <FormDatePicker
              {...register('exitDate')}
              error={errors.exitDate?.message}
            />
          </FormField>
          <FormField label="Razón de Salida" error={errors.exitReason?.message}>
            <Controller
              name="exitReason"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value || ''}
                  onValueChange={field.onChange}
                  options={exitReasonOptions}
                  placeholder="Seleccionar..."
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
            {isEditing ? 'Guardar Cambios' : 'Registrar Animal'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
