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
  apiarioFormSchema,
  apiarioStatusOptions,
  type ApiarioFormData,
} from '../../schemas/apicultura.schema';
import { useCreateApiario, useUpdateApiario } from '../../hooks/useApiculturaMutations';
import type { Apiario } from '../../types/apicultura.types';

interface ApiarioFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiario?: Apiario | null;
  onSuccess?: () => void;
}

export default function ApiarioFormModal({
  open,
  onOpenChange,
  apiario,
  onSuccess,
}: ApiarioFormModalProps) {
  const isEditing = !!apiario;
  const createMutation = useCreateApiario();
  const updateMutation = useUpdateApiario();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ApiarioFormData>({
    resolver: zodResolver(apiarioFormSchema),
    defaultValues: {
      name: '',
      address: '',
      lat: '',
      lng: '',
      status: undefined,
      costPerHour: '',
      costPerKm: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (open && apiario) {
      reset({
        name: apiario.name,
        address: apiario.location.address || '',
        lat: apiario.location.lat.toString(),
        lng: apiario.location.lng.toString(),
        status: apiario.status,
        costPerHour: apiario.costPerHour?.toString() || '',
        costPerKm: apiario.costPerKm?.toString() || '',
        notes: apiario.notes || '',
      });
    } else if (open && !apiario) {
      reset({
        name: '',
        address: '',
        lat: '',
        lng: '',
        status: undefined,
        costPerHour: '',
        costPerKm: '',
        notes: '',
      });
    }
  }, [open, apiario, reset]);

  const onSubmit = async (data: ApiarioFormData) => {
    try {
      if (isEditing && apiario) {
        await updateMutation.mutateAsync({ id: apiario.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving apiario:', error);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar Apiario' : 'Nuevo Apiario'}
      description={
        isEditing
          ? 'Modifica los datos del apiario'
          : 'Registra un nuevo apiario'
      }
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Row 1: Name and Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <FormField label="Nombre" required error={errors.name?.message}>
              <FormInput
                {...register('name')}
                placeholder="Ej: Apiario El Roble"
                error={errors.name?.message}
              />
            </FormField>
          </div>
          <FormField label="Estado" required error={errors.status?.message}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={apiarioStatusOptions}
                  placeholder="Seleccionar..."
                  error={errors.status?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 2: Address */}
        <FormField label="Dirección / Ubicación" error={errors.address?.message}>
          <FormInput
            {...register('address')}
            placeholder="Ej: Sector Norte, Finca El Roble"
            error={errors.address?.message}
          />
        </FormField>

        {/* Row 3: Coordinates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Latitud" error={errors.lat?.message}>
            <FormInput
              {...register('lat')}
              type="number"
              step="any"
              placeholder="Ej: 10.2"
              error={errors.lat?.message}
            />
          </FormField>
          <FormField label="Longitud" error={errors.lng?.message}>
            <FormInput
              {...register('lng')}
              type="number"
              step="any"
              placeholder="Ej: -84.1"
              error={errors.lng?.message}
            />
          </FormField>
        </div>

        {/* Row 4: Costs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Costo por Hora (₡)" error={errors.costPerHour?.message}>
            <FormInput
              {...register('costPerHour')}
              type="number"
              placeholder="Ej: 5000"
              error={errors.costPerHour?.message}
            />
          </FormField>
          <FormField label="Costo por Km (₡)" error={errors.costPerKm?.message}>
            <FormInput
              {...register('costPerKm')}
              type="number"
              placeholder="Ej: 500"
              error={errors.costPerKm?.message}
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
            {isEditing ? 'Guardar Cambios' : 'Crear Apiario'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
