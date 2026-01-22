import { z } from 'zod';

// Facility constants
export const facilityTypes = [
  'building',
  'storage',
  'processing',
  'housing',
  'greenhouse',
  'barn',
  'water_reservoir',
  'tank',
  'irrigation_system',
  'well',
  'water_intake',
  'other',
] as const;

export const facilityStatuses = ['operational', 'maintenance', 'out_of_service', 'under_construction'] as const;

export const moduleAssignments = ['agro', 'pecuario', 'apicultura', 'procesamiento', 'general'] as const;

// Equipment constants
export const equipmentTypes = ['vehicle', 'machinery', 'tool', 'irrigation', 'electrical', 'other'] as const;

export const equipmentStatuses = ['operational', 'maintenance', 'repair', 'out_of_service'] as const;

// Facility Form Schema
export const facilityFormSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres'),
  type: z.enum(facilityTypes, {
    message: 'Seleccione un tipo válido',
  }),
  description: z.string().optional(),
  location: z
    .string()
    .min(1, 'La ubicación es requerida'),
  area: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) > 0),
      'El área debe ser un número positivo'
    ),
  capacity: z.string().optional(),
  status: z.enum(facilityStatuses, {
    message: 'Seleccione un estado válido',
  }),
  constructionDate: z.string().optional(),
  lastMaintenanceDate: z.string().optional(),
  nextMaintenanceDate: z.string().optional(),
  assignedModule: z.enum(moduleAssignments).optional(),
  notes: z.string().optional(),
});

export type FacilityFormData = z.infer<typeof facilityFormSchema>;

// Equipment Form Schema
export const equipmentFormSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres'),
  type: z.enum(equipmentTypes, {
    message: 'Seleccione un tipo válido',
  }),
  brand: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  status: z.enum(equipmentStatuses, {
    message: 'Seleccione un estado válido',
  }),
  purchaseDate: z.string().optional(),
  lastMaintenanceDate: z.string().optional(),
  nextMaintenanceDate: z.string().optional(),
  location: z
    .string()
    .min(1, 'La ubicación es requerida'),
  assignedTo: z.string().optional(),
  value: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
      'El valor debe ser un número válido'
    ),
  notes: z.string().optional(),
});

export type EquipmentFormData = z.infer<typeof equipmentFormSchema>;

// Select options for Facility
export const facilityTypeOptions = [
  { value: 'building', label: 'Edificio' },
  { value: 'storage', label: 'Almacén' },
  { value: 'processing', label: 'Procesamiento' },
  { value: 'housing', label: 'Vivienda' },
  { value: 'greenhouse', label: 'Invernadero' },
  { value: 'barn', label: 'Establo' },
  { value: 'water_reservoir', label: 'Reservorio de Agua' },
  { value: 'tank', label: 'Tanque' },
  { value: 'irrigation_system', label: 'Sistema de Riego' },
  { value: 'well', label: 'Pozo' },
  { value: 'water_intake', label: 'Captación de Agua' },
  { value: 'other', label: 'Otro' },
];

export const facilityStatusOptions = [
  { value: 'operational', label: 'Operativa' },
  { value: 'maintenance', label: 'En Mantenimiento' },
  { value: 'out_of_service', label: 'Fuera de Servicio' },
  { value: 'under_construction', label: 'En Construcción' },
];

// Select options for Equipment
export const equipmentTypeOptions = [
  { value: 'vehicle', label: 'Vehículo' },
  { value: 'machinery', label: 'Maquinaria' },
  { value: 'tool', label: 'Herramienta' },
  { value: 'irrigation', label: 'Riego' },
  { value: 'electrical', label: 'Eléctrico' },
  { value: 'other', label: 'Otro' },
];

export const equipmentStatusOptions = [
  { value: 'operational', label: 'Operativo' },
  { value: 'maintenance', label: 'En Mantenimiento' },
  { value: 'repair', label: 'En Reparación' },
  { value: 'out_of_service', label: 'Fuera de Servicio' },
];

export const moduleAssignmentOptions = [
  { value: 'agro', label: 'Agricultura' },
  { value: 'pecuario', label: 'Pecuario' },
  { value: 'apicultura', label: 'Apicultura' },
  { value: 'procesamiento', label: 'Procesamiento' },
  { value: 'general', label: 'General' },
];
