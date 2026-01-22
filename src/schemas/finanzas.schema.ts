import { z } from 'zod';

// Constants
export const moduleSourceOptions = ['agro', 'pecuario', 'apicultura', 'general'] as const;
export const paymentStatusOptions = ['pending', 'partial', 'paid'] as const;
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
  date: z.string().min(1, 'La fecha es requerida'),
  invoiceNumber: z
    .string()
    .min(1, 'El número de factura es requerido')
    .max(50, 'Máximo 50 caracteres'),
  moduleSource: z.enum(moduleSourceOptions, {
    message: 'Seleccione un módulo',
  }),
  productDescription: z
    .string()
    .min(2, 'La descripción debe tener al menos 2 caracteres')
    .max(200, 'Máximo 200 caracteres'),
  quantity: z
    .string()
    .min(1, 'La cantidad es requerida')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Debe ser un número mayor a 0'),
  unit: z
    .string()
    .min(1, 'La unidad es requerida')
    .max(20, 'Máximo 20 caracteres'),
  unitPrice: z
    .string()
    .min(1, 'El precio unitario es requerido')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, 'Debe ser un número válido'),
  buyerName: z
    .string()
    .min(2, 'El nombre del comprador debe tener al menos 2 caracteres')
    .max(100, 'Máximo 100 caracteres'),
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
  notes: z.string().optional(),
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
export const moduleSourceSelectOptions = [
  { value: 'agro', label: 'Agricultura' },
  { value: 'pecuario', label: 'Pecuario' },
  { value: 'apicultura', label: 'Apicultura' },
  { value: 'general', label: 'General' },
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
