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
  potreroFormSchema,
  potreroStatusOptions,
  type PotreroFormData,
} from '../../schemas/pecuario.schema';
import { useCreatePotrero, useUpdatePotrero } from '../../hooks/usePecuarioMutations';
import { useDivisions } from '../../hooks/useFinca';
import type { Potrero } from '../../types/pecuario.types';

interface PotreroFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  potrero?: Potrero | null;
  onSuccess?: () => void;
}

function formatDateForInput(date: Date | string | undefined): string {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().split('T')[0];
}

export default function PotreroFormModal({
  open,
  onOpenChange,
  potrero,
  onSuccess,
}: PotreroFormModalProps) {
  const isEditing = !!potrero;
  const createMutation = useCreatePotrero();
  const updateMutation = useUpdatePotrero();
  const { data: divisions } = useDivisions();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  // Filter divisions by type 'potrero'
  const divisionOptions = [
    { value: '', label: 'Sin asignar' },
    ...(divisions || [])
      .filter(d => d.type === 'potrero')
      .map(d => ({ value: d.id, label: d.name })),
  ];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<PotreroFormData>({
    resolver: zodResolver(potreroFormSchema),
    defaultValues: {
      name: '',
      code: '',
      area: '',
      capacity: '',
      currentOccupancy: '0',
      status: undefined,
      divisionId: '',
      waterSource: false,
      shade: false,
      grassType: '',
      lastRotation: '',
      nextRotation: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (open && potrero) {
      reset({
        name: potrero.name,
        code: potrero.code || '',
        area: potrero.area.toString(),
        capacity: potrero.capacity.toString(),
        currentOccupancy: potrero.currentOccupancy.toString(),
        status: potrero.status,
        divisionId: potrero.divisionId || '',
        waterSource: potrero.waterSource || false,
        shade: potrero.shade || false,
        grassType: potrero.grassType || '',
        lastRotation: formatDateForInput(potrero.lastRotation),
        nextRotation: formatDateForInput(potrero.nextRotation),
        notes: potrero.notes || '',
      });
    } else if (open && !potrero) {
      reset({
        name: '',
        code: '',
        area: '',
        capacity: '',
        currentOccupancy: '0',
        status: undefined,
        divisionId: '',
        waterSource: false,
        shade: false,
        grassType: '',
        lastRotation: '',
        nextRotation: '',
        notes: '',
      });
    }
  }, [open, potrero, reset]);

  const onSubmit = async (data: PotreroFormData) => {
    try {
      if (isEditing && potrero) {
        await updateMutation.mutateAsync({ id: potrero.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving potrero:', error);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar Potrero' : 'Nuevo Potrero'}
      description={
        isEditing
          ? 'Modifica los datos del potrero'
          : 'Registra un nuevo potrero'
      }
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Row 1: Code, Name and Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField label="Codigo" error={errors.code?.message}>
            <FormInput
              {...register('code')}
              placeholder="Ej: P-001"
              error={errors.code?.message}
            />
          </FormField>
          <div className="md:col-span-2">
            <FormField label="Nombre" required error={errors.name?.message}>
              <FormInput
                {...register('name')}
                placeholder="Ej: Potrero Norte"
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
                  options={potreroStatusOptions}
                  placeholder="Seleccionar..."
                  error={errors.status?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 2: Area, Capacity, Occupancy */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Área (ha)" required error={errors.area?.message}>
            <FormInput
              {...register('area')}
              type="number"
              step="0.1"
              placeholder="Ej: 5.5"
              error={errors.area?.message}
            />
          </FormField>
          <FormField label="Capacidad" required error={errors.capacity?.message}>
            <FormInput
              {...register('capacity')}
              type="number"
              placeholder="Ej: 25"
              error={errors.capacity?.message}
            />
          </FormField>
          <FormField label="Ocupación Actual" required error={errors.currentOccupancy?.message}>
            <FormInput
              {...register('currentOccupancy')}
              type="number"
              placeholder="Ej: 18"
              error={errors.currentOccupancy?.message}
            />
          </FormField>
        </div>

        {/* Row 3: Division and Grass Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Division (Mi Finca)" error={errors.divisionId?.message}>
            <Controller
              name="divisionId"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value || ''}
                  onValueChange={field.onChange}
                  options={divisionOptions}
                  placeholder="Vincular a division..."
                />
              )}
            />
          </FormField>
          <FormField label="Tipo de Pasto" error={errors.grassType?.message}>
            <FormInput
              {...register('grassType')}
              placeholder="Ej: Brachiaria"
              error={errors.grassType?.message}
            />
          </FormField>
        </div>

        {/* Row 4: Characteristics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('waterSource')}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="text-sm text-gray-700">Tiene fuente de agua</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('shade')}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="text-sm text-gray-700">Tiene sombra</span>
          </label>
        </div>

        {/* Row 4: Rotation Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Última Rotación" error={errors.lastRotation?.message}>
            <FormDatePicker
              {...register('lastRotation')}
              error={errors.lastRotation?.message}
            />
          </FormField>
          <FormField label="Próxima Rotación" error={errors.nextRotation?.message}>
            <FormDatePicker
              {...register('nextRotation')}
              error={errors.nextRotation?.message}
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
            {isEditing ? 'Guardar Cambios' : 'Crear Potrero'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
