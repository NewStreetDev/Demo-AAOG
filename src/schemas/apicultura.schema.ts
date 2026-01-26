import { z } from 'zod';

// Apiario constants
export const apiarioStatuses = ['active', 'inactive'] as const;

// Colmena constants
export const colmenaStatuses = ['active', 'inactive', 'producing', 'resting', 'quarantine'] as const;
export const queenStatuses = ['present', 'absent', 'new'] as const;
export const populationLevels = ['low', 'medium', 'high'] as const;
export const weightLevels = ['bad', 'regular', 'good'] as const;

// Apiario Form Schema
export const apiarioFormSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres'),
  address: z.string().optional(),
  lat: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= -90 && parseFloat(val) <= 90),
      'La latitud debe ser un número válido entre -90 y 90'
    ),
  lng: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= -180 && parseFloat(val) <= 180),
      'La longitud debe ser un número válido entre -180 y 180'
    ),
  status: z.enum(apiarioStatuses, {
    message: 'Seleccione un estado válido',
  }),
  costPerHour: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
      'El costo debe ser un número válido'
    ),
  costPerKm: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
      'El costo debe ser un número válido'
    ),
  notes: z.string().optional(),
});

export type ApiarioFormData = z.infer<typeof apiarioFormSchema>;

// Colmena Form Schema
export const colmenaFormSchema = z.object({
  code: z
    .string()
    .min(1, 'El código es requerido')
    .max(20, 'El código no puede tener más de 20 caracteres'),
  apiarioId: z.string().min(1, 'Seleccione un apiario'),
  queenAge: z
    .string()
    .min(1, 'La edad de la reina es requerida')
    .refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, 'La edad debe ser un número válido'),
  queenStatus: z.enum(queenStatuses, {
    message: 'Seleccione un estado de reina',
  }),
  population: z.enum(populationLevels, {
    message: 'Seleccione un nivel de población',
  }),
  health: z
    .string()
    .min(1, 'La salud es requerida')
    .refine(
      (val) => !isNaN(parseInt(val)) && parseInt(val) >= 1 && parseInt(val) <= 10,
      'La salud debe ser un número entre 1 y 10'
    ),
  weight: z.enum(weightLevels, {
    message: 'Seleccione un nivel de peso',
  }),
  honeyMaturity: z
    .string()
    .min(1, 'La madurez de la miel es requerida')
    .refine(
      (val) => !isNaN(parseInt(val)) && parseInt(val) >= 0 && parseInt(val) <= 100,
      'La madurez debe ser un porcentaje entre 0 y 100'
    ),
  status: z.enum(colmenaStatuses, {
    message: 'Seleccione un estado válido',
  }),
  notes: z.string().optional(),
});

export type ColmenaFormData = z.infer<typeof colmenaFormSchema>;

// Select options for Apiario
export const apiarioStatusOptions = [
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' },
];

// Select options for Colmena
export const colmenaStatusOptions = [
  { value: 'active', label: 'Activa' },
  { value: 'producing', label: 'Produciendo' },
  { value: 'resting', label: 'En Descanso' },
  { value: 'quarantine', label: 'Cuarentena' },
  { value: 'inactive', label: 'Inactiva' },
];

export const queenStatusOptions = [
  { value: 'present', label: 'Presente' },
  { value: 'absent', label: 'Ausente' },
  { value: 'new', label: 'Nueva' },
];

export const populationOptions = [
  { value: 'low', label: 'Baja' },
  { value: 'medium', label: 'Media' },
  { value: 'high', label: 'Alta' },
];

export const weightOptions = [
  { value: 'bad', label: 'Malo' },
  { value: 'regular', label: 'Regular' },
  { value: 'good', label: 'Bueno' },
];

// WorkPlan constants
export const workPlanStatuses = ['pending', 'in_progress', 'completed', 'cancelled'] as const;
export const workPlanActivityTypes = [
  'medication',
  'panel_change',
  'feeding',
  'revision',
  'queen_change',
  'reproduction',
  'harvest',
  'maintenance',
  'other',
] as const;
export const workPlanPriorities = ['high', 'medium', 'low'] as const;

// WorkPlan Form Schema
export const workPlanFormSchema = z.object({
  title: z
    .string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(100, 'El título no puede tener más de 100 caracteres'),
  description: z.string().optional(),
  apiarioId: z.string().optional(),
  colmenaId: z.string().optional(),
  activityType: z.enum(workPlanActivityTypes, {
    message: 'Seleccione un tipo de actividad',
  }),
  scheduledDate: z.string().min(1, 'La fecha programada es requerida'),
  estimatedDuration: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) > 0),
      'La duración debe ser un número mayor a 0'
    ),
  assignedTo: z.string().optional(),
  priority: z.enum(workPlanPriorities, {
    message: 'Seleccione una prioridad',
  }),
  status: z.enum(workPlanStatuses, {
    message: 'Seleccione un estado',
  }),
  notes: z.string().optional(),
});

export type WorkPlanFormData = z.infer<typeof workPlanFormSchema>;

// Select options for WorkPlan
export const workPlanStatusOptions = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'in_progress', label: 'En Progreso' },
  { value: 'completed', label: 'Completado' },
  { value: 'cancelled', label: 'Cancelado' },
];

export const workPlanActivityTypeOptions = [
  { value: 'medication', label: 'Aplicación de Medicamentos' },
  { value: 'panel_change', label: 'Cambio de Panales' },
  { value: 'feeding', label: 'Alimentación' },
  { value: 'revision', label: 'Revisión' },
  { value: 'queen_change', label: 'Cambio de Reinas' },
  { value: 'reproduction', label: 'Reproducción' },
  { value: 'harvest', label: 'Cosecha' },
  { value: 'maintenance', label: 'Mantenimiento' },
  { value: 'other', label: 'Otros' },
];

export const workPlanPriorityOptions = [
  { value: 'high', label: 'Alta' },
  { value: 'medium', label: 'Media' },
  { value: 'low', label: 'Baja' },
];

// ========================================
// Accion Apicultura Schema
// ========================================

export const accionApiculturaTypes = [
  'medication',
  'panel_change',
  'feeding',
  'revision',
  'queen_change',
  'reproduction',
  'harvest',
] as const;

export const reproductionTypes = [
  'free_mating',
  'insemination',
  'queen_introduction',
  'queen_raising',
] as const;

export const accionApiculturaFormSchema = z.object({
  apiarioId: z.string().min(1, 'Seleccione un apiario'),
  colmenaId: z.string().optional(),
  type: z.enum(accionApiculturaTypes, {
    message: 'Seleccione un tipo de accion',
  }),
  date: z.string().min(1, 'La fecha es requerida'),
  description: z
    .string()
    .min(3, 'La descripcion debe tener al menos 3 caracteres')
    .max(500, 'La descripcion no puede tener mas de 500 caracteres'),
  performedBy: z
    .string()
    .min(2, 'El nombre de quien realiza la accion es requerido'),
  // Campos para Medicamentos
  medication: z.string().optional(),
  dosage: z.string().optional(),
  applicationMethod: z.string().optional(),
  nextApplicationDate: z.string().optional(),
  // Campos para Cambio de Panales
  panelCount: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseInt(val)) && parseInt(val) > 0),
      'La cantidad debe ser un numero positivo'
    ),
  waxOrigin: z.string().optional(),
  // Campos para Alimentacion
  feedingType: z.string().optional(),
  insumoUsed: z.string().optional(),
  quantity: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) > 0),
      'La cantidad debe ser un numero positivo'
    ),
  unit: z.string().optional(),
  // Campos para Reproduccion
  reproductionType: z.enum(reproductionTypes).optional(),
  reproductionDetails: z.string().optional(),
  notes: z.string().optional(),
});

export type AccionApiculturaFormData = z.infer<typeof accionApiculturaFormSchema>;

// Accion Type Options
export const accionApiculturaTypeOptions = [
  { value: 'medication', label: 'Aplicacion de Medicamentos' },
  { value: 'panel_change', label: 'Cambio de Panales' },
  { value: 'feeding', label: 'Alimentacion' },
  { value: 'revision', label: 'Revision' },
  { value: 'queen_change', label: 'Cambio de Reinas' },
  { value: 'reproduction', label: 'Reproduccion y Crias' },
  { value: 'harvest', label: 'Cosecha' },
];

// Reproduction Type Options
export const reproductionTypeOptions = [
  { value: 'free_mating', label: 'Apareamiento Libre' },
  { value: 'insemination', label: 'Inseminacion' },
  { value: 'queen_introduction', label: 'Introduccion de Reinas' },
  { value: 'queen_raising', label: 'Crianza Do Little' },
];

// Feeding Type Options
export const feedingTypeOptions = [
  { value: 'sugar_syrup', label: 'Jarabe de Azucar' },
  { value: 'raw_sugar', label: 'Azucar Cruda' },
  { value: 'candy', label: 'Candy/Pasta' },
  { value: 'pollen_substitute', label: 'Sustituto de Polen' },
  { value: 'other', label: 'Otro' },
];

// Application Method Options
export const applicationMethodOptions = [
  { value: 'spray', label: 'Aspersion' },
  { value: 'drip', label: 'Goteo' },
  { value: 'strips', label: 'Tiras' },
  { value: 'fumigation', label: 'Fumigacion' },
  { value: 'feeding', label: 'En Alimentacion' },
  { value: 'other', label: 'Otro' },
];

// ========================================
// Revision Schema (Formulario Completo)
// ========================================

export const postureStates = ['excellent', 'good', 'regular', 'bad', 'none'] as const;
export const amountLevels = ['none', 'low', 'medium', 'high'] as const;

export const revisionFormSchema = z.object({
  apiarioId: z.string().min(1, 'Seleccione un apiario'),
  colmenaId: z.string().optional(),
  type: z.enum(['general', 'individual'] as const, {
    message: 'Seleccione un tipo de revision',
  }),
  date: z.string().min(1, 'La fecha es requerida'),
  inspector: z
    .string()
    .min(2, 'El nombre del inspector es requerido'),
  // Estado General
  generalState: z
    .string()
    .min(1, 'El estado general es requerido')
    .refine(
      (val) => !isNaN(parseInt(val)) && parseInt(val) >= 1 && parseInt(val) <= 10,
      'El estado debe ser un numero entre 1 y 10'
    ),
  queenAge: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseInt(val)) && parseInt(val) >= 0),
      'La edad debe ser un numero valido'
    ),
  queenChanged: z.boolean().default(false),
  queenPresent: z.boolean().default(true),
  postureState: z.enum(postureStates, {
    message: 'Seleccione un estado de postura',
  }),
  sanity: z
    .string()
    .min(1, 'La sanidad es requerida')
    .refine(
      (val) => !isNaN(parseInt(val)) && parseInt(val) >= 1 && parseInt(val) <= 10,
      'La sanidad debe ser un numero entre 1 y 10'
    ),
  // Peso y Madurez
  weight: z.enum(weightLevels, {
    message: 'Seleccione un nivel de peso',
  }),
  honeyMaturity: z
    .string()
    .min(1, 'La madurez es requerida')
    .refine(
      (val) => !isNaN(parseInt(val)) && parseInt(val) >= 0 && parseInt(val) <= 100,
      'La madurez debe ser un porcentaje entre 0 y 100'
    ),
  // Revision Interna
  population: z.enum(populationLevels, {
    message: 'Seleccione un nivel de poblacion',
  }),
  broodAmount: z.enum(amountLevels, {
    message: 'Seleccione la cantidad de cria',
  }),
  pollenReserves: z.enum(amountLevels, {
    message: 'Seleccione las reservas de polen',
  }),
  nectarReserves: z.enum(amountLevels, {
    message: 'Seleccione las reservas de nectar',
  }),
  comments: z.string().optional(),
});

export type RevisionFormData = z.infer<typeof revisionFormSchema>;

// Posture State Options
export const postureStateOptions = [
  { value: 'excellent', label: 'Excelente' },
  { value: 'good', label: 'Buena' },
  { value: 'regular', label: 'Regular' },
  { value: 'bad', label: 'Mala' },
  { value: 'none', label: 'Sin Postura' },
];

// Amount Level Options
export const amountLevelOptions = [
  { value: 'none', label: 'Ninguna' },
  { value: 'low', label: 'Baja' },
  { value: 'medium', label: 'Media' },
  { value: 'high', label: 'Alta' },
];

// Revision Type Options
export const revisionTypeOptions = [
  { value: 'general', label: 'General (Apiario)' },
  { value: 'individual', label: 'Individual (Colmena)' },
];

// ========================================
// Cosecha Schema
// ========================================

export const productTypes = ['honey', 'wax', 'royal_jelly', 'propolis', 'pollen', 'hives'] as const;
export const qualityLevels = ['A', 'B', 'C'] as const;

export const cosechaFormSchema = z.object({
  apiarioId: z.string().min(1, 'Seleccione un apiario'),
  colmenaId: z.string().optional(),
  date: z.string().min(1, 'La fecha es requerida'),
  productType: z.enum(productTypes, {
    message: 'Seleccione un tipo de producto',
  }),
  quantity: z
    .string()
    .min(1, 'La cantidad es requerida')
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      'La cantidad debe ser un numero positivo'
    ),
  unit: z.string().min(1, 'La unidad es requerida'),
  quality: z.enum(qualityLevels).optional(),
  performedBy: z
    .string()
    .min(2, 'El nombre de quien realiza la cosecha es requerido'),
  notes: z.string().optional(),
});

export type CosechaFormData = z.infer<typeof cosechaFormSchema>;

// Product Type Options
export const productTypeOptions = [
  { value: 'honey', label: 'Miel' },
  { value: 'wax', label: 'Cera' },
  { value: 'royal_jelly', label: 'Jalea Real' },
  { value: 'propolis', label: 'Propoleo' },
  { value: 'pollen', label: 'Polen' },
  { value: 'hives', label: 'Colmenas' },
];

// Quality Level Options
export const qualityLevelOptions = [
  { value: 'A', label: 'Calidad A' },
  { value: 'B', label: 'Calidad B' },
  { value: 'C', label: 'Calidad C' },
];

// Unit Options by Product Type
export const unitOptionsByProduct: Record<string, { value: string; label: string }[]> = {
  honey: [
    { value: 'kg', label: 'Kilogramos' },
    { value: 'lb', label: 'Libras' },
    { value: 'lt', label: 'Litros' },
  ],
  wax: [
    { value: 'kg', label: 'Kilogramos' },
    { value: 'g', label: 'Gramos' },
  ],
  royal_jelly: [
    { value: 'g', label: 'Gramos' },
    { value: 'ml', label: 'Mililitros' },
  ],
  propolis: [
    { value: 'g', label: 'Gramos' },
    { value: 'kg', label: 'Kilogramos' },
  ],
  pollen: [
    { value: 'g', label: 'Gramos' },
    { value: 'kg', label: 'Kilogramos' },
  ],
  hives: [
    { value: 'units', label: 'Unidades' },
  ],
};
