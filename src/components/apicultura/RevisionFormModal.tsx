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
  FormCheckbox,
} from '../common/Forms';
import {
  revisionFormSchema,
  revisionTypeOptions,
  postureStateOptions,
  amountLevelOptions,
  populationOptions,
  weightOptions,
  type RevisionFormData,
} from '../../schemas/apicultura.schema';
import { useCreateRevision, useUpdateRevision } from '../../hooks/useApiculturaMutations';
import { useApiarios, useColmenas } from '../../hooks/useApicultura';
import type { Revision, Apiario, Colmena } from '../../types/apicultura.types';

interface RevisionFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  revision?: Revision | null;
  apiario?: Apiario | null;
  colmena?: Colmena | null;
  onSuccess?: () => void;
}

export default function RevisionFormModal({
  open,
  onOpenChange,
  revision,
  apiario: preselectedApiario,
  colmena: preselectedColmena,
  onSuccess,
}: RevisionFormModalProps) {
  const isEditing = !!revision;
  const createMutation = useCreateRevision();
  const updateMutation = useUpdateRevision();
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
  } = useForm<RevisionFormData>({
    resolver: zodResolver(revisionFormSchema),
    defaultValues: {
      apiarioId: '',
      colmenaId: '',
      type: 'general',
      date: '',
      inspector: '',
      generalState: '',
      queenAge: '',
      queenChanged: false,
      queenPresent: true,
      postureState: undefined,
      sanity: '',
      weight: undefined,
      honeyMaturity: '',
      population: undefined,
      broodAmount: undefined,
      pollenReserves: undefined,
      nectarReserves: undefined,
      comments: '',
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
    if (open && revision) {
      reset({
        apiarioId: revision.apiarioId,
        colmenaId: revision.colmenaId || '',
        type: revision.type,
        date: revision.date
          ? new Date(revision.date).toISOString().split('T')[0]
          : '',
        inspector: revision.inspector,
        generalState: revision.generalState.toString(),
        queenAge: revision.queenAge?.toString() || '',
        queenChanged: revision.queenChanged,
        queenPresent: revision.queenPresent,
        postureState: revision.postureState,
        sanity: revision.sanity.toString(),
        weight: revision.weight,
        honeyMaturity: revision.honeyMaturity.toString(),
        population: revision.population,
        broodAmount: revision.broodAmount,
        pollenReserves: revision.foodReserves.pollen,
        nectarReserves: revision.foodReserves.nectar,
        comments: revision.comments || '',
      });
    } else if (open && !revision) {
      reset({
        apiarioId: preselectedApiario?.id || preselectedColmena?.apiarioId || '',
        colmenaId: preselectedColmena?.id || '',
        type: preselectedColmena ? 'individual' : 'general',
        date: new Date().toISOString().split('T')[0],
        inspector: '',
        generalState: '',
        queenAge: preselectedColmena?.queenAge?.toString() || '',
        queenChanged: false,
        queenPresent: preselectedColmena?.queenStatus !== 'absent',
        postureState: undefined,
        sanity: '',
        weight: preselectedColmena?.weight || undefined,
        honeyMaturity: preselectedColmena?.honeyMaturity?.toString() || '',
        population: preselectedColmena?.population || undefined,
        broodAmount: undefined,
        pollenReserves: undefined,
        nectarReserves: undefined,
        comments: '',
      });
    }
  }, [open, revision, preselectedApiario, preselectedColmena, reset]);

  const onSubmit = async (data: RevisionFormData) => {
    try {
      if (isEditing && revision) {
        await updateMutation.mutateAsync({ id: revision.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving revision:', error);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar Revision' : 'Nueva Revision'}
      description={
        isEditing
          ? 'Modifica los datos de la revision'
          : 'Registra una nueva revision apicola'
      }
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Section: Ubicacion */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Ubicacion y Tipo</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <FormField label="Tipo de Revision" required error={errors.type?.message}>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    options={revisionTypeOptions}
                    placeholder="Seleccionar..."
                    error={errors.type?.message}
                  />
                )}
              />
            </FormField>
            {selectedType === 'individual' && (
              <FormField label="Colmena" error={errors.colmenaId?.message}>
                <Controller
                  name="colmenaId"
                  control={control}
                  render={({ field }) => (
                    <FormSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      options={filteredColmenaOptions}
                      placeholder="Seleccionar colmena..."
                      error={errors.colmenaId?.message}
                      disabled={!!preselectedColmena || filteredColmenaOptions.length === 0}
                    />
                  )}
                />
              </FormField>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <FormField label="Fecha" required error={errors.date?.message}>
              <FormInput
                {...register('date')}
                type="date"
                error={errors.date?.message}
              />
            </FormField>
            <FormField label="Inspector" required error={errors.inspector?.message}>
              <FormInput
                {...register('inspector')}
                placeholder="Ej: Juan Perez"
                error={errors.inspector?.message}
              />
            </FormField>
          </div>
        </div>

        {/* Section: Estado General */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Estado General</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Estado General (1-10)" required error={errors.generalState?.message}>
              <FormInput
                {...register('generalState')}
                type="number"
                min="1"
                max="10"
                placeholder="Ej: 8"
                error={errors.generalState?.message}
              />
            </FormField>
            <FormField label="Sanidad (1-10)" required error={errors.sanity?.message}>
              <FormInput
                {...register('sanity')}
                type="number"
                min="1"
                max="10"
                placeholder="Ej: 9"
                error={errors.sanity?.message}
              />
            </FormField>
            <FormField label="Estado de Postura" required error={errors.postureState?.message}>
              <Controller
                name="postureState"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    options={postureStateOptions}
                    placeholder="Seleccionar..."
                    error={errors.postureState?.message}
                  />
                )}
              />
            </FormField>
          </div>
        </div>

        {/* Section: Reina */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Estado de la Reina</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Edad de la Reina (meses)" error={errors.queenAge?.message}>
              <FormInput
                {...register('queenAge')}
                type="number"
                min="0"
                placeholder="Ej: 12"
                error={errors.queenAge?.message}
              />
            </FormField>
            <div className="flex items-center gap-6 pt-6">
              <Controller
                name="queenPresent"
                control={control}
                render={({ field }) => (
                  <FormCheckbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    label="Reina Presente"
                  />
                )}
              />
              <Controller
                name="queenChanged"
                control={control}
                render={({ field }) => (
                  <FormCheckbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    label="Cambio de Reina"
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Section: Peso y Madurez */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Peso y Madurez de Miel</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Peso de Colmena (Tanteo)" required error={errors.weight?.message}>
              <Controller
                name="weight"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    options={weightOptions}
                    placeholder="Seleccionar..."
                    error={errors.weight?.message}
                  />
                )}
              />
            </FormField>
            <FormField label="Madurez de Miel (%)" required error={errors.honeyMaturity?.message}>
              <FormInput
                {...register('honeyMaturity')}
                type="number"
                min="0"
                max="100"
                placeholder="Ej: 75"
                error={errors.honeyMaturity?.message}
              />
            </FormField>
          </div>
        </div>

        {/* Section: Revision Interna */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Revision Interna</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Poblacion de Colmena" required error={errors.population?.message}>
              <Controller
                name="population"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    options={populationOptions}
                    placeholder="Seleccionar..."
                    error={errors.population?.message}
                  />
                )}
              />
            </FormField>
            <FormField label="Cantidad de Cria por Nacer" required error={errors.broodAmount?.message}>
              <Controller
                name="broodAmount"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    options={amountLevelOptions}
                    placeholder="Seleccionar..."
                    error={errors.broodAmount?.message}
                  />
                )}
              />
            </FormField>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <FormField label="Reservas de Polen" required error={errors.pollenReserves?.message}>
              <Controller
                name="pollenReserves"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    options={amountLevelOptions}
                    placeholder="Seleccionar..."
                    error={errors.pollenReserves?.message}
                  />
                )}
              />
            </FormField>
            <FormField label="Reservas de Nectar" required error={errors.nectarReserves?.message}>
              <Controller
                name="nectarReserves"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    options={amountLevelOptions}
                    placeholder="Seleccionar..."
                    error={errors.nectarReserves?.message}
                  />
                )}
              />
            </FormField>
          </div>
        </div>

        {/* Comments */}
        <FormField label="Comentarios" error={errors.comments?.message}>
          <FormTextArea
            {...register('comments')}
            placeholder="Observaciones adicionales sobre la revision..."
            rows={3}
            error={errors.comments?.message}
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
            {isEditing ? 'Guardar Cambios' : 'Registrar Revision'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
