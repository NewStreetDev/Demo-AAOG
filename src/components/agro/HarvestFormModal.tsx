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
  harvestFormSchema,
  harvestQualityOptions,
  harvestDestinationOptions,
  yieldUnitOptions,
  type HarvestFormData,
} from '../../schemas/agro.schema';
import { useCreateHarvest, useUpdateHarvest } from '../../hooks/useAgroMutations';
import { useLotes, useCrops } from '../../hooks/useAgro';
import type { Harvest, Lote, Crop } from '../../types/agro.types';

interface HarvestFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  harvest?: Harvest | null;
  lote?: Lote | null;
  crop?: Crop | null;
  onSuccess?: () => void;
}

export default function HarvestFormModal({
  open,
  onOpenChange,
  harvest,
  lote: preselectedLote,
  crop: preselectedCrop,
  onSuccess,
}: HarvestFormModalProps) {
  const isEditing = !!harvest;
  const createMutation = useCreateHarvest();
  const updateMutation = useUpdateHarvest();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const { data: lotes } = useLotes();
  const { data: crops } = useCrops();

  const loteOptions = lotes?.map(l => ({ value: l.id, label: `${l.code} - ${l.name}` })) || [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<HarvestFormData>({
    resolver: zodResolver(harvestFormSchema),
    defaultValues: {
      cropId: '',
      loteId: '',
      date: '',
      quantity: '',
      unit: '',
      quality: undefined,
      destination: undefined,
      pricePerUnit: '',
      harvestedBy: '',
      notes: '',
    },
  });

  const selectedLoteId = watch('loteId');

  const filteredCrops = crops?.filter(c =>
    !selectedLoteId || c.loteId === selectedLoteId
  ) || [];
  const filteredCropOptions = filteredCrops.map(c => ({
    value: c.id,
    label: `${c.name} - ${c.variety}${selectedLoteId ? '' : ` (${c.loteName})`}`
  }));

  useEffect(() => {
    if (open && harvest) {
      reset({
        cropId: harvest.cropId,
        loteId: harvest.loteId,
        date: harvest.date
          ? new Date(harvest.date).toISOString().split('T')[0]
          : '',
        quantity: harvest.quantity.toString(),
        unit: harvest.unit,
        quality: harvest.quality,
        destination: harvest.destination,
        pricePerUnit: harvest.pricePerUnit?.toString() || '',
        harvestedBy: harvest.harvestedBy || '',
        notes: harvest.notes || '',
      });
    } else if (open && !harvest) {
      reset({
        cropId: preselectedCrop?.id || '',
        loteId: preselectedLote?.id || preselectedCrop?.loteId || '',
        date: new Date().toISOString().split('T')[0],
        quantity: '',
        unit: 'kg',
        quality: undefined,
        destination: undefined,
        pricePerUnit: '',
        harvestedBy: '',
        notes: '',
      });
    }
  }, [open, harvest, preselectedLote, preselectedCrop, reset]);

  const onSubmit = async (data: HarvestFormData) => {
    try {
      if (isEditing && harvest) {
        await updateMutation.mutateAsync({ id: harvest.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving harvest:', error);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar Cosecha' : 'Nueva Cosecha'}
      description={
        isEditing
          ? 'Modifica los datos de la cosecha'
          : 'Registra una nueva cosecha'
      }
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Row 1: Lote and Crop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Lote" required error={errors.loteId?.message}>
            <Controller
              name="loteId"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={loteOptions}
                  placeholder="Seleccionar lote..."
                  error={errors.loteId?.message}
                  disabled={!!preselectedLote}
                />
              )}
            />
          </FormField>
          <FormField label="Cultivo" required error={errors.cropId?.message}>
            <Controller
              name="cropId"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={filteredCropOptions}
                  placeholder="Seleccionar cultivo..."
                  error={errors.cropId?.message}
                  disabled={!!preselectedCrop || filteredCropOptions.length === 0}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 2: Date */}
        <FormField label="Fecha de Cosecha" required error={errors.date?.message}>
          <FormInput
            {...register('date')}
            type="date"
            error={errors.date?.message}
          />
        </FormField>

        {/* Row 3: Quantity and Unit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Cantidad" required error={errors.quantity?.message}>
            <FormInput
              {...register('quantity')}
              type="number"
              step="0.1"
              placeholder="Ej: 500"
              error={errors.quantity?.message}
            />
          </FormField>
          <FormField label="Unidad" required error={errors.unit?.message}>
            <Controller
              name="unit"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={yieldUnitOptions}
                  placeholder="Seleccionar..."
                  error={errors.unit?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 4: Quality and Destination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Calidad" required error={errors.quality?.message}>
            <Controller
              name="quality"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={harvestQualityOptions}
                  placeholder="Seleccionar..."
                  error={errors.quality?.message}
                />
              )}
            />
          </FormField>
          <FormField label="Destino" required error={errors.destination?.message}>
            <Controller
              name="destination"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={harvestDestinationOptions}
                  placeholder="Seleccionar..."
                  error={errors.destination?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 5: Price and Harvested By */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Precio por Unidad (colones)" error={errors.pricePerUnit?.message}>
            <FormInput
              {...register('pricePerUnit')}
              type="number"
              step="10"
              placeholder="Ej: 1500"
              error={errors.pricePerUnit?.message}
            />
          </FormField>
          <FormField label="Cosechado por" error={errors.harvestedBy?.message}>
            <FormInput
              {...register('harvestedBy')}
              placeholder="Ej: Juan Perez"
              error={errors.harvestedBy?.message}
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
            {isEditing ? 'Guardar Cambios' : 'Registrar Cosecha'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
