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
  accionApiculturaFormSchema,
  accionApiculturaTypeOptions,
  reproductionTypeOptions,
  feedingTypeOptions,
  applicationMethodOptions,
  type AccionApiculturaFormData,
} from '../../schemas/apicultura.schema';
import { useCreateAccion, useUpdateAccion } from '../../hooks/useApiculturaMutations';
import { useApiarios, useColmenas } from '../../hooks/useApicultura';
import type { AccionApicultura, Apiario, Colmena } from '../../types/apicultura.types';

interface AccionFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accion?: AccionApicultura | null;
  apiario?: Apiario | null;
  colmena?: Colmena | null;
  onSuccess?: () => void;
}

export default function AccionFormModal({
  open,
  onOpenChange,
  accion,
  apiario: preselectedApiario,
  colmena: preselectedColmena,
  onSuccess,
}: AccionFormModalProps) {
  const isEditing = !!accion;
  const createMutation = useCreateAccion();
  const updateMutation = useUpdateAccion();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const { data: apiarios } = useApiarios();
  const { data: colmenas } = useColmenas();

  const apiarioOptions = apiarios?.map(a => ({ value: a.id, label: a.name })) || [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<AccionApiculturaFormData>({
    resolver: zodResolver(accionApiculturaFormSchema),
    defaultValues: {
      apiarioId: '',
      colmenaId: '',
      type: undefined,
      date: '',
      description: '',
      performedBy: '',
      medication: '',
      dosage: '',
      applicationMethod: '',
      nextApplicationDate: '',
      panelCount: '',
      waxOrigin: '',
      feedingType: '',
      insumoUsed: '',
      quantity: '',
      unit: '',
      reproductionType: undefined,
      reproductionDetails: '',
      notes: '',
    },
  });

  const selectedApiarioId = watch('apiarioId');
  const selectedType = watch('type');

  const filteredColmenas = colmenas?.filter(c =>
    !selectedApiarioId || c.apiarioId === selectedApiarioId
  ) || [];
  const filteredColmenaOptions = filteredColmenas.map(c => ({
    value: c.id,
    label: `${c.code}${selectedApiarioId ? '' : ` - ${c.apiarioName}`}`
  }));

  useEffect(() => {
    if (open && accion) {
      reset({
        apiarioId: accion.apiarioId,
        colmenaId: accion.colmenaId || '',
        type: accion.type,
        date: accion.date
          ? new Date(accion.date).toISOString().split('T')[0]
          : '',
        description: accion.description,
        performedBy: accion.performedBy,
        medication: accion.medication || '',
        dosage: accion.dosage || '',
        applicationMethod: accion.applicationMethod || '',
        nextApplicationDate: accion.nextApplicationDate
          ? new Date(accion.nextApplicationDate).toISOString().split('T')[0]
          : '',
        panelCount: accion.panelCount?.toString() || '',
        waxOrigin: accion.waxOrigin || '',
        feedingType: accion.feedingType || '',
        insumoUsed: accion.insumoUsed || '',
        quantity: accion.quantity?.toString() || '',
        unit: accion.unit || '',
        reproductionType: accion.reproductionType || undefined,
        reproductionDetails: accion.reproductionDetails || '',
        notes: accion.notes || '',
      });
    } else if (open && !accion) {
      reset({
        apiarioId: preselectedApiario?.id || preselectedColmena?.apiarioId || '',
        colmenaId: preselectedColmena?.id || '',
        type: undefined,
        date: new Date().toISOString().split('T')[0],
        description: '',
        performedBy: '',
        medication: '',
        dosage: '',
        applicationMethod: '',
        nextApplicationDate: '',
        panelCount: '',
        waxOrigin: '',
        feedingType: '',
        insumoUsed: '',
        quantity: '',
        unit: '',
        reproductionType: undefined,
        reproductionDetails: '',
        notes: '',
      });
    }
  }, [open, accion, preselectedApiario, preselectedColmena, reset]);

  const onSubmit = async (data: AccionApiculturaFormData) => {
    try {
      if (isEditing && accion) {
        await updateMutation.mutateAsync({ id: accion.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving accion:', error);
    }
  };

  // Filter out revision and harvest types as they have specialized forms
  const filteredTypeOptions = accionApiculturaTypeOptions.filter(
    opt => opt.value !== 'revision' && opt.value !== 'harvest'
  );

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar Accion' : 'Nueva Accion'}
      description={
        isEditing
          ? 'Modifica los datos de la accion'
          : 'Registra una nueva accion apicola'
      }
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Row 1: Apiario and Colmena */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Apiario" required error={errors.apiarioId?.message}>
            <Controller
              name="apiarioId"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={apiarioOptions}
                  placeholder="Seleccionar apiario..."
                  error={errors.apiarioId?.message}
                  disabled={!!preselectedApiario}
                />
              )}
            />
          </FormField>
          <FormField label="Colmena (opcional)" error={errors.colmenaId?.message}>
            <Controller
              name="colmenaId"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={filteredColmenaOptions}
                  placeholder="Todas las colmenas"
                  error={errors.colmenaId?.message}
                  disabled={!!preselectedColmena || filteredColmenaOptions.length === 0}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 2: Type and Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Tipo de Accion" required error={errors.type?.message}>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={filteredTypeOptions}
                  placeholder="Seleccionar..."
                  error={errors.type?.message}
                />
              )}
            />
          </FormField>
          <FormField label="Fecha" required error={errors.date?.message}>
            <FormInput
              {...register('date')}
              type="date"
              error={errors.date?.message}
            />
          </FormField>
        </div>

        {/* Row 3: Performed By */}
        <FormField label="Realizado por" required error={errors.performedBy?.message}>
          <FormInput
            {...register('performedBy')}
            placeholder="Ej: Juan Perez"
            error={errors.performedBy?.message}
          />
        </FormField>

        {/* Row 4: Description */}
        <FormField label="Descripcion" required error={errors.description?.message}>
          <FormTextArea
            {...register('description')}
            placeholder="Describa la accion realizada..."
            rows={2}
            error={errors.description?.message}
          />
        </FormField>

        {/* Conditional Fields based on Type */}

        {/* Medication Fields */}
        {selectedType === 'medication' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Medicamento" error={errors.medication?.message}>
                <FormInput
                  {...register('medication')}
                  placeholder="Ej: Acido Oxalico"
                  error={errors.medication?.message}
                />
              </FormField>
              <FormField label="Dosis" error={errors.dosage?.message}>
                <FormInput
                  {...register('dosage')}
                  placeholder="Ej: 5ml por colmena"
                  error={errors.dosage?.message}
                />
              </FormField>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Metodo de Aplicacion" error={errors.applicationMethod?.message}>
                <Controller
                  name="applicationMethod"
                  control={control}
                  render={({ field }) => (
                    <FormSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      options={applicationMethodOptions}
                      placeholder="Seleccionar..."
                      error={errors.applicationMethod?.message}
                    />
                  )}
                />
              </FormField>
              <FormField label="Proxima Aplicacion" error={errors.nextApplicationDate?.message}>
                <FormInput
                  {...register('nextApplicationDate')}
                  type="date"
                  error={errors.nextApplicationDate?.message}
                />
              </FormField>
            </div>
          </>
        )}

        {/* Panel Change Fields */}
        {selectedType === 'panel_change' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Cantidad de Panales" error={errors.panelCount?.message}>
              <FormInput
                {...register('panelCount')}
                type="number"
                placeholder="Ej: 4"
                error={errors.panelCount?.message}
              />
            </FormField>
            <FormField label="Origen de Laminas de Cera" error={errors.waxOrigin?.message}>
              <FormInput
                {...register('waxOrigin')}
                placeholder="Ej: Proveedora Apicola Nacional"
                error={errors.waxOrigin?.message}
              />
            </FormField>
          </div>
        )}

        {/* Feeding Fields */}
        {selectedType === 'feeding' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Tipo de Alimento" error={errors.feedingType?.message}>
                <Controller
                  name="feedingType"
                  control={control}
                  render={({ field }) => (
                    <FormSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      options={feedingTypeOptions}
                      placeholder="Seleccionar..."
                      error={errors.feedingType?.message}
                    />
                  )}
                />
              </FormField>
              <FormField label="Insumo Utilizado" error={errors.insumoUsed?.message}>
                <FormInput
                  {...register('insumoUsed')}
                  placeholder="Ej: Azucar Cruda"
                  error={errors.insumoUsed?.message}
                />
              </FormField>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Cantidad" error={errors.quantity?.message}>
                <FormInput
                  {...register('quantity')}
                  type="number"
                  step="0.1"
                  placeholder="Ej: 10"
                  error={errors.quantity?.message}
                />
              </FormField>
              <FormField label="Unidad" error={errors.unit?.message}>
                <FormInput
                  {...register('unit')}
                  placeholder="Ej: kg"
                  error={errors.unit?.message}
                />
              </FormField>
            </div>
          </>
        )}

        {/* Reproduction Fields */}
        {selectedType === 'reproduction' && (
          <>
            <FormField label="Tipo de Reproduccion" error={errors.reproductionType?.message}>
              <Controller
                name="reproductionType"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    options={reproductionTypeOptions}
                    placeholder="Seleccionar..."
                    error={errors.reproductionType?.message}
                  />
                )}
              />
            </FormField>
            <FormField label="Detalles de Reproduccion" error={errors.reproductionDetails?.message}>
              <FormTextArea
                {...register('reproductionDetails')}
                placeholder="Detalles especificos del proceso..."
                rows={2}
                error={errors.reproductionDetails?.message}
              />
            </FormField>
          </>
        )}

        {/* Queen Change Fields */}
        {selectedType === 'queen_change' && (
          <FormField label="Detalles del Cambio" error={errors.reproductionDetails?.message}>
            <FormTextArea
              {...register('reproductionDetails')}
              placeholder="Origen de la nueva reina, proveedor, genetica..."
              rows={2}
              error={errors.reproductionDetails?.message}
            />
          </FormField>
        )}

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
            {isEditing ? 'Guardar Cambios' : 'Registrar Accion'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
