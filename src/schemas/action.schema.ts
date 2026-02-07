import { z } from 'zod';

// Modules for action forms - subset of SystemModule that can have actions
// Must be compatible with SystemModule type from common.types.ts
export const systemModules = ['mi_finca', 'agricola', 'agro', 'pecuario', 'procesamiento', 'finanzas', 'reglamentos', 'reportes', 'general'] as const;

// Tipos de acción por módulo
export const actionTypesByModule = {
  mi_finca: [
    { value: 'maintenance', label: 'Mantenimiento' },
    { value: 'planning', label: 'Planificación' },
    { value: 'other', label: 'Otra' },
  ],
  agricola: [
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
  procesamiento: [
    { value: 'processing', label: 'Procesamiento' },
    { value: 'packaging', label: 'Empaque' },
    { value: 'labeling', label: 'Etiquetado' },
    { value: 'quality_control', label: 'Control de Calidad' },
    { value: 'storage', label: 'Almacenamiento' },
    { value: 'cleaning', label: 'Limpieza' },
    { value: 'other', label: 'Otra' },
  ],
  finanzas: [
    { value: 'accounting', label: 'Contabilidad' },
    { value: 'payment', label: 'Pago' },
    { value: 'collection', label: 'Cobro' },
    { value: 'other', label: 'Otra' },
  ],
  reglamentos: [
    { value: 'document_review', label: 'Revisión de Documento' },
    { value: 'upload', label: 'Carga de Documento' },
    { value: 'other', label: 'Otra' },
  ],
  reportes: [
    { value: 'report_generation', label: 'Generación de Reporte' },
    { value: 'export', label: 'Exportación' },
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

// Opciones de módulos - for forms/selects
export const moduleOptions = [
  { value: 'mi_finca', label: 'Mi Finca' },
  { value: 'agro', label: 'Agricultura' },
  { value: 'pecuario', label: 'Pecuario' },
  { value: 'procesamiento', label: 'Procesamiento' },
  { value: 'finanzas', label: 'Finanzas' },
  { value: 'general', label: 'General' },
];
