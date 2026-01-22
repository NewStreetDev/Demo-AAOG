import { z } from 'zod';

export const systemModules = ['agro', 'pecuario', 'apicultura', 'procesamiento', 'activos', 'infraestructura', 'general'] as const;

// Tipos de acción por módulo
export const actionTypesByModule = {
  agro: [
    { value: 'planting', label: 'Siembra' },
    { value: 'irrigation', label: 'Riego' },
    { value: 'fertilization', label: 'Fertilización' },
    { value: 'pesticide', label: 'Aplicación de Pesticida' },
    { value: 'weeding', label: 'Deshierbe' },
    { value: 'pruning', label: 'Poda' },
    { value: 'harvest', label: 'Cosecha' },
    { value: 'soil_preparation', label: 'Preparación de Suelo' },
    { value: 'other', label: 'Otra' },
  ],
  pecuario: [
    { value: 'feeding', label: 'Alimentación' },
    { value: 'vaccination', label: 'Vacunación' },
    { value: 'deworming', label: 'Desparasitación' },
    { value: 'treatment', label: 'Tratamiento Médico' },
    { value: 'checkup', label: 'Revisión' },
    { value: 'milking', label: 'Ordeño' },
    { value: 'rotation', label: 'Rotación de Potrero' },
    { value: 'breeding', label: 'Monta/Inseminación' },
    { value: 'other', label: 'Otra' },
  ],
  apicultura: [
    { value: 'revision', label: 'Revisión' },
    { value: 'feeding', label: 'Alimentación' },
    { value: 'medication', label: 'Aplicación de Medicamento' },
    { value: 'panel_change', label: 'Cambio de Panales' },
    { value: 'queen_change', label: 'Cambio de Reina' },
    { value: 'harvest', label: 'Cosecha' },
    { value: 'free_mating', label: 'Apareamiento Libre' },
    { value: 'insemination', label: 'Inseminación' },
    { value: 'queen_introduction', label: 'Introducción de Reina' },
    { value: 'queen_raising', label: 'Crianza de Reinas' },
    { value: 'other', label: 'Otra' },
  ],
  procesamiento: [
    { value: 'processing', label: 'Procesamiento' },
    { value: 'packaging', label: 'Empaque' },
    { value: 'labeling', label: 'Etiquetado' },
    { value: 'quality_control', label: 'Control de Calidad' },
    { value: 'storage', label: 'Almacenamiento' },
    { value: 'cleaning', label: 'Limpieza' },
    { value: 'other', label: 'Otra' },
  ],
  activos: [
    { value: 'maintenance', label: 'Mantenimiento' },
    { value: 'repair', label: 'Reparación' },
    { value: 'inspection', label: 'Inspección' },
    { value: 'cleaning', label: 'Limpieza' },
    { value: 'calibration', label: 'Calibración' },
    { value: 'other', label: 'Otra' },
  ],
  infraestructura: [
    { value: 'maintenance', label: 'Mantenimiento' },
    { value: 'repair', label: 'Reparación' },
    { value: 'inspection', label: 'Inspección' },
    { value: 'cleaning', label: 'Limpieza' },
    { value: 'installation', label: 'Instalación' },
    { value: 'other', label: 'Otra' },
  ],
  general: [
    { value: 'administrative', label: 'Administrativa' },
    { value: 'transport', label: 'Transporte' },
    { value: 'meeting', label: 'Reunión' },
    { value: 'training', label: 'Capacitación' },
    { value: 'other', label: 'Otra' },
  ],
} as const;

// Schema para insumo en acción
export const actionInsumoSchema = z.object({
  insumoId: z.string().min(1, 'Seleccione un insumo'),
  insumoName: z.string(),
  quantity: z.number().positive('La cantidad debe ser mayor a 0'),
  unit: z.string(),
});

// Schema principal del formulario de acción
export const actionFormSchema = z.object({
  module: z.enum(systemModules, {
    message: 'Seleccione un módulo',
  }),
  actionType: z.string().min(1, 'Seleccione un tipo de acción'),
  date: z.string().min(1, 'La fecha es requerida'),
  workerId: z.string().min(1, 'Seleccione un trabajador'),
  workerName: z.string().optional(),
  totalHours: z
    .string()
    .min(1, 'Las horas son requeridas')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Las horas deben ser mayor a 0'),
  description: z.string().optional(),
  targetId: z.string().optional(),
  targetName: z.string().optional(),
  notes: z.string().optional(),
});

export type ActionFormData = z.infer<typeof actionFormSchema>;
export type ActionInsumoData = z.infer<typeof actionInsumoSchema>;

// Helper para obtener tipos de acción por módulo
export function getActionTypesForModule(module: string) {
  return actionTypesByModule[module as keyof typeof actionTypesByModule] || actionTypesByModule.general;
}

// Helper para obtener label del tipo de acción
export function getActionTypeLabel(module: string, actionType: string): string {
  const types = getActionTypesForModule(module);
  const found = types.find((t) => t.value === actionType);
  return found?.label || actionType;
}

// Opciones de módulos
export const moduleOptions = [
  { value: 'agro', label: 'Agricultura' },
  { value: 'pecuario', label: 'Pecuario' },
  { value: 'apicultura', label: 'Apicultura' },
  { value: 'procesamiento', label: 'Procesamiento' },
  { value: 'activos', label: 'Activos' },
  { value: 'infraestructura', label: 'Infraestructura' },
  { value: 'general', label: 'General' },
];
