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
  livestockGroupFormSchema,
  speciesOptions,
  categoryOptionsBySpecies,
  type LivestockGroupFormData,
} from '../../schemas/pecuario.schema';
import { useCreateLivestockGroup, useUpdateLivestockGroup } from '../../hooks/usePecuarioMutations';
import type { LivestockGroup } from '../../types/pecuario.types';

interface LivestockGroupFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  livestockGroup?: LivestockGroup | null;
  onSuccess?: () => void;
}

export default function LivestockGroupFormModal({
  open,
  onOpenChange,
  livestockGroup,
  onSuccess,
}: LivestockGroupFormModalProps) {
  const isEditing = !!livestockGroup;
  const createMutation = useCreateLivestockGroup();
  const updateMutation = useUpdateLivestockGroup();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LivestockGroupFormData>({
    resolver: zodResolver(livestockGroupFormSchema),
    defaultValues: {
      name: '',
      species: undefined,
      category: undefined,
      count: '',
      location: '',
      description: '',
    },
  });

  const selectedSpecies = watch('species');

  // Get category options based on selected species
  const categoryOptions = selectedSpecies
    ? categoryOptionsBySpecies[selectedSpecies] || []
    : [];

  // Reset category when species changes (only in create mode or if species differs)
  useEffect(() => {
    if (selectedSpecies && !isEditing) {
      setValue('category', undefined as unknown as LivestockGroupFormData['category']);
    }
  }, [selectedSpecies, setValue, isEditing]);

  useEffect(() => {
    if (open && livestockGroup) {
      reset({
        name: livestockGroup.name,
        species: livestockGroup.species,
        category: livestockGroup.category,
        count: String(livestockGroup.count),
        location: livestockGroup.location,
        description: livestockGroup.description || '',
      });
    } else if (open && !livestockGroup) {
      reset({
        name: '',
        species: undefined,
        category: undefined,
        count: '',
        location: '',
        description: '',
      });
    }
  }, [open, livestockGroup, reset]);

  const onSubmit = async (data: LivestockGroupFormData) => {
    try {
      if (isEditing && livestockGroup) {
        await updateMutation.mutateAsync({ id: livestockGroup.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving livestock group:', error);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar Grupo' : 'Nuevo Grupo de Ganado'}
      description={
        isEditing
          ? 'Modifica los datos del grupo de ganado'
          : 'Crea un nuevo grupo para organizar el ganado'
      }
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Row 1: Name */}
        <FormField label="Nombre del Grupo" required error={errors.name?.message}>
          <FormInput
            {...register('name')}
            placeholder="Ej: Vacas lecheras, Novillos engorde..."
            error={errors.name?.message}
          />
        </FormField>

        {/* Row 2: Species and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Especie" required error={errors.species?.message}>
            <Controller
              name="species"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={speciesOptions}
                  placeholder="Seleccionar especie..."
                  error={errors.species?.message}
                />
              )}
            />
          </FormField>
          <FormField label="Categoria" required error={errors.category?.message}>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={categoryOptions}
                  placeholder={selectedSpecies ? 'Seleccionar categoria...' : 'Seleccione especie primero'}
                  error={errors.category?.message}
                  disabled={!selectedSpecies}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 3: Count and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Cantidad de Animales" required error={errors.count?.message}>
            <FormInput
              {...register('count')}
              type="number"
              min="1"
              placeholder="Ej: 25"
              error={errors.count?.message}
            />
          </FormField>
          <FormField label="Ubicacion / Potrero" required error={errors.location?.message}>
            <FormInput
              {...register('location')}
              placeholder="Ej: Potrero Norte"
              error={errors.location?.message}
            />
          </FormField>
        </div>

        {/* Row 4: Description */}
        <FormField label="Descripcion" error={errors.description?.message}>
          <FormTextArea
            {...register('description')}
            placeholder="Descripcion del grupo, proposito, observaciones..."
            rows={3}
            error={errors.description?.message}
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
            {isEditing ? 'Guardar Cambios' : 'Crear Grupo'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
