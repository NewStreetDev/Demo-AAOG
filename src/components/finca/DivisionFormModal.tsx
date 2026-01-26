import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Modal } from '../common/Modals';
import { FormInput, FormField, FormSelect, FormTextArea } from '../common/Forms';
import {
  divisionFormSchema,
  divisionTypeOptions,
  divisionStatusOptions,
  moduleAssociationOptions,
  type DivisionFormData,
} from '../../schemas/finca.schema';
import { useCreateDivision, useUpdateDivision } from '../../hooks/useFincaMutations';
import { useDivisions } from '../../hooks/useFinca';
import type { Division } from '../../types/finca.types';

interface DivisionFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  division?: Division | null;
  onSuccess?: () => void;
}

export default function DivisionFormModal({
  open,
  onOpenChange,
  division,
  onSuccess,
}: DivisionFormModalProps) {
  const isEditing = !!division;

  const { data: divisions } = useDivisions();
  const createMutation = useCreateDivision();
  const updateMutation = useUpdateDivision();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<DivisionFormData>({
    resolver: zodResolver(divisionFormSchema),
    defaultValues: {
      name: '',
      code: '',
      type: 'otro',
      area: '',
      status: 'active',
      lat: '',
      lng: '',
      parentDivisionId: '',
      moduleAssociation: undefined,
      description: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (open && division) {
      reset({
        name: division.name,
        code: division.code,
        type: division.type,
        area: String(division.area),
        status: division.status,
        lat: division.coordinates?.lat ? String(division.coordinates.lat) : '',
        lng: division.coordinates?.lng ? String(division.coordinates.lng) : '',
        parentDivisionId: division.parentDivisionId || '',
        moduleAssociation: division.moduleAssociation || undefined,
        description: division.description || '',
        notes: division.notes || '',
      });
    } else if (open && !division) {
      reset({
        name: '',
        code: '',
        type: 'otro',
        area: '',
        status: 'active',
        lat: '',
        lng: '',
        parentDivisionId: '',
        moduleAssociation: undefined,
        description: '',
        notes: '',
      });
    }
  }, [open, division, reset]);

  const onSubmit = async (data: DivisionFormData) => {
    try {
      if (isEditing && division) {
        await updateMutation.mutateAsync({ id: division.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving division:', error);
    }
  };

  // Build parent division options (exclude current division if editing)
  const parentDivisionOptions = [
    { value: '', label: 'Ninguna (Division principal)' },
    ...(divisions || [])
      .filter(d => !isEditing || d.id !== division?.id)
      .map(d => ({ value: d.id, label: `${d.name} (${d.code})` })),
  ];

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar Division' : 'Nueva Division'}
      description={isEditing ? 'Modifica los datos de la division' : 'Agrega una nueva division a la finca'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Nombre" required error={errors.name?.message}>
            <FormInput
              {...register('name')}
              placeholder="Ej: Potrero Norte"
              error={errors.name?.message}
            />
          </FormField>

          <FormField label="Codigo" required error={errors.code?.message}>
            <FormInput
              {...register('code')}
              placeholder="Ej: POT-001"
              error={errors.code?.message}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Tipo" required error={errors.type?.message}>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={divisionTypeOptions}
                  placeholder="Seleccionar tipo..."
                  error={errors.type?.message}
                />
              )}
            />
          </FormField>

          <FormField label="Area (hectareas)" required error={errors.area?.message}>
            <FormInput
              type="number"
              step="0.01"
              {...register('area')}
              placeholder="Ej: 5.5"
              error={errors.area?.message}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Estado" required error={errors.status?.message}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={divisionStatusOptions}
                  placeholder="Seleccionar estado..."
                  error={errors.status?.message}
                />
              )}
            />
          </FormField>

          <FormField label="Modulo Asociado" error={errors.moduleAssociation?.message}>
            <Controller
              name="moduleAssociation"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value || ''}
                  onValueChange={field.onChange}
                  options={[
                    { value: '', label: 'Ninguno' },
                    ...moduleAssociationOptions,
                  ]}
                  placeholder="Seleccionar modulo..."
                />
              )}
            />
          </FormField>
        </div>

        <FormField label="Division Padre">
          <Controller
            name="parentDivisionId"
            control={control}
            render={({ field }) => (
              <FormSelect
                value={field.value || ''}
                onValueChange={field.onChange}
                options={parentDivisionOptions}
                placeholder="Seleccionar division padre..."
              />
            )}
          />
          <p className="text-xs text-gray-500 mt-1">
            Para divisiones anidadas dentro de otra
          </p>
        </FormField>

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

        <FormField label="Descripcion" error={errors.description?.message}>
          <FormTextArea
            {...register('description')}
            placeholder="Descripcion de la division..."
            rows={2}
          />
        </FormField>

        <FormField label="Notas" error={errors.notes?.message}>
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
            {isEditing ? 'Guardar Cambios' : 'Crear Division'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
