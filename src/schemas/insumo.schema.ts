import { z } from 'zod';

// Insumo constants
export const insumoCategories = [
  'semillas',
  'fertilizantes',
  'pesticidas',
  'herbicidas',
  'alimentos',
  'medicamentos',
  'herramientas',
  'otros',
] as const;

export const stockStatuses = ['en_stock', 'bajo', 'critico'] as const;

export const relatedModules = ['agro', 'pecuario', 'apicultura', 'general'] as const;

export const unitTypes = ['kg', 'L', 'unidades', 'g', 'mL', 'sacos', 'cajas'] as const;

// Insumo Form Schema
export const insumoFormSchema = z.object({
  code: z
    .string()
    .min(1, 'El código es requerido')
    .max(20, 'El código no puede tener más de 20 caracteres'),
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres'),
  category: z.enum(insumoCategories, {
    message: 'Seleccione una categoría válida',
  }),
  description: z.string().optional(),
  currentStock: z
    .string()
    .min(1, 'El stock actual es requerido')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, 'El stock debe ser un número válido'),
  minStock: z
    .string()
    .min(1, 'El stock mínimo es requerido')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, 'El stock mínimo debe ser un número válido'),
  maxStock: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) > 0),
      'El stock máximo debe ser un número positivo'
    ),
  unit: z
    .string()
    .min(1, 'La unidad es requerida'),
  costPerUnit: z
    .string()
    .min(1, 'El costo por unidad es requerido')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, 'El costo debe ser un número válido'),
  supplier: z.string().optional(),
  supplierPhone: z.string().optional(),
  expirationDate: z.string().optional(),
  batchCode: z.string().optional(),
  location: z.string().optional(),
  relatedModule: z.enum(relatedModules).optional(),
  alertEnabled: z.boolean(),
  reorderQuantity: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) > 0),
      'La cantidad de reorden debe ser un número positivo'
    ),
  notes: z.string().optional(),
});

export type InsumoFormData = z.infer<typeof insumoFormSchema>;

// Select options
export const categoryOptions = [
  { value: 'semillas', label: 'Semillas' },
  { value: 'fertilizantes', label: 'Fertilizantes' },
  { value: 'pesticidas', label: 'Pesticidas' },
  { value: 'herbicidas', label: 'Herbicidas' },
  { value: 'alimentos', label: 'Alimentos' },
  { value: 'medicamentos', label: 'Medicamentos' },
  { value: 'herramientas', label: 'Herramientas' },
  { value: 'otros', label: 'Otros' },
];

export const unitOptions = [
  { value: 'kg', label: 'Kilogramos (kg)' },
  { value: 'g', label: 'Gramos (g)' },
  { value: 'L', label: 'Litros (L)' },
  { value: 'mL', label: 'Mililitros (mL)' },
  { value: 'unidades', label: 'Unidades' },
  { value: 'sacos', label: 'Sacos' },
  { value: 'cajas', label: 'Cajas' },
];

export const moduleOptions = [
  { value: 'agro', label: 'Agricultura' },
  { value: 'pecuario', label: 'Pecuario' },
  { value: 'apicultura', label: 'Apicultura' },
  { value: 'general', label: 'General' },
];

export const stockStatusOptions = [
  { value: 'en_stock', label: 'En Stock' },
  { value: 'bajo', label: 'Bajo' },
  { value: 'critico', label: 'Crítico' },
];
