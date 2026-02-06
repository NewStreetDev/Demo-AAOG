import { z } from 'zod';

// ========================================
// Constants
// ========================================

export const batchStatuses = ['en_proceso', 'completado'] as const;
export const inputSourceTypes = ['cosecha', 'lote_anterior', 'miel', 'otro'] as const;

// ========================================
// Processing Batch Form Schema
// ========================================

export const processingBatchFormSchema = z.object({
  // Process info - ahora con catálogo
  processTypeId: z
    .string()
    .min(1, 'Seleccione un tipo de proceso'),
  processTypeName: z.string().optional(), // Se llena automáticamente del catálogo
  processDate: z
    .string()
    .min(1, 'La fecha del proceso es requerida'),

  // Input
  inputProduct: z
    .string()
    .min(1, 'El producto de entrada es requerido'),
  inputQuantity: z
    .string()
    .min(1, 'La cantidad de entrada es requerida')
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      'La cantidad debe ser un numero positivo'
    ),
  inputUnit: z
    .string()
    .min(1, 'La unidad de entrada es requerida'),
  inputSourceType: z.enum(inputSourceTypes, {
    message: 'Seleccione el tipo de origen',
  }),
  inputSourceBatchId: z.string().optional(),

  // Output (optional - filled on completion)
  outputProduct: z.string().optional(),
  outputQuantity: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
      'La cantidad debe ser un numero valido'
    ),
  outputUnit: z.string().optional(),

  // Status
  status: z.enum(batchStatuses, {
    message: 'Seleccione un estado valido',
  }),

  // Final product flag
  isFinalProduct: z.boolean().default(false),

  // Additional info
  operator: z.string().optional(),
  supervisor: z.string().optional(),
  storageLocation: z.string().optional(),
  completionDate: z.string().optional(),

  // Notes
  notes: z.string().optional(),
}).superRefine((data, ctx) => {
  // If source is lote_anterior, require a source batch ID
  if (data.inputSourceType === 'lote_anterior' && !data.inputSourceBatchId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Debe seleccionar el lote de origen',
      path: ['inputSourceBatchId'],
    });
  }

  // If status is completado, require output fields
  if (data.status === 'completado') {
    if (!data.outputProduct) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El producto de salida es requerido para lotes completados',
        path: ['outputProduct'],
      });
    }
    if (!data.outputQuantity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La cantidad de salida es requerida para lotes completados',
        path: ['outputQuantity'],
      });
    }
    if (!data.outputUnit) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La unidad de salida es requerida para lotes completados',
        path: ['outputUnit'],
      });
    }
  }
});

export type ProcessingBatchFormData = z.infer<typeof processingBatchFormSchema>;

// ========================================
// Select Options
// ========================================

export const batchStatusOptions = [
  { value: 'en_proceso', label: 'En Proceso' },
  { value: 'completado', label: 'Completado' },
];

export const inputSourceTypeOptions = [
  { value: 'cosecha', label: 'Cosecha (materia prima fresca)' },
  { value: 'lote_anterior', label: 'Lote anterior (proceso previo)' },
  { value: 'miel', label: 'Miel (producción apícola)' },
  { value: 'otro', label: 'Otro' },
];

export const inputUnitOptions = [
  { value: 'kg', label: 'Kilogramos (kg)' },
  { value: 'g', label: 'Gramos (g)' },
  { value: 'L', label: 'Litros (L)' },
  { value: 'ml', label: 'Mililitros (ml)' },
  { value: 'unidades', label: 'Unidades' },
];

// Common process types (user can add more)
export const commonProcessTypes = [
  'Lavado',
  'Seleccion',
  'Corte',
  'Secado',
  'Molienda',
  'Cernido',
  'Envasado',
  'Etiquetado',
  'Fermentacion',
  'Pasteurizacion',
  'Filtracion',
  'Empaque',
];
