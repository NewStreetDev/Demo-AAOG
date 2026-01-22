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
  saleRecordFormSchema,
  moduleSourceSelectOptions,
  paymentStatusSelectOptions,
  type SaleRecordFormData,
} from '../../schemas/finanzas.schema';
import { useCreateSaleRecord, useUpdateSaleRecord } from '../../hooks/useFinanzasMutations';
import type { SaleRecord } from '../../types/finanzas.types';

interface SaleRecordFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  saleRecord?: SaleRecord | null;
  onSuccess?: () => void;
}

function formatDateForInput(date: Date | string | undefined): string {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().split('T')[0];
}

export default function SaleRecordFormModal({
  open,
  onOpenChange,
  saleRecord,
  onSuccess,
}: SaleRecordFormModalProps) {
  const isEditing = !!saleRecord;
  const createMutation = useCreateSaleRecord();
  const updateMutation = useUpdateSaleRecord();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<SaleRecordFormData>({
    resolver: zodResolver(saleRecordFormSchema),
    defaultValues: {
      date: '',
      invoiceNumber: '',
      moduleSource: undefined,
      productDescription: '',
      quantity: '',
      unit: '',
      unitPrice: '',
      buyerName: '',
      paymentStatus: undefined,
      amountPaid: '',
      dueDate: '',
      notes: '',
    },
  });

  const paymentStatus = watch('paymentStatus');

  useEffect(() => {
    if (open && saleRecord) {
      reset({
        date: formatDateForInput(saleRecord.date),
        invoiceNumber: saleRecord.invoiceNumber,
        moduleSource: saleRecord.moduleSource,
        productDescription: saleRecord.productDescription,
        quantity: saleRecord.quantity.toString(),
        unit: saleRecord.unit,
        unitPrice: saleRecord.unitPrice.toString(),
        buyerName: saleRecord.buyerName,
        paymentStatus: saleRecord.paymentStatus,
        amountPaid: saleRecord.amountPaid.toString(),
        dueDate: formatDateForInput(saleRecord.dueDate),
        notes: saleRecord.notes || '',
      });
    } else if (open && !saleRecord) {
      reset({
        date: formatDateForInput(new Date()),
        invoiceNumber: '',
        moduleSource: undefined,
        productDescription: '',
        quantity: '',
        unit: '',
        unitPrice: '',
        buyerName: '',
        paymentStatus: undefined,
        amountPaid: '',
        dueDate: '',
        notes: '',
      });
    }
  }, [open, saleRecord, reset]);

  const onSubmit = async (data: SaleRecordFormData) => {
    try {
      if (isEditing && saleRecord) {
        await updateMutation.mutateAsync({ id: saleRecord.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving sale record:', error);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Editar Venta' : 'Nueva Venta'}
      description={
        isEditing
          ? 'Modifica los datos de la venta'
          : 'Registra una nueva venta'
      }
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Row 1: Date, Invoice, Module */}
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
              placeholder="Ej: FAC-2026-001"
              error={errors.invoiceNumber?.message}
            />
          </FormField>
          <FormField label="Módulo" required error={errors.moduleSource?.message}>
            <Controller
              name="moduleSource"
              control={control}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={moduleSourceSelectOptions}
                  placeholder="Seleccionar..."
                  error={errors.moduleSource?.message}
                />
              )}
            />
          </FormField>
        </div>

        {/* Row 2: Buyer */}
        <FormField label="Comprador" required error={errors.buyerName?.message}>
          <FormInput
            {...register('buyerName')}
            placeholder="Nombre del comprador"
            error={errors.buyerName?.message}
          />
        </FormField>

        {/* Row 3: Product Description */}
        <FormField label="Descripción del Producto" required error={errors.productDescription?.message}>
          <FormInput
            {...register('productDescription')}
            placeholder="Ej: Tomate Roma - 150 kg"
            error={errors.productDescription?.message}
          />
        </FormField>

        {/* Row 4: Quantity, Unit, Unit Price */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Cantidad" required error={errors.quantity?.message}>
            <FormInput
              {...register('quantity')}
              type="number"
              step="any"
              placeholder="Ej: 150"
              error={errors.quantity?.message}
            />
          </FormField>
          <FormField label="Unidad" required error={errors.unit?.message}>
            <FormInput
              {...register('unit')}
              placeholder="Ej: kg, L, unidades"
              error={errors.unit?.message}
            />
          </FormField>
          <FormField label="Precio Unitario (₡)" required error={errors.unitPrice?.message}>
            <FormInput
              {...register('unitPrice')}
              type="number"
              step="any"
              placeholder="Ej: 8000"
              error={errors.unitPrice?.message}
            />
          </FormField>
        </div>

        {/* Row 5: Payment Status, Amount Paid, Due Date */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  placeholder="Ej: 500000"
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
            {isEditing ? 'Guardar Cambios' : 'Registrar Venta'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
