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
  cropFormSchema,
  cropStatusOptions,
  productTypeOptions,
  yieldUnitOptions,
  type CropFormData,
} from '../../schemas/agro.schema';
import { useCreateCrop, useUpdateCrop } from '../../hooks/useAgroMutations';
import { useLotes } from '../../hooks/useAgro';
import type { Crop } from '../../types/agro.types';

interface CropFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  crop?: Crop | null;
  onSuccess?: () => void;
}

function formatDateForInput(date: Date | string | undefined): string {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().split('T')[0];
}

export default function CropFormModal({
  open,
  onOpenChange,
  crop,
  onSuccess,
}: CropFormModalProps) {
  const isEditing = !!crop;
  const createMutation = useCreateCrop();
  const updateMutation = useUpdateCrop();
  const isLoading = createMutation.isPending || updateMutation.isPending;
  const { data: lotes } = useLotes();

  const loteOptions = (lotes || []).map(l => ({
    value: l.id,
    label: `${l.name} (${l.code})`,
  }));

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CropFormData>({
    resolver: zodResolver(cropFormSchema),
    defaultValues: {
      name: '',
      variety: '',
      productType: undefined,
      loteId: '',
      area: '',
      plantingDate: '',
      expectedHarvestDate: '',
      actualHarvestDate: '',
      status: undefined,
      seedsUsed: '',
      seedsUnit: '',
      estimatedYield: '',
      actualYield: '',
      yieldUnit: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (open && crop) {
      reset({
        name: crop.name,
        variety: crop.variety,
        productType: crop.productType,
        loteId: crop.loteId,
        area: crop.area.toString(),
        plantingDate: formatDateForInput(crop.plantingDate),
        expectedHarvestDate: formatDateForInput(crop.expectedHarvestDate),
        actualHarvestDate: formatDateForInput(crop.actualHarvestDate),
        status: crop.status,
        seedsUsed: crop.seedsUsed?.toString() || '',
        seedsUnit: crop.seedsUnit || '',
        estimatedYield: crop.estimatedYield?.toString() || '',
        actualYield: crop.actualYield?.toString() || '',
        yieldUnit: crop.yieldUnit || '',
        notes: crop.notes || '',
      });
    } else if (open && !crop) {
      reset({
        name: '',
        variety: '',
        productType: undefined,
        loteId: '',
        area: '',
        plantingDate: '',
        expectedHarvestDate: '',
        actualHarvestDate: '',
        status: undefined,
        seedsUsed: '',
        seedsUnit: '',
        estimatedYield: '',
        actualYield: '',
        yieldUnit: '',
        notes: '',
      });
    }
  }, [open, crop, reset]);

  const onSubmit = async (data: CropFormData) => {
    try {
      if (isEditing && crop) {
        await updateMutation.mutateAsync({ id: crop.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving crop:', error);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar Cultivo' : 'Nuevo Cultivo'}
      description={
        isEditing
          ? 'Modifica los datos del cultivo'
          : 'Registra un nuevo cultivo'
      }
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Row 1: Name and Variety */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Nombre" required error={errors.name?.message}>
            <FormInput
              {...register('name')}
              placeholder="Ej: Tomate"
              error={errors.name?.message}
            />
          </FormField>
          <FormField label="Variedad" required error={errors.variety?.message}>
            <FormInput
              {...register('variety')}
              placeholder="Ej: Roma"
              error={errors.variety?.message}
            />
          </FormField>
        </div>

        {/* Row 2: Product Type and Lote */}
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
                  placeholder="Seleccionar tipo..."
                  error={errors.productType?.message}
                />
              )}
            />
          </FormField>
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
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 3: Area and Status */}
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
                  options={cropStatusOptions}
                  placeholder="Seleccionar estado..."
                  error={errors.status?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 4: Dates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Fecha de Siembra" required error={errors.plantingDate?.message}>
            <FormDatePicker
              {...register('plantingDate')}
              error={errors.plantingDate?.message}
            />
          </FormField>
          <FormField label="Cosecha Esperada" required error={errors.expectedHarvestDate?.message}>
            <FormDatePicker
              {...register('expectedHarvestDate')}
              error={errors.expectedHarvestDate?.message}
            />
          </FormField>
          <FormField label="Cosecha Real" error={errors.actualHarvestDate?.message}>
            <FormDatePicker
              {...register('actualHarvestDate')}
              error={errors.actualHarvestDate?.message}
            />
          </FormField>
        </div>

        {/* Row 5: Seeds */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Semillas Usadas" error={errors.seedsUsed?.message}>
            <FormInput
              {...register('seedsUsed')}
              type="number"
              placeholder="Ej: 1000"
              error={errors.seedsUsed?.message}
            />
          </FormField>
          <FormField label="Unidad de Semillas" error={errors.seedsUnit?.message}>
            <FormInput
              {...register('seedsUnit')}
              placeholder="Ej: kg, unidades"
              error={errors.seedsUnit?.message}
            />
          </FormField>
        </div>

        {/* Row 6: Yield */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Rendimiento Estimado" error={errors.estimatedYield?.message}>
            <FormInput
              {...register('estimatedYield')}
              type="number"
              placeholder="Ej: 45000"
              error={errors.estimatedYield?.message}
            />
          </FormField>
          <FormField label="Rendimiento Real" error={errors.actualYield?.message}>
            <FormInput
              {...register('actualYield')}
              type="number"
              placeholder="Ej: 42000"
              error={errors.actualYield?.message}
            />
          </FormField>
          <FormField label="Unidad de Rendimiento" error={errors.yieldUnit?.message}>
            <Controller
              name="yieldUnit"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value || ''}
                  onValueChange={field.onChange}
                  options={yieldUnitOptions}
                  placeholder="Seleccionar unidad..."
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
            {isEditing ? 'Guardar Cambios' : 'Crear Cultivo'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
