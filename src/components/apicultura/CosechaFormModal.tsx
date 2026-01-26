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
  cosechaFormSchema,
  productTypeOptions,
  qualityLevelOptions,
  unitOptionsByProduct,
  type CosechaFormData,
} from '../../schemas/apicultura.schema';
import { useCreateCosecha, useUpdateCosecha } from '../../hooks/useApiculturaMutations';
import { useApiarios, useColmenas } from '../../hooks/useApicultura';
import type { Cosecha, Apiario, Colmena } from '../../types/apicultura.types';

interface CosechaFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cosecha?: Cosecha | null;
  apiario?: Apiario | null;
  colmena?: Colmena | null;
  onSuccess?: () => void;
}

export default function CosechaFormModal({
  open,
  onOpenChange,
  cosecha,
  apiario: preselectedApiario,
  colmena: preselectedColmena,
  onSuccess,
}: CosechaFormModalProps) {
  const isEditing = !!cosecha;
  const createMutation = useCreateCosecha();
  const updateMutation = useUpdateCosecha();
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
  } = useForm<CosechaFormData>({
    resolver: zodResolver(cosechaFormSchema),
    defaultValues: {
      apiarioId: '',
      colmenaId: '',
      date: '',
      productType: undefined,
      quantity: '',
      unit: '',
      quality: undefined,
      performedBy: '',
      notes: '',
    },
  });

  const selectedApiarioId = watch('apiarioId');
  const selectedProductType = watch('productType');

  const filteredColmenas = colmenas?.filter(c =>
    !selectedApiarioId || c.apiarioId === selectedApiarioId
  ) || [];
  const filteredColmenaOptions = filteredColmenas.map(c => ({
    value: c.id,
    label: `${c.code}${selectedApiarioId ? '' : ` - ${c.apiarioName}`}`
  }));

  const unitOptions = selectedProductType
    ? unitOptionsByProduct[selectedProductType] || []
    : [];

  useEffect(() => {
    if (open && cosecha) {
      reset({
        apiarioId: cosecha.apiarioId,
        colmenaId: cosecha.colmenaId || '',
        date: cosecha.date
          ? new Date(cosecha.date).toISOString().split('T')[0]
          : '',
        productType: cosecha.productType,
        quantity: cosecha.quantity.toString(),
        unit: cosecha.unit,
        quality: cosecha.quality || undefined,
        performedBy: cosecha.performedBy,
        notes: cosecha.notes || '',
      });
    } else if (open && !cosecha) {
      reset({
        apiarioId: preselectedApiario?.id || preselectedColmena?.apiarioId || '',
        colmenaId: preselectedColmena?.id || '',
        date: new Date().toISOString().split('T')[0],
        productType: undefined,
        quantity: '',
        unit: '',
        quality: undefined,
        performedBy: '',
        notes: '',
      });
    }
  }, [open, cosecha, preselectedApiario, preselectedColmena, reset]);

  const onSubmit = async (data: CosechaFormData) => {
    try {
      if (isEditing && cosecha) {
        await updateMutation.mutateAsync({ id: cosecha.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving cosecha:', error);
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
        {/* Row 1: Apiario and Colmena */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Apiario" required error={errors.apiarioId?.message}>
            <Controller
              name="apiarioId"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={apiarioOptions}
                  placeholder="Seleccionar apiario..."
                  error={errors.apiarioId?.message}
                  disabled={!!preselectedApiario}
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
                  disabled={!!preselectedColmena || filteredColmenaOptions.length === 0}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 2: Product Type and Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Tipo de Producto" required error={errors.productType?.message}>
            <Controller
              name="productType"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={productTypeOptions}
                  placeholder="Seleccionar..."
                  error={errors.productType?.message}
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

        {/* Row 3: Quantity and Unit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Cantidad" required error={errors.quantity?.message}>
            <FormInput
              {...register('quantity')}
              type="number"
              step="0.1"
              placeholder="Ej: 45"
              error={errors.quantity?.message}
            />
          </FormField>
          <FormField label="Unidad" required error={errors.unit?.message}>
            {unitOptions.length > 0 ? (
              <Controller
                name="unit"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    options={unitOptions}
                    placeholder="Seleccionar..."
                    error={errors.unit?.message}
                  />
                )}
              />
            ) : (
              <FormInput
                {...register('unit')}
                placeholder="Ej: kg"
                error={errors.unit?.message}
              />
            )}
          </FormField>
        </div>

        {/* Row 4: Quality and Performed By */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Calidad" error={errors.quality?.message}>
            <Controller
              name="quality"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={qualityLevelOptions}
                  placeholder="Seleccionar..."
                  error={errors.quality?.message}
                />
              )}
            />
          </FormField>
          <FormField label="Realizado por" required error={errors.performedBy?.message}>
            <FormInput
              {...register('performedBy')}
              placeholder="Ej: Juan Perez"
              error={errors.performedBy?.message}
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
