import type { BaseEntity } from './common.types';
import type {
  InsumoUtilizado,
  HerramientaUtilizada,
  PlanPhase,
  PlanStatus,
  PlanPriority,
  GeneralPlanActionType
} from './finca.types';

// ==================== TIPOS BASE ====================

// Destino de producción unificado (usado en Harvest y RG05Record)
export type DestinoProduccion =
  | 'venta'
  | 'procesamiento'
  | 'almacen'
  | 'semilla'
  | 'autoconsumo'
  | 'donacion';

// Tipo de producto agrícola
export type ProductType = 'primary' | 'secondary';

// Estado del cultivo
export type CropStatus = 'planned' | 'planted' | 'growing' | 'flowering' | 'fruiting' | 'ready' | 'harvested';

// Tipo de acción agrícola (alineado con GeneralPlanActionType de finca.types.ts)
export type AgroActionType =
  | 'planting'           // siembra
  | 'irrigation'         // riego
  | 'fertilization'      // fertilización
  | 'pesticide'          // aplicación de pesticidas
  | 'weeding'            // deshierbe
  | 'pruning'            // poda
  | 'harvest'            // cosecha
  | 'soil_preparation'   // preparación de suelo
  | 'mantenimiento'      // mantenimiento general
  | 'tratamiento'        // tratamiento fitosanitario
  | 'revision'           // revisión/inspección
  | 'otro';              // otros

// ==================== ENTIDADES PRINCIPALES ====================

// Lote/Parcela agrícola
export interface Lote extends BaseEntity {
  fincaId: string;
  name: string;
  code: string;
  area: number; // hectáreas
  soilType?: string;
  irrigationType?: 'drip' | 'sprinkler' | 'flood' | 'none';
  status: 'active' | 'resting' | 'preparation';
  currentCropId?: string;
  location?: {
    lat: number;
    lng: number;
  };
  notes?: string;
  // Vinculación con Mi Finca
  divisionId?: string;        // Vincula con Division de finca.types.ts
  annualPlanId?: string;      // Plan anual asociado (opcional)
}

// Cultivo
export interface Crop extends BaseEntity {
  fincaId: string;
  name: string;
  variety: string;
  productType: ProductType;
  loteId: string;
  loteName?: string;
  area: number; // hectáreas sembradas
  plantingDate: Date;
  expectedHarvestDate: Date;
  actualHarvestDate?: Date;
  status: CropStatus;
  seedsUsed?: number;
  seedsUnit?: string;
  estimatedYield?: number;
  actualYield?: number;
  yieldUnit?: string;
  notes?: string;
  // Vinculación con Mi Finca y planificación
  divisionId?: string;        // Vincula con Division de finca.types.ts
  annualPlanId?: string;      // Plan anual asociado
  planPhase?: PlanPhase;      // 'initial' | 'execution'
  isFromPlanning?: boolean;   // Si viene de la planificación central
}

// Cosecha
export interface Harvest extends BaseEntity {
  fincaId: string;
  cropId: string;
  cropName?: string;
  loteId: string;
  loteName?: string;
  date: Date;
  quantity: number;
  unit: string;
  quality: 'A' | 'B' | 'C' | 'rechazo';
  destination: DestinoProduccion;
  pricePerUnit?: number;
  totalValue?: number;
  harvestedBy?: string;
  notes?: string;
  // Vinculación con Procesamiento
  batchId?: string;           // Vincula con ProcessingBatch si destino es 'processing'
}

// Acción agrícola (aplicaciones, riegos, labores, etc.)
// Actualizado para alinearse con GeneralPlan de finca.types.ts
export interface AgroAction extends BaseEntity {
  fincaId: string;
  cropId?: string;
  cropName?: string;
  loteId: string;
  loteName?: string;
  type: AgroActionType;
  date: Date;
  description: string;
  /**
   * @deprecated Usar `insumos[]` en su lugar. Mantenido solo para compatibilidad con datos antiguos.
   */
  insumoUsed?: string;
  /** @deprecated Usar `insumos[].cantidad` en su lugar */
  quantity?: number;
  /** @deprecated Usar `insumos[].unidad` en su lugar */
  unit?: string;
  /** @deprecated Usar `insumos[].costo` en su lugar */
  cost?: number;
  performedBy: string;
  weatherConditions?: string;
  notes?: string;
  // Nuevos campos alineados con GeneralPlan
  status: PlanStatus;                    // 'pending' | 'in_progress' | 'completed' | 'cancelled'
  priority?: PlanPriority;               // 'high' | 'medium' | 'low'
  annualPlanId?: string;                 // Plan anual asociado
  planPhase?: PlanPhase;                 // 'initial' | 'execution'
  linkedPlanId?: string;                 // Vincula con GeneralPlan de Mi Finca
  isFromPlanning?: boolean;              // Si viene de la planificación central
  // Insumos y herramientas estructurados (para RG04)
  insumos?: InsumoUtilizado[];           // Lista de insumos utilizados
  herramientas?: HerramientaUtilizada[]; // Lista de herramientas utilizadas
  // Campos de ejecución
  scheduledDate?: Date;                  // Fecha planificada original
  completedDate?: Date;                  // Fecha real de completación
  estimatedDuration?: number;            // Duración estimada (horas)
  actualDuration?: number;               // Duración real (horas)
  executorNotes?: string;                // Observaciones del ejecutor
}

// ==================== REPORTES RG (Sección 4 - Módulo Agrícola) ====================

/**
 * RG01Record - Plan de Manejo (del SIC - planificación inicial)
 * Representa las actividades agrícolas planificadas en la fase inicial
 * Fuente: Sistema de Información Central (SIC)
 */
export interface RG01Record extends BaseEntity {
  // Identificación
  annualPlanId: string;                  // Plan anual al que pertenece
  divisionId: string;                    // División/lote donde se ejecutará
  divisionName?: string;
  // Planificación
  actividadPlanificada: string;          // Descripción de la actividad
  tipoCultivo: string;                   // Cultivo planificado
  variedad?: string;                     // Variedad específica
  areaPlanificada: number;               // Hectáreas planificadas
  // Fechas estimadas
  fechaInicioEstimada: Date;
  fechaFinEstimada: Date;
  // Recursos planificados
  insumosEstimados?: InsumoUtilizado[];
  herramientasRequeridas?: HerramientaUtilizada[];
  costoEstimado?: number;
  // Metadatos
  responsable?: string;
  prioridad?: PlanPriority;
  observaciones?: string;
}

/**
 * RG02Record - Estimación de Producción (del SIC - planificación inicial)
 * Proyecciones de rendimiento por cultivo y división
 * Fuente: Sistema de Información Central (SIC)
 * Usado para: Balance de Masas (comparación con RG05)
 */
export interface RG02Record extends BaseEntity {
  // Identificación
  annualPlanId: string;                  // Plan anual al que pertenece
  divisionId: string;                    // División/lote
  divisionName?: string;
  // Cultivo
  cultivoId?: string;                    // Referencia al cultivo si existe
  nombreCultivo: string;
  variedad?: string;
  // Estimación
  cantidadEstimada: number;              // Producción esperada
  unidad: string;                        // kg, toneladas, quintales, etc.
  areaSembrada: number;                  // Hectáreas
  rendimientoEsperado: number;           // Por hectárea
  // Fechas
  periodoInicio: Date;                   // Inicio del período de estimación
  periodoFin: Date;                      // Fin del período de estimación
  fechaCosechaEstimada?: Date;
  // Económico
  precioEstimado?: number;               // Precio unitario esperado
  ingresoEstimado?: number;              // Ingreso total esperado
  // Metadatos
  metodologiaEstimacion?: string;        // Cómo se calculó la estimación
  confianza?: 'alta' | 'media' | 'baja'; // Nivel de confianza
  observaciones?: string;
}

/**
 * RG03Record - Bitácora de Labores (ejecución)
 * Registro de actividades realmente ejecutadas
 * Fuente: Plan de ejecución
 * Vinculado a actionId del GeneralPlan
 */
export interface RG03Record extends BaseEntity {
  // Vinculación con planificación
  actionId: string;                      // ID de la AgroAction o GeneralPlan ejecutado
  annualPlanId?: string;
  divisionId: string;
  divisionName?: string;
  // Actividad ejecutada
  actividadRealizada: string;            // Descripción de lo que se hizo
  tipoActividad: AgroActionType;
  cultivoId?: string;
  cultivoNombre?: string;
  // Ejecución
  fechaReal: Date;                       // Fecha en que se ejecutó
  horaInicio?: string;                   // HH:mm
  horaFin?: string;                      // HH:mm
  duracionHoras?: number;
  // Ejecutor
  ejecutor: string;                      // Persona que realizó la labor
  equipoTrabajo?: string[];              // Otros participantes
  // Condiciones
  condicionesClimaticas?: string;
  temperaturaDia?: number;
  humedadRelativa?: number;
  // Observaciones
  observaciones?: string;
  incidencias?: string;                  // Problemas encontrados
  fotosEvidencia?: string[];             // URLs de fotos
  // Estado
  completado: boolean;
  porcentajeAvance?: number;             // 0-100
}

/**
 * RG04Record - Insumos Utilizados (ejecución)
 * Registro de insumos realmente consumidos
 * Fuente: Plan de ejecución
 * Vinculado a actionId del GeneralPlan
 */
export interface RG04Record extends BaseEntity {
  // Vinculación
  actionId: string;                      // ID de la AgroAction o GeneralPlan
  rg03RecordId?: string;                 // Referencia a la bitácora de labores
  annualPlanId?: string;
  divisionId?: string;
  // Insumo
  insumoId?: string;                     // Referencia al inventario de insumos
  nombreInsumo: string;
  tipoInsumo: 'seed' | 'fertilizer' | 'pesticide' | 'herbicide' | 'fungicide' | 'fuel' | 'water' | 'other';
  marca?: string;
  lote?: string;                         // Lote del producto
  // Cantidades
  cantidadUtilizada: number;
  unidad: string;
  cantidadPlanificada?: number;          // Para comparación
  // Costos
  costoUnitario?: number;
  costoTotal?: number;
  costoEstimado?: number;                // Para comparación
  // Aplicación
  fechaAplicacion: Date;
  metodoAplicacion?: string;             // Foliar, suelo, riego, etc.
  dosisRecomendada?: string;
  areaTratada?: number;                  // Hectáreas
  // Trazabilidad
  proveedorId?: string;
  proveedorNombre?: string;
  facturaCompra?: string;
  // Observaciones
  observaciones?: string;
  efectividadObservada?: 'alta' | 'media' | 'baja';
}

/**
 * RG05Record - Registro de Cosechas (ejecución)
 * Cantidades realmente cosechadas
 * Fuente: Plan de ejecución
 * Usado para: Balance de Masas (comparación con RG02)
 */
export interface RG05Record extends BaseEntity {
  // Vinculación
  harvestId?: string;                    // Referencia a Harvest si existe
  cultivoId: string;
  cultivoNombre: string;
  divisionId: string;
  divisionName?: string;
  annualPlanId: string;
  // Cosecha
  fechaCosecha: Date;
  cantidadCosechada: number;             // Cantidad real
  unidad: string;
  areaCosechada: number;                 // Hectáreas
  rendimientoReal: number;               // Por hectárea
  // Calidad
  calidad: 'A' | 'B' | 'C' | 'rechazo';
  porcentajeCalidadA?: number;
  porcentajeCalidadB?: number;
  porcentajeCalidadC?: number;
  porcentajeRechazo?: number;
  humedadGrano?: number;                 // Para granos
  defectos?: string;
  // Destino
  destino: DestinoProduccion;
  cantidadPorDestino?: {
    venta?: number;
    procesamiento?: number;
    almacen?: number;
    semilla?: number;
    autoconsumo?: number;
    donacion?: number;
  };
  // Vinculación con Procesamiento
  batchId?: string;                      // ProcessingBatch si destino incluye procesamiento
  // Económico
  precioVenta?: number;
  ingresoTotal?: number;
  // Personal
  cosechadores?: string[];
  supervisorCosecha?: string;
  // Condiciones
  condicionesClimaticas?: string;
  metodoCosecha?: 'manual' | 'mecanizado' | 'mixto';
  // Observaciones
  observaciones?: string;
  fotosEvidencia?: string[];
}

/**
 * BalanceMasasAgro - Comparación RG02 vs RG05
 * Balance de masas para verificar estimación vs producción real
 * Compara por producto y período
 */
export interface BalanceMasasAgro extends BaseEntity {
  // Identificación
  annualPlanId: string;
  periodoInicio: Date;
  periodoFin: Date;
  // Producto
  cultivoId?: string;
  nombreCultivo: string;
  variedad?: string;
  divisionId?: string;
  divisionName?: string;
  // Estimación (RG02)
  cantidadEstimada: number;
  unidadEstimada: string;
  rendimientoEstimado: number;           // Por hectárea
  areaEstimada: number;
  ingresoEstimado?: number;
  // Real (RG05)
  cantidadReal: number;
  unidadReal: string;
  rendimientoReal: number;               // Por hectárea
  areaCosechada: number;
  ingresoReal?: number;
  // Análisis
  diferenciaCantidad: number;            // Real - Estimado
  porcentajeCumplimiento: number;        // (Real / Estimado) * 100
  diferenciaRendimiento: number;
  porcentajeRendimiento: number;
  diferenciaIngreso?: number;
  // Desglose por calidad (del RG05)
  distribucionCalidad?: {
    A: number;
    B: number;
    C: number;
    rechazo: number;
  };
  // Análisis de desviación
  desviacionSignificativa: boolean;      // Si la diferencia supera umbral
  umbralDesviacion: number;              // Porcentaje de tolerancia
  causasDesviacion?: string[];           // Razones identificadas
  // Metadatos
  fechaGeneracion: Date;
  generadoPor?: string;
  observaciones?: string;
}

// ==================== PLANIFICACIÓN ====================

// Planificación agrícola
export interface AgroPlan extends BaseEntity {
  name: string;
  season: string; // e.g., "2026-A", "2026-B"
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  lotes: {
    loteId: string;
    loteName: string;
    plannedCrop: string;
    plannedVariety: string;
    plannedArea: number;
    expectedYield: number;
  }[];
  totalArea: number;
  estimatedCost?: number;
  estimatedRevenue?: number;
  notes?: string;
}

// Insumo agrícola (inventario)
export interface AgroInsumo extends BaseEntity {
  name: string;
  type: 'seed' | 'fertilizer' | 'pesticide' | 'herbicide' | 'tool' | 'other';
  unit: string;
  currentStock: number;
  minStock: number;
  costPerUnit: number;
  supplier?: string;
  expirationDate?: Date;
}

// ==================== DASHBOARD Y ESTADÍSTICAS ====================

// Dashboard stats
export interface AgroDashboardStats {
  totalLotes: number;
  activeLotes: number;
  totalArea: number;
  cultivatedArea: number;
  activeCrops: number;
  readyToHarvest: number;
  monthlyHarvest: {
    quantity: number;
    unit: string;
  };
  monthlyRevenue: number;
  pendingActions: number;
}

// Datos de producción para gráficos
export interface AgroProductionData {
  month: string;
  harvest: number; // kg
  revenue: number; // $
  area: number; // hectáreas cosechadas
}

// Distribución de cultivos
export interface CropDistribution {
  crop: string;
  area: number;
  percentage: number;
  color: string;
}

// Tarea agrícola pendiente
export interface AgroTask {
  id: string;
  title: string;
  type: 'planting' | 'irrigation' | 'fertilization' | 'pesticide' | 'harvest' | 'maintenance';
  cropName?: string;
  loteName?: string;
  description?: string;
  dueDate: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
}

// Estado del clima para widget
export interface WeatherInfo {
  temperature: number;
  humidity: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'partly_cloudy';
  windSpeed: number;
  precipitation: number;
  forecast: {
    day: string;
    high: number;
    low: number;
    condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'partly_cloudy';
  }[];
}

// Resumen de cultivo para cards
export interface CropSummary {
  id: string;
  name: string;
  variety: string;
  loteName: string;
  area: number;
  status: CropStatus;
  progress: number; // porcentaje de avance
  daysToHarvest: number;
  healthStatus: 'excellent' | 'good' | 'fair' | 'poor';
}

// ==================== RE-EXPORTS ====================

// Re-exportar tipos importados para conveniencia
export type { InsumoUtilizado, HerramientaUtilizada, PlanPhase, PlanStatus, PlanPriority, GeneralPlanActionType };
