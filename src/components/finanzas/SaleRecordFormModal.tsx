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
  saleTypeSelectOptions,
  quantityModeSelectOptions,
  priceTypeSelectOptions,
  paymentStatusSelectOptions,
  type SaleRecordFormData,
} from '../../schemas/finanzas.schema';
import { useCreateSaleRecord, useUpdateSaleRecord } from '../../hooks/useFinanzasMutations';
import { useCompletedBatches } from '../../hooks/useProcesamiento';
import { useLivestock } from '../../hooks/usePecuario';
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

// Package type options for processed products
const packageTypeOptions = [
  { value: 'sacos', label: 'Sacos' },
  { value: 'cajas', label: 'Cajas' },
  { value: 'frascos', label: 'Frascos' },
  { value: 'envases', label: 'Envases' },
  { value: 'bolsas', label: 'Bolsas' },
  { value: 'unidades', label: 'Unidades' },
];

// Size unit options for processed products
const packageSizeUnitOptions = [
  { value: 'kg', label: 'kg' },
  { value: 'g', label: 'g' },
  { value: 'litros', label: 'litros' },
  { value: 'ml', label: 'ml' },
  { value: 'unidades', label: 'unidades' },
];

// Weight unit options
const weightUnitOptions = [
  { value: 'kg', label: 'kg' },
  { value: 'lb', label: 'lb' },
];

export default function SaleRecordFormModal({
  open,
  onOpenChange,
  saleRecord,
  onSuccess,
}: SaleRecordFormModalProps) {
  const isEditing = !!saleRecord;
  const createMutation = useCreateSaleRecord();
  const updateMutation = useUpdateSaleRecord();
  const { data: completedBatches } = useCompletedBatches();
  const { data: livestock } = useLivestock();
  const isLoading = createMutation.isPending || updateMutation.isPending;

  // Build batch options for procesado sales (only final products)
  const batchOptions = (completedBatches || [])
    .filter(b => b.isFinalProduct && (b.availableQuantity ?? 0) > 0)
    .map(b => ({
      value: b.id,
      label: `${b.batchCode || b.tempCode} - ${b.outputProduct} (${b.availableQuantity} ${b.outputUnit})`,
      code: b.batchCode || b.tempCode || '',
    }));

  // Build livestock options for animal_vivo sales (only active animals)
  const livestockOptions = (livestock || [])
    .filter(l => l.status === 'active')
    .map(l => ({
      value: l.id,
      label: `${l.tag} - ${l.name || l.breed} (${l.category})`,
      tag: l.tag,
    }));

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SaleRecordFormData>({
    resolver: zodResolver(saleRecordFormSchema),
    defaultValues: {
      saleType: undefined,
      date: '',
      invoiceNumber: '',
      productDescription: '',
      quantity: '',
      unit: '',
      unitPrice: '',
      buyerName: '',
      paymentStatus: undefined,
      amountPaid: '',
      dueDate: '',
      notes: '',
      quantityMode: undefined,
      packageType: '',
      packageSize: '',
      packageSizeUnit: '',
      packageCount: '',
      batchId: '',
      batchCode: '',
      animalWeight: '',
      livestockId: '',
      livestockTag: '',
      priceType: undefined,
    },
  });

  const saleType = watch('saleType');
  const paymentStatus = watch('paymentStatus');
  const quantityMode = watch('quantityMode');
  const priceType = watch('priceType');

  // Set default unit based on sale type and mode
  useEffect(() => {
    if (saleType === 'agricola' && quantityMode === 'peso') {
      setValue('unit', 'kg');
    } else if (saleType === 'animal_vivo') {
      setValue('unit', 'animal');
    } else if (saleType === 'carnico') {
      setValue('unit', 'kg');
    }
  }, [saleType, quantityMode, setValue]);

  useEffect(() => {
    if (open && saleRecord) {
      reset({
        saleType: saleRecord.saleType,
        date: formatDateForInput(saleRecord.date),
        invoiceNumber: saleRecord.invoiceNumber || '',
        productDescription: saleRecord.productDescription,
        quantity: saleRecord.quantity.toString(),
        unit: saleRecord.unit,
        unitPrice: saleRecord.unitPrice.toString(),
        buyerName: saleRecord.buyerName,
        paymentStatus: saleRecord.paymentStatus,
        amountPaid: saleRecord.amountPaid.toString(),
        dueDate: formatDateForInput(saleRecord.dueDate),
        notes: saleRecord.notes || '',
        quantityMode: saleRecord.quantityMode,
        packageType: saleRecord.packageType || '',
        packageSize: saleRecord.packageSize?.toString() || '',
        packageSizeUnit: saleRecord.packageSizeUnit || '',
        packageCount: saleRecord.packageCount?.toString() || '',
        batchId: saleRecord.batchId || '',
        batchCode: saleRecord.batchCode || '',
        animalWeight: saleRecord.animalWeight?.toString() || '',
        livestockId: saleRecord.livestockId || '',
        livestockTag: saleRecord.livestockTag || '',
        priceType: saleRecord.priceType,
      });
    } else if (open && !saleRecord) {
      reset({
        saleType: undefined,
        date: formatDateForInput(new Date()),
        invoiceNumber: '',
        productDescription: '',
        quantity: '',
        unit: '',
        unitPrice: '',
        buyerName: '',
        paymentStatus: undefined,
        amountPaid: '',
        dueDate: '',
        notes: '',
        quantityMode: undefined,
        packageType: '',
        packageSize: '',
        packageSizeUnit: '',
        packageCount: '',
        batchId: '',
        batchCode: '',
        animalWeight: '',
        livestockId: '',
        livestockTag: '',
        priceType: undefined,
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

  // Render type-specific fields based on saleType
  const renderTypeSpecificFields = () => {
    switch (saleType) {
      case 'agricola':
        return (
          <>
            {/* Agricola: Choose between unidades or peso */}
            <FormField label="Modalidad de Registro" required error={errors.quantityMode?.message}>
              <Controller
                name="quantityMode"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    options={quantityModeSelectOptions}
                    placeholder="Seleccionar modalidad..."
                    error={errors.quantityMode?.message}
                  />
                )}
              />
            </FormField>

            {quantityMode && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="Cantidad" required error={errors.quantity?.message}>
                  <FormInput
                    {...register('quantity')}
                    type="number"
                    step="any"
                    placeholder={quantityMode === 'unidades' ? 'Ej: 10' : 'Ej: 20'}
                    error={errors.quantity?.message}
                  />
                </FormField>
                <FormField label="Unidad" required error={errors.unit?.message}>
                  <FormInput
                    {...register('unit')}
                    placeholder={quantityMode === 'unidades' ? 'Ej: lechugas, piñas' : 'kg'}
                    error={errors.unit?.message}
                  />
                </FormField>
                <FormField label="Precio Unitario (₡)" required error={errors.unitPrice?.message}>
                  <FormInput
                    {...register('unitPrice')}
                    type="number"
                    step="any"
                    placeholder="Ej: 1500"
                    error={errors.unitPrice?.message}
                  />
                </FormField>
              </div>
            )}
          </>
        );

      case 'procesado':
        return (
          <>
            {/* Procesado: Lote de origen */}
            <FormField label="Lote de Procesamiento" error={errors.batchId?.message}>
              <Controller
                name="batchId"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    value={field.value || ''}
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Auto-fill batchCode from selection
                      const selected = batchOptions.find(b => b.value === value);
                      setValue('batchCode', selected?.code || '');
                    }}
                    options={[
                      { value: '', label: 'Sin lote asociado' },
                      ...batchOptions,
                    ]}
                    placeholder="Seleccionar lote..."
                    error={errors.batchId?.message}
                  />
                )}
              />
            </FormField>

            {/* Procesado: Presentación comercial */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Tipo de Presentación" required error={errors.packageType?.message}>
                <Controller
                  name="packageType"
                  control={control}
                  render={({ field }) => (
                    <FormSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      options={packageTypeOptions}
                      placeholder="Seleccionar tipo..."
                      error={errors.packageType?.message}
                    />
                  )}
                />
              </FormField>
              <FormField label="Cantidad de Presentaciones" required error={errors.packageCount?.message}>
                <FormInput
                  {...register('packageCount')}
                  type="number"
                  step="1"
                  placeholder="Ej: 10, 50, 24"
                  error={errors.packageCount?.message}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Tamaño por Presentación" required error={errors.packageSize?.message}>
                <FormInput
                  {...register('packageSize')}
                  type="number"
                  step="any"
                  placeholder="Ej: 100, 1, 500"
                  error={errors.packageSize?.message}
                />
              </FormField>
              <FormField label="Unidad de Medida" required error={errors.packageSizeUnit?.message}>
                <Controller
                  name="packageSizeUnit"
                  control={control}
                  render={({ field }) => (
                    <FormSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      options={packageSizeUnitOptions}
                      placeholder="Seleccionar..."
                      error={errors.packageSizeUnit?.message}
                    />
                  )}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Cantidad Total" required error={errors.quantity?.message}>
                <FormInput
                  {...register('quantity')}
                  type="number"
                  step="1"
                  placeholder="Cantidad total vendida"
                  error={errors.quantity?.message}
                />
              </FormField>
              <FormField label="Precio Unitario (₡)" required error={errors.unitPrice?.message}>
                <FormInput
                  {...register('unitPrice')}
                  type="number"
                  step="any"
                  placeholder="Precio por presentación"
                  error={errors.unitPrice?.message}
                />
              </FormField>
            </div>

            {/* Hidden fields */}
            <input type="hidden" {...register('unit')} value="unidad" />
            <input type="hidden" {...register('batchCode')} />
          </>
        );

      case 'animal_vivo':
        return (
          <>
            {/* Animal vivo: Selección de animal */}
            <FormField label="Animal a Vender" error={errors.livestockId?.message}>
              <Controller
                name="livestockId"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    value={field.value || ''}
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Auto-fill livestockTag from selection
                      const selected = livestockOptions.find(l => l.value === value);
                      setValue('livestockTag', selected?.tag || '');
                    }}
                    options={[
                      { value: '', label: 'Sin animal específico' },
                      ...livestockOptions,
                    ]}
                    placeholder="Seleccionar animal..."
                    error={errors.livestockId?.message}
                  />
                )}
              />
            </FormField>

            {/* Animal vivo: Simple por unidad */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Cantidad" required error={errors.quantity?.message}>
                <FormInput
                  {...register('quantity')}
                  type="number"
                  step="1"
                  placeholder="Generalmente 1"
                  error={errors.quantity?.message}
                />
              </FormField>
              <FormField label="Unidad" error={errors.unit?.message}>
                <FormInput
                  {...register('unit')}
                  value="animal"
                  readOnly
                  className="bg-gray-50"
                  error={errors.unit?.message}
                />
              </FormField>
              <FormField label="Precio (₡)" required error={errors.unitPrice?.message}>
                <FormInput
                  {...register('unitPrice')}
                  type="number"
                  step="any"
                  placeholder="Precio del animal"
                  error={errors.unitPrice?.message}
                />
              </FormField>
            </div>

            <FormField label="Peso del Animal (opcional, kg)" error={errors.animalWeight?.message}>
              <FormInput
                {...register('animalWeight')}
                type="number"
                step="any"
                placeholder="Peso de referencia"
                error={errors.animalWeight?.message}
              />
            </FormField>

            {/* Hidden field for livestockTag */}
            <input type="hidden" {...register('livestockTag')} />
          </>
        );

      case 'carnico':
        return (
          <>
            {/* Carnico: Registro por peso */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Cantidad" required error={errors.quantity?.message}>
                <FormInput
                  {...register('quantity')}
                  type="number"
                  step="any"
                  placeholder="Ej: 250"
                  error={errors.quantity?.message}
                />
              </FormField>
              <FormField label="Unidad de Peso" required error={errors.unit?.message}>
                <Controller
                  name="unit"
                  control={control}
                  render={({ field }) => (
                    <FormSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      options={weightUnitOptions}
                      placeholder="Seleccionar..."
                      error={errors.unit?.message}
                    />
                  )}
                />
              </FormField>
              <FormField label="Tipo de Precio" required error={errors.priceType?.message}>
                <Controller
                  name="priceType"
                  control={control}
                  render={({ field }) => (
                    <FormSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      options={priceTypeSelectOptions}
                      placeholder="Seleccionar..."
                      error={errors.priceType?.message}
                    />
                  )}
                />
              </FormField>
            </div>

            {priceType && (
              <FormField
                label={priceType === 'per_kilo' ? 'Precio por Kilo (₡)' : 'Monto Total (₡)'}
                required
                error={errors.unitPrice?.message}
              >
                <FormInput
                  {...register('unitPrice')}
                  type="number"
                  step="any"
                  placeholder={priceType === 'per_kilo' ? 'Precio por kg' : 'Monto total de la venta'}
                  error={errors.unitPrice?.message}
                />
              </FormField>
            )}
          </>
        );

      default:
        return null;
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
        {/* Row 1: Sale Type */}
        <FormField label="Tipo de Venta" required error={errors.saleType?.message}>
          <Controller
            name="saleType"
            control={control}
            render={({ field }) => (
              <FormSelect
                value={field.value}
                onValueChange={field.onChange}
                options={saleTypeSelectOptions}
                placeholder="Seleccionar tipo de venta..."
                error={errors.saleType?.message}
              />
            )}
          />
        </FormField>

        {saleType && (
          <>
            {/* Row 2: Date, Invoice */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            {/* Row 3: Buyer */}
            <FormField label="Cliente / Comprador" required error={errors.buyerName?.message}>
              <FormInput
                {...register('buyerName')}
                placeholder="Nombre del comprador"
                error={errors.buyerName?.message}
              />
            </FormField>

            {/* Row 4: Product Description */}
            <FormField label="Producto o Referencia" required error={errors.productDescription?.message}>
              <FormInput
                {...register('productDescription')}
                placeholder="Descripción del producto vendido"
                error={errors.productDescription?.message}
              />
            </FormField>

            {/* Type-specific fields */}
            {renderTypeSpecificFields()}

            {/* Payment Status Section */}
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
            <FormField label="Observaciones" error={errors.notes?.message}>
              <FormTextArea
                {...register('notes')}
                placeholder="Observaciones adicionales..."
                rows={2}
                error={errors.notes?.message}
              />
            </FormField>
          </>
        )}

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
            disabled={isLoading || !saleType}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEditing ? 'Guardar Cambios' : 'Registrar Venta'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
