import { z } from 'zod';

// ==================== FINCA SCHEMA ====================

export const fincaStatuses = ['active', 'inactive'] as const;

export const fincaFormSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener mas de 100 caracteres'),
  totalArea: z
    .string()
    .min(1, 'El area total es requerida')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'El area debe ser un numero positivo'),
  lat: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= -90 && parseFloat(val) <= 90),
      'La latitud debe estar entre -90 y 90'
    ),
  lng: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= -180 && parseFloat(val) <= 180),
      'La longitud debe estar entre -180 y 180'
    ),
  address: z.string().optional(),
  department: z.string().optional(),
  municipality: z.string().optional(),
  owner: z
    .string()
    .min(2, 'El propietario debe tener al menos 2 caracteres')
    .max(100, 'El propietario no puede tener mas de 100 caracteres'),
  contactPhone: z.string().optional(),
  contactEmail: z
    .string()
    .optional()
    .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), 'Ingrese un email valido'),
  status: z.enum(fincaStatuses, {
    message: 'Seleccione un estado valido',
  }),
  description: z.string().optional(),
  notes: z.string().optional(),
});

export type FincaFormData = z.infer<typeof fincaFormSchema>;

// Finca status options
export const fincaStatusOptions = [
  { value: 'active', label: 'Activa' },
  { value: 'inactive', label: 'Inactiva' },
];

// ==================== DIVISION SCHEMA ====================

export const divisionTypes = [
  'potrero',
  'lote_agricola',
  'apiario',
  'infraestructura',
  'reserva',
  'bosque',
  'agua',
  'otro',
] as const;

export const divisionStatuses = ['active', 'inactive', 'maintenance', 'resting'] as const;

export const moduleAssociations = [
  'agro',
  'pecuario',
  'apicultura',
  'procesamiento',
  'activos',
  'infraestructura',
  'general',
] as const;

export const divisionFormSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener mas de 100 caracteres'),
  code: z
    .string()
    .min(2, 'El codigo debe tener al menos 2 caracteres')
    .max(20, 'El codigo no puede tener mas de 20 caracteres'),
  type: z.enum(divisionTypes, {
    message: 'Seleccione un tipo de division',
  }),
  area: z
    .string()
    .min(1, 'El area es requerida')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'El area debe ser un numero positivo'),
  status: z.enum(divisionStatuses, {
    message: 'Seleccione un estado valido',
  }),
  lat: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= -90 && parseFloat(val) <= 90),
      'La latitud debe estar entre -90 y 90'
    ),
  lng: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= -180 && parseFloat(val) <= 180),
      'La longitud debe estar entre -180 y 180'
    ),
  parentDivisionId: z.string().optional(),
  moduleAssociation: z.enum(moduleAssociations).optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
});

export type DivisionFormData = z.infer<typeof divisionFormSchema>;

// Division type options
export const divisionTypeOptions = [
  { value: 'potrero', label: 'Potrero' },
  { value: 'lote_agricola', label: 'Lote Agricola' },
  { value: 'apiario', label: 'Apiario' },
  { value: 'infraestructura', label: 'Infraestructura' },
  { value: 'reserva', label: 'Reserva Natural' },
  { value: 'bosque', label: 'Bosque' },
  { value: 'agua', label: 'Cuerpo de Agua' },
  { value: 'otro', label: 'Otro' },
];

// Division status options
export const divisionStatusOptions = [
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' },
  { value: 'maintenance', label: 'En Mantenimiento' },
  { value: 'resting', label: 'En Descanso' },
];

// Module association options
export const moduleAssociationOptions = [
  { value: 'agro', label: 'Agricultura' },
  { value: 'pecuario', label: 'Pecuario' },
  { value: 'apicultura', label: 'Apicultura' },
  { value: 'procesamiento', label: 'Procesamiento' },
  { value: 'activos', label: 'Activos' },
  { value: 'infraestructura', label: 'Infraestructura' },
  { value: 'general', label: 'General' },
];

// ==================== GENERAL PLAN SCHEMA ====================

export const planActionTypes = [
  'mantenimiento',
  'siembra',
  'cosecha',
  'tratamiento',
  'vacunacion',
  'revision',
  'compra',
  'venta',
  'reparacion',
  'capacitacion',
  'otro',
] as const;

export const planPriorities = ['high', 'medium', 'low'] as const;

export const planStatuses = ['pending', 'in_progress', 'completed', 'cancelled'] as const;

export const generalPlanFormSchema = z.object({
  title: z
    .string()
    .min(3, 'El titulo debe tener al menos 3 caracteres')
    .max(200, 'El titulo no puede tener mas de 200 caracteres'),
  description: z.string().optional(),
  actionType: z.enum(planActionTypes, {
    message: 'Seleccione un tipo de accion',
  }),
  targetModule: z.enum(moduleAssociations).optional(),
  targetDivisionId: z.string().optional(),
  scheduledDate: z.string().min(1, 'La fecha programada es requerida'),
  dueDate: z.string().optional(),
  estimatedDuration: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) > 0),
      'La duracion debe ser un numero positivo'
    ),
  estimatedCost: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
      'El costo debe ser un numero valido'
    ),
  actualCost: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
      'El costo debe ser un numero valido'
    ),
  assignedTo: z.string().optional(),
  priority: z.enum(planPriorities, {
    message: 'Seleccione una prioridad',
  }),
  status: z.enum(planStatuses, {
    message: 'Seleccione un estado',
  }),
  notes: z.string().optional(),
});

export type GeneralPlanFormData = z.infer<typeof generalPlanFormSchema>;

// Plan action type options
export const planActionTypeOptions = [
  { value: 'mantenimiento', label: 'Mantenimiento' },
  { value: 'siembra', label: 'Siembra' },
  { value: 'cosecha', label: 'Cosecha' },
  { value: 'tratamiento', label: 'Tratamiento' },
  { value: 'vacunacion', label: 'Vacunacion' },
  { value: 'revision', label: 'Revision' },
  { value: 'compra', label: 'Compra' },
  { value: 'venta', label: 'Venta' },
  { value: 'reparacion', label: 'Reparacion' },
  { value: 'capacitacion', label: 'Capacitacion' },
  { value: 'otro', label: 'Otro' },
];

// Priority options
export const priorityOptions = [
  { value: 'high', label: 'Alta' },
  { value: 'medium', label: 'Media' },
  { value: 'low', label: 'Baja' },
];

// Status options
export const planStatusOptions = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'in_progress', label: 'En Progreso' },
  { value: 'completed', label: 'Completado' },
  { value: 'cancelled', label: 'Cancelado' },
];
