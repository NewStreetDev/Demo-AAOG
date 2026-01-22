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
  assetFormSchema,
  categoryOptions,
  statusOptions,
  depreciationMethodOptions,
  moduleAssignmentOptions,
  type AssetFormData,
} from '../../schemas/asset.schema';
import { useCreateAsset, useUpdateAsset } from '../../hooks/useAssetMutations';
import type { Asset } from '../../types/activos.types';

interface AssetFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset?: Asset | null;
  onSuccess?: () => void;
}

function formatDateForInput(date: Date | string | undefined): string {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().split('T')[0];
}

export default function AssetFormModal({
  open,
  onOpenChange,
  asset,
  onSuccess,
}: AssetFormModalProps) {
  const isEditing = !!asset;
  const createMutation = useCreateAsset();
  const updateMutation = useUpdateAsset();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<AssetFormData>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      category: undefined,
      status: 'active',
      location: '',
      acquisitionDate: '',
      acquisitionCost: '',
      depreciationMethod: 'straight_line',
      usefulLifeYears: '',
      salvageValue: '',
      assignedModule: 'none',
      responsiblePerson: '',
      serialNumber: '',
      notes: '',
    },
  });

  const depreciationMethod = watch('depreciationMethod');

  useEffect(() => {
    if (open && asset) {
      reset({
        code: asset.code,
        name: asset.name,
        description: asset.description || '',
        category: asset.category,
        status: asset.status,
        location: asset.location,
        acquisitionDate: formatDateForInput(asset.acquisitionDate),
        acquisitionCost: asset.acquisitionCost.toString(),
        depreciationMethod: asset.depreciationMethod,
        usefulLifeYears: asset.usefulLifeYears?.toString() || '',
        salvageValue: asset.salvageValue?.toString() || '',
        assignedModule: asset.assignedModule || '',
        responsiblePerson: asset.responsiblePerson || '',
        serialNumber: asset.serialNumber || '',
        notes: asset.notes || '',
      });
    } else if (open && !asset) {
      reset({
        code: '',
        name: '',
        description: '',
        category: undefined,
        status: 'active',
        location: '',
        acquisitionDate: '',
        acquisitionCost: '',
        depreciationMethod: 'straight_line',
        usefulLifeYears: '',
        salvageValue: '',
        assignedModule: 'none',
        responsiblePerson: '',
        serialNumber: '',
        notes: '',
      });
    }
  }, [open, asset, reset]);

  const onSubmit = async (data: AssetFormData) => {
    try {
      if (isEditing && asset) {
        await updateMutation.mutateAsync({ id: asset.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving asset:', error);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar Activo' : 'Nuevo Activo'}
      description={
        isEditing
          ? 'Modifica los datos del activo'
          : 'Registra un nuevo activo'
      }
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Row 1: Code and Name */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Código" required error={errors.code?.message}>
            <FormInput
              {...register('code')}
              placeholder="Ej: ACT-001"
              error={errors.code?.message}
            />
          </FormField>
          <div className="md:col-span-2">
            <FormField label="Nombre" required error={errors.name?.message}>
              <FormInput
                {...register('name')}
                placeholder="Ej: Tractor John Deere"
                error={errors.name?.message}
              />
            </FormField>
          </div>
        </div>

        {/* Row 2: Category and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Categoría" required error={errors.category?.message}>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={categoryOptions}
                  placeholder="Seleccionar categoría..."
                  error={errors.category?.message}
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
                  options={statusOptions}
                  placeholder="Seleccionar estado..."
                  error={errors.status?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 3: Location and Module */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Ubicación" required error={errors.location?.message}>
            <FormInput
              {...register('location')}
              placeholder="Ej: Bodega Principal"
              error={errors.location?.message}
            />
          </FormField>
          <FormField label="Módulo Asignado" error={errors.assignedModule?.message}>
            <Controller
              name="assignedModule"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value || ''}
                  onValueChange={field.onChange}
                  options={moduleAssignmentOptions}
                  placeholder="Seleccionar módulo..."
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 4: Acquisition Date and Cost */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Fecha de Adquisición" required error={errors.acquisitionDate?.message}>
            <FormDatePicker
              {...register('acquisitionDate')}
              error={errors.acquisitionDate?.message}
            />
          </FormField>
          <FormField label="Costo de Adquisición (₡)" required error={errors.acquisitionCost?.message}>
            <FormInput
              {...register('acquisitionCost')}
              type="number"
              placeholder="Ej: 5000000"
              error={errors.acquisitionCost?.message}
            />
          </FormField>
        </div>

        {/* Row 5: Depreciation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Método Depreciación" required error={errors.depreciationMethod?.message}>
            <Controller
              name="depreciationMethod"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={depreciationMethodOptions}
                  placeholder="Seleccionar método..."
                  error={errors.depreciationMethod?.message}
                />
              )}
            />
          </FormField>
          {depreciationMethod !== 'none' && (
            <>
              <FormField label="Vida Útil (años)" error={errors.usefulLifeYears?.message}>
                <FormInput
                  {...register('usefulLifeYears')}
                  type="number"
                  placeholder="Ej: 10"
                  error={errors.usefulLifeYears?.message}
                />
              </FormField>
              <FormField label="Valor Residual (₡)" error={errors.salvageValue?.message}>
                <FormInput
                  {...register('salvageValue')}
                  type="number"
                  placeholder="Ej: 500000"
                  error={errors.salvageValue?.message}
                />
              </FormField>
            </>
          )}
        </div>

        {/* Row 6: Responsible and Serial */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Responsable" error={errors.responsiblePerson?.message}>
            <FormInput
              {...register('responsiblePerson')}
              placeholder="Ej: Juan García"
              error={errors.responsiblePerson?.message}
            />
          </FormField>
          <FormField label="Número de Serie" error={errors.serialNumber?.message}>
            <FormInput
              {...register('serialNumber')}
              placeholder="Ej: SN-2024-001"
              error={errors.serialNumber?.message}
            />
          </FormField>
        </div>

        {/* Description */}
        <FormField label="Descripción" error={errors.description?.message}>
          <FormTextArea
            {...register('description')}
            placeholder="Descripción del activo..."
            rows={2}
            error={errors.description?.message}
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
            {isEditing ? 'Guardar Cambios' : 'Crear Activo'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
