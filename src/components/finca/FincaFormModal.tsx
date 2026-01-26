import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Modal } from '../common/Modals';
import { FormInput, FormField, FormSelect, FormTextArea } from '../common/Forms';
import {
  fincaFormSchema,
  fincaStatusOptions,
  type FincaFormData,
} from '../../schemas/finca.schema';
import { useUpdateFinca } from '../../hooks/useFincaMutations';
import type { Finca } from '../../types/finca.types';

interface FincaFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  finca: Finca | null;
  onSuccess?: () => void;
}

export default function FincaFormModal({
  open,
  onOpenChange,
  finca,
  onSuccess,
}: FincaFormModalProps) {
  const updateMutation = useUpdateFinca();
  const isLoading = updateMutation.isPending;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FincaFormData>({
    resolver: zodResolver(fincaFormSchema),
  });

  useEffect(() => {
    if (open && finca) {
      reset({
        name: finca.name,
        totalArea: String(finca.totalArea),
        lat: finca.location.lat ? String(finca.location.lat) : '',
        lng: finca.location.lng ? String(finca.location.lng) : '',
        address: finca.location.address || '',
        department: finca.location.department || '',
        municipality: finca.location.municipality || '',
        owner: finca.owner,
        contactPhone: finca.contactPhone || '',
        contactEmail: finca.contactEmail || '',
        status: finca.status,
        description: finca.description || '',
        notes: finca.notes || '',
      });
    }
  }, [open, finca, reset]);

  const onSubmit = async (data: FincaFormData) => {
    try {
      await updateMutation.mutateAsync(data);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving finca:', error);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Editar Finca"
      description="Modifica la informacion general de la finca"
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Nombre de la Finca" required error={errors.name?.message}>
            <FormInput
              {...register('name')}
              placeholder="Ej: Finca El Roble"
              error={errors.name?.message}
            />
          </FormField>

          <FormField label="Area Total (hectareas)" required error={errors.totalArea?.message}>
            <FormInput
              type="number"
              step="0.01"
              {...register('totalArea')}
              placeholder="Ej: 85.5"
              error={errors.totalArea?.message}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Propietario" required error={errors.owner?.message}>
            <FormInput
              {...register('owner')}
              placeholder="Nombre del propietario"
              error={errors.owner?.message}
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
                  options={fincaStatusOptions}
                  placeholder="Seleccionar estado..."
                  error={errors.status?.message}
                />
              )}
            />
          </FormField>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Ubicacion</h4>
          <div className="space-y-4">
            <FormField label="Direccion">
              <FormInput
                {...register('address')}
                placeholder="Direccion completa"
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Departamento/Provincia">
                <FormInput
                  {...register('department')}
                  placeholder="Ej: Alajuela"
                />
              </FormField>

              <FormField label="Municipio">
                <FormInput
                  {...register('municipality')}
                  placeholder="Ej: San Ramon"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Latitud" error={errors.lat?.message}>
                <FormInput
                  type="number"
                  step="0.0001"
                  {...register('lat')}
                  placeholder="Ej: 10.25"
                  error={errors.lat?.message}
                />
              </FormField>

              <FormField label="Longitud" error={errors.lng?.message}>
                <FormInput
                  type="number"
                  step="0.0001"
                  {...register('lng')}
                  placeholder="Ej: -84.15"
                  error={errors.lng?.message}
                />
              </FormField>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Contacto</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Telefono">
              <FormInput
                {...register('contactPhone')}
                placeholder="Ej: 2456-7890"
              />
            </FormField>

            <FormField label="Email" error={errors.contactEmail?.message}>
              <FormInput
                type="email"
                {...register('contactEmail')}
                placeholder="Ej: info@finca.com"
                error={errors.contactEmail?.message}
              />
            </FormField>
          </div>
        </div>

        <FormField label="Descripcion">
          <FormTextArea
            {...register('description')}
            placeholder="Descripcion de la finca..."
            rows={3}
          />
        </FormField>

        <FormField label="Notas">
          <FormTextArea
            {...register('notes')}
            placeholder="Notas adicionales..."
            rows={2}
          />
        </FormField>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="btn-secondary"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary inline-flex items-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Guardar Cambios
          </button>
        </div>
      </form>
    </Modal>
  );
}
