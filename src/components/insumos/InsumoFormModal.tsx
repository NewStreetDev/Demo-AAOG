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
  insumoFormSchema,
  categoryOptions,
  unitOptions,
  moduleOptions,
  type InsumoFormData,
} from '../../schemas/insumo.schema';
import { useCreateInsumo, useUpdateInsumo } from '../../hooks/useInsumoMutations';
import type { Insumo } from '../../types/insumos.types';

interface InsumoFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  insumo?: Insumo | null;
  onSuccess?: () => void;
}

function formatDateForInput(date: Date | string | undefined): string {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().split('T')[0];
}

export default function InsumoFormModal({
  open,
  onOpenChange,
  insumo,
  onSuccess,
}: InsumoFormModalProps) {
  const isEditing = !!insumo;
  const createMutation = useCreateInsumo();
  const updateMutation = useUpdateInsumo();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<InsumoFormData>({
    resolver: zodResolver(insumoFormSchema),
    defaultValues: {
      code: '',
      name: '',
      category: undefined,
      description: '',
      currentStock: '',
      minStock: '',
      maxStock: '',
      unit: '',
      costPerUnit: '',
      supplier: '',
      supplierPhone: '',
      expirationDate: '',
      batchCode: '',
      location: '',
      relatedModule: undefined,
      alertEnabled: true,
      reorderQuantity: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (open && insumo) {
      reset({
        code: insumo.code,
        name: insumo.name,
        category: insumo.category,
        description: insumo.description || '',
        currentStock: insumo.currentStock.toString(),
        minStock: insumo.minStock.toString(),
        maxStock: insumo.maxStock?.toString() || '',
        unit: insumo.unit,
        costPerUnit: insumo.costPerUnit.toString(),
        supplier: insumo.supplier || '',
        supplierPhone: insumo.supplierPhone || '',
        expirationDate: formatDateForInput(insumo.expirationDate),
        batchCode: insumo.batchCode || '',
        location: insumo.location || '',
        relatedModule: insumo.relatedModule,
        alertEnabled: insumo.alertEnabled,
        reorderQuantity: insumo.reorderQuantity?.toString() || '',
        notes: insumo.notes || '',
      });
    } else if (open && !insumo) {
      reset({
        code: '',
        name: '',
        category: undefined,
        description: '',
        currentStock: '',
        minStock: '',
        maxStock: '',
        unit: '',
        costPerUnit: '',
        supplier: '',
        supplierPhone: '',
        expirationDate: '',
        batchCode: '',
        location: '',
        relatedModule: undefined,
        alertEnabled: true,
        reorderQuantity: '',
        notes: '',
      });
    }
  }, [open, insumo, reset]);

  const onSubmit = async (data: InsumoFormData) => {
    try {
      if (isEditing && insumo) {
        await updateMutation.mutateAsync({ id: insumo.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving insumo:', error);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar Insumo' : 'Nuevo Insumo'}
      description={
        isEditing
          ? 'Modifica los datos del insumo'
          : 'Registra un nuevo insumo en el inventario'
      }
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Row 1: Code and Name */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Código" required error={errors.code?.message}>
            <FormInput
              {...register('code')}
              placeholder="Ej: SEM-001"
              error={errors.code?.message}
            />
          </FormField>
          <div className="md:col-span-2">
            <FormField label="Nombre" required error={errors.name?.message}>
              <FormInput
                {...register('name')}
                placeholder="Ej: Semilla de Tomate Roma"
                error={errors.name?.message}
              />
            </FormField>
          </div>
        </div>

        {/* Row 2: Category and Unit */}
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
          <FormField label="Unidad" required error={errors.unit?.message}>
            <Controller
              name="unit"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={unitOptions}
                  placeholder="Seleccionar unidad..."
                  error={errors.unit?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 3: Stock levels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Stock Actual" required error={errors.currentStock?.message}>
            <FormInput
              {...register('currentStock')}
              type="number"
              placeholder="Ej: 100"
              error={errors.currentStock?.message}
            />
          </FormField>
          <FormField label="Stock Mínimo" required error={errors.minStock?.message}>
            <FormInput
              {...register('minStock')}
              type="number"
              placeholder="Ej: 20"
              error={errors.minStock?.message}
            />
          </FormField>
          <FormField label="Stock Máximo" error={errors.maxStock?.message}>
            <FormInput
              {...register('maxStock')}
              type="number"
              placeholder="Ej: 200"
              error={errors.maxStock?.message}
            />
          </FormField>
        </div>

        {/* Row 4: Cost and Reorder */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Costo por Unidad (₡)" required error={errors.costPerUnit?.message}>
            <FormInput
              {...register('costPerUnit')}
              type="number"
              placeholder="Ej: 5000"
              error={errors.costPerUnit?.message}
            />
          </FormField>
          <FormField label="Cantidad de Reorden" error={errors.reorderQuantity?.message}>
            <FormInput
              {...register('reorderQuantity')}
              type="number"
              placeholder="Ej: 50"
              error={errors.reorderQuantity?.message}
            />
          </FormField>
        </div>

        {/* Row 5: Supplier */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Proveedor" error={errors.supplier?.message}>
            <FormInput
              {...register('supplier')}
              placeholder="Ej: Agrosemillas CR"
              error={errors.supplier?.message}
            />
          </FormField>
          <FormField label="Teléfono Proveedor" error={errors.supplierPhone?.message}>
            <FormInput
              {...register('supplierPhone')}
              type="tel"
              placeholder="Ej: 2222-3333"
              error={errors.supplierPhone?.message}
            />
          </FormField>
        </div>

        {/* Row 6: Location, Module, Expiration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Ubicación" error={errors.location?.message}>
            <FormInput
              {...register('location')}
              placeholder="Ej: Bodega A - Estante 2"
              error={errors.location?.message}
            />
          </FormField>
          <FormField label="Módulo Relacionado" error={errors.relatedModule?.message}>
            <Controller
              name="relatedModule"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value || ''}
                  onValueChange={field.onChange}
                  options={moduleOptions}
                  placeholder="Seleccionar módulo..."
                />
              )}
            />
          </FormField>
          <FormField label="Fecha de Vencimiento" error={errors.expirationDate?.message}>
            <FormDatePicker
              {...register('expirationDate')}
              error={errors.expirationDate?.message}
            />
          </FormField>
        </div>

        {/* Row 7: Batch Code and Alert */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Código de Lote" error={errors.batchCode?.message}>
            <FormInput
              {...register('batchCode')}
              placeholder="Ej: LOTE-2026-001"
              error={errors.batchCode?.message}
            />
          </FormField>
          <FormField label="Alertas">
            <div className="flex items-center gap-2 h-10">
              <Controller
                name="alertEnabled"
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    id="alertEnabled"
                    checked={field.value}
                    onChange={field.onChange}
                    className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                  />
                )}
              />
              <label htmlFor="alertEnabled" className="text-sm text-gray-700">
                Habilitar alertas de stock bajo
              </label>
            </div>
          </FormField>
        </div>

        {/* Description */}
        <FormField label="Descripción" error={errors.description?.message}>
          <FormTextArea
            {...register('description')}
            placeholder="Descripción del insumo..."
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
            {isEditing ? 'Guardar Cambios' : 'Crear Insumo'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
