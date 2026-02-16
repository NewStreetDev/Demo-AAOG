import { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Trash2, Package, Wrench } from 'lucide-react';
import { Modal } from '../common/Modals';
import { FormInput, FormField, FormSelect, FormSelectWithAdd, FormTextArea, FormDatePicker, FormMultiSelect } from '../common/Forms';
import {
  generalPlanFormSchema,
  priorityOptions,
  planStatusOptions,
  moduleAssociationOptions,
  unidadOptions,
  currencyOptions,
  type GeneralPlanFormData,
} from '../../schemas/finca.schema';
import { useCreateGeneralPlan, useUpdateGeneralPlan } from '../../hooks/useFincaMutations';
import { useDivisions } from '../../hooks/useFinca';
import { useActionTypes, useAddActionType } from '../../hooks/useActionTypes';
import { useWorkers } from '../../hooks/useWorkers';
import type { GeneralPlan } from '../../types/finca.types';

interface GeneralPlanFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan?: GeneralPlan | null;
  defaultModule?: 'pecuario' | 'agro' | 'procesamiento' | 'general';
  preselectedDate?: Date | null;
  onSuccess?: () => void;
  // Annual planning props
  annualPlanId?: string;
  planPhase?: 'initial' | 'execution';
}

function formatDateForInput(date: Date | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

export default function GeneralPlanFormModal({
  open,
  onOpenChange,
  plan,
  defaultModule,
  preselectedDate,
  onSuccess,
  annualPlanId,
  planPhase,
}: GeneralPlanFormModalProps) {
  const isEditing = !!plan;

  const { data: divisions } = useDivisions();
  const { data: workers = [] } = useWorkers();
  const { data: actionTypes = [] } = useActionTypes();
  const addActionTypeMutation = useAddActionType();
  const createMutation = useCreateGeneralPlan();
  const updateMutation = useUpdateGeneralPlan();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  // Handle adding a new action type
  const handleAddActionType = async (label: string, value: string) => {
    try {
      await addActionTypeMutation.mutateAsync({ label, value });
    } catch (error) {
      console.error('Error adding action type:', error);
    }
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<GeneralPlanFormData>({
    resolver: zodResolver(generalPlanFormSchema),
    defaultValues: {
      title: '',
      description: '',
      actionType: 'otro',
      targetModule: undefined,
      targetDivisionId: '',
      scheduledDate: '',
      dueDate: '',
      estimatedDuration: '',
      estimatedCost: '',
      actualCost: '',
      currency: 'CRC',
      assignedTo: [],
      priority: 'medium',
      status: 'pending',
      notes: '',
      insumos: [],
      herramientas: [],
    },
  });

  // Field arrays para insumos y herramientas
  const { fields: insumosFields, append: appendInsumo, remove: removeInsumo } = useFieldArray({
    control,
    name: 'insumos',
  });

  const { fields: herramientasFields, append: appendHerramienta, remove: removeHerramienta } = useFieldArray({
    control,
    name: 'herramientas',
  });

  const selectedStatus = watch('status');

  // Estados locales para el formulario de agregar
  const [newInsumo, setNewInsumo] = useState({ nombre: '', cantidad: '', unidad: 'kg', costo: '' });
  const [newHerramienta, setNewHerramienta] = useState({ nombre: '', descripcion: '' });

  const handleAddInsumo = () => {
    if (newInsumo.nombre && newInsumo.cantidad && newInsumo.unidad) {
      appendInsumo({
        nombre: newInsumo.nombre,
        cantidad: parseFloat(newInsumo.cantidad),
        unidad: newInsumo.unidad,
        costo: newInsumo.costo ? parseFloat(newInsumo.costo) : undefined,
      });
      setNewInsumo({ nombre: '', cantidad: '', unidad: 'kg', costo: '' });
    }
  };

  const handleAddHerramienta = () => {
    if (newHerramienta.nombre) {
      appendHerramienta({
        nombre: newHerramienta.nombre,
        descripcion: newHerramienta.descripcion || undefined,
      });
      setNewHerramienta({ nombre: '', descripcion: '' });
    }
  };

  useEffect(() => {
    if (open && plan) {
      reset({
        title: plan.title,
        description: plan.description || '',
        actionType: plan.actionType,
        targetModule: plan.targetModule || undefined,
        targetDivisionId: plan.targetDivisionId || '',
        scheduledDate: formatDateForInput(plan.scheduledDate),
        dueDate: formatDateForInput(plan.dueDate),
        estimatedDuration: plan.estimatedDuration ? String(plan.estimatedDuration) : '',
        estimatedCost: plan.estimatedCost ? String(plan.estimatedCost) : '',
        actualCost: plan.actualCost ? String(plan.actualCost) : '',
        currency: plan.currency || 'CRC',
        assignedTo: plan.assignedTo || [],
        priority: plan.priority,
        status: plan.status,
        notes: plan.notes || '',
        insumos: plan.insumos || [],
        herramientas: plan.herramientas || [],
      });
      // Reset local state
      setNewInsumo({ nombre: '', cantidad: '', unidad: 'kg', costo: '' });
      setNewHerramienta({ nombre: '', descripcion: '' });
    } else if (open && !plan) {
      const dateToUse = preselectedDate
        ? formatDateForInput(preselectedDate)
        : new Date().toISOString().split('T')[0];
      reset({
        title: '',
        description: '',
        actionType: 'otro',
        targetModule: defaultModule || undefined,
        targetDivisionId: '',
        scheduledDate: dateToUse,
        dueDate: '',
        estimatedDuration: '',
        estimatedCost: '',
        actualCost: '',
        currency: 'CRC',
        assignedTo: [],
        priority: 'medium',
        status: 'pending',
        notes: '',
        insumos: [],
        herramientas: [],
      });
      // Reset local state
      setNewInsumo({ nombre: '', cantidad: '', unidad: 'kg', costo: '' });
      setNewHerramienta({ nombre: '', descripcion: '' });
    }
  }, [open, plan, defaultModule, preselectedDate, reset]);

  const onSubmit = async (data: GeneralPlanFormData) => {
    try {
      // Include annualPlanId and planPhase when creating new plans
      const submitData: GeneralPlanFormData = {
        ...data,
        ...(annualPlanId && !isEditing && { annualPlanId }),
        ...(planPhase && !isEditing && { planPhase }),
        ...(planPhase && !isEditing && { isFromPlanning: planPhase === 'initial' }),
      };

      if (isEditing && plan) {
        await updateMutation.mutateAsync({ id: plan.id, data: submitData });
      } else {
        await createMutation.mutateAsync(submitData);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving plan:', error);
    }
  };

  // Build worker options for multi-select
  const workerOptions = workers.map(w => ({ value: w.name, label: w.name }));

  // Build division options
  const divisionOptions = [
    { value: '', label: 'Ninguna' },
    ...(divisions || []).map(d => ({ value: d.id, label: `${d.name} (${d.code})` })),
  ];

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar Accion' : 'Nueva Accion Planificada'}
      description={isEditing ? 'Modifica los datos de la accion' : 'Programa una accion en el plan anual'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormField label="Titulo" required error={errors.title?.message}>
          <FormInput
            {...register('title')}
            placeholder="Ej: Mantenimiento de cercas"
            error={errors.title?.message}
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Tipo de Accion" required error={errors.actionType?.message}>
            <Controller
              name="actionType"
              control={control}
              render={({ field }) => (
                <FormSelectWithAdd
                  value={field.value}
                  onValueChange={field.onChange}
                  options={actionTypes}
                  placeholder="Seleccionar tipo..."
                  error={errors.actionType?.message}
                  onAddNew={handleAddActionType}
                  addButtonLabel="+ Agregar tipo"
                  addModalTitle="Nuevo Tipo de Accion"
                />
              )}
            />
          </FormField>

          <FormField label="Modulo Destino">
            <Controller
              name="targetModule"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value || ''}
                  onValueChange={field.onChange}
                  options={[
                    { value: '', label: 'General (todos)' },
                    ...moduleAssociationOptions,
                  ]}
                  placeholder="Seleccionar modulo..."
                />
              )}
            />
          </FormField>
        </div>

        <FormField label="Division Especifica">
          <Controller
            name="targetDivisionId"
            control={control}
            render={({ field }) => (
              <FormSelect
                value={field.value || ''}
                onValueChange={field.onChange}
                options={divisionOptions}
                placeholder="Seleccionar division..."
              />
            )}
          />
        </FormField>

        <FormField label="Descripcion">
          <FormTextArea
            {...register('description')}
            placeholder="Descripcion detallada del plan..."
            rows={3}
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Fecha Programada" required error={errors.scheduledDate?.message}>
            <FormDatePicker
              {...register('scheduledDate')}
              error={errors.scheduledDate?.message}
            />
          </FormField>

          <FormField label="Fecha Limite">
            <FormDatePicker
              {...register('dueDate')}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField label="Duracion Estimada (horas)">
            <FormInput
              type="number"
              step="0.5"
              {...register('estimatedDuration')}
              placeholder="Ej: 8"
            />
          </FormField>

          <FormField label="Moneda">
            <Controller
              name="currency"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value || 'CRC'}
                  onValueChange={field.onChange}
                  options={currencyOptions}
                  placeholder="Moneda"
                />
              )}
            />
          </FormField>

          <FormField label="Costo Estimado">
            <FormInput
              type="number"
              {...register('estimatedCost')}
              placeholder="Ej: 150000"
            />
          </FormField>

          {selectedStatus === 'completed' && (
            <FormField label="Costo Real">
              <FormInput
                type="number"
                {...register('actualCost')}
                placeholder="Ej: 145000"
              />
            </FormField>
          )}
        </div>

        <FormField label="Asignado a">
          <Controller
            name="assignedTo"
            control={control}
            render={({ field }) => (
              <FormMultiSelect
                value={field.value || []}
                onValueChange={field.onChange}
                options={workerOptions}
                placeholder="Seleccionar responsables..."
              />
            )}
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Prioridad" required error={errors.priority?.message}>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={priorityOptions}
                  placeholder="Seleccionar prioridad..."
                  error={errors.priority?.message}
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
                  options={planStatusOptions}
                  placeholder="Seleccionar estado..."
                  error={errors.status?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Seccion de Insumos Utilizados */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-5 h-5 text-green-600" />
            <h4 className="font-medium text-gray-900">Insumos Utilizados</h4>
          </div>

          {/* Lista de insumos agregados */}
          {insumosFields.length > 0 && (
            <div className="space-y-2 mb-3">
              {insumosFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                  <div className="flex-1 text-sm">
                    <span className="font-medium">{field.nombre}</span>
                    <span className="text-gray-600"> - {field.cantidad} {field.unidad}</span>
                    {field.costo && (
                      <span className="text-gray-500"> (${field.costo.toLocaleString()})</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeInsumo(index)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Formulario para agregar nuevo insumo */}
          <div className="grid grid-cols-12 gap-2 items-end">
            <div className="col-span-4">
              <label className="text-xs font-medium text-gray-500 mb-1 block">Nombre</label>
              <input
                type="text"
                value={newInsumo.nombre}
                onChange={(e) => setNewInsumo({ ...newInsumo, nombre: e.target.value })}
                placeholder="Nombre del insumo"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-gray-500 mb-1 block">Cantidad</label>
              <input
                type="number"
                value={newInsumo.cantidad}
                onChange={(e) => setNewInsumo({ ...newInsumo, cantidad: e.target.value })}
                placeholder="Cantidad"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-gray-500 mb-1 block">Unidad</label>
              <select
                value={newInsumo.unidad}
                onChange={(e) => setNewInsumo({ ...newInsumo, unidad: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {unidadOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-gray-500 mb-1 block">Costo</label>
              <input
                type="number"
                value={newInsumo.costo}
                onChange={(e) => setNewInsumo({ ...newInsumo, costo: e.target.value })}
                placeholder="Costo"
                min="0"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div className="col-span-2">
              <button
                type="button"
                onClick={handleAddInsumo}
                disabled={!newInsumo.nombre || !newInsumo.cantidad}
                className="w-full px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Agregar
              </button>
            </div>
          </div>
        </div>

        {/* Seccion de Herramientas Utilizadas */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Wrench className="w-5 h-5 text-blue-600" />
            <h4 className="font-medium text-gray-900">Herramientas Utilizadas</h4>
          </div>

          {/* Lista de herramientas agregadas */}
          {herramientasFields.length > 0 && (
            <div className="space-y-2 mb-3">
              {herramientasFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                  <div className="flex-1 text-sm">
                    <span className="font-medium">{field.nombre}</span>
                    {field.descripcion && (
                      <span className="text-gray-600"> - {field.descripcion}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeHerramienta(index)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Formulario para agregar nueva herramienta */}
          <div className="grid grid-cols-12 gap-2 items-end">
            <div className="col-span-5">
              <label className="text-xs font-medium text-gray-500 mb-1 block">Nombre</label>
              <input
                type="text"
                value={newHerramienta.nombre}
                onChange={(e) => setNewHerramienta({ ...newHerramienta, nombre: e.target.value })}
                placeholder="Nombre de la herramienta"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="col-span-5">
              <label className="text-xs font-medium text-gray-500 mb-1 block">Descripcion</label>
              <input
                type="text"
                value={newHerramienta.descripcion}
                onChange={(e) => setNewHerramienta({ ...newHerramienta, descripcion: e.target.value })}
                placeholder="Descripcion (opcional)"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="col-span-2">
              <button
                type="button"
                onClick={handleAddHerramienta}
                disabled={!newHerramienta.nombre}
                className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Agregar
              </button>
            </div>
          </div>
        </div>

        <FormField label="Notas">
          <FormTextArea
            {...register('notes')}
            placeholder="Notas adicionales..."
            rows={2}
          />
        </FormField>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="btn-secondary"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary inline-flex items-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEditing ? 'Guardar Cambios' : 'Crear Accion'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
