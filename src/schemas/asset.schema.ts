import { z } from 'zod';

export const assetCategories = [
  'land',
  'building',
  'vehicle',
  'machinery',
  'livestock',
  'equipment',
  'seeds',
  'genetic_material',
  'other',
] as const;

export const assetStatuses = ['active', 'inactive', 'disposed', 'under_maintenance'] as const;

export const depreciationMethods = ['straight_line', 'declining_balance', 'none'] as const;

export const assetFormSchema = z.object({
  code: z
    .string()
    .min(1, 'El código es requerido')
    .max(20, 'El código no puede tener más de 20 caracteres'),
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres'),
  description: z.string().optional(),
  category: z.enum(assetCategories, {
    message: 'Seleccione una categoría válida',
  }),
  status: z.enum(assetStatuses, {
    message: 'Seleccione un estado válido',
  }),
  location: z
    .string()
    .min(1, 'La ubicación es requerida'),
  acquisitionDate: z.string().min(1, 'La fecha de adquisición es requerida'),
  acquisitionCost: z
    .string()
    .min(1, 'El costo de adquisición es requerido')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, 'El costo debe ser un número válido'),
  depreciationMethod: z.enum(depreciationMethods, {
    message: 'Seleccione un método de depreciación',
  }),
  usefulLifeYears: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseInt(val)) && parseInt(val) > 0),
      'La vida útil debe ser un número positivo'
    ),
  salvageValue: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
      'El valor residual debe ser un número válido'
    ),
  assignedModule: z.string().optional(),
  responsiblePerson: z.string().optional(),
  serialNumber: z.string().optional(),
  notes: z.string().optional(),
});

export type AssetFormData = z.infer<typeof assetFormSchema>;

export const categoryOptions = [
  { value: 'land', label: 'Terreno' },
  { value: 'building', label: 'Edificación' },
  { value: 'vehicle', label: 'Vehículo' },
  { value: 'machinery', label: 'Maquinaria' },
  { value: 'livestock', label: 'Semoviente' },
  { value: 'equipment', label: 'Equipo' },
  { value: 'seeds', label: 'Semillas' },
  { value: 'genetic_material', label: 'Material Genético' },
  { value: 'other', label: 'Otro' },
];

export const statusOptions = [
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' },
  { value: 'disposed', label: 'Dado de Baja' },
  { value: 'under_maintenance', label: 'En Mantenimiento' },
];

export const depreciationMethodOptions = [
  { value: 'straight_line', label: 'Línea Recta' },
  { value: 'declining_balance', label: 'Saldo Decreciente' },
  { value: 'none', label: 'Sin Depreciación' },
];

export const moduleAssignmentOptions = [
  { value: 'none', label: 'Sin asignar' },
  { value: 'agro', label: 'Agricultura' },
  { value: 'pecuario', label: 'Pecuario' },
  { value: 'apicultura', label: 'Apicultura' },
  { value: 'procesamiento', label: 'Procesamiento' },
  { value: 'general', label: 'General' },
];
