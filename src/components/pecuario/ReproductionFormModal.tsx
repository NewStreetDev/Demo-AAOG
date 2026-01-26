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
  reproductionRecordFormSchema,
  reproductionTypeOptions,
  reproductionStatusOptions,
  type ReproductionRecordFormData,
} from '../../schemas/pecuario.schema';
import { useCreateReproductionRecord, useUpdateReproductionRecord } from '../../hooks/usePecuarioMutations';
import { useLivestock } from '../../hooks/usePecuario';
import type { ReproductionRecord, Livestock } from '../../types/pecuario.types';

interface ReproductionFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reproductionRecord?: ReproductionRecord | null;
  preselectedCow?: Livestock | null;
  onSuccess?: () => void;
}

export default function ReproductionFormModal({
  open,
  onOpenChange,
  reproductionRecord,
  preselectedCow,
  onSuccess,
}: ReproductionFormModalProps) {
  const isEditing = !!reproductionRecord;
  const createMutation = useCreateReproductionRecord();
  const updateMutation = useUpdateReproductionRecord();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const { data: allLivestock } = useLivestock();

  // Filter for females (potential mothers)
  const femaleOptions = allLivestock
    ?.filter(l => l.status === 'active' && l.gender === 'female')
    .map(l => ({
      value: l.id,
      label: `${l.tag}${l.name ? ` - ${l.name}` : ''} (${l.breed})`,
    })) || [];

  // Filter for males (potential fathers)
  const maleOptions = allLivestock
    ?.filter(l => l.status === 'active' && l.gender === 'male')
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
  } = useForm<ReproductionRecordFormData>({
    resolver: zodResolver(reproductionRecordFormSchema),
    defaultValues: {
      cowId: '',
      cowTag: '',
      bullId: '',
      bullTag: '',
      type: undefined,
      serviceDate: '',
      expectedBirthDate: '',
      actualBirthDate: '',
      status: 'pending',
      calfId: '',
      calfTag: '',
      notes: '',
    },
  });

  const selectedCowId = watch('cowId');
  const selectedBullId = watch('bullId');
  const watchedType = watch('type');
  const watchedServiceDate = watch('serviceDate');

  // Update cowTag when cow is selected
  useEffect(() => {
    if (selectedCowId && allLivestock) {
      const selected = allLivestock.find(l => l.id === selectedCowId);
      if (selected) {
        setValue('cowTag', selected.tag);
      }
    }
  }, [selectedCowId, allLivestock, setValue]);

  // Update bullTag when bull is selected
  useEffect(() => {
    if (selectedBullId && allLivestock) {
      const selected = allLivestock.find(l => l.id === selectedBullId);
      if (selected) {
        setValue('bullTag', selected.tag);
      }
    }
  }, [selectedBullId, allLivestock, setValue]);

  // Calculate expected birth date (approximately 283 days for cattle)
  useEffect(() => {
    if (watchedServiceDate && !isEditing) {
      const serviceDate = new Date(watchedServiceDate);
      const expectedDate = new Date(serviceDate);
      expectedDate.setDate(expectedDate.getDate() + 283);
      setValue('expectedBirthDate', expectedDate.toISOString().split('T')[0]);
    }
  }, [watchedServiceDate, isEditing, setValue]);

  useEffect(() => {
    if (open && reproductionRecord) {
      reset({
        cowId: reproductionRecord.cowId,
        cowTag: reproductionRecord.cowTag,
        bullId: reproductionRecord.bullId || '',
        bullTag: reproductionRecord.bullTag || '',
        type: reproductionRecord.type,
        serviceDate: reproductionRecord.serviceDate
          ? new Date(reproductionRecord.serviceDate).toISOString().split('T')[0]
          : '',
        expectedBirthDate: reproductionRecord.expectedBirthDate
          ? new Date(reproductionRecord.expectedBirthDate).toISOString().split('T')[0]
          : '',
        actualBirthDate: reproductionRecord.actualBirthDate
          ? new Date(reproductionRecord.actualBirthDate).toISOString().split('T')[0]
          : '',
        status: reproductionRecord.status,
        calfId: reproductionRecord.calfId || '',
        calfTag: reproductionRecord.calfTag || '',
        notes: reproductionRecord.notes || '',
      });
    } else if (open && preselectedCow) {
      reset({
        cowId: preselectedCow.id,
        cowTag: preselectedCow.tag,
        bullId: '',
        bullTag: '',
        type: undefined,
        serviceDate: new Date().toISOString().split('T')[0],
        expectedBirthDate: '',
        actualBirthDate: '',
        status: 'pending',
        calfId: '',
        calfTag: '',
        notes: '',
      });
    } else if (open && !reproductionRecord) {
      reset({
        cowId: '',
        cowTag: '',
        bullId: '',
        bullTag: '',
        type: undefined,
        serviceDate: new Date().toISOString().split('T')[0],
        expectedBirthDate: '',
        actualBirthDate: '',
        status: 'pending',
        calfId: '',
        calfTag: '',
        notes: '',
      });
    }
  }, [open, reproductionRecord, preselectedCow, reset]);

  const onSubmit = async (data: ReproductionRecordFormData) => {
    try {
      if (isEditing && reproductionRecord) {
        await updateMutation.mutateAsync({ id: reproductionRecord.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving reproduction record:', error);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar Registro de Reproduccion' : 'Nuevo Registro de Reproduccion'}
      description={
        isEditing
          ? 'Modifica los datos del registro de reproduccion'
          : 'Registra una monta natural o inseminacion artificial'
      }
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Row 1: Female Selection */}
        <FormField label="Hembra" required error={errors.cowId?.message}>
          <Controller
            name="cowId"
            control={control}
            render={({ field }) => (
              <FormSelect
                value={field.value}
                onValueChange={field.onChange}
                options={femaleOptions}
                placeholder="Seleccionar hembra..."
                error={errors.cowId?.message}
                disabled={!!preselectedCow}
              />
            )}
          />
        </FormField>

        {/* Row 2: Type and Service Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Tipo de Reproduccion" required error={errors.type?.message}>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={reproductionTypeOptions}
                  placeholder="Seleccionar tipo..."
                  error={errors.type?.message}
                />
              )}
            />
          </FormField>
          <FormField label="Fecha de Servicio" required error={errors.serviceDate?.message}>
            <FormInput
              {...register('serviceDate')}
              type="date"
              error={errors.serviceDate?.message}
            />
          </FormField>
        </div>

        {/* Row 3: Male Selection (only for natural mating) */}
        {watchedType === 'natural' && (
          <FormField label="Macho/Semental" error={errors.bullId?.message}>
            <Controller
              name="bullId"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value || ''}
                  onValueChange={field.onChange}
                  options={maleOptions}
                  placeholder="Seleccionar macho..."
                  error={errors.bullId?.message}
                />
              )}
            />
          </FormField>
        )}

        {/* Row 4: Status */}
        <FormField label="Estado" required error={errors.status?.message}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FormSelect
                value={field.value}
                onValueChange={field.onChange}
                options={reproductionStatusOptions}
                placeholder="Seleccionar estado..."
                error={errors.status?.message}
              />
            )}
          />
        </FormField>

        {/* Row 5: Expected and Actual Birth Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Fecha Esperada de Parto" error={errors.expectedBirthDate?.message}>
            <FormInput
              {...register('expectedBirthDate')}
              type="date"
              error={errors.expectedBirthDate?.message}
            />
          </FormField>
          <FormField label="Fecha Real de Parto" error={errors.actualBirthDate?.message}>
            <FormInput
              {...register('actualBirthDate')}
              type="date"
              error={errors.actualBirthDate?.message}
            />
          </FormField>
        </div>

        {/* Row 6: Calf Information (if born) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="ID de la Cria" error={errors.calfId?.message}>
            <FormInput
              {...register('calfId')}
              placeholder="ID de la cria (si nacio)"
              error={errors.calfId?.message}
            />
          </FormField>
          <FormField label="Arete de la Cria" error={errors.calfTag?.message}>
            <FormInput
              {...register('calfTag')}
              placeholder="Arete de la cria"
              error={errors.calfTag?.message}
            />
          </FormField>
        </div>

        {/* Notes */}
        <FormField label="Notas" error={errors.notes?.message}>
          <FormTextArea
            {...register('notes')}
            placeholder="Observaciones adicionales..."
            rows={2}
            error={errors.notes?.message}
          />
        </FormField>

        {/* Hidden fields */}
        <input type="hidden" {...register('cowTag')} />
        <input type="hidden" {...register('bullTag')} />

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
