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
  equipmentFormSchema,
  equipmentTypeOptions,
  equipmentStatusOptions,
  type EquipmentFormData,
} from '../../schemas/infraestructura.schema';
import { useCreateEquipment, useUpdateEquipment } from '../../hooks/useInfraestructuraMutations';
import type { Equipment } from '../../types/infraestructura.types';

interface EquipmentFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipment?: Equipment | null;
  onSuccess?: () => void;
}

function formatDateForInput(date: Date | string | undefined): string {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().split('T')[0];
}

export default function EquipmentFormModal({
  open,
  onOpenChange,
  equipment,
  onSuccess,
}: EquipmentFormModalProps) {
  const isEditing = !!equipment;
  const createMutation = useCreateEquipment();
  const updateMutation = useUpdateEquipment();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentFormSchema),
    defaultValues: {
      name: '',
      type: undefined,
      brand: '',
      model: '',
      serialNumber: '',
      status: 'operational',
      purchaseDate: '',
      lastMaintenanceDate: '',
      nextMaintenanceDate: '',
      location: '',
      assignedTo: '',
      value: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (open && equipment) {
      reset({
        name: equipment.name,
        type: equipment.type,
        brand: equipment.brand || '',
        model: equipment.model || '',
        serialNumber: equipment.serialNumber || '',
        status: equipment.status,
        purchaseDate: formatDateForInput(equipment.purchaseDate),
        lastMaintenanceDate: formatDateForInput(equipment.lastMaintenanceDate),
        nextMaintenanceDate: formatDateForInput(equipment.nextMaintenanceDate),
        location: equipment.location,
        assignedTo: equipment.assignedTo || '',
        value: equipment.value?.toString() || '',
        notes: equipment.notes || '',
      });
    } else if (open && !equipment) {
      reset({
        name: '',
        type: undefined,
        brand: '',
        model: '',
        serialNumber: '',
        status: 'operational',
        purchaseDate: '',
        lastMaintenanceDate: '',
        nextMaintenanceDate: '',
        location: '',
        assignedTo: '',
        value: '',
        notes: '',
      });
    }
  }, [open, equipment, reset]);

  const onSubmit = async (data: EquipmentFormData) => {
    try {
      if (isEditing && equipment) {
        await updateMutation.mutateAsync({ id: equipment.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving equipment:', error);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar Equipo' : 'Nuevo Equipo'}
      description={
        isEditing
          ? 'Modifica los datos del equipo'
          : 'Registra un nuevo equipo'
      }
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Row 1: Name and Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Nombre" required error={errors.name?.message}>
            <FormInput
              {...register('name')}
              placeholder="Ej: Tractor John Deere"
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
                  options={equipmentTypeOptions}
                  placeholder="Seleccionar tipo..."
                  error={errors.type?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 2: Brand and Model */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Marca" error={errors.brand?.message}>
            <FormInput
              {...register('brand')}
              placeholder="Ej: John Deere"
              error={errors.brand?.message}
            />
          </FormField>
          <FormField label="Modelo" error={errors.model?.message}>
            <FormInput
              {...register('model')}
              placeholder="Ej: 5075E"
              error={errors.model?.message}
            />
          </FormField>
        </div>

        {/* Row 3: Serial, Location, Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Número de Serie" error={errors.serialNumber?.message}>
            <FormInput
              {...register('serialNumber')}
              placeholder="Ej: JD-2021-001"
              error={errors.serialNumber?.message}
            />
          </FormField>
          <FormField label="Ubicación" required error={errors.location?.message}>
            <FormInput
              {...register('location')}
              placeholder="Ej: Bodega Principal"
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
                  options={equipmentStatusOptions}
                  placeholder="Seleccionar estado..."
                  error={errors.status?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 4: Dates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Fecha de Compra" error={errors.purchaseDate?.message}>
            <FormDatePicker
              {...register('purchaseDate')}
              error={errors.purchaseDate?.message}
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

        {/* Row 5: Assigned To and Value */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Asignado a" error={errors.assignedTo?.message}>
            <FormInput
              {...register('assignedTo')}
              placeholder="Ej: Juan García"
              error={errors.assignedTo?.message}
            />
          </FormField>
          <FormField label="Valor (₡)" error={errors.value?.message}>
            <FormInput
              {...register('value')}
              type="number"
              placeholder="Ej: 5000000"
              error={errors.value?.message}
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
            {isEditing ? 'Guardar Cambios' : 'Crear Equipo'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
