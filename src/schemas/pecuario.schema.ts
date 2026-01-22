import { z } from 'zod';

// Livestock constants
export const livestockCategories = ['ternero', 'ternera', 'novillo', 'novilla', 'vaca', 'toro'] as const;
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

// Select options for Livestock
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
