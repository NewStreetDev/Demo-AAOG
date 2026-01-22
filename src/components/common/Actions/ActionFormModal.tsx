import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { Modal } from '../Modals';
import {
  FormInput,
  FormField,
  FormSelect,
  FormDatePicker,
  FormTextArea,
} from '../Forms';
import {
  actionFormSchema,
  moduleOptions,
  getActionTypesForModule,
  type ActionFormData,
} from '../../../schemas/action.schema';
import { useCreateAction, useUpdateAction } from '../../../hooks/useActions';
import { useWorkers } from '../../../hooks/useTrabajadores';
import { useInsumos } from '../../../hooks/useInsumos';
import type { GenericAction, ActionInsumo, SystemModule } from '../../../types/common.types';

interface ActionFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action?: GenericAction | null;
  defaultModule?: SystemModule;
  defaultTargetId?: string;
  defaultTargetName?: string;
  onSuccess?: () => void;
}

function formatDateForInput(date: Date | string | undefined): string {
  if (!date) return new Date().toISOString().split('T')[0];
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().split('T')[0];
}

export default function ActionFormModal({
  open,
  onOpenChange,
  action,
  defaultModule,
  defaultTargetId,
  defaultTargetName,
  onSuccess,
}: ActionFormModalProps) {
  const isEditing = !!action;
  const createMutation = useCreateAction();
  const updateMutation = useUpdateAction();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const { data: workers } = useWorkers();
  const { data: insumos } = useInsumos();

  // Local state for insumos list
  const [selectedInsumos, setSelectedInsumos] = useState<ActionInsumo[]>([]);
  const [newInsumoId, setNewInsumoId] = useState('');
  const [newInsumoQty, setNewInsumoQty] = useState('');

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<ActionFormData>({
    resolver: zodResolver(actionFormSchema),
    defaultValues: {
      module: defaultModule || 'general',
      actionType: '',
      date: formatDateForInput(new Date()),
      workerId: '',
      totalHours: '',
      description: '',
      targetId: defaultTargetId || '',
      targetName: defaultTargetName || '',
      notes: '',
    },
  });

  const selectedModule = watch('module');
  const actionTypes = getActionTypesForModule(selectedModule);

  // Worker options for select
  const workerOptions = workers?.map(w => ({
    value: w.id,
    label: `${w.firstName} ${w.lastName}`,
  })) || [];

  // Insumo options for select
  const insumoOptions = insumos?.map(i => ({
    value: i.id,
    label: `${i.name} (${i.currentStock} ${i.unit})`,
    unit: i.unit,
    name: i.name,
  })) || [];

  useEffect(() => {
    if (open && action) {
      reset({
        module: action.module,
        actionType: action.actionType,
        date: formatDateForInput(action.date),
        workerId: action.workerId,
        totalHours: action.totalHours.toString(),
        description: action.description || '',
        targetId: action.targetId || '',
        targetName: action.targetName || '',
        notes: action.notes || '',
      });
      setSelectedInsumos(action.insumos || []);
    } else if (open && !action) {
      reset({
        module: defaultModule || 'general',
        actionType: '',
        date: formatDateForInput(new Date()),
        workerId: '',
        totalHours: '',
        description: '',
        targetId: defaultTargetId || '',
        targetName: defaultTargetName || '',
        notes: '',
      });
      setSelectedInsumos([]);
    }
  }, [open, action, defaultModule, defaultTargetId, defaultTargetName, reset]);

  const handleAddInsumo = () => {
    if (!newInsumoId || !newInsumoQty) return;

    const insumo = insumoOptions.find(i => i.value === newInsumoId);
    if (!insumo) return;

    const qty = parseFloat(newInsumoQty);
    if (isNaN(qty) || qty <= 0) return;

    // Check if already added
    if (selectedInsumos.some(i => i.insumoId === newInsumoId)) {
      return;
    }

    setSelectedInsumos([
      ...selectedInsumos,
      {
        insumoId: newInsumoId,
        insumoName: insumo.name,
        quantity: qty,
        unit: insumo.unit,
      },
    ]);
    setNewInsumoId('');
    setNewInsumoQty('');
  };

  const handleRemoveInsumo = (insumoId: string) => {
    setSelectedInsumos(selectedInsumos.filter(i => i.insumoId !== insumoId));
  };

  const onSubmit = async (data: ActionFormData) => {
    try {
      const worker = workers?.find(w => w.id === data.workerId);
      const workerName = worker ? `${worker.firstName} ${worker.lastName}` : '';

      if (isEditing && action) {
        await updateMutation.mutateAsync({
          id: action.id,
          data,
          insumos: selectedInsumos,
          workerName,
        });
      } else {
        await createMutation.mutateAsync({
          data,
          insumos: selectedInsumos,
          workerName,
        });
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
      title={isEditing ? 'Editar Acción' : 'Registrar Acción'}
      description={
        isEditing
          ? 'Modifica los datos de la acción'
          : 'Registra una nueva acción de trabajo'
      }
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Row 1: Module and Action Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Módulo" required error={errors.module?.message}>
            <Controller
              name="module"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={moduleOptions}
                  placeholder="Seleccionar módulo..."
                  error={errors.module?.message}
                  disabled={!!defaultModule}
                />
              )}
            />
          </FormField>
          <FormField label="Tipo de Acción" required error={errors.actionType?.message}>
            <Controller
              name="actionType"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={actionTypes.map(t => ({ value: t.value, label: t.label }))}
                  placeholder="Seleccionar acción..."
                  error={errors.actionType?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 2: Worker and Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Trabajador" required error={errors.workerId?.message}>
            <Controller
              name="workerId"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={workerOptions}
                  placeholder="Seleccionar trabajador..."
                  error={errors.workerId?.message}
                />
              )}
            />
          </FormField>
          <FormField label="Fecha" required error={errors.date?.message}>
            <FormDatePicker
              {...register('date')}
              error={errors.date?.message}
            />
          </FormField>
        </div>

        {/* Row 3: Hours and Target */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Horas Totales" required error={errors.totalHours?.message}>
            <FormInput
              {...register('totalHours')}
              type="number"
              step="0.5"
              min="0.5"
              placeholder="Ej: 4"
              error={errors.totalHours?.message}
            />
          </FormField>
          <FormField label="Objeto/Área Relacionada" error={errors.targetName?.message}>
            <FormInput
              {...register('targetName')}
              placeholder="Ej: Lote Norte, Apiario Principal..."
              error={errors.targetName?.message}
            />
          </FormField>
        </div>

        {/* Description */}
        <FormField label="Descripción" error={errors.description?.message}>
          <FormInput
            {...register('description')}
            placeholder="Descripción breve de la actividad..."
            error={errors.description?.message}
          />
        </FormField>

        {/* Insumos Section */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Insumos Utilizados
          </label>

          {/* Add Insumo Row */}
          <div className="flex gap-2">
            <div className="flex-1">
              <FormSelect
                value={newInsumoId}
                onValueChange={setNewInsumoId}
                options={insumoOptions.filter(i => !selectedInsumos.some(s => s.insumoId === i.value))}
                placeholder="Seleccionar insumo..."
              />
            </div>
            <div className="w-24">
              <FormInput
                type="number"
                value={newInsumoQty}
                onChange={(e) => setNewInsumoQty(e.target.value)}
                placeholder="Cant."
                min="0.1"
                step="0.1"
              />
            </div>
            <button
              type="button"
              onClick={handleAddInsumo}
              className="btn-secondary px-3"
              disabled={!newInsumoId || !newInsumoQty}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Selected Insumos List */}
          {selectedInsumos.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              {selectedInsumos.map((insumo) => (
                <div
                  key={insumo.insumoId}
                  className="flex items-center justify-between bg-white rounded-md px-3 py-2 border border-gray-200"
                >
                  <span className="text-sm">
                    <span className="font-medium">{insumo.insumoName}</span>
                    <span className="text-gray-500 ml-2">
                      {insumo.quantity} {insumo.unit}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveInsumo(insumo.insumoId)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
            {isEditing ? 'Guardar Cambios' : 'Registrar Acción'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
