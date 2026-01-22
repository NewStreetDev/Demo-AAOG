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
  workerFormSchema,
  roleOptions,
  moduleOptions,
  statusOptions,
  type WorkerFormData,
} from '../../schemas/worker.schema';
import { useCreateWorker, useUpdateWorker } from '../../hooks/useWorkerMutations';
import type { Worker } from '../../types/trabajadores.types';

interface WorkerFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  worker?: Worker | null;
  onSuccess?: () => void;
}

function formatDateForInput(date: Date | string | undefined): string {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().split('T')[0];
}

export default function WorkerFormModal({
  open,
  onOpenChange,
  worker,
  onSuccess,
}: WorkerFormModalProps) {
  const isEditing = !!worker;
  const createMutation = useCreateWorker();
  const updateMutation = useUpdateWorker();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<WorkerFormData>({
    resolver: zodResolver(workerFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      documentId: '',
      role: undefined,
      moduleAssignment: undefined,
      status: 'active',
      hireDate: '',
      hourlyRate: '',
      email: '',
      phone: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (open && worker) {
      reset({
        firstName: worker.firstName,
        lastName: worker.lastName,
        documentId: worker.documentId,
        role: worker.role,
        moduleAssignment: worker.moduleAssignment,
        status: worker.status,
        hireDate: formatDateForInput(worker.hireDate),
        hourlyRate: worker.hourlyRate?.toString() || '',
        email: worker.email || '',
        phone: worker.phone || '',
        notes: worker.notes || '',
      });
    } else if (open && !worker) {
      reset({
        firstName: '',
        lastName: '',
        documentId: '',
        role: undefined,
        moduleAssignment: undefined,
        status: 'active',
        hireDate: '',
        hourlyRate: '',
        email: '',
        phone: '',
        notes: '',
      });
    }
  }, [open, worker, reset]);

  const onSubmit = async (data: WorkerFormData) => {
    try {
      if (isEditing && worker) {
        await updateMutation.mutateAsync({ id: worker.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving worker:', error);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar Trabajador' : 'Nuevo Trabajador'}
      description={
        isEditing
          ? 'Modifica los datos del trabajador'
          : 'Completa los datos del trabajador'
      }
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Row 1: Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Nombre" required error={errors.firstName?.message}>
            <FormInput
              {...register('firstName')}
              placeholder="Ej: Juan"
              error={errors.firstName?.message}
            />
          </FormField>
          <FormField label="Apellido" required error={errors.lastName?.message}>
            <FormInput
              {...register('lastName')}
              placeholder="Ej: García"
              error={errors.lastName?.message}
            />
          </FormField>
        </div>

        {/* Row 2: Document and Role */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Documento" required error={errors.documentId?.message}>
            <FormInput
              {...register('documentId')}
              placeholder="Ej: 1234567890"
              error={errors.documentId?.message}
            />
          </FormField>
          <FormField label="Rol" required error={errors.role?.message}>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={roleOptions}
                  placeholder="Seleccionar rol..."
                  error={errors.role?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 3: Module and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Módulo" required error={errors.moduleAssignment?.message}>
            <Controller
              name="moduleAssignment"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={moduleOptions}
                  placeholder="Seleccionar módulo..."
                  error={errors.moduleAssignment?.message}
                />
              )}
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
                  options={statusOptions}
                  placeholder="Seleccionar estado..."
                  error={errors.status?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 4: Hire Date and Hourly Rate */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Fecha de Contrato" required error={errors.hireDate?.message}>
            <FormDatePicker
              {...register('hireDate')}
              error={errors.hireDate?.message}
            />
          </FormField>
          <FormField label="Tarifa por Hora" error={errors.hourlyRate?.message}>
            <FormInput
              {...register('hourlyRate')}
              type="number"
              placeholder="Ej: 15000"
              error={errors.hourlyRate?.message}
            />
          </FormField>
        </div>

        {/* Row 5: Email and Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Email" error={errors.email?.message}>
            <FormInput
              {...register('email')}
              type="email"
              placeholder="Ej: correo@ejemplo.com"
              error={errors.email?.message}
            />
          </FormField>
          <FormField label="Teléfono" error={errors.phone?.message}>
            <FormInput
              {...register('phone')}
              type="tel"
              placeholder="Ej: 8765-4321"
              error={errors.phone?.message}
            />
          </FormField>
        </div>

        {/* Row 6: Notes */}
        <FormField label="Notas" error={errors.notes?.message}>
          <FormTextArea
            {...register('notes')}
            placeholder="Observaciones adicionales sobre el trabajador..."
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
            {isEditing ? 'Guardar Cambios' : 'Crear Trabajador'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
