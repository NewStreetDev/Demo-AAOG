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
  agroActionFormSchema,
  agroActionTypeOptions,
  weatherConditionOptions,
  type AgroActionFormData,
} from '../../schemas/agro.schema';
import { useCreateAgroAction, useUpdateAgroAction } from '../../hooks/useAgroMutations';
import { useLotes, useCrops } from '../../hooks/useAgro';
import type { AgroAction, Lote, Crop } from '../../types/agro.types';

interface AgroActionFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action?: AgroAction | null;
  lote?: Lote | null;
  crop?: Crop | null;
  onSuccess?: () => void;
}

export default function AgroActionFormModal({
  open,
  onOpenChange,
  action,
  lote: preselectedLote,
  crop: preselectedCrop,
  onSuccess,
}: AgroActionFormModalProps) {
  const isEditing = !!action;
  const createMutation = useCreateAgroAction();
  const updateMutation = useUpdateAgroAction();
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
  } = useForm<AgroActionFormData>({
    resolver: zodResolver(agroActionFormSchema),
    defaultValues: {
      loteId: '',
      cropId: '',
      type: undefined,
      date: '',
      description: '',
      insumoUsed: '',
      quantity: '',
      unit: '',
      cost: '',
      performedBy: '',
      weatherConditions: '',
      notes: '',
    },
  });

  const selectedLoteId = watch('loteId');

  const filteredCrops = crops?.filter(c =>
    !selectedLoteId || c.loteId === selectedLoteId
  ) || [];
  const filteredCropOptions = [
    { value: '', label: 'Sin cultivo especifico' },
    ...filteredCrops.map(c => ({
      value: c.id,
      label: `${c.name} - ${c.variety}${selectedLoteId ? '' : ` (${c.loteName})`}`
    }))
  ];

  useEffect(() => {
    if (open && action) {
      reset({
        loteId: action.loteId,
        cropId: action.cropId || '',
        type: action.type,
        date: action.date
          ? new Date(action.date).toISOString().split('T')[0]
          : '',
        description: action.description,
        insumoUsed: action.insumoUsed || '',
        quantity: action.quantity?.toString() || '',
        unit: action.unit || '',
        cost: action.cost?.toString() || '',
        performedBy: action.performedBy,
        weatherConditions: action.weatherConditions || '',
        notes: action.notes || '',
      });
    } else if (open && !action) {
      reset({
        loteId: preselectedLote?.id || preselectedCrop?.loteId || '',
        cropId: preselectedCrop?.id || '',
        type: undefined,
        date: new Date().toISOString().split('T')[0],
        description: '',
        insumoUsed: '',
        quantity: '',
        unit: '',
        cost: '',
        performedBy: '',
        weatherConditions: '',
        notes: '',
      });
    }
  }, [open, action, preselectedLote, preselectedCrop, reset]);

  const onSubmit = async (data: AgroActionFormData) => {
    try {
      if (isEditing && action) {
        await updateMutation.mutateAsync({ id: action.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving action:', error);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar Accion Agricola' : 'Nueva Accion Agricola'}
      description={
        isEditing
          ? 'Modifica los datos de la accion'
          : 'Registra una nueva accion agricola'
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
          <FormField label="Cultivo (opcional)" error={errors.cropId?.message}>
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
                  disabled={!!preselectedCrop || filteredCropOptions.length <= 1}
                />
              )}
            />
          </FormField>
        </div>

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
                  options={agroActionTypeOptions}
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

        {/* Row 3: Performed By and Weather */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Realizado por" required error={errors.performedBy?.message}>
            <FormInput
              {...register('performedBy')}
              placeholder="Ej: Juan Perez"
              error={errors.performedBy?.message}
            />
          </FormField>
          <FormField label="Condiciones Climaticas" error={errors.weatherConditions?.message}>
            <Controller
              name="weatherConditions"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={weatherConditionOptions}
                  placeholder="Seleccionar..."
                  error={errors.weatherConditions?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 4: Description */}
        <FormField label="Descripcion" required error={errors.description?.message}>
          <FormTextArea
            {...register('description')}
            placeholder="Describa la accion realizada..."
            rows={2}
            error={errors.description?.message}
          />
        </FormField>

        {/* Row 5: Insumo and Quantity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Insumo Utilizado" error={errors.insumoUsed?.message}>
            <FormInput
              {...register('insumoUsed')}
              placeholder="Ej: Fertilizante NPK"
              error={errors.insumoUsed?.message}
            />
          </FormField>
          <FormField label="Cantidad" error={errors.quantity?.message}>
            <FormInput
              {...register('quantity')}
              type="number"
              step="0.1"
              placeholder="Ej: 50"
              error={errors.quantity?.message}
            />
          </FormField>
          <FormField label="Unidad" error={errors.unit?.message}>
            <FormInput
              {...register('unit')}
              placeholder="Ej: kg, L, unidades"
              error={errors.unit?.message}
            />
          </FormField>
        </div>

        {/* Row 6: Cost */}
        <FormField label="Costo (colones)" error={errors.cost?.message}>
          <FormInput
            {...register('cost')}
            type="number"
            step="100"
            placeholder="Ej: 45000"
            error={errors.cost?.message}
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
            {isEditing ? 'Guardar Cambios' : 'Registrar Accion'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
