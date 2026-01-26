import { z } from 'zod';

// Species constants
export const livestockSpecies = ['bovine', 'porcine', 'caprine', 'buffalo', 'equine', 'ovine', 'poultry'] as const;

// Livestock constants - todas las categorías posibles
export const livestockCategories = [
  // Bovinos
  'ternero', 'ternera', 'novillo', 'novilla', 'vaca', 'toro',
  // Porcinos
  'lechon', 'lechona', 'cerdo', 'cerda', 'verraco',
  // Caprinos
  'cabrito', 'cabrita', 'chivo', 'cabra', 'semental_caprino',
  // Bufalinos
  'bucerro', 'bucerra', 'bubillo', 'bubilla', 'bufala', 'bufalo',
  // Equinos
  'potro', 'potra', 'caballo', 'yegua', 'semental_equino',
  // Ovinos
  'cordero', 'cordera', 'borrego', 'oveja', 'carnero',
  // Aves
  'gallina', 'gallo', 'pollo', 'chompipe', 'pato', 'pata', 'ave_otro',
] as const;

export const livestockStatuses = ['active', 'sold', 'deceased', 'transferred'] as const;
export const genders = ['male', 'female'] as const;
export const entryReasons = ['birth', 'purchase', 'transfer'] as const;
export const exitReasons = ['sale', 'death', 'transfer', 'slaughter'] as const;

// Potrero constants
export const potreroStatuses = ['active', 'resting', 'maintenance'] as const;

// Livestock Form Schema
export const livestockFormSchema = z.object({
  tag: z
    .string()
    .min(1, 'El arete es requerido')
    .max(20, 'El arete no puede tener más de 20 caracteres'),
  name: z.string().optional(),
  species: z.enum(livestockSpecies, {
    message: 'Seleccione una especie válida',
  }),
  category: z.enum(livestockCategories, {
    message: 'Seleccione una categoría válida',
  }),
  breed: z
    .string()
    .min(1, 'La raza es requerida')
    .max(50, 'La raza no puede tener más de 50 caracteres'),
  birthDate: z.string().min(1, 'La fecha de nacimiento es requerida'),
  gender: z.enum(genders, {
    message: 'Seleccione un género',
  }),
  weight: z
    .string()
    .min(1, 'El peso es requerido')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'El peso debe ser un número positivo'),
  status: z.enum(livestockStatuses, {
    message: 'Seleccione un estado válido',
  }),
  location: z
    .string()
    .min(1, 'La ubicación es requerida')
    .max(100, 'La ubicación no puede tener más de 100 caracteres'),
  // Seguimiento de padres (opcional, solo aplica para especies que lo requieren)
  motherId: z.string().optional(),
  motherTag: z.string().optional(),
  fatherId: z.string().optional(),
  fatherTag: z.string().optional(),
  entryDate: z.string().min(1, 'La fecha de entrada es requerida'),
  entryReason: z.enum(entryReasons, {
    message: 'Seleccione una razón de entrada',
  }),
  exitDate: z.string().optional(),
  exitReason: z.enum(exitReasons).optional(),
  notes: z.string().optional(),
});

export type LivestockFormData = z.infer<typeof livestockFormSchema>;

// Potrero Form Schema
export const potreroFormSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres'),
  area: z
    .string()
    .min(1, 'El área es requerida')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'El área debe ser un número positivo'),
  capacity: z
    .string()
    .min(1, 'La capacidad es requerida')
    .refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, 'La capacidad debe ser un número positivo'),
  currentOccupancy: z
    .string()
    .min(1, 'La ocupación actual es requerida')
    .refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, 'La ocupación debe ser un número válido'),
  status: z.enum(potreroStatuses, {
    message: 'Seleccione un estado válido',
  }),
  grassType: z.string().optional(),
  lastRotation: z.string().optional(),
  nextRotation: z.string().optional(),
  notes: z.string().optional(),
});

export type PotreroFormData = z.infer<typeof potreroFormSchema>;

// Select options for Species
export const speciesOptions = [
  { value: 'bovine', label: 'Bovinos' },
  { value: 'porcine', label: 'Porcinos' },
  { value: 'caprine', label: 'Caprinos' },
  { value: 'buffalo', label: 'Bufalinos' },
  { value: 'equine', label: 'Equinos' },
  { value: 'ovine', label: 'Ovinos' },
  { value: 'poultry', label: 'Aves' },
];

// Select options for Livestock categories by species
export const categoryOptionsBySpecies: Record<string, { value: string; label: string }[]> = {
  bovine: [
    { value: 'ternero', label: 'Ternero' },
    { value: 'ternera', label: 'Ternera' },
    { value: 'novillo', label: 'Novillo' },
    { value: 'novilla', label: 'Novilla' },
    { value: 'vaca', label: 'Vaca' },
    { value: 'toro', label: 'Toro' },
  ],
  porcine: [
    { value: 'lechon', label: 'Lechón' },
    { value: 'lechona', label: 'Lechona' },
    { value: 'cerdo', label: 'Cerdo' },
    { value: 'cerda', label: 'Cerda' },
    { value: 'verraco', label: 'Verraco' },
  ],
  caprine: [
    { value: 'cabrito', label: 'Cabrito' },
    { value: 'cabrita', label: 'Cabrita' },
    { value: 'chivo', label: 'Chivo' },
    { value: 'cabra', label: 'Cabra' },
    { value: 'semental_caprino', label: 'Semental' },
  ],
  buffalo: [
    { value: 'bucerro', label: 'Bucerro' },
    { value: 'bucerra', label: 'Bucerra' },
    { value: 'bubillo', label: 'Bubillo' },
    { value: 'bubilla', label: 'Bubilla' },
    { value: 'bufala', label: 'Búfala' },
    { value: 'bufalo', label: 'Búfalo' },
  ],
  equine: [
    { value: 'potro', label: 'Potro' },
    { value: 'potra', label: 'Potra' },
    { value: 'caballo', label: 'Caballo' },
    { value: 'yegua', label: 'Yegua' },
    { value: 'semental_equino', label: 'Semental' },
  ],
  ovine: [
    { value: 'cordero', label: 'Cordero' },
    { value: 'cordera', label: 'Cordera' },
    { value: 'borrego', label: 'Borrego' },
    { value: 'oveja', label: 'Oveja' },
    { value: 'carnero', label: 'Carnero' },
  ],
  poultry: [
    { value: 'gallina', label: 'Gallina' },
    { value: 'gallo', label: 'Gallo' },
    { value: 'pollo', label: 'Pollo' },
    { value: 'chompipe', label: 'Chompipe' },
    { value: 'pato', label: 'Pato' },
    { value: 'pata', label: 'Pata' },
    { value: 'ave_otro', label: 'Otra Ave' },
  ],
};

// All category options (for backwards compatibility)
export const categoryOptions = [
  { value: 'ternero', label: 'Ternero' },
  { value: 'ternera', label: 'Ternera' },
  { value: 'novillo', label: 'Novillo' },
  { value: 'novilla', label: 'Novilla' },
  { value: 'vaca', label: 'Vaca' },
  { value: 'toro', label: 'Toro' },
];

export const genderOptions = [
  { value: 'male', label: 'Macho' },
  { value: 'female', label: 'Hembra' },
];

export const livestockStatusOptions = [
  { value: 'active', label: 'Activo' },
  { value: 'sold', label: 'Vendido' },
  { value: 'deceased', label: 'Fallecido' },
  { value: 'transferred', label: 'Transferido' },
];

export const entryReasonOptions = [
  { value: 'birth', label: 'Nacimiento' },
  { value: 'purchase', label: 'Compra' },
  { value: 'transfer', label: 'Transferencia' },
];

export const exitReasonOptions = [
  { value: 'sale', label: 'Venta' },
  { value: 'death', label: 'Muerte' },
  { value: 'transfer', label: 'Transferencia' },
  { value: 'slaughter', label: 'Sacrificio' },
];

// Select options for Potrero
export const potreroStatusOptions = [
  { value: 'active', label: 'Activo' },
  { value: 'resting', label: 'En Descanso' },
  { value: 'maintenance', label: 'En Mantenimiento' },
];

// ========================================
// Health Record Schema (Individual animal)
// ========================================

export const healthRecordTypes = ['vaccination', 'treatment', 'checkup', 'deworming', 'surgery'] as const;

export const healthRecordFormSchema = z.object({
  livestockId: z.string().min(1, 'Seleccione un animal'),
  livestockTag: z.string().min(1, 'El arete del animal es requerido'),
  date: z.string().min(1, 'La fecha es requerida'),
  type: z.enum(healthRecordTypes, {
    message: 'Seleccione un tipo de acción',
  }),
  description: z
    .string()
    .min(3, 'La descripción debe tener al menos 3 caracteres')
    .max(500, 'La descripción no puede tener más de 500 caracteres'),
  medication: z.string().optional(),
  dosage: z.string().optional(),
  veterinarian: z.string().optional(),
  cost: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
      'El costo debe ser un número válido'
    ),
  nextCheckup: z.string().optional(),
  notes: z.string().optional(),
});

export type HealthRecordFormData = z.infer<typeof healthRecordFormSchema>;

// Health Record Type Options
export const healthRecordTypeOptions = [
  { value: 'vaccination', label: 'Vacunacion' },
  { value: 'treatment', label: 'Tratamiento' },
  { value: 'deworming', label: 'Desparasitacion' },
  { value: 'checkup', label: 'Revision' },
  { value: 'surgery', label: 'Cirugia' },
];

// ========================================
// Group Health Action Schema
// ========================================

export const groupHealthActionTypes = ['vaccination', 'treatment', 'deworming', 'checkup'] as const;

export const groupHealthActionFormSchema = z.object({
  // Target selection - at least one must be provided
  groupId: z.string().optional(),
  groupName: z.string().optional(),
  species: z.enum(livestockSpecies).optional(),
  category: z.enum(livestockCategories).optional(),
  // Action details
  affectedCount: z
    .string()
    .min(1, 'El numero de animales afectados es requerido')
    .refine(
      (val) => !isNaN(parseInt(val)) && parseInt(val) > 0,
      'El numero debe ser mayor a 0'
    ),
  date: z.string().min(1, 'La fecha es requerida'),
  type: z.enum(groupHealthActionTypes, {
    message: 'Seleccione un tipo de accion',
  }),
  description: z
    .string()
    .min(3, 'La descripcion debe tener al menos 3 caracteres')
    .max(500, 'La descripcion no puede tener mas de 500 caracteres'),
  medication: z.string().optional(),
  performedBy: z
    .string()
    .min(2, 'El nombre de quien realiza la accion es requerido'),
  cost: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
      'El costo debe ser un numero valido'
    ),
  notes: z.string().optional(),
});

export type GroupHealthActionFormData = z.infer<typeof groupHealthActionFormSchema>;

// Group Health Action Type Options
export const groupHealthActionTypeOptions = [
  { value: 'vaccination', label: 'Vacunacion' },
  { value: 'treatment', label: 'Tratamiento' },
  { value: 'deworming', label: 'Desparasitacion' },
  { value: 'checkup', label: 'Revision' },
];

// ========================================
// Reproduction Record Schema
// ========================================

export const reproductionTypes = ['natural', 'artificial_insemination'] as const;
export const reproductionStatuses = ['pending', 'confirmed', 'failed', 'born'] as const;

export const reproductionRecordFormSchema = z.object({
  cowId: z.string().min(1, 'Seleccione una hembra'),
  cowTag: z.string().min(1, 'El arete de la hembra es requerido'),
  bullId: z.string().optional(),
  bullTag: z.string().optional(),
  type: z.enum(reproductionTypes, {
    message: 'Seleccione un tipo de reproduccion',
  }),
  serviceDate: z.string().min(1, 'La fecha de servicio es requerida'),
  expectedBirthDate: z.string().optional(),
  actualBirthDate: z.string().optional(),
  status: z.enum(reproductionStatuses, {
    message: 'Seleccione un estado',
  }),
  calfId: z.string().optional(),
  calfTag: z.string().optional(),
  notes: z.string().optional(),
});

export type ReproductionRecordFormData = z.infer<typeof reproductionRecordFormSchema>;

// Reproduction type options
export const reproductionTypeOptions = [
  { value: 'natural', label: 'Monta natural' },
  { value: 'artificial_insemination', label: 'Inseminacion artificial' },
];

// Reproduction status options
export const reproductionStatusOptions = [
  { value: 'pending', label: 'Pendiente confirmacion' },
  { value: 'confirmed', label: 'Prenez confirmada' },
  { value: 'failed', label: 'Fallido' },
  { value: 'born', label: 'Nacido' },
];

// ========================================
// Milk Production Schema
// ========================================

export const milkShifts = ['morning', 'afternoon'] as const;
export const milkQualities = ['A', 'B', 'C'] as const;
export const milkDestinations = ['sale', 'processing', 'calves'] as const;

export const milkProductionFormSchema = z.object({
  date: z.string().min(1, 'La fecha es requerida'),
  shift: z.enum(milkShifts, {
    message: 'Seleccione un turno',
  }),
  totalLiters: z
    .string()
    .min(1, 'Los litros totales son requeridos')
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      'Los litros deben ser un numero positivo'
    ),
  cowsMilked: z
    .string()
    .min(1, 'El numero de vacas ordenadas es requerido')
    .refine(
      (val) => !isNaN(parseInt(val)) && parseInt(val) > 0,
      'El numero de vacas debe ser mayor a 0'
    ),
  avgPerCow: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
      'El promedio debe ser un numero valido'
    ),
  temperature: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0 && parseFloat(val) <= 50),
      'La temperatura debe estar entre 0 y 50 grados'
    ),
  quality: z.enum(milkQualities).optional(),
  destination: z.enum(milkDestinations).optional(),
  notes: z.string().optional(),
});

export type MilkProductionFormData = z.infer<typeof milkProductionFormSchema>;

// Milk shift options
export const milkShiftOptions = [
  { value: 'morning', label: 'Manana' },
  { value: 'afternoon', label: 'Tarde' },
];

// Milk quality options
export const milkQualityOptions = [
  { value: 'A', label: 'Calidad A' },
  { value: 'B', label: 'Calidad B' },
  { value: 'C', label: 'Calidad C' },
];

// Milk destination options
export const milkDestinationOptions = [
  { value: 'sale', label: 'Venta' },
  { value: 'processing', label: 'Procesamiento' },
  { value: 'calves', label: 'Terneros' },
];

// ========================================
// Livestock Group Schema
// ========================================

export const livestockGroupFormSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener mas de 100 caracteres'),
  species: z.enum(livestockSpecies, {
    message: 'Seleccione una especie valida',
  }),
  category: z.enum(livestockCategories, {
    message: 'Seleccione una categoria valida',
  }),
  count: z
    .string()
    .min(1, 'La cantidad es requerida')
    .refine(
      (val) => !isNaN(parseInt(val)) && parseInt(val) > 0,
      'La cantidad debe ser un numero positivo'
    ),
  location: z
    .string()
    .min(1, 'La ubicacion es requerida')
    .max(100, 'La ubicacion no puede tener mas de 100 caracteres'),
  description: z.string().optional(),
});

export type LivestockGroupFormData = z.infer<typeof livestockGroupFormSchema>;
