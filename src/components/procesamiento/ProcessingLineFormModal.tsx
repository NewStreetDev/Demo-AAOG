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
  processingLineFormSchema,
  processingLineStatusOptions,
  processingProductTypeOptions,
  capacityUnitOptions,
  type ProcessingLineFormData,
} from '../../schemas/procesamiento.schema';
import {
  useCreateProcessingLine,
  useUpdateProcessingLine,
} from '../../hooks/useProcesamientoMutations';
import type { ProcessingLine } from '../../types/procesamiento.types';

interface ProcessingLineFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  line?: ProcessingLine | null;
  onSuccess?: () => void;
}

export default function ProcessingLineFormModal({
  open,
  onOpenChange,
  line,
  onSuccess,
}: ProcessingLineFormModalProps) {
  const isEditing = !!line;
  const createMutation = useCreateProcessingLine();
  const updateMutation = useUpdateProcessingLine();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProcessingLineFormData>({
    resolver: zodResolver(processingLineFormSchema),
    defaultValues: {
      lineCode: '',
      name: '',
      description: '',
      productTypes: [],
      status: undefined,
      capacity: '',
      capacityUnit: '',
      location: '',
      operator: '',
      lastMaintenance: '',
      nextScheduledMaintenance: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (open && line) {
      reset({
        lineCode: line.lineCode,
        name: line.name,
        description: line.description || '',
        productTypes: line.productTypes,
        status: line.status,
        capacity: line.capacity.toString(),
        capacityUnit: line.capacityUnit,
        location: line.location,
        operator: line.operator || '',
        lastMaintenance: line.lastMaintenance
          ? new Date(line.lastMaintenance).toISOString().split('T')[0]
          : '',
        nextScheduledMaintenance: line.nextScheduledMaintenance
          ? new Date(line.nextScheduledMaintenance).toISOString().split('T')[0]
          : '',
        notes: line.notes || '',
      });
    } else if (open && !line) {
      reset({
        lineCode: '',
        name: '',
        description: '',
        productTypes: [],
        status: undefined,
        capacity: '',
        capacityUnit: '',
        location: '',
        operator: '',
        lastMaintenance: '',
        nextScheduledMaintenance: '',
        notes: '',
      });
    }
  }, [open, line, reset]);

  const onSubmit = async (data: ProcessingLineFormData) => {
    try {
      if (isEditing && line) {
        await updateMutation.mutateAsync({ id: line.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving processing line:', error);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar Linea de Procesamiento' : 'Nueva Linea de Procesamiento'}
      description={
        isEditing
          ? 'Modifica los datos de la linea de procesamiento'
          : 'Registra una nueva linea de procesamiento'
      }
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Row 1: Code and Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Codigo de Linea" required error={errors.lineCode?.message}>
            <FormInput
              {...register('lineCode')}
              placeholder="Ej: LINEA-005"
              error={errors.lineCode?.message}
            />
          </FormField>
          <FormField label="Nombre" required error={errors.name?.message}>
            <FormInput
              {...register('name')}
              placeholder="Ej: Linea Frutas"
              error={errors.name?.message}
            />
          </FormField>
        </div>

        {/* Row 2: Status and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Estado" required error={errors.status?.message}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={processingLineStatusOptions}
                  placeholder="Seleccionar..."
                  error={errors.status?.message}
                />
              )}
            />
          </FormField>
          <FormField label="Ubicacion" required error={errors.location?.message}>
            <FormInput
              {...register('location')}
              placeholder="Ej: Planta Principal - Seccion E"
              error={errors.location?.message}
            />
          </FormField>
        </div>

        {/* Row 3: Capacity and Unit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Capacidad" required error={errors.capacity?.message}>
            <FormInput
              {...register('capacity')}
              type="number"
              step="1"
              placeholder="Ej: 500"
              error={errors.capacity?.message}
            />
          </FormField>
          <FormField label="Unidad de Capacidad" required error={errors.capacityUnit?.message}>
            <Controller
              name="capacityUnit"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={capacityUnitOptions}
                  placeholder="Seleccionar..."
                  error={errors.capacityUnit?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 4: Product Types */}
        <FormField label="Tipos de Producto" required error={errors.productTypes?.message}>
          <Controller
            name="productTypes"
            control={control}
            render={({ field }) => (
              <div className="flex flex-wrap gap-2">
                {processingProductTypeOptions.map((option) => {
                  const isSelected = field.value?.includes(option.value as ProcessingLineFormData['productTypes'][number]);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        const current = field.value || [];
                        const val = option.value as ProcessingLineFormData['productTypes'][number];
                        if (isSelected) {
                          field.onChange(current.filter((v: string) => v !== val));
                        } else {
                          field.onChange([...current, val]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        isSelected
                          ? 'bg-blue-100 text-blue-700 border-blue-300'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            )}
          />
        </FormField>

        {/* Row 5: Operator */}
        <FormField label="Operador" error={errors.operator?.message}>
          <FormInput
            {...register('operator')}
            placeholder="Ej: Juan Perez"
            error={errors.operator?.message}
          />
        </FormField>

        {/* Row 6: Maintenance Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Ultimo Mantenimiento" error={errors.lastMaintenance?.message}>
            <FormInput
              {...register('lastMaintenance')}
              type="date"
              error={errors.lastMaintenance?.message}
            />
          </FormField>
          <FormField label="Proximo Mantenimiento" error={errors.nextScheduledMaintenance?.message}>
            <FormInput
              {...register('nextScheduledMaintenance')}
              type="date"
              error={errors.nextScheduledMaintenance?.message}
            />
          </FormField>
        </div>

        {/* Description */}
        <FormField label="Descripcion" error={errors.description?.message}>
          <FormTextArea
            {...register('description')}
            placeholder="Descripcion de la linea de procesamiento..."
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
            {isEditing ? 'Guardar Cambios' : 'Crear Linea'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
