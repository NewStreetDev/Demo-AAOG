import { z } from 'zod';

// ========================================
// Processing Line Constants & Schema
// ========================================

export const processingLineStatuses = ['active', 'maintenance', 'idle', 'calibration'] as const;
export const processingProductTypes = ['tomate', 'chile', 'pepino', 'leche', 'carne', 'miel', 'cera', 'polen'] as const;

export const processingLineFormSchema = z.object({
  lineCode: z
    .string()
    .min(1, 'El codigo de linea es requerido')
    .max(20, 'El codigo no puede tener mas de 20 caracteres'),
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener mas de 100 caracteres'),
  description: z.string().optional(),
  productTypes: z
    .array(z.enum(processingProductTypes))
    .min(1, 'Seleccione al menos un tipo de producto'),
  status: z.enum(processingLineStatuses, {
    message: 'Seleccione un estado valido',
  }),
  capacity: z
    .string()
    .min(1, 'La capacidad es requerida')
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      'La capacidad debe ser un numero positivo'
    ),
  capacityUnit: z.string().min(1, 'La unidad de capacidad es requerida'),
  location: z
    .string()
    .min(2, 'La ubicacion es requerida'),
  operator: z.string().optional(),
  lastMaintenance: z.string().optional(),
  nextScheduledMaintenance: z.string().optional(),
  notes: z.string().optional(),
});

export type ProcessingLineFormData = z.infer<typeof processingLineFormSchema>;

// Processing Line Select Options
export const processingLineStatusOptions = [
  { value: 'active', label: 'Activa' },
  { value: 'idle', label: 'Inactiva' },
  { value: 'maintenance', label: 'En Mantenimiento' },
  { value: 'calibration', label: 'En Calibracion' },
];

export const processingProductTypeOptions = [
  { value: 'tomate', label: 'Tomate' },
  { value: 'chile', label: 'Chile' },
  { value: 'pepino', label: 'Pepino' },
  { value: 'leche', label: 'Leche' },
  { value: 'carne', label: 'Carne' },
  { value: 'miel', label: 'Miel' },
  { value: 'cera', label: 'Cera' },
  { value: 'polen', label: 'Polen' },
];

export const capacityUnitOptions = [
  { value: 'kg/dia', label: 'kg/dia' },
  { value: 'L/dia', label: 'L/dia' },
  { value: 'unidades/dia', label: 'unidades/dia' },
];

// ========================================
// Processing Batch Constants & Schema
// ========================================

export const processingStatuses = ['pending', 'in_progress', 'quality_control', 'completed', 'rejected', 'paused'] as const;
export const sourceModules = ['agro', 'pecuario', 'apicultura'] as const;
export const qualityGrades = ['A', 'B', 'C', 'descarte'] as const;
export const stageStatuses = ['pending', 'in_progress', 'completed', 'skipped'] as const;

// Processing Stage Schema
export const processingStageSchema = z.object({
  id: z.string(),
  order: z.number(),
  name: z.string().min(1, 'El nombre del proceso es requerido'),
  description: z.string().optional(),
  status: z.enum(stageStatuses),
  // Input
  inputProductName: z.string().optional(),
  inputQuantity: z.string().optional(),
  // Output
  outputProductName: z.string().optional(),
  outputQuantity: z.string().optional(),
  unit: z.string().optional(),
  operator: z.string().optional(),
  notes: z.string().optional(),
});

export type ProcessingStageFormData = z.infer<typeof processingStageSchema>;

export const processingBatchFormSchema = z.object({
  batchCode: z
    .string()
    .min(1, 'El codigo de lote es requerido')
    .max(20, 'El codigo no puede tener mas de 20 caracteres'),
  inputProductName: z
    .string()
    .min(2, 'El nombre del producto es requerido'),
  inputProductType: z.enum(processingProductTypes, {
    message: 'Seleccione un tipo de producto',
  }),
  sourceModule: z.enum(sourceModules, {
    message: 'Seleccione el modulo de origen',
  }),
  sourceLocation: z.string().optional(),
  inputQuantity: z
    .string()
    .min(1, 'La cantidad de entrada es requerida')
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      'La cantidad debe ser un numero positivo'
    ),
  inputUnit: z.string().min(1, 'La unidad de entrada es requerida'),
  outputProductName: z.string().optional(),
  outputQuantity: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
      'La cantidad debe ser un numero valido'
    ),
  outputUnit: z.string().optional(),
  outputGrade: z.enum(qualityGrades).optional(),
  status: z.enum(processingStatuses, {
    message: 'Seleccione un estado valido',
  }),
  processingLineId: z.string().min(1, 'Seleccione una linea de procesamiento'),
  startDate: z.string().min(1, 'La fecha de inicio es requerida'),
  expectedEndDate: z.string().min(1, 'La fecha esperada de fin es requerida'),
  actualEndDate: z.string().optional(),
  operator: z.string().optional(),
  supervisor: z.string().optional(),
  temperature: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(parseFloat(val)),
      'La temperatura debe ser un numero valido'
    ),
  storageLocation: z.string().optional(),
  notes: z.string().optional(),
  // Processing stages
  stages: z.array(processingStageSchema).optional(),
});

export type ProcessingBatchFormData = z.infer<typeof processingBatchFormSchema>;

// Processing Batch Select Options
export const processingStatusOptions = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'in_progress', label: 'En Proceso' },
  { value: 'quality_control', label: 'Control de Calidad' },
  { value: 'completed', label: 'Completado' },
  { value: 'rejected', label: 'Rechazado' },
  { value: 'paused', label: 'Pausado' },
];

export const sourceModuleOptions = [
  { value: 'agro', label: 'Agricola' },
  { value: 'pecuario', label: 'Pecuario' },
  { value: 'apicultura', label: 'Apicultura' },
];

export const qualityGradeOptions = [
  { value: 'A', label: 'Grado A' },
  { value: 'B', label: 'Grado B' },
  { value: 'C', label: 'Grado C' },
  { value: 'descarte', label: 'Descarte' },
];

export const inputUnitOptions = [
  { value: 'kg', label: 'Kilogramos (kg)' },
  { value: 'L', label: 'Litros (L)' },
  { value: 'unidades', label: 'Unidades' },
];

export const stageStatusOptions = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'in_progress', label: 'En Proceso' },
  { value: 'completed', label: 'Completada' },
  { value: 'skipped', label: 'Omitida' },
];

// ========================================
// Quality Control Constants & Schema
// ========================================

export const qcOverallResults = ['pass', 'fail', 'retest'] as const;
export const defectSeverities = ['critical', 'major', 'minor'] as const;

export const qualityControlFormSchema = z.object({
  batchId: z.string().min(1, 'Seleccione un lote'),
  inspectionDate: z.string().min(1, 'La fecha de inspeccion es requerida'),
  inspector: z
    .string()
    .min(2, 'El nombre del inspector es requerido'),
  overallResult: z.enum(qcOverallResults, {
    message: 'Seleccione un resultado',
  }),
  finalGrade: z.enum(qualityGrades, {
    message: 'Seleccione un grado de calidad',
  }),
  temperature: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(parseFloat(val)),
      'La temperatura debe ser un numero valido'
    ),
  humidity: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0 && parseFloat(val) <= 100),
      'La humedad debe ser un porcentaje entre 0 y 100'
    ),
  pH: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0 && parseFloat(val) <= 14),
      'El pH debe estar entre 0 y 14'
    ),
  approved: z.boolean(),
  approvedBy: z.string().optional(),
  defectsDescription: z.string().optional(),
  correctiveActions: z.string().optional(),
  notes: z.string().optional(),
});

export type QualityControlFormData = z.infer<typeof qualityControlFormSchema>;

// Quality Control Select Options
export const qcOverallResultOptions = [
  { value: 'pass', label: 'Aprobado' },
  { value: 'fail', label: 'Rechazado' },
  { value: 'retest', label: 'Re-evaluar' },
];
