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
