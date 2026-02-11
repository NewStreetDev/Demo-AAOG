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
  FormCheckbox,
} from '../common/Forms';
import {
  beehiveFormSchema,
  beehiveTypeOptions,
  beehiveStatusOptions,
  beehiveStrengthOptions,
  beehiveTemperamentOptions,
  queenStatusOptions,
  queenOriginOptions,
  beehiveEntryReasonOptions,
  beehiveExitReasonOptions,
  type BeehiveFormData,
} from '../../schemas/pecuario.schema';
import { useCreateBeehive, useUpdateBeehive } from '../../hooks/usePecuarioMutations';
import { useDivisions } from '../../hooks/useFinca';
import { useBeehives } from '../../hooks/usePecuario';
import type { Beehive } from '../../types/pecuario.types';

interface BeehiveFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  beehive?: Beehive | null;
  onSuccess?: () => void;
}

function formatDateForInput(date: Date | string | undefined): string {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().split('T')[0];
}

export default function BeehiveFormModal({
  open,
  onOpenChange,
  beehive,
  onSuccess,
}: BeehiveFormModalProps) {
  const isEditing = !!beehive;
  const createMutation = useCreateBeehive();
  const updateMutation = useUpdateBeehive();
  const { data: divisions } = useDivisions();
  const { data: beehives } = useBeehives();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  // Build apiario options from divisions (filter by type 'apiario')
  const apiaryOptions = (divisions || [])
    .filter(d => d.type === 'apiario' && d.status === 'active')
    .map(d => ({ value: d.id, label: d.name }));

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<BeehiveFormData>({
    resolver: zodResolver(beehiveFormSchema),
    defaultValues: {
      code: '',
      name: '',
      apiaryId: '',
      position: '',
      type: undefined,
      frameCount: '10',
      superCount: '0',
      hasQueenExcluder: false,
      status: 'active',
      strength: undefined,
      temperament: undefined,
      queenStatus: undefined,
      queenMarked: false,
      queenColor: '',
      queenAge: '',
      queenOrigin: undefined,
      installationDate: '',
      entryReason: undefined,
      parentHiveCode: '',
      exitDate: '',
      exitReason: undefined,
      notes: '',
    },
  });

  // Watch entryReason to conditionally show parent hive field
  const selectedEntryReason = watch('entryReason');

  // Build parent hive options (only for 'split' entry reason)
  const parentHiveOptions = (beehives || [])
    .filter(b => b.id !== beehive?.id) // Exclude current beehive
    .map(b => ({ value: b.code, label: `${b.code}${b.name ? ` - ${b.name}` : ''}` }));

  useEffect(() => {
    if (open && beehive) {
      reset({
        code: beehive.code,
        name: beehive.name || '',
        apiaryId: beehive.apiaryId,
        position: beehive.position || '',
        type: beehive.type,
        frameCount: beehive.frameCount.toString(),
        superCount: beehive.superCount.toString(),
        hasQueenExcluder: beehive.hasQueenExcluder,
        status: beehive.status,
        strength: beehive.strength,
        temperament: beehive.temperament,
        queenStatus: beehive.queenStatus,
        queenMarked: beehive.queenMarked,
        queenColor: beehive.queenColor || '',
        queenAge: beehive.queenAge?.toString() || '',
        queenOrigin: beehive.queenOrigin,
        installationDate: formatDateForInput(beehive.installationDate),
        entryReason: beehive.entryReason,
        parentHiveCode: beehive.parentHiveCode || '',
        exitDate: formatDateForInput(beehive.exitDate),
        exitReason: beehive.exitReason,
        notes: beehive.notes || '',
      });
    } else if (open && !beehive) {
      reset({
        code: '',
        name: '',
        apiaryId: '',
        position: '',
        type: undefined,
        frameCount: '10',
        superCount: '0',
        hasQueenExcluder: false,
        status: 'active',
        strength: undefined,
        temperament: undefined,
        queenStatus: undefined,
        queenMarked: false,
        queenColor: '',
        queenAge: '',
        queenOrigin: undefined,
        installationDate: '',
        entryReason: undefined,
        parentHiveCode: '',
        exitDate: '',
        exitReason: undefined,
        notes: '',
      });
    }
  }, [open, beehive, reset]);

  const onSubmit = async (data: BeehiveFormData) => {
    try {
      if (isEditing && beehive) {
        await updateMutation.mutateAsync({ id: beehive.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving beehive:', error);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar Colmena' : 'Nueva Colmena'}
      description={
        isEditing
          ? 'Modifica los datos de la colmena'
          : 'Registra una nueva colmena en el inventario'
      }
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Row 1: Code, Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Código" required error={errors.code?.message}>
            <FormInput
              {...register('code')}
              placeholder="Ej: COL-001"
              error={errors.code?.message}
            />
          </FormField>
          <FormField label="Nombre" error={errors.name?.message}>
            <FormInput
              {...register('name')}
              placeholder="Ej: Reina Dorada"
              error={errors.name?.message}
            />
          </FormField>
        </div>

        {/* Row 2: Type, Apiary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Tipo de Colmena" required error={errors.type?.message}>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={beehiveTypeOptions}
                  placeholder="Seleccionar tipo..."
                  error={errors.type?.message}
                />
              )}
            />
          </FormField>
          <FormField label="Apiario" required error={errors.apiaryId?.message}>
            <Controller
              name="apiaryId"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={apiaryOptions}
                  placeholder="Seleccionar apiario..."
                  error={errors.apiaryId?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 3: Frames, Supers, Position */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Marcos" required error={errors.frameCount?.message}>
            <FormInput
              {...register('frameCount')}
              type="number"
              placeholder="Ej: 10"
              error={errors.frameCount?.message}
            />
          </FormField>
          <FormField label="Alzas" required error={errors.superCount?.message}>
            <FormInput
              {...register('superCount')}
              type="number"
              placeholder="Ej: 2"
              error={errors.superCount?.message}
            />
          </FormField>
          <FormField label="Posición" error={errors.position?.message}>
            <FormInput
              {...register('position')}
              placeholder="Ej: Fila 1, #3"
              error={errors.position?.message}
            />
          </FormField>
        </div>

        {/* Row 4: Status, Strength, Temperament */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Estado" required error={errors.status?.message}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={beehiveStatusOptions}
                  placeholder="Seleccionar..."
                  error={errors.status?.message}
                />
              )}
            />
          </FormField>
          <FormField label="Fortaleza" required error={errors.strength?.message}>
            <Controller
              name="strength"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={beehiveStrengthOptions}
                  placeholder="Seleccionar..."
                  error={errors.strength?.message}
                />
              )}
            />
          </FormField>
          <FormField label="Temperamento" required error={errors.temperament?.message}>
            <Controller
              name="temperament"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={beehiveTemperamentOptions}
                  placeholder="Seleccionar..."
                  error={errors.temperament?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 5: Queen Excluder checkbox */}
        <Controller
          name="hasQueenExcluder"
          control={control}
          render={({ field }) => (
            <FormCheckbox
              checked={field.value}
              onCheckedChange={field.onChange}
              label="Tiene excluidor de reina"
            />
          )}
        />

        {/* Queen Section */}
        <div className="border-t border-gray-100 pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Información de la Reina</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Estado de la Reina" required error={errors.queenStatus?.message}>
              <Controller
                name="queenStatus"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    options={queenStatusOptions}
                    placeholder="Seleccionar..."
                    error={errors.queenStatus?.message}
                  />
                )}
              />
            </FormField>
            <FormField label="Edad (años)" error={errors.queenAge?.message}>
              <FormInput
                {...register('queenAge')}
                type="number"
                placeholder="Ej: 1"
                error={errors.queenAge?.message}
              />
            </FormField>
            <FormField label="Origen de la Reina" error={errors.queenOrigin?.message}>
              <Controller
                name="queenOrigin"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    value={field.value || ''}
                    onValueChange={field.onChange}
                    options={queenOriginOptions}
                    placeholder="Seleccionar..."
                  />
                )}
              />
            </FormField>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Controller
              name="queenMarked"
              control={control}
              render={({ field }) => (
                <FormCheckbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  label="Reina marcada"
                />
              )}
            />
            <FormField label="Color de marca" error={errors.queenColor?.message}>
              <FormInput
                {...register('queenColor')}
                placeholder="Ej: Azul"
                error={errors.queenColor?.message}
              />
            </FormField>
          </div>
        </div>

        {/* Row 6: Installation Date, Entry Reason */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Fecha de Instalación" required error={errors.installationDate?.message}>
            <FormDatePicker
              {...register('installationDate')}
              error={errors.installationDate?.message}
            />
          </FormField>
          <FormField label="Razón de Entrada" required error={errors.entryReason?.message}>
            <Controller
              name="entryReason"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={beehiveEntryReasonOptions}
                  placeholder="Seleccionar..."
                  error={errors.entryReason?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 7: Parent Hive (conditional - only for split) */}
        {selectedEntryReason === 'split' && (
          <FormField label="Colmena Madre" error={errors.parentHiveCode?.message}>
            <Controller
              name="parentHiveCode"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value || ''}
                  onValueChange={field.onChange}
                  options={parentHiveOptions}
                  placeholder="Seleccionar colmena madre..."
                />
              )}
            />
          </FormField>
        )}

        {/* Row 8: Exit Date, Exit Reason */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Fecha de Salida" error={errors.exitDate?.message}>
            <FormDatePicker
              {...register('exitDate')}
              error={errors.exitDate?.message}
            />
          </FormField>
          <FormField label="Razón de Salida" error={errors.exitReason?.message}>
            <Controller
              name="exitReason"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value || ''}
                  onValueChange={field.onChange}
                  options={beehiveExitReasonOptions}
                  placeholder="Seleccionar..."
                />
              )}
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
            {isEditing ? 'Guardar Cambios' : 'Registrar Colmena'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
