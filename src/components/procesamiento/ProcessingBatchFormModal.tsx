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
  processingBatchFormSchema,
  processingStatusOptions,
  processingProductTypeOptions,
  sourceModuleOptions,
  qualityGradeOptions,
  inputUnitOptions,
  type ProcessingBatchFormData,
} from '../../schemas/procesamiento.schema';
import {
  useCreateProcessingBatch,
  useUpdateProcessingBatch,
} from '../../hooks/useProcesamientoMutations';
import { useProcessingLines } from '../../hooks/useProcesamiento';
import type { ProcessingBatch } from '../../types/procesamiento.types';

interface ProcessingBatchFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batch?: ProcessingBatch | null;
  onSuccess?: () => void;
}

export default function ProcessingBatchFormModal({
  open,
  onOpenChange,
  batch,
  onSuccess,
}: ProcessingBatchFormModalProps) {
  const isEditing = !!batch;
  const createMutation = useCreateProcessingBatch();
  const updateMutation = useUpdateProcessingBatch();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const { data: lines } = useProcessingLines();
  const lineOptions = lines?.map(l => ({ value: l.id, label: `${l.lineCode} - ${l.name}` })) || [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProcessingBatchFormData>({
    resolver: zodResolver(processingBatchFormSchema),
    defaultValues: {
      batchCode: '',
      inputProductName: '',
      inputProductType: undefined,
      sourceModule: undefined,
      sourceLocation: '',
      inputQuantity: '',
      inputUnit: '',
      outputProductName: '',
      outputQuantity: '',
      outputUnit: '',
      outputGrade: undefined,
      status: 'pending',
      processingLineId: '',
      startDate: '',
      expectedEndDate: '',
      actualEndDate: '',
      operator: '',
      supervisor: '',
      temperature: '',
      storageLocation: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (open && batch) {
      reset({
        batchCode: batch.batchCode,
        inputProductName: batch.inputProductName,
        inputProductType: batch.inputProductType,
        sourceModule: batch.sourceModule,
        sourceLocation: batch.sourceLocation || '',
        inputQuantity: batch.inputQuantity.toString(),
        inputUnit: batch.inputUnit,
        outputProductName: batch.outputProductName || '',
        outputQuantity: batch.outputQuantity?.toString() || '',
        outputUnit: batch.outputUnit || '',
        outputGrade: batch.outputGrade,
        status: batch.status,
        processingLineId: batch.processingLineId,
        startDate: new Date(batch.startDate).toISOString().slice(0, 16),
        expectedEndDate: new Date(batch.expectedEndDate).toISOString().slice(0, 16),
        actualEndDate: batch.actualEndDate
          ? new Date(batch.actualEndDate).toISOString().slice(0, 16)
          : '',
        operator: batch.operator || '',
        supervisor: batch.supervisor || '',
        temperature: batch.temperature?.toString() || '',
        storageLocation: batch.storageLocation || '',
        notes: batch.notes || '',
      });
    } else if (open && !batch) {
      reset({
        batchCode: '',
        inputProductName: '',
        inputProductType: undefined,
        sourceModule: undefined,
        sourceLocation: '',
        inputQuantity: '',
        inputUnit: '',
        outputProductName: '',
        outputQuantity: '',
        outputUnit: '',
        outputGrade: undefined,
        status: 'pending',
        processingLineId: '',
        startDate: '',
        expectedEndDate: '',
        actualEndDate: '',
        operator: '',
        supervisor: '',
        temperature: '',
        storageLocation: '',
        notes: '',
      });
    }
  }, [open, batch, reset]);

  const onSubmit = async (data: ProcessingBatchFormData) => {
    try {
      if (isEditing && batch) {
        await updateMutation.mutateAsync({ id: batch.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving processing batch:', error);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar Lote de Procesamiento' : 'Nuevo Lote de Procesamiento'}
      description={
        isEditing
          ? 'Modifica los datos del lote de procesamiento'
          : 'Registra un nuevo lote de procesamiento'
      }
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Row 1: Batch Code and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Codigo de Lote" required error={errors.batchCode?.message}>
            <FormInput
              {...register('batchCode')}
              placeholder="Ej: PROC-2026-006"
              error={errors.batchCode?.message}
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
                  options={processingStatusOptions}
                  placeholder="Seleccionar..."
                  error={errors.status?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 2: Processing Line */}
        <FormField label="Linea de Procesamiento" required error={errors.processingLineId?.message}>
          <Controller
            name="processingLineId"
            control={control}
            render={({ field }) => (
              <FormSelect
                value={field.value}
                onValueChange={field.onChange}
                options={lineOptions}
                placeholder="Seleccionar linea..."
                error={errors.processingLineId?.message}
              />
            )}
          />
        </FormField>

        {/* Input Section Header */}
        <div className="border-t border-gray-100 pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Materia Prima</h3>
        </div>

        {/* Row 3: Input Product */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Producto de Entrada" required error={errors.inputProductName?.message}>
            <FormInput
              {...register('inputProductName')}
              placeholder="Ej: Tomate Roma"
              error={errors.inputProductName?.message}
            />
          </FormField>
          <FormField label="Tipo de Producto" required error={errors.inputProductType?.message}>
            <Controller
              name="inputProductType"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={processingProductTypeOptions}
                  placeholder="Seleccionar..."
                  error={errors.inputProductType?.message}
                />
              )}
            />
          </FormField>
          <FormField label="Modulo de Origen" required error={errors.sourceModule?.message}>
            <Controller
              name="sourceModule"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={sourceModuleOptions}
                  placeholder="Seleccionar..."
                  error={errors.sourceModule?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 4: Input Quantity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Cantidad de Entrada" required error={errors.inputQuantity?.message}>
            <FormInput
              {...register('inputQuantity')}
              type="number"
              step="0.01"
              placeholder="Ej: 450"
              error={errors.inputQuantity?.message}
            />
          </FormField>
          <FormField label="Unidad de Entrada" required error={errors.inputUnit?.message}>
            <Controller
              name="inputUnit"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={inputUnitOptions}
                  placeholder="Seleccionar..."
                  error={errors.inputUnit?.message}
                />
              )}
            />
          </FormField>
          <FormField label="Ubicacion de Origen" error={errors.sourceLocation?.message}>
            <FormInput
              {...register('sourceLocation')}
              placeholder="Ej: Lote Norte"
              error={errors.sourceLocation?.message}
            />
          </FormField>
        </div>

        {/* Output Section Header */}
        <div className="border-t border-gray-100 pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Producto de Salida</h3>
        </div>

        {/* Row 5: Output Product */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Producto de Salida" error={errors.outputProductName?.message}>
            <FormInput
              {...register('outputProductName')}
              placeholder="Ej: Salsa de Tomate"
              error={errors.outputProductName?.message}
            />
          </FormField>
          <FormField label="Cantidad de Salida" error={errors.outputQuantity?.message}>
            <FormInput
              {...register('outputQuantity')}
              type="number"
              step="0.01"
              placeholder="Ej: 200"
              error={errors.outputQuantity?.message}
            />
          </FormField>
          <FormField label="Grado de Calidad" error={errors.outputGrade?.message}>
            <Controller
              name="outputGrade"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={qualityGradeOptions}
                  placeholder="Seleccionar..."
                  error={errors.outputGrade?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Dates Section */}
        <div className="border-t border-gray-100 pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Fechas y Operacion</h3>
        </div>

        {/* Row 6: Dates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Fecha de Inicio" required error={errors.startDate?.message}>
            <FormInput
              {...register('startDate')}
              type="datetime-local"
              error={errors.startDate?.message}
            />
          </FormField>
          <FormField label="Fecha Esperada de Fin" required error={errors.expectedEndDate?.message}>
            <FormInput
              {...register('expectedEndDate')}
              type="datetime-local"
              error={errors.expectedEndDate?.message}
            />
          </FormField>
          <FormField label="Fecha Real de Fin" error={errors.actualEndDate?.message}>
            <FormInput
              {...register('actualEndDate')}
              type="datetime-local"
              error={errors.actualEndDate?.message}
            />
          </FormField>
        </div>

        {/* Row 7: Operator, Supervisor, Temperature */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Operador" error={errors.operator?.message}>
            <FormInput
              {...register('operator')}
              placeholder="Ej: Juan Perez"
              error={errors.operator?.message}
            />
          </FormField>
          <FormField label="Supervisor" error={errors.supervisor?.message}>
            <FormInput
              {...register('supervisor')}
              placeholder="Ej: Maria Garcia"
              error={errors.supervisor?.message}
            />
          </FormField>
          <FormField label="Temperatura (C)" error={errors.temperature?.message}>
            <FormInput
              {...register('temperature')}
              type="number"
              step="0.1"
              placeholder="Ej: 85"
              error={errors.temperature?.message}
            />
          </FormField>
        </div>

        {/* Row 8: Storage Location */}
        <FormField label="Ubicacion de Almacenamiento" error={errors.storageLocation?.message}>
          <FormInput
            {...register('storageLocation')}
            placeholder="Ej: Bodega Fria A"
            error={errors.storageLocation?.message}
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
            {isEditing ? 'Guardar Cambios' : 'Crear Lote'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
