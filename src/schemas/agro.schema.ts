import { z } from 'zod';

// Lote constants
export const loteStatuses = ['active', 'resting', 'preparation'] as const;
export const irrigationTypes = ['drip', 'sprinkler', 'flood', 'none'] as const;

// Crop constants
export const cropStatuses = ['planned', 'planted', 'growing', 'flowering', 'fruiting', 'ready', 'harvested'] as const;
export const productTypes = ['primary', 'secondary'] as const;

// Lote Form Schema
export const loteFormSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres'),
  code: z
    .string()
    .min(1, 'El código es requerido')
    .max(20, 'El código no puede tener más de 20 caracteres'),
  area: z
    .string()
    .min(1, 'El área es requerida')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'El área debe ser un número positivo'),
  soilType: z.string().optional(),
  irrigationType: z.enum(irrigationTypes).optional(),
  status: z.enum(loteStatuses, {
    message: 'Seleccione un estado válido',
  }),
  notes: z.string().optional(),
});

export type LoteFormData = z.infer<typeof loteFormSchema>;

// Crop Form Schema
export const cropFormSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres'),
  variety: z
    .string()
    .min(1, 'La variedad es requerida')
    .max(100, 'La variedad no puede tener más de 100 caracteres'),
  productType: z.enum(productTypes, {
    message: 'Seleccione un tipo de producto',
  }),
  loteId: z.string().min(1, 'Seleccione un lote'),
  area: z
    .string()
    .min(1, 'El área es requerida')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'El área debe ser un número positivo'),
  plantingDate: z.string().min(1, 'La fecha de siembra es requerida'),
  expectedHarvestDate: z.string().min(1, 'La fecha esperada de cosecha es requerida'),
  actualHarvestDate: z.string().optional(),
  status: z.enum(cropStatuses, {
    message: 'Seleccione un estado válido',
  }),
  seedsUsed: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
      'La cantidad de semillas debe ser un número válido'
    ),
  seedsUnit: z.string().optional(),
  estimatedYield: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
      'El rendimiento estimado debe ser un número válido'
    ),
  actualYield: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
      'El rendimiento real debe ser un número válido'
    ),
  yieldUnit: z.string().optional(),
  notes: z.string().optional(),
});

export type CropFormData = z.infer<typeof cropFormSchema>;

// Select options for Lote
export const loteStatusOptions = [
  { value: 'active', label: 'Activo' },
  { value: 'resting', label: 'En Descanso' },
  { value: 'preparation', label: 'En Preparación' },
];

export const irrigationTypeOptions = [
  { value: 'drip', label: 'Goteo' },
  { value: 'sprinkler', label: 'Aspersión' },
  { value: 'flood', label: 'Inundación' },
  { value: 'none', label: 'Sin Riego' },
];

// Select options for Crop
export const cropStatusOptions = [
  { value: 'planned', label: 'Planificado' },
  { value: 'planted', label: 'Sembrado' },
  { value: 'growing', label: 'En Crecimiento' },
  { value: 'flowering', label: 'En Floración' },
  { value: 'fruiting', label: 'En Fructificación' },
  { value: 'ready', label: 'Listo para Cosecha' },
  { value: 'harvested', label: 'Cosechado' },
];

export const productTypeOptions = [
  { value: 'primary', label: 'Primario' },
  { value: 'secondary', label: 'Secundario' },
];

export const yieldUnitOptions = [
  { value: 'kg', label: 'Kilogramos (kg)' },
  { value: 'ton', label: 'Toneladas (ton)' },
  { value: 'unidades', label: 'Unidades' },
  { value: 'cajas', label: 'Cajas' },
  { value: 'manojos', label: 'Manojos' },
];

// AgroAction constants
export const agroActionTypes = [
  'planting',
  'irrigation',
  'fertilization',
  'pesticide',
  'weeding',
  'pruning',
  'harvest',
  'soil_preparation',
] as const;

// Harvest constants
export const harvestQualities = ['A', 'B', 'C'] as const;
export const harvestDestinations = ['sale', 'processing', 'storage', 'seeds'] as const;

// AgroAction Form Schema
export const agroActionFormSchema = z.object({
  loteId: z.string().min(1, 'Seleccione un lote'),
  cropId: z.string().optional(),
  type: z.enum(agroActionTypes, {
    message: 'Seleccione un tipo de accion',
  }),
  date: z.string().min(1, 'La fecha es requerida'),
  description: z
    .string()
    .min(5, 'La descripcion debe tener al menos 5 caracteres')
    .max(500, 'La descripcion no puede tener mas de 500 caracteres'),
  insumoUsed: z.string().optional(),
  quantity: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
      'La cantidad debe ser un numero valido'
    ),
  unit: z.string().optional(),
  cost: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
      'El costo debe ser un numero valido'
    ),
  performedBy: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener mas de 100 caracteres'),
  weatherConditions: z.string().optional(),
  notes: z.string().optional(),
});

export type AgroActionFormData = z.infer<typeof agroActionFormSchema>;

// Harvest Form Schema
export const harvestFormSchema = z.object({
  cropId: z.string().min(1, 'Seleccione un cultivo'),
  loteId: z.string().min(1, 'Seleccione un lote'),
  date: z.string().min(1, 'La fecha es requerida'),
  quantity: z
    .string()
    .min(1, 'La cantidad es requerida')
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      'La cantidad debe ser un numero positivo'
    ),
  unit: z.string().min(1, 'La unidad es requerida'),
  quality: z.enum(harvestQualities, {
    message: 'Seleccione una calidad',
  }),
  destination: z.enum(harvestDestinations, {
    message: 'Seleccione un destino',
  }),
  pricePerUnit: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
      'El precio debe ser un numero valido'
    ),
  harvestedBy: z.string().optional(),
  notes: z.string().optional(),
});

export type HarvestFormData = z.infer<typeof harvestFormSchema>;

// Select options for AgroAction
export const agroActionTypeOptions = [
  { value: 'planting', label: 'Siembra' },
  { value: 'irrigation', label: 'Riego' },
  { value: 'fertilization', label: 'Fertilizacion' },
  { value: 'pesticide', label: 'Aplicacion de Pesticidas' },
  { value: 'weeding', label: 'Deshierbe' },
  { value: 'pruning', label: 'Poda' },
  { value: 'harvest', label: 'Cosecha' },
  { value: 'soil_preparation', label: 'Preparacion de Suelo' },
];

// Select options for Harvest quality
export const harvestQualityOptions = [
  { value: 'A', label: 'Calidad A - Excelente' },
  { value: 'B', label: 'Calidad B - Buena' },
  { value: 'C', label: 'Calidad C - Regular' },
];

// Select options for Harvest destination
export const harvestDestinationOptions = [
  { value: 'sale', label: 'Venta' },
  { value: 'processing', label: 'Procesamiento' },
  { value: 'storage', label: 'Almacenamiento' },
  { value: 'seeds', label: 'Semillas' },
];

// Weather condition options
export const weatherConditionOptions = [
  { value: 'sunny', label: 'Soleado' },
  { value: 'cloudy', label: 'Nublado' },
  { value: 'rainy', label: 'Lluvioso' },
  { value: 'windy', label: 'Ventoso' },
  { value: 'hot', label: 'Caluroso' },
  { value: 'cold', label: 'Frio' },
];
