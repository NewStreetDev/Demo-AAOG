import { useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Trash2, Package, Wrench } from 'lucide-react';
import { Modal } from '../common/Modals';
import {
  FormInput,
  FormField,
  FormSelect,
  FormTextArea,
} from '../common/Forms';
import {
  agroActionFormSchema,
  agroActionTypeOptions,
  agroActionStatusOptions,
  agroActionPriorityOptions,
  weatherConditionOptions,
  type AgroActionFormData,
} from '../../schemas/agro.schema';
import { unidadOptions } from '../../schemas/finca.schema';
import { useCreateAgroAction, useUpdateAgroAction } from '../../hooks/useAgroMutations';
import { useLotes, useCrops } from '../../hooks/useAgro';
import type { AgroAction, Lote, Crop } from '../../types/agro.types';

interface AgroActionFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action?: AgroAction | null;
  lote?: Lote | null;
  crop?: Crop | null;
  onSuccess?: () => void;
}

export default function AgroActionFormModal({
  open,
  onOpenChange,
  action,
  lote: preselectedLote,
  crop: preselectedCrop,
  onSuccess,
}: AgroActionFormModalProps) {
  const isEditing = !!action;
  const createMutation = useCreateAgroAction();
  const updateMutation = useUpdateAgroAction();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const { data: lotes } = useLotes();
  const { data: crops } = useCrops();

  const loteOptions = lotes?.map(l => ({ value: l.id, label: `${l.code} - ${l.name}` })) || [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<AgroActionFormData>({
    resolver: zodResolver(agroActionFormSchema) as never,
    defaultValues: {
      loteId: '',
      cropId: '',
      type: undefined,
      date: '',
      status: 'pending',
      priority: undefined,
      description: '',
      insumos: [],
      herramientas: [],
      insumoUsed: '',
      quantity: '',
      unit: '',
      cost: '',
      performedBy: '',
      weatherConditions: '',
      annualPlanId: '',
      planPhase: undefined,
      linkedPlanId: '',
      isFromPlanning: false,
      notes: '',
    },
  });

  const { fields: insumoFields, append: appendInsumo, remove: removeInsumo } = useFieldArray({
    control,
    name: 'insumos',
  });

  const { fields: herramientaFields, append: appendHerramienta, remove: removeHerramienta } = useFieldArray({
    control,
    name: 'herramientas',
  });

  const selectedLoteId = watch('loteId');

  const filteredCrops = crops?.filter(c =>
    !selectedLoteId || c.loteId === selectedLoteId
  ) || [];
  const filteredCropOptions = [
    { value: '', label: 'Sin cultivo especifico' },
    ...filteredCrops.map(c => ({
      value: c.id,
      label: `${c.name} - ${c.variety}${selectedLoteId ? '' : ` (${c.loteName})`}`
    }))
  ];

  useEffect(() => {
    if (open && action) {
      reset({
        loteId: action.loteId,
        cropId: action.cropId || '',
        type: action.type,
        date: action.date
          ? new Date(action.date).toISOString().split('T')[0]
          : '',
        status: action.status,
        priority: action.priority,
        description: action.description,
        insumos: action.insumos?.map(i => ({
          nombre: i.nombre,
          cantidad: i.cantidad.toString(),
          unidad: i.unidad,
          costo: i.costo?.toString() || '',
        })) || [],
        herramientas: action.herramientas?.map(h => ({
          nombre: h.nombre,
          descripcion: h.descripcion || '',
        })) || [],
        insumoUsed: action.insumoUsed || '',
        quantity: action.quantity?.toString() || '',
        unit: action.unit || '',
        cost: action.cost?.toString() || '',
        performedBy: action.performedBy,
        weatherConditions: action.weatherConditions || '',
        annualPlanId: action.annualPlanId || '',
        planPhase: action.planPhase,
        linkedPlanId: action.linkedPlanId || '',
        isFromPlanning: action.isFromPlanning || false,
        notes: action.notes || '',
      });
    } else if (open && !action) {
      reset({
        loteId: preselectedLote?.id || preselectedCrop?.loteId || '',
        cropId: preselectedCrop?.id || '',
        type: undefined,
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        priority: undefined,
        description: '',
        insumos: [],
        herramientas: [],
        insumoUsed: '',
        quantity: '',
        unit: '',
        cost: '',
        performedBy: '',
        weatherConditions: '',
        annualPlanId: '',
        planPhase: undefined,
        linkedPlanId: '',
        isFromPlanning: false,
        notes: '',
      });
    }
  }, [open, action, preselectedLote, preselectedCrop, reset]);

  const onSubmit = async (data: AgroActionFormData) => {
    try {
      if (isEditing && action) {
        await updateMutation.mutateAsync({ id: action.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving action:', error);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar Accion Agricola' : 'Nueva Accion Agricola'}
      description={
        isEditing
          ? 'Modifica los datos de la accion'
          : 'Registra una nueva accion agricola'
      }
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Row 1: Lote and Crop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Lote" required error={errors.loteId?.message}>
            <Controller
              name="loteId"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={loteOptions}
                  placeholder="Seleccionar lote..."
                  error={errors.loteId?.message}
                  disabled={!!preselectedLote}
                />
              )}
            />
          </FormField>
          <FormField label="Cultivo (opcional)" error={errors.cropId?.message}>
            <Controller
              name="cropId"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={filteredCropOptions}
                  placeholder="Seleccionar cultivo..."
                  error={errors.cropId?.message}
                  disabled={!!preselectedCrop || filteredCropOptions.length <= 1}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 2: Type, Date, Status, Priority */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField label="Tipo de Accion" required error={errors.type?.message}>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={agroActionTypeOptions}
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
          <FormField label="Estado" required error={errors.status?.message}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={agroActionStatusOptions}
                  placeholder="Seleccionar..."
                  error={errors.status?.message}
                />
              )}
            />
          </FormField>
          <FormField label="Prioridad" error={errors.priority?.message}>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={agroActionPriorityOptions}
                  placeholder="Seleccionar..."
                  error={errors.priority?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 3: Performed By and Weather */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Realizado por" required error={errors.performedBy?.message}>
            <FormInput
              {...register('performedBy')}
              placeholder="Ej: Juan Perez"
              error={errors.performedBy?.message}
            />
          </FormField>
          <FormField label="Condiciones Climaticas" error={errors.weatherConditions?.message}>
            <Controller
              name="weatherConditions"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={weatherConditionOptions}
                  placeholder="Seleccionar..."
                  error={errors.weatherConditions?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 4: Description */}
        <FormField label="Descripcion" required error={errors.description?.message}>
          <FormTextArea
            {...register('description')}
            placeholder="Describa la accion realizada..."
            rows={2}
            error={errors.description?.message}
          />
        </FormField>

        {/* Insumos - Dynamic Array */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Insumos Utilizados
            </label>
            <button
              type="button"
              onClick={() => appendInsumo({ nombre: '', cantidad: '', unidad: '', costo: '' })}
              className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Agregar Insumo
            </button>
          </div>

          {insumoFields.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No hay insumos registrados</p>
          ) : (
            <div className="space-y-3">
              {insumoFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-2 items-end p-3 bg-gray-50 rounded-lg">
                  <div className="col-span-12 md:col-span-4">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Nombre</label>
                    <FormInput
                      {...register(`insumos.${index}.nombre`)}
                      placeholder="Nombre del insumo"
                      error={errors.insumos?.[index]?.nombre?.message}
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Cantidad</label>
                    <FormInput
                      {...register(`insumos.${index}.cantidad`)}
                      type="number"
                      step="0.1"
                      placeholder="Cantidad"
                      error={errors.insumos?.[index]?.cantidad?.message}
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Unidad</label>
                    <select
                      {...register(`insumos.${index}.unidad`)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Seleccionar</option>
                      {unidadOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-3 md:col-span-3">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Costo</label>
                    <FormInput
                      {...register(`insumos.${index}.costo`)}
                      type="number"
                      step="100"
                      placeholder="Costo"
                      error={errors.insumos?.[index]?.costo?.message}
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      type="button"
                      onClick={() => removeInsumo(index)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Herramientas - Dynamic Array */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Herramientas Utilizadas
            </label>
            <button
              type="button"
              onClick={() => appendHerramienta({ nombre: '', descripcion: '' })}
              className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Agregar Herramienta
            </button>
          </div>

          {herramientaFields.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No hay herramientas registradas</p>
          ) : (
            <div className="space-y-3">
              {herramientaFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-2 items-end p-3 bg-gray-50 rounded-lg">
                  <div className="col-span-12 md:col-span-5">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Nombre</label>
                    <FormInput
                      {...register(`herramientas.${index}.nombre`)}
                      placeholder="Nombre de la herramienta"
                      error={errors.herramientas?.[index]?.nombre?.message}
                    />
                  </div>
                  <div className="col-span-11 md:col-span-6">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Descripcion</label>
                    <FormInput
                      {...register(`herramientas.${index}.descripcion`)}
                      placeholder="Descripcion (opcional)"
                      error={errors.herramientas?.[index]?.descripcion?.message}
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      type="button"
                      onClick={() => removeHerramienta(index)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
            {isEditing ? 'Guardar Cambios' : 'Registrar Accion'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
