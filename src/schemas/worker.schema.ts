import { z } from 'zod';

export const workerRoles = ['jefe', 'supervisor', 'trabajador', 'especialista', 'practicante'] as const;
export const moduleAssignments = ['agro', 'pecuario', 'apicultura', 'procesamiento', 'multiple'] as const;
export const workerStatuses = ['active', 'inactive', 'on_leave', 'temporary'] as const;

export const workerFormSchema = z.object({
  firstName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres'),
  lastName: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede tener más de 50 caracteres'),
  documentId: z
    .string()
    .min(5, 'El documento debe tener al menos 5 caracteres')
    .max(20, 'El documento no puede tener más de 20 caracteres'),
  role: z.enum(workerRoles, {
    message: 'Seleccione un rol válido',
  }),
  moduleAssignment: z.enum(moduleAssignments, {
    message: 'Seleccione un módulo válido',
  }),
  status: z.enum(workerStatuses, {
    message: 'Seleccione un estado válido',
  }),
  hireDate: z.string().min(1, 'La fecha de contratación es requerida'),
  hourlyRate: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(parseFloat(val)),
      'La tarifa debe ser un número válido'
    )
    .refine(
      (val) => !val || parseFloat(val) >= 0,
      'La tarifa debe ser un número positivo'
    ),
  email: z
    .string()
    .email('Ingrese un email válido')
    .optional()
    .or(z.literal('')),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

export type WorkerFormData = z.infer<typeof workerFormSchema>;

export const roleOptions = [
  { value: 'jefe', label: 'Jefe' },
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'trabajador', label: 'Trabajador' },
  { value: 'especialista', label: 'Especialista' },
  { value: 'practicante', label: 'Practicante' },
];

export const moduleOptions = [
  { value: 'agro', label: 'Agricultura' },
  { value: 'pecuario', label: 'Pecuario' },
  { value: 'apicultura', label: 'Apicultura' },
  { value: 'procesamiento', label: 'Procesamiento' },
  { value: 'multiple', label: 'Múltiple' },
];

export const statusOptions = [
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' },
  { value: 'on_leave', label: 'En Permiso' },
  { value: 'temporary', label: 'Temporal' },
];
