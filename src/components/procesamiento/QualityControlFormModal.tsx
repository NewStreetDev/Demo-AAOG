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
  qualityControlFormSchema,
  qcOverallResultOptions,
  qualityGradeOptions,
  type QualityControlFormData,
} from '../../schemas/procesamiento.schema';
import {
  useCreateQualityControl,
  useUpdateQualityControl,
} from '../../hooks/useProcesamientoMutations';
import { useProcessingBatches } from '../../hooks/useProcesamiento';
import type { QualityControl } from '../../types/procesamiento.types';

interface QualityControlFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qualityControl?: QualityControl | null;
  onSuccess?: () => void;
}

export default function QualityControlFormModal({
  open,
  onOpenChange,
  qualityControl,
  onSuccess,
}: QualityControlFormModalProps) {
  const isEditing = !!qualityControl;
  const createMutation = useCreateQualityControl();
  const updateMutation = useUpdateQualityControl();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const { data: batches } = useProcessingBatches();
  const batchOptions = batches?.map(b => ({
    value: b.id,
    label: `${b.batchCode} - ${b.inputProductName}`,
  })) || [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<QualityControlFormData>({
    resolver: zodResolver(qualityControlFormSchema),
    defaultValues: {
      batchId: '',
      inspectionDate: '',
      inspector: '',
      overallResult: undefined,
      finalGrade: undefined,
      temperature: '',
      humidity: '',
      pH: '',
      approved: false,
      approvedBy: '',
      defectsDescription: '',
      correctiveActions: '',
      notes: '',
    },
  });

  const overallResult = watch('overallResult');

  useEffect(() => {
    if (open && qualityControl) {
      reset({
        batchId: qualityControl.batchId,
        inspectionDate: new Date(qualityControl.inspectionDate).toISOString().slice(0, 16),
        inspector: qualityControl.inspector,
        overallResult: qualityControl.overallResult,
        finalGrade: qualityControl.finalGrade,
        temperature: '',
        humidity: '',
        pH: '',
        approved: qualityControl.approved,
        approvedBy: qualityControl.approvedBy || '',
        defectsDescription: qualityControl.defectsFound?.[0]?.description || '',
        correctiveActions: '',
        notes: qualityControl.notes || '',
      });
    } else if (open && !qualityControl) {
      reset({
        batchId: '',
        inspectionDate: '',
        inspector: '',
        overallResult: undefined,
        finalGrade: undefined,
        temperature: '',
        humidity: '',
        pH: '',
        approved: false,
        approvedBy: '',
        defectsDescription: '',
        correctiveActions: '',
        notes: '',
      });
    }
  }, [open, qualityControl, reset]);

  const onSubmit = async (data: QualityControlFormData) => {
    try {
      if (isEditing && qualityControl) {
        await updateMutation.mutateAsync({ id: qualityControl.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving quality control:', error);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar Control de Calidad' : 'Nuevo Control de Calidad'}
      description={
        isEditing
          ? 'Modifica los datos del control de calidad'
          : 'Registra un nuevo control de calidad'
      }
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Row 1: Batch Selection */}
        <FormField label="Lote" required error={errors.batchId?.message}>
          <Controller
            name="batchId"
            control={control}
            render={({ field }) => (
              <FormSelect
                value={field.value}
                onValueChange={field.onChange}
                options={batchOptions}
                placeholder="Seleccionar lote..."
                error={errors.batchId?.message}
              />
            )}
          />
        </FormField>

        {/* Row 2: Inspection Date and Inspector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Fecha de Inspeccion" required error={errors.inspectionDate?.message}>
            <FormInput
              {...register('inspectionDate')}
              type="datetime-local"
              error={errors.inspectionDate?.message}
            />
          </FormField>
          <FormField label="Inspector" required error={errors.inspector?.message}>
            <FormInput
              {...register('inspector')}
              placeholder="Ej: Maria Garcia"
              error={errors.inspector?.message}
            />
          </FormField>
        </div>

        {/* Row 3: Result and Grade */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Resultado General" required error={errors.overallResult?.message}>
            <Controller
              name="overallResult"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={qcOverallResultOptions}
                  placeholder="Seleccionar..."
                  error={errors.overallResult?.message}
                />
              )}
            />
          </FormField>
          <FormField label="Grado Final" required error={errors.finalGrade?.message}>
            <Controller
              name="finalGrade"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={qualityGradeOptions}
                  placeholder="Seleccionar..."
                  error={errors.finalGrade?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Parameters Section */}
        <div className="border-t border-gray-100 pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Parametros Medidos</h3>
        </div>

        {/* Row 4: Temperature, Humidity, pH */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Temperatura (C)" error={errors.temperature?.message}>
            <FormInput
              {...register('temperature')}
              type="number"
              step="0.1"
              placeholder="Ej: 4.5"
              error={errors.temperature?.message}
            />
          </FormField>
          <FormField label="Humedad (%)" error={errors.humidity?.message}>
            <FormInput
              {...register('humidity')}
              type="number"
              step="0.1"
              placeholder="Ej: 65"
              error={errors.humidity?.message}
            />
          </FormField>
          <FormField label="pH" error={errors.pH?.message}>
            <FormInput
              {...register('pH')}
              type="number"
              step="0.01"
              placeholder="Ej: 4.5"
              error={errors.pH?.message}
            />
          </FormField>
        </div>

        {/* Approval Section */}
        <div className="border-t border-gray-100 pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Aprobacion</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Aprobado">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('approved')}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                {overallResult === 'pass' ? 'Marcar como aprobado' : 'Pendiente de aprobacion'}
              </span>
            </label>
          </FormField>
          <FormField label="Aprobado Por" error={errors.approvedBy?.message}>
            <FormInput
              {...register('approvedBy')}
              placeholder="Ej: Dr. Lopez"
              error={errors.approvedBy?.message}
            />
          </FormField>
        </div>

        {/* Defects */}
        <FormField label="Defectos Encontrados" error={errors.defectsDescription?.message}>
          <FormTextArea
            {...register('defectsDescription')}
            placeholder="Descripcion de defectos encontrados..."
            rows={2}
            error={errors.defectsDescription?.message}
          />
        </FormField>

        {/* Corrective Actions */}
        <FormField label="Acciones Correctivas" error={errors.correctiveActions?.message}>
          <FormTextArea
            {...register('correctiveActions')}
            placeholder="Acciones correctivas aplicadas o requeridas..."
            rows={2}
            error={errors.correctiveActions?.message}
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
            {isEditing ? 'Guardar Cambios' : 'Registrar Control'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
