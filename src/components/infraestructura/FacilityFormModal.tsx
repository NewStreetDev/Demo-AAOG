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
  facilityFormSchema,
  facilityTypeOptions,
  facilityStatusOptions,
  moduleAssignmentOptions,
  type FacilityFormData,
} from '../../schemas/infraestructura.schema';
import { useCreateFacility, useUpdateFacility } from '../../hooks/useInfraestructuraMutations';
import type { Facility } from '../../types/infraestructura.types';

interface FacilityFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  facility?: Facility | null;
  onSuccess?: () => void;
}

function formatDateForInput(date: Date | string | undefined): string {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().split('T')[0];
}

export default function FacilityFormModal({
  open,
  onOpenChange,
  facility,
  onSuccess,
}: FacilityFormModalProps) {
  const isEditing = !!facility;
  const createMutation = useCreateFacility();
  const updateMutation = useUpdateFacility();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FacilityFormData>({
    resolver: zodResolver(facilityFormSchema),
    defaultValues: {
      name: '',
      type: undefined,
      description: '',
      location: '',
      area: '',
      capacity: '',
      status: 'operational',
      constructionDate: '',
      lastMaintenanceDate: '',
      nextMaintenanceDate: '',
      assignedModule: undefined,
      notes: '',
    },
  });

  useEffect(() => {
    if (open && facility) {
      reset({
        name: facility.name,
        type: facility.type,
        description: facility.description || '',
        location: facility.location,
        area: facility.area?.toString() || '',
        capacity: facility.capacity || '',
        status: facility.status,
        constructionDate: formatDateForInput(facility.constructionDate),
        lastMaintenanceDate: formatDateForInput(facility.lastMaintenanceDate),
        nextMaintenanceDate: formatDateForInput(facility.nextMaintenanceDate),
        assignedModule: facility.assignedModule,
        notes: facility.notes || '',
      });
    } else if (open && !facility) {
      reset({
        name: '',
        type: undefined,
        description: '',
        location: '',
        area: '',
        capacity: '',
        status: 'operational',
        constructionDate: '',
        lastMaintenanceDate: '',
        nextMaintenanceDate: '',
        assignedModule: undefined,
        notes: '',
      });
    }
  }, [open, facility, reset]);

  const onSubmit = async (data: FacilityFormData) => {
    try {
      if (isEditing && facility) {
        await updateMutation.mutateAsync({ id: facility.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving facility:', error);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar Instalación' : 'Nueva Instalación'}
      description={
        isEditing
          ? 'Modifica los datos de la instalación'
          : 'Registra una nueva instalación'
      }
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Row 1: Name and Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Nombre" required error={errors.name?.message}>
            <FormInput
              {...register('name')}
              placeholder="Ej: Bodega Principal"
              error={errors.name?.message}
            />
          </FormField>
          <FormField label="Tipo" required error={errors.type?.message}>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={facilityTypeOptions}
                  placeholder="Seleccionar tipo..."
                  error={errors.type?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 2: Location and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Ubicación" required error={errors.location?.message}>
            <FormInput
              {...register('location')}
              placeholder="Ej: Sector Norte"
              error={errors.location?.message}
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
                  options={facilityStatusOptions}
                  placeholder="Seleccionar estado..."
                  error={errors.status?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 3: Area, Capacity, Module */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Área (m²)" error={errors.area?.message}>
            <FormInput
              {...register('area')}
              type="number"
              placeholder="Ej: 500"
              error={errors.area?.message}
            />
          </FormField>
          <FormField label="Capacidad" error={errors.capacity?.message}>
            <FormInput
              {...register('capacity')}
              placeholder="Ej: 200 toneladas"
              error={errors.capacity?.message}
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

        {/* Row 4: Dates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Fecha de Construcción" error={errors.constructionDate?.message}>
            <FormDatePicker
              {...register('constructionDate')}
              error={errors.constructionDate?.message}
            />
          </FormField>
          <FormField label="Último Mantenimiento" error={errors.lastMaintenanceDate?.message}>
            <FormDatePicker
              {...register('lastMaintenanceDate')}
              error={errors.lastMaintenanceDate?.message}
            />
          </FormField>
          <FormField label="Próximo Mantenimiento" error={errors.nextMaintenanceDate?.message}>
            <FormDatePicker
              {...register('nextMaintenanceDate')}
              error={errors.nextMaintenanceDate?.message}
            />
          </FormField>
        </div>

        {/* Description */}
        <FormField label="Descripción" error={errors.description?.message}>
          <FormTextArea
            {...register('description')}
            placeholder="Descripción de la instalación..."
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
            {isEditing ? 'Guardar Cambios' : 'Crear Instalación'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
