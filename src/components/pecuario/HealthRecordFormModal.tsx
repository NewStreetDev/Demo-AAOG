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
  healthRecordFormSchema,
  healthRecordTypeOptions,
  type HealthRecordFormData,
} from '../../schemas/pecuario.schema';
import { useCreateHealthRecord, useUpdateHealthRecord } from '../../hooks/usePecuarioMutations';
import { useLivestock } from '../../hooks/usePecuario';
import type { HealthRecord, Livestock } from '../../types/pecuario.types';

interface HealthRecordFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  healthRecord?: HealthRecord | null;
  livestock?: Livestock | null; // Pre-selected livestock
  onSuccess?: () => void;
}

export default function HealthRecordFormModal({
  open,
  onOpenChange,
  healthRecord,
  livestock: preselectedLivestock,
  onSuccess,
}: HealthRecordFormModalProps) {
  const isEditing = !!healthRecord;
  const createMutation = useCreateHealthRecord();
  const updateMutation = useUpdateHealthRecord();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const { data: allLivestock } = useLivestock();

  const livestockOptions = allLivestock
    ?.filter(l => l.status === 'active')
    .map(l => ({
      value: l.id,
      label: `${l.tag}${l.name ? ` - ${l.name}` : ''} (${l.breed})`,
    })) || [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<HealthRecordFormData>({
    resolver: zodResolver(healthRecordFormSchema),
    defaultValues: {
      livestockId: '',
      livestockTag: '',
      date: '',
      type: undefined,
      description: '',
      medication: '',
      dosage: '',
      veterinarian: '',
      cost: '',
      nextCheckup: '',
      notes: '',
    },
  });

  const selectedLivestockId = watch('livestockId');

  // Update livestockTag when livestock is selected
  useEffect(() => {
    if (selectedLivestockId && allLivestock) {
      const selected = allLivestock.find(l => l.id === selectedLivestockId);
      if (selected) {
        setValue('livestockTag', selected.tag);
      }
    }
  }, [selectedLivestockId, allLivestock, setValue]);

  useEffect(() => {
    if (open && healthRecord) {
      reset({
        livestockId: healthRecord.livestockId,
        livestockTag: healthRecord.livestockTag,
        date: healthRecord.date
          ? new Date(healthRecord.date).toISOString().split('T')[0]
          : '',
        type: healthRecord.type,
        description: healthRecord.description,
        medication: healthRecord.medication || '',
        dosage: healthRecord.dosage || '',
        veterinarian: healthRecord.veterinarian || '',
        cost: healthRecord.cost?.toString() || '',
        nextCheckup: healthRecord.nextCheckup
          ? new Date(healthRecord.nextCheckup).toISOString().split('T')[0]
          : '',
        notes: healthRecord.notes || '',
      });
    } else if (open && preselectedLivestock) {
      reset({
        livestockId: preselectedLivestock.id,
        livestockTag: preselectedLivestock.tag,
        date: new Date().toISOString().split('T')[0],
        type: undefined,
        description: '',
        medication: '',
        dosage: '',
        veterinarian: '',
        cost: '',
        nextCheckup: '',
        notes: '',
      });
    } else if (open && !healthRecord) {
      reset({
        livestockId: '',
        livestockTag: '',
        date: new Date().toISOString().split('T')[0],
        type: undefined,
        description: '',
        medication: '',
        dosage: '',
        veterinarian: '',
        cost: '',
        nextCheckup: '',
        notes: '',
      });
    }
  }, [open, healthRecord, preselectedLivestock, reset]);

  const onSubmit = async (data: HealthRecordFormData) => {
    try {
      if (isEditing && healthRecord) {
        await updateMutation.mutateAsync({ id: healthRecord.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving health record:', error);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar Registro de Salud' : 'Nuevo Registro de Salud'}
      description={
        isEditing
          ? 'Modifica los datos del registro de salud'
          : 'Registra una nueva accion de salud para un animal'
      }
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Row 1: Animal Selection */}
        <FormField label="Animal" required error={errors.livestockId?.message}>
          <Controller
            name="livestockId"
            control={control}
            render={({ field }) => (
              <FormSelect
                value={field.value}
                onValueChange={field.onChange}
                options={livestockOptions}
                placeholder="Seleccionar animal..."
                error={errors.livestockId?.message}
                disabled={!!preselectedLivestock}
              />
            )}
          />
        </FormField>

        {/* Row 2: Type and Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Tipo de Accion" required error={errors.type?.message}>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={healthRecordTypeOptions}
                  placeholder="Seleccionar..."
                  error={errors.type?.message}
                />
              )}
            />
          </FormField>
          <FormField label="Fecha" required error={errors.date?.message}>
            <FormInput
              {...register('date')}
              type="date"
              error={errors.date?.message}
            />
          </FormField>
        </div>

        {/* Row 3: Description */}
        <FormField label="Descripcion" required error={errors.description?.message}>
          <FormTextArea
            {...register('description')}
            placeholder="Describa la accion realizada..."
            rows={2}
            error={errors.description?.message}
          />
        </FormField>

        {/* Row 4: Medication and Dosage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Medicamento" error={errors.medication?.message}>
            <FormInput
              {...register('medication')}
              placeholder="Ej: Ivermectina"
              error={errors.medication?.message}
            />
          </FormField>
          <FormField label="Dosis" error={errors.dosage?.message}>
            <FormInput
              {...register('dosage')}
              placeholder="Ej: 5ml"
              error={errors.dosage?.message}
            />
          </FormField>
        </div>

        {/* Row 5: Veterinarian and Cost */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Veterinario" error={errors.veterinarian?.message}>
            <FormInput
              {...register('veterinarian')}
              placeholder="Ej: Dr. Garcia"
              error={errors.veterinarian?.message}
            />
          </FormField>
          <FormField label="Costo" error={errors.cost?.message}>
            <FormInput
              {...register('cost')}
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.cost?.message}
            />
          </FormField>
        </div>

        {/* Row 6: Next Checkup */}
        <FormField label="Proxima Revision" error={errors.nextCheckup?.message}>
          <FormInput
            {...register('nextCheckup')}
            type="date"
            error={errors.nextCheckup?.message}
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

        {/* Hidden field for livestockTag */}
        <input type="hidden" {...register('livestockTag')} />

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
            {isEditing ? 'Guardar Cambios' : 'Crear Registro'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
