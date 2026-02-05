import { z } from 'zod';

// Constants
export const moduleSourceOptions = ['agro', 'pecuario', 'procesamiento'] as const;
export const paymentStatusOptions = ['pending', 'partial', 'paid'] as const;
export const saleTypeOptions = ['agricola', 'procesado', 'animal_vivo', 'carnico'] as const;
export const quantityModeOptions = ['unidades', 'peso'] as const;
export const priceTypeOptions = ['per_kilo', 'total'] as const;
export const purchaseCategoryOptions = [
  'insumos',
  'mano_obra',
  'servicios_externos',
  'mantenimiento',
  'transporte',
  'otros_gastos',
] as const;

// Sale Record Form Schema
export const saleRecordFormSchema = z.object({
  // Common fields
  saleType: z.enum(saleTypeOptions, { message: 'Seleccione un tipo de venta' }),
  date: z.string().min(1, 'La fecha es requerida'),
  invoiceNumber: z.string().min(1, 'El número de factura es requerido').max(50, 'Máximo 50 caracteres'),
  productDescription: z.string().min(2, 'La descripción debe tener al menos 2 caracteres').max(200, 'Máximo 200 caracteres'),
  buyerName: z.string().min(2, 'El nombre del comprador debe tener al menos 2 caracteres').max(100, 'Máximo 100 caracteres'),
  quantity: z.string().min(1, 'La cantidad es requerida').refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Debe ser un número mayor a 0'),
  unit: z.string().min(1, 'La unidad es requerida').max(20, 'Máximo 20 caracteres'),
  unitPrice: z.string().min(1, 'El precio es requerido').refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, 'Debe ser un número válido'),
  paymentStatus: z.enum(paymentStatusOptions, { message: 'Seleccione un estado de pago' }),
  amountPaid: z.string().optional().refine((val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0), 'Debe ser un número válido'),
  dueDate: z.string().optional(),
  notes: z.string().optional(),

  // Agricola-specific
  quantityMode: z.enum(quantityModeOptions).optional(),

  // Procesado-specific
  packageType: z.string().optional(),
  packageSize: z.string().optional().refine((val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) > 0), 'Debe ser un número mayor a 0'),
  packageSizeUnit: z.string().optional(),
  batchNumber: z.string().optional(),

  // Animal vivo-specific
  animalWeight: z.string().optional().refine((val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) > 0), 'Debe ser un número mayor a 0'),

  // Carnico-specific
  priceType: z.enum(priceTypeOptions).optional(),
});

export type SaleRecordFormData = z.infer<typeof saleRecordFormSchema>;

// Purchase Record Form Schema
export const purchaseRecordFormSchema = z.object({
  date: z.string().min(1, 'La fecha es requerida'),
  invoiceNumber: z
    .string()
    .min(1, 'El número de factura es requerido')
    .max(50, 'Máximo 50 caracteres'),
  supplierName: z
    .string()
    .min(2, 'El nombre del proveedor debe tener al menos 2 caracteres')
    .max(100, 'Máximo 100 caracteres'),
  category: z.enum(purchaseCategoryOptions, {
    message: 'Seleccione una categoría',
  }),
  description: z
    .string()
    .min(2, 'La descripción debe tener al menos 2 caracteres')
    .max(200, 'Máximo 200 caracteres'),
  quantity: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) > 0),
      'Debe ser un número mayor a 0'
    ),
  unit: z.string().optional(),
  unitCost: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
      'Debe ser un número válido'
    ),
  totalAmount: z
    .string()
    .min(1, 'El monto total es requerido')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Debe ser un número mayor a 0'),
  paymentStatus: z.enum(paymentStatusOptions, {
    message: 'Seleccione un estado de pago',
  }),
  amountPaid: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
      'Debe ser un número válido'
    ),
  dueDate: z.string().optional(),
  moduleUsage: z.string().optional(),
  notes: z.string().optional(),
});

export type PurchaseRecordFormData = z.infer<typeof purchaseRecordFormSchema>;

// Select options for forms
export const saleTypeSelectOptions = [
  { value: 'agricola', label: 'Producto Agrícola' },
  { value: 'procesado', label: 'Producto Procesado' },
  { value: 'animal_vivo', label: 'Animal Vivo' },
  { value: 'carnico', label: 'Producto Cárnico' },
];

export const quantityModeSelectOptions = [
  { value: 'unidades', label: 'Por Unidades' },
  { value: 'peso', label: 'Por Peso' },
];

export const priceTypeSelectOptions = [
  { value: 'per_kilo', label: 'Precio por Kilo' },
  { value: 'total', label: 'Monto Total' },
];

export const paymentStatusSelectOptions = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'partial', label: 'Parcial' },
  { value: 'paid', label: 'Pagado' },
];

export const purchaseCategorySelectOptions = [
  { value: 'insumos', label: 'Insumos' },
  { value: 'mano_obra', label: 'Mano de Obra' },
  { value: 'servicios_externos', label: 'Servicios Externos' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
  { value: 'transporte', label: 'Transporte' },
  { value: 'otros_gastos', label: 'Otros Gastos' },
];

// ==================== Accounts Receivable ====================

export const accountStatusOptions = ['pending', 'overdue', 'paid'] as const;

export const accountsReceivableFormSchema = z.object({
  saleRecordId: z.string().optional(),
  buyerName: z
    .string()
    .min(2, 'El nombre del comprador debe tener al menos 2 caracteres')
    .max(100, 'Máximo 100 caracteres'),
  invoiceNumber: z
    .string()
    .min(1, 'El número de factura es requerido')
    .max(50, 'Máximo 50 caracteres'),
  totalAmount: z
    .string()
    .min(1, 'El monto total es requerido')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Debe ser un número mayor a 0'),
  amountPaid: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
      'Debe ser un número válido'
    ),
  dueDate: z.string().min(1, 'La fecha de vencimiento es requerida'),
  notes: z.string().optional(),
});

export type AccountsReceivableFormData = z.infer<typeof accountsReceivableFormSchema>;

export const accountStatusSelectOptions = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'overdue', label: 'Vencido' },
  { value: 'paid', label: 'Pagado' },
];

// ==================== Accounts Payable ====================

export const accountsPayableFormSchema = z.object({
  purchaseRecordId: z.string().optional(),
  supplierName: z
    .string()
    .min(2, 'El nombre del proveedor debe tener al menos 2 caracteres')
    .max(100, 'Máximo 100 caracteres'),
  invoiceNumber: z
    .string()
    .min(1, 'El número de factura es requerido')
    .max(50, 'Máximo 50 caracteres'),
  totalAmount: z
    .string()
    .min(1, 'El monto total es requerido')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Debe ser un número mayor a 0'),
  amountPaid: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
      'Debe ser un número válido'
    ),
  dueDate: z.string().min(1, 'La fecha de vencimiento es requerida'),
  notes: z.string().optional(),
});

export type AccountsPayableFormData = z.infer<typeof accountsPayableFormSchema>;

// ==================== Budget ====================

export const budgetPeriodOptions = ['monthly', 'quarterly', 'yearly'] as const;
export const budgetCategoryOptions = [
  'insumos',
  'mano_obra',
  'servicios_externos',
  'mantenimiento',
  'transporte',
  'otros_gastos',
] as const;

export const budgetFormSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'Máximo 100 caracteres'),
  category: z.enum(budgetCategoryOptions, {
    message: 'Seleccione una categoría',
  }),
  amount: z
    .string()
    .min(1, 'El monto es requerido')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Debe ser un número mayor a 0'),
  period: z.enum(budgetPeriodOptions, {
    message: 'Seleccione un período',
  }),
  startDate: z.string().min(1, 'La fecha de inicio es requerida'),
  endDate: z.string().min(1, 'La fecha de fin es requerida'),
  spent: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
      'Debe ser un número válido'
    ),
});

export type BudgetFormData = z.infer<typeof budgetFormSchema>;

export const budgetPeriodSelectOptions = [
  { value: 'monthly', label: 'Mensual' },
  { value: 'quarterly', label: 'Trimestral' },
  { value: 'yearly', label: 'Anual' },
];

export const budgetCategorySelectOptions = [
  { value: 'insumos', label: 'Insumos' },
  { value: 'mano_obra', label: 'Mano de Obra' },
  { value: 'servicios_externos', label: 'Servicios Externos' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
  { value: 'transporte', label: 'Transporte' },
  { value: 'otros_gastos', label: 'Otros Gastos' },
];
