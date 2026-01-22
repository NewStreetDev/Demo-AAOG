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
  purchaseRecordFormSchema,
  moduleSourceSelectOptions,
  paymentStatusSelectOptions,
  purchaseCategorySelectOptions,
  type PurchaseRecordFormData,
} from '../../schemas/finanzas.schema';
import { useCreatePurchaseRecord, useUpdatePurchaseRecord } from '../../hooks/useFinanzasMutations';
import type { PurchaseRecord } from '../../types/finanzas.types';

interface PurchaseRecordFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchaseRecord?: PurchaseRecord | null;
  onSuccess?: () => void;
}

function formatDateForInput(date: Date | string | undefined): string {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().split('T')[0];
}

export default function PurchaseRecordFormModal({
  open,
  onOpenChange,
  purchaseRecord,
  onSuccess,
}: PurchaseRecordFormModalProps) {
  const isEditing = !!purchaseRecord;
  const createMutation = useCreatePurchaseRecord();
  const updateMutation = useUpdatePurchaseRecord();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<PurchaseRecordFormData>({
    resolver: zodResolver(purchaseRecordFormSchema),
    defaultValues: {
      date: '',
      invoiceNumber: '',
      supplierName: '',
      category: undefined,
      description: '',
      quantity: '',
      unit: '',
      unitCost: '',
      totalAmount: '',
      paymentStatus: undefined,
      amountPaid: '',
      dueDate: '',
      moduleUsage: '',
      notes: '',
    },
  });

  const paymentStatus = watch('paymentStatus');

  useEffect(() => {
    if (open && purchaseRecord) {
      // Cast category to the form's expected type (only purchase categories)
      const validCategory = purchaseRecord.category as PurchaseRecordFormData['category'];
      reset({
        date: formatDateForInput(purchaseRecord.date),
        invoiceNumber: purchaseRecord.invoiceNumber,
        supplierName: purchaseRecord.supplierName,
        category: validCategory,
        description: purchaseRecord.description,
        quantity: purchaseRecord.quantity?.toString() || '',
        unit: purchaseRecord.unit || '',
        unitCost: purchaseRecord.unitCost?.toString() || '',
        totalAmount: purchaseRecord.totalAmount.toString(),
        paymentStatus: purchaseRecord.paymentStatus,
        amountPaid: purchaseRecord.amountPaid.toString(),
        dueDate: formatDateForInput(purchaseRecord.dueDate),
        moduleUsage: purchaseRecord.moduleUsage || '',
        notes: purchaseRecord.notes || '',
      });
    } else if (open && !purchaseRecord) {
      reset({
        date: formatDateForInput(new Date()),
        invoiceNumber: '',
        supplierName: '',
        category: undefined,
        description: '',
        quantity: '',
        unit: '',
        unitCost: '',
        totalAmount: '',
        paymentStatus: undefined,
        amountPaid: '',
        dueDate: '',
        moduleUsage: '',
        notes: '',
      });
    }
  }, [open, purchaseRecord, reset]);

  const onSubmit = async (data: PurchaseRecordFormData) => {
    try {
      if (isEditing && purchaseRecord) {
        await updateMutation.mutateAsync({ id: purchaseRecord.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving purchase record:', error);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar Compra' : 'Nueva Compra'}
      description={
        isEditing
          ? 'Modifica los datos de la compra'
          : 'Registra una nueva compra o gasto'
      }
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Row 1: Date, Invoice, Category */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Fecha" required error={errors.date?.message}>
            <FormInput
              {...register('date')}
              type="date"
              error={errors.date?.message}
            />
          </FormField>
          <FormField label="N° Factura" required error={errors.invoiceNumber?.message}>
            <FormInput
              {...register('invoiceNumber')}
              placeholder="Ej: PROV-2026-001"
              error={errors.invoiceNumber?.message}
            />
          </FormField>
          <FormField label="Categoría" required error={errors.category?.message}>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={purchaseCategorySelectOptions}
                  placeholder="Seleccionar..."
                  error={errors.category?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 2: Supplier */}
        <FormField label="Proveedor" required error={errors.supplierName?.message}>
          <FormInput
            {...register('supplierName')}
            placeholder="Nombre del proveedor"
            error={errors.supplierName?.message}
          />
        </FormField>

        {/* Row 3: Description */}
        <FormField label="Descripción" required error={errors.description?.message}>
          <FormInput
            {...register('description')}
            placeholder="Descripción detallada de la compra"
            error={errors.description?.message}
          />
        </FormField>

        {/* Row 4: Quantity, Unit, Unit Cost, Total */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField label="Cantidad" error={errors.quantity?.message}>
            <FormInput
              {...register('quantity')}
              type="number"
              step="any"
              placeholder="Ej: 100"
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
          <FormField label="Costo Unitario (₡)" error={errors.unitCost?.message}>
            <FormInput
              {...register('unitCost')}
              type="number"
              step="any"
              placeholder="Ej: 9000"
              error={errors.unitCost?.message}
            />
          </FormField>
          <FormField label="Monto Total (₡)" required error={errors.totalAmount?.message}>
            <FormInput
              {...register('totalAmount')}
              type="number"
              step="any"
              placeholder="Ej: 900000"
              error={errors.totalAmount?.message}
            />
          </FormField>
        </div>

        {/* Row 5: Payment Status, Amount Paid, Due Date, Module */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField label="Estado de Pago" required error={errors.paymentStatus?.message}>
            <Controller
              name="paymentStatus"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={paymentStatusSelectOptions}
                  placeholder="Seleccionar..."
                  error={errors.paymentStatus?.message}
                />
              )}
            />
          </FormField>
          {paymentStatus && paymentStatus !== 'paid' && (
            <>
              <FormField label="Monto Pagado (₡)" error={errors.amountPaid?.message}>
                <FormInput
                  {...register('amountPaid')}
                  type="number"
                  step="any"
                  placeholder="Ej: 450000"
                  error={errors.amountPaid?.message}
                />
              </FormField>
              <FormField label="Fecha de Vencimiento" error={errors.dueDate?.message}>
                <FormInput
                  {...register('dueDate')}
                  type="date"
                  error={errors.dueDate?.message}
                />
              </FormField>
            </>
          )}
          <FormField label="Uso en Módulo" error={errors.moduleUsage?.message}>
            <Controller
              name="moduleUsage"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                  options={moduleSourceSelectOptions}
                  placeholder="Sin asignar"
                  error={errors.moduleUsage?.message}
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
            {isEditing ? 'Guardar Cambios' : 'Registrar Compra'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
