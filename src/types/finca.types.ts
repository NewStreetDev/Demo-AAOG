import type { BaseEntity, SystemModule, InsumoUtilizado, HerramientaUtilizada } from './common.types';

// ==================== FINCA ====================

// Finca - Main farm entity
export interface Finca extends BaseEntity {
  name: string;
  totalArea: number; // hectareas
  location: {
    lat: number;
    lng: number;
    address?: string;
    department?: string;
    municipality?: string;
  };
  ownerName: string;    // Nombre del propietario (display)
  ownerId: string;      // ID del usuario propietario (referencia)
  contactPhone?: string;
  contactEmail?: string;
  status: 'active' | 'inactive';
  description?: string;
  imageUrl?: string;
  notes?: string;
  // Croquis georreferenciado (§3.5)
  croquisUrl?: string;           // URL del croquis/mapa fijo
  croquisBounds?: {              // Límites del croquis para overlay en mapa
    north: number;
    south: number;
    east: number;
    west: number;
  };
  // Configuración de clima (§3.5)
  weatherLocationId?: string;    // ID de ubicación para API de clima
}

// ==================== CROQUIS Y CLIMA (§3.5) ====================

// Croquis georreferenciado de la finca
export interface FincaCroquis {
  fincaId: string;
  imageUrl: string;              // URL de la imagen del croquis
  bounds: {                      // Coordenadas para posicionar en mapa
    north: number;
    south: number;
    east: number;
    west: number;
  };
  divisions?: {                  // Marcadores de divisiones en el croquis
    divisionId: string;
    divisionName: string;
    position: { lat: number; lng: number };
  }[];
  uploadedAt: Date;
  updatedAt?: Date;
}

// Información climática actual
export interface CurrentWeather {
  fincaId: string;
  temperature: number;           // Celsius
  humidity: number;              // Porcentaje
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'partly_cloudy' | 'foggy';
  windSpeed: number;             // km/h
  windDirection?: string;        // N, S, E, W, NE, etc.
  precipitation: number;         // mm
  uvIndex?: number;
  lastUpdated: Date;
}

// Pronóstico del clima
export interface WeatherForecast {
  fincaId: string;
  forecast: {
    date: Date;
    high: number;
    low: number;
    condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'partly_cloudy' | 'foggy';
    precipitationChance: number; // Porcentaje
    description?: string;
  }[];
  lastUpdated: Date;
}

// Weather data for dashboard widgets
export interface WeatherData {
  current: {
    temperature: number;
    humidity: number;
    condition: string;
    icon: string;
  };
  forecast: {
    day: string;
    icon: string;
    tempHigh: number;
    tempLow: number;
  }[];
}

// ==================== SELECTOR DE FINCA ACTIVA (§3.2) ====================

// Contexto de finca activa para el usuario
export interface ActiveFincaContext {
  userId: string;
  activeFincaId: string;
  activeFincaName: string;
  availableFincas: {
    id: string;
    name: string;
    status: 'active' | 'inactive';
  }[];
  lastSwitchedAt?: Date;
}

// ==================== DIVISIONS ====================

/**
 * Tipos de división de la finca
 * Nota: 'lote_agricola' usa snake_case intencionalmente para consistencia
 * con el esquema de base de datos y APIs del backend.
 */
export type DivisionType =
  | 'potrero'
  | 'lote_agricola'
  | 'apiario'
  | 'infraestructura'
  | 'reserva'
  | 'bosque'
  | 'agua'
  | 'otro';

// Division - Areas within the farm
export interface Division extends BaseEntity {
  fincaId: string;  // ID de la finca a la que pertenece esta división
  name: string;
  code: string;
  type: DivisionType;
  area: number; // hectareas
  status: 'active' | 'inactive' | 'maintenance' | 'resting';
  coordinates?: {
    lat: number;
    lng: number;
  };
  parentDivisionId?: string;  // Para divisiones anidadas dentro de otra
  moduleAssociations?: SystemModule[];  // Módulos que usan esta división (agro, pecuario, etc.)
  description?: string;
  notes?: string;
}

// ==================== ANNUAL PLAN ====================

// Annual Plan status
export type AnnualPlanStatus = 'draft' | 'planning' | 'active' | 'completed';

// Plan phase
export type PlanPhase = 'initial' | 'execution';

// Annual Plan - Yearly planning container (§3.9-3.11)
export interface AnnualPlan extends BaseEntity {
  fincaId: string;  // ID de la finca a la que pertenece este plan anual
  year: number;
  name: string; // e.g., "Planificacion 2026"
  status: AnnualPlanStatus;
  currentPhase: PlanPhase;       // Fase actual: 'initial' o 'execution'
  description?: string;
  // Ciclo de vida del SIC (§3.9)
  submittedAt?: Date;            // Cuando se envió/cerró el plan inicial (SIC)
  submittedBy?: string;          // Usuario que envió el SIC
  // Transición a ejecución (§3.10)
  activatedAt?: Date;            // Cuando se inició la ejecución
  activatedBy?: string;          // Usuario que activó la ejecución
  // Cierre del plan
  completedAt?: Date;
  completedBy?: string;
  // Estadísticas del plan
  totalPlannedActions?: number;  // Acciones en planificación inicial
  totalExecutedActions?: number; // Acciones ejecutadas
  totalAddedActions?: number;    // Acciones agregadas en ejecución (no planificadas)
}

// ==================== GENERAL PLAN ====================

// Action types for general planning
export type GeneralPlanActionType =
  | 'mantenimiento'
  | 'siembra'
  | 'cosecha'
  | 'tratamiento'
  | 'vacunacion'
  | 'revision'
  | 'compra'
  | 'venta'
  | 'reparacion'
  | 'capacitacion'
  | 'otro';

// Priority levels
export type PlanPriority = 'high' | 'medium' | 'low';

// Plan status
export type PlanStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

// General Plan - Cross-module planning (§3.8, §3.11-3.12)
export interface GeneralPlan extends BaseEntity {
  fincaId: string;  // ID de la finca a la que pertenece este plan
  title: string;
  description?: string;
  actionType: GeneralPlanActionType;
  targetModule?: SystemModule;
  targetDivisionId?: string;
  targetDivisionName?: string;

  // Planificación (§3.8)
  scheduledDate: Date;             // Fecha programada
  dueDate?: Date;                  // Fecha límite
  estimatedDuration?: number;      // Duración estimada (horas)
  estimatedCost?: number;          // Costo estimado
  currency?: 'CRC' | 'USD';       // Moneda
  assignedTo?: string[];           // Responsables asignados
  priority: PlanPriority;
  status: PlanStatus;

  // Ejecución real (§3.11) - campos que se llenan al ejecutar
  executedAt?: Date;               // Fecha/hora real de ejecución
  executedBy?: string;             // Persona que realmente ejecutó
  actualDuration?: number;         // Duración real (horas)
  actualCost?: number;             // Costo real
  completedDate?: Date;            // Fecha de completado
  executionNotes?: string;         // Observaciones de la ejecución

  // Insumos y herramientas (para RG04)
  // Planificados (del SIC)
  plannedInsumos?: InsumoUtilizado[];
  plannedHerramientas?: HerramientaUtilizada[];
  // Realmente utilizados (en ejecución)
  insumos?: InsumoUtilizado[];
  herramientas?: HerramientaUtilizada[];

  notes?: string;

  // Campos de planificación anual
  annualPlanId?: string;           // Referencia a AnnualPlan
  planPhase?: PlanPhase;           // Fase: 'initial' o 'execution'
  linkedPlanId?: string;           // Para ejecución: enlace al plan inicial original
  isFromPlanning?: boolean;        // true = del SIC, false = agregado en ejecución (bitácora)
  isBitacora?: boolean;            // true = acción tipo bitácora (sin planificación previa)
  originalScheduledDate?: Date;    // Fecha original del SIC (para tracking de cambios)
  originalDueDate?: Date;          // Fecha límite original del SIC
}

// ==================== VISTAS DE PLANIFICACIÓN (§3.7) ====================

// Tipos de vista de planificación
export type PlanningViewType = 'monthly' | 'weekly' | 'gantt' | 'list';

// Filtros para la vista de planificación
export interface PlanningFilters {
  fincaId: string;
  annualPlanId?: string;
  planPhase?: PlanPhase;
  viewType: PlanningViewType;
  // Filtros de fecha
  startDate?: Date;
  endDate?: Date;
  year?: number;
  month?: number;                // 1-12
  week?: number;                 // 1-53
  // Filtros de contenido
  targetModule?: SystemModule;   // Filtrar por módulo (agro, pecuario, procesamiento)
  status?: PlanStatus[];         // Filtrar por estados
  priority?: PlanPriority[];     // Filtrar por prioridad
  assignedTo?: string;           // Filtrar por responsable
  actionType?: GeneralPlanActionType[];
  // Opciones de visualización
  showCompleted?: boolean;
  showCancelled?: boolean;
  groupByModule?: boolean;
  groupByDivision?: boolean;
}

// Datos para vista mensual
export interface MonthlyPlanningView {
  year: number;
  month: number;
  monthName: string;
  days: {
    date: Date;
    dayOfMonth: number;
    dayOfWeek: number;
    isToday: boolean;
    isWeekend: boolean;
    plans: GeneralPlan[];
  }[];
  summary: {
    totalPlans: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
}

// Datos para vista semanal
export interface WeeklyPlanningView {
  year: number;
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  days: {
    date: Date;
    dayName: string;
    isToday: boolean;
    plans: GeneralPlan[];
  }[];
  summary: {
    totalPlans: number;
    byModule: Record<SystemModule, number>;
  };
}

// Datos para vista Gantt
export interface GanttPlanningView {
  startDate: Date;
  endDate: Date;
  plans: {
    plan: GeneralPlan;
    startX: number;              // Posición inicial (día)
    width: number;               // Duración en días
    row: number;                 // Fila en el Gantt
    color: string;               // Color según módulo/prioridad
    dependencies?: string[];     // IDs de planes que deben completarse antes
  }[];
  milestones?: {
    date: Date;
    label: string;
    type: 'deadline' | 'event' | 'checkpoint';
  }[];
}

// Comparación planificado vs ejecutado
export interface PlanningVsExecutionSummary {
  fincaId: string;
  annualPlanId: string;
  period: {
    startDate: Date;
    endDate: Date;
  };
  planned: {
    total: number;
    byModule: Record<SystemModule, number>;
    byActionType: Record<GeneralPlanActionType, number>;
  };
  executed: {
    completed: number;
    inProgress: number;
    pending: number;
    cancelled: number;
    addedInExecution: number;    // Acciones tipo bitácora
  };
  metrics: {
    completionRate: number;      // Porcentaje completado
    onTimeRate: number;          // Porcentaje a tiempo
    deviationDays: number;       // Promedio de días de desviación
  };
}

// ==================== DASHBOARD STATS ====================

// Module summary for dashboard
export interface ModuleSummary {
  module: SystemModule;
  moduleName: string;
  mainMetric: number;
  mainMetricLabel: string;
  secondaryMetric?: number;
  secondaryMetricLabel?: string;
  status: 'good' | 'warning' | 'critical';
  pendingTasks: number;
}

// Finca Dashboard Stats - Aggregated data from MVP modules
export interface FincaDashboardStats {
  // Finca info
  fincaName: string;
  totalArea: number;
  location: string;

  // Financial summary
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  profitMargin: number;

  // Module summaries (MVP)
  pecuario: {
    totalLivestock: number;
    bySpecies: {
      bovine: number;
      porcine: number;
      caprine: number;
      poultry: number;
      other: number;
    };
    monthlyMilkProduction: number;
    pendingTasks: number;
  };
  agro: {
    totalLotes: number;
    activeLotes: number;
    totalArea: number;
    cultivatedArea: number;
    activeCrops: number;
    pendingTasks: number;
  };
  finanzas: {
    thisMonthIncome: number;
    thisMonthExpense: number;
    pendingReceivables: number;
    pendingPayables: number;
  };
  procesamiento: {
    activeBatches: number;
    monthlyProduction: number;
    pendingTasks: number;
  };

  // Aggregated counts
  totalDivisions: number;
  totalPendingPlans: number;
  upcomingDeadlines: number;
}

// Monthly aggregated data for charts
export interface MonthlyAggregatedData {
  month: string;
  agroRevenue: number;
  pecuarioRevenue: number;
  procesamientoRevenue: number;
  totalExpenses: number;
  netProfit: number;
}

// Pending task from all modules
export interface AggregatedTask {
  id: string;
  title: string;
  module: SystemModule;
  moduleName: string;
  type: string;
  dueDate: Date;
  priority: PlanPriority;
  status: PlanStatus;
  assignedTo?: string;
  // Additional fields for detail view
  description?: string;
  sourceId?: string;
  sourceType?: 'plan' | 'task';
}

// Division summary for map/grid
export interface DivisionSummary {
  id: string;
  name: string;
  code: string;
  type: DivisionType;
  area: number;
  status: string;
  moduleAssociations?: SystemModule[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Quick action shortcut
export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  module: SystemModule;
  path: string;
  color: string;
}

// ==================== RE-EXPORTS ====================

// Re-exportar tipos comunes usados frecuentemente
export type { InsumoUtilizado, HerramientaUtilizada } from './common.types';
