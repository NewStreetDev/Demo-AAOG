import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Users } from 'lucide-react';
import { Modal } from '../common/Modals';
import {
  FormInput,
  FormField,
  FormSelect,
  FormTextArea,
} from '../common/Forms';
import {
  groupHealthActionFormSchema,
  groupHealthActionTypeOptions,
  speciesOptions,
  categoryOptionsBySpecies,
  type GroupHealthActionFormData,
} from '../../schemas/pecuario.schema';
import { useCreateGroupHealthAction } from '../../hooks/usePecuarioMutations';

interface GroupHealthActionFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function GroupHealthActionFormModal({
  open,
  onOpenChange,
  onSuccess,
}: GroupHealthActionFormModalProps) {
  const createMutation = useCreateGroupHealthAction();
  const isLoading = createMutation.isPending;

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<GroupHealthActionFormData>({
    resolver: zodResolver(groupHealthActionFormSchema),
    defaultValues: {
      groupId: '',
      groupName: '',
      species: undefined,
      category: undefined,
      affectedCount: '',
      date: '',
      type: undefined,
      description: '',
      medication: '',
      performedBy: '',
      cost: '',
      notes: '',
    },
  });

  const selectedSpecies = watch('species');

  // Get category options based on selected species
  const categoryOptions = selectedSpecies
    ? categoryOptionsBySpecies[selectedSpecies] || []
    : Object.values(categoryOptionsBySpecies).flat();

  useEffect(() => {
    if (open) {
      reset({
        groupId: '',
        groupName: '',
        species: undefined,
        category: undefined,
        affectedCount: '',
        date: new Date().toISOString().split('T')[0],
        type: undefined,
        description: '',
        medication: '',
        performedBy: '',
        cost: '',
        notes: '',
      });
    }
  }, [open, reset]);

  const onSubmit = async (data: GroupHealthActionFormData) => {
    try {
      await createMutation.mutateAsync(data);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving group health action:', error);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Nueva Accion Grupal de Salud"
      description="Registra una accion de salud para un grupo de animales"
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Info Banner */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <Users className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Accion grupal</p>
            <p className="text-blue-600">
              Selecciona por especie, categoria o grupo para aplicar la accion a multiples animales.
            </p>
          </div>
        </div>

        {/* Row 1: Target Selection - Species and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Especie" error={errors.species?.message}>
            <Controller
              name="species"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={speciesOptions}
                  placeholder="Todas las especies"
                  error={errors.species?.message}
                />
              )}
            />
          </FormField>
          <FormField label="Categoria" error={errors.category?.message}>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={categoryOptions}
                  placeholder="Todas las categorias"
                  error={errors.category?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 2: Group Name (optional) */}
        <FormField label="Nombre del Grupo (opcional)" error={errors.groupName?.message}>
          <FormInput
            {...register('groupName')}
            placeholder="Ej: Vacas lecheras, Terneros Potrero Norte..."
            error={errors.groupName?.message}
          />
        </FormField>

        {/* Row 3: Type and Affected Count */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Tipo de Accion" required error={errors.type?.message}>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={groupHealthActionTypeOptions}
                  placeholder="Seleccionar..."
                  error={errors.type?.message}
                />
              )}
            />
          </FormField>
          <FormField label="Cantidad de Animales" required error={errors.affectedCount?.message}>
            <FormInput
              {...register('affectedCount')}
              type="number"
              min="1"
              placeholder="Ej: 25"
              error={errors.affectedCount?.message}
            />
          </FormField>
        </div>

        {/* Row 4: Date and Performed By */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Fecha" required error={errors.date?.message}>
            <FormInput
              {...register('date')}
              type="date"
              error={errors.date?.message}
            />
          </FormField>
          <FormField label="Realizado por" required error={errors.performedBy?.message}>
            <FormInput
              {...register('performedBy')}
              placeholder="Ej: Dr. Garcia"
              error={errors.performedBy?.message}
            />
          </FormField>
        </div>

        {/* Row 5: Description */}
        <FormField label="Descripcion" required error={errors.description?.message}>
          <FormTextArea
            {...register('description')}
            placeholder="Describa la accion realizada..."
            rows={2}
            error={errors.description?.message}
          />
        </FormField>

        {/* Row 6: Medication and Cost */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Medicamento" error={errors.medication?.message}>
            <FormInput
              {...register('medication')}
              placeholder="Ej: Aftogan, Ivermectina..."
              error={errors.medication?.message}
            />
          </FormField>
          <FormField label="Costo Total" error={errors.cost?.message}>
            <FormInput
              {...register('cost')}
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.cost?.message}
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
            Registrar Accion
          </button>
        </div>
      </form>
    </Modal>
  );
}
