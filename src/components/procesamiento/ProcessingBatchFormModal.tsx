import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Check, Link2 } from 'lucide-react';
import { Modal } from '../common/Modals';
import {
  FormInput,
  FormField,
  FormSelect,
  FormTextArea,
} from '../common/Forms';
import {
  processingBatchFormSchema,
  batchStatusOptions,
  inputSourceTypeOptions,
  inputUnitOptions,
  commonProcessTypes,
  type ProcessingBatchFormData,
} from '../../schemas/procesamiento.schema';
import {
  useCreateProcessingBatch,
  useUpdateProcessingBatch,
} from '../../hooks/useProcesamientoMutations';
import { useCompletedBatches } from '../../hooks/useProcesamiento';
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

  // Custom process type input
  const [showCustomProcess, setShowCustomProcess] = useState(false);
  const [customProcessType, setCustomProcessType] = useState('');

  // Fetch completed batches for source selection
  const { data: completedBatches } = useCompletedBatches();

  // Create options for source batch dropdown
  const sourceBatchOptions = completedBatches?.map(b => ({
    value: b.id,
    label: `${b.batchCode || 'Sin codigo'} - ${b.outputProduct || b.inputProduct} (${b.outputQuantity || 0} ${b.outputUnit || b.inputUnit})`,
  })) || [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProcessingBatchFormData>({
    resolver: zodResolver(processingBatchFormSchema) as never,
    defaultValues: {
      processTypeId: '',
      processTypeName: '',
      processDate: '',
      inputProduct: '',
      inputQuantity: '',
      inputUnit: '',
      inputSourceType: 'cosecha',
      inputSourceBatchId: '',
      outputProduct: '',
      outputQuantity: '',
      outputUnit: '',
      status: 'en_proceso',
      isFinalProduct: false,
      operator: '',
      supervisor: '',
      storageLocation: '',
      completionDate: '',
      notes: '',
    },
  });

  const inputSourceType = watch('inputSourceType');
  const status = watch('status');
  const inputSourceBatchId = watch('inputSourceBatchId');

  // Auto-fill input product when selecting a source batch
  useEffect(() => {
    if (inputSourceType === 'lote_anterior' && inputSourceBatchId && completedBatches) {
      const sourceBatch = completedBatches.find(b => b.id === inputSourceBatchId);
      if (sourceBatch) {
        setValue('inputProduct', sourceBatch.outputProduct || sourceBatch.inputProduct);
        setValue('inputUnit', sourceBatch.outputUnit || sourceBatch.inputUnit);
        // Optionally pre-fill quantity with available amount
        if (!watch('inputQuantity')) {
          setValue('inputQuantity', String(sourceBatch.outputQuantity || 0));
        }
      }
    }
  }, [inputSourceBatchId, inputSourceType, completedBatches, setValue, watch]);

  useEffect(() => {
    if (open && batch) {
      reset({
        processTypeId: batch.processTypeId || batch.processType || '',
        processTypeName: batch.processTypeName || '',
        processDate: new Date(batch.processDate).toISOString().slice(0, 16),
        inputProduct: batch.inputProduct,
        inputQuantity: batch.inputQuantity.toString(),
        inputUnit: batch.inputUnit,
        inputSourceType: batch.inputSourceType,
        inputSourceBatchId: batch.inputSourceBatchId || '',
        outputProduct: batch.outputProduct || '',
        outputQuantity: batch.outputQuantity?.toString() || '',
        outputUnit: batch.outputUnit || '',
        status: batch.status,
        isFinalProduct: batch.isFinalProduct,
        operator: batch.operator || '',
        supervisor: batch.supervisor || '',
        storageLocation: batch.storageLocation || '',
        completionDate: batch.completionDate
          ? new Date(batch.completionDate).toISOString().slice(0, 16)
          : '',
        notes: batch.notes || '',
      });
      setShowCustomProcess(false);
      setCustomProcessType('');
    } else if (open && !batch) {
      reset({
        processTypeId: '',
        processTypeName: '',
        processDate: new Date().toISOString().slice(0, 16),
        inputProduct: '',
        inputQuantity: '',
        inputUnit: '',
        inputSourceType: 'cosecha',
        inputSourceBatchId: '',
        outputProduct: '',
        outputQuantity: '',
        outputUnit: '',
        status: 'en_proceso',
        isFinalProduct: false,
        operator: '',
        supervisor: '',
        storageLocation: '',
        completionDate: '',
        notes: '',
      });
      setShowCustomProcess(false);
      setCustomProcessType('');
    }
  }, [open, batch, reset]);

  const handleAddCustomProcess = () => {
    if (customProcessType.trim()) {
      const trimmed = customProcessType.trim();
      setValue('processTypeId', trimmed);
      setValue('processTypeName', trimmed);
      setShowCustomProcess(false);
      setCustomProcessType('');
    }
  };

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
          ? `Editando lote ${batch?.batchCode || '(en proceso)'}`
          : 'Registra un nuevo proceso sobre materia prima o lote anterior'
      }
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Process Info Section */}
        <div className="border-b border-gray-100 pb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Informacion del Proceso</h3>
        </div>

        {/* Row 1: Process Type and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Tipo de Proceso" required error={errors.processTypeId?.message}>
            {showCustomProcess ? (
              <div className="flex gap-2">
                <FormInput
                  value={customProcessType}
                  onChange={(e) => setCustomProcessType(e.target.value)}
                  placeholder="Nombre del proceso..."
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={handleAddCustomProcess}
                  className="btn-secondary px-3"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Controller
                  name="processTypeId"
                  control={control}
                  render={({ field }) => (
                    <FormSelect
                      value={field.value}
                      onValueChange={(val) => {
                        field.onChange(val);
                        setValue('processTypeName', val);
                      }}
                      options={commonProcessTypes.map(p => ({ value: p, label: p }))}
                      placeholder="Seleccionar proceso..."
                      error={errors.processTypeId?.message}
                      className="flex-1"
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowCustomProcess(true)}
                  className="btn-secondary px-3"
                  title="Agregar proceso personalizado"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
          </FormField>
          <FormField label="Estado" required error={errors.status?.message}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={batchStatusOptions}
                  placeholder="Seleccionar..."
                  error={errors.status?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 2: Process Date */}
        <FormField label="Fecha del Proceso" required error={errors.processDate?.message}>
          <FormInput
            {...register('processDate')}
            type="datetime-local"
            error={errors.processDate?.message}
          />
        </FormField>

        {/* Input Section */}
        <div className="border-t border-gray-100 pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Materia Prima (Entrada)</h3>
        </div>

        {/* Row 3: Input Source Type */}
        <FormField label="Origen de la Materia Prima" required error={errors.inputSourceType?.message}>
          <Controller
            name="inputSourceType"
            control={control}
            render={({ field }) => (
              <FormSelect
                value={field.value}
                onValueChange={(val) => {
                  field.onChange(val);
                  // Clear source batch if switching to cosecha
                  if (val === 'cosecha') {
                    setValue('inputSourceBatchId', '');
                  }
                }}
                options={inputSourceTypeOptions}
                placeholder="Seleccionar origen..."
                error={errors.inputSourceType?.message}
              />
            )}
          />
        </FormField>

        {/* Row 4: Source Batch (conditional) */}
        {inputSourceType === 'lote_anterior' && (
          <FormField
            label="Lote de Origen"
            required
            error={errors.inputSourceBatchId?.message}
          >
            <Controller
              name="inputSourceBatchId"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value || ''}
                  onValueChange={field.onChange}
                  options={sourceBatchOptions}
                  placeholder="Seleccionar lote completado..."
                  error={errors.inputSourceBatchId?.message}
                />
              )}
            />
            {inputSourceBatchId && (
              <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                <Link2 className="w-3 h-3" />
                El producto de entrada se pre-llena automaticamente desde el lote seleccionado
              </p>
            )}
          </FormField>
        )}

        {/* Row 5: Input Product */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Producto de Entrada" required error={errors.inputProduct?.message}>
            <FormInput
              {...register('inputProduct')}
              placeholder="Ej: Miel Cruda"
              error={errors.inputProduct?.message}
            />
          </FormField>
          <FormField label="Cantidad" required error={errors.inputQuantity?.message}>
            <FormInput
              {...register('inputQuantity')}
              type="number"
              step="0.01"
              placeholder="Ej: 50"
              error={errors.inputQuantity?.message}
            />
          </FormField>
          <FormField label="Unidad" required error={errors.inputUnit?.message}>
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
        </div>

        {/* Output Section */}
        <div className="border-t border-gray-100 pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Producto de Salida
            {status === 'completado' && (
              <span className="text-red-500 ml-1">*</span>
            )}
            {status === 'en_proceso' && (
              <span className="text-gray-400 text-xs font-normal ml-2">(completar al finalizar)</span>
            )}
          </h3>
        </div>

        {/* Row 6: Output Product */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Producto de Salida"
            required={status === 'completado'}
            error={errors.outputProduct?.message}
          >
            <FormInput
              {...register('outputProduct')}
              placeholder="Ej: Miel Filtrada"
              error={errors.outputProduct?.message}
            />
          </FormField>
          <FormField
            label="Cantidad"
            required={status === 'completado'}
            error={errors.outputQuantity?.message}
          >
            <FormInput
              {...register('outputQuantity')}
              type="number"
              step="0.01"
              placeholder="Ej: 48"
              error={errors.outputQuantity?.message}
            />
          </FormField>
          <FormField
            label="Unidad"
            required={status === 'completado'}
            error={errors.outputUnit?.message}
          >
            <Controller
              name="outputUnit"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value || ''}
                  onValueChange={field.onChange}
                  options={inputUnitOptions}
                  placeholder="Seleccionar..."
                  error={errors.outputUnit?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Proceso Final Checkbox */}
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
          <label className="flex items-start gap-3 cursor-pointer">
            <Controller
              name="isFinalProduct"
              control={control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
              )}
            />
            <div>
              <span className="font-medium text-amber-800">Proceso Final (Producto Terminado)</span>
              <p className="text-sm text-amber-600 mt-0.5">
                Marque si este es el ultimo proceso y el producto esta listo para venta.
                Los lotes marcados como "producto final" generan boletas RG06 y quedan habilitados para ventas (RG07).
              </p>
            </div>
          </label>
        </div>

        {/* Additional Info Section */}
        <div className="border-t border-gray-100 pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Informacion Adicional</h3>
        </div>

        {/* Row 7: Operator, Supervisor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Operador" error={errors.operator?.message}>
            <FormInput
              {...register('operator')}
              placeholder="Ej: Ana Lopez"
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
        </div>

        {/* Row 8: Storage Location and Completion Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Ubicacion de Almacenamiento" error={errors.storageLocation?.message}>
            <FormInput
              {...register('storageLocation')}
              placeholder="Ej: Bodega Fria A"
              error={errors.storageLocation?.message}
            />
          </FormField>
          {status === 'completado' && (
            <FormField label="Fecha de Finalizacion" error={errors.completionDate?.message}>
              <FormInput
                {...register('completionDate')}
                type="datetime-local"
                error={errors.completionDate?.message}
              />
            </FormField>
          )}
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
            {isEditing ? 'Guardar Cambios' : 'Crear Lote'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
