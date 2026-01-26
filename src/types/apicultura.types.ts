import type { BaseEntity } from './common.types';

// Apiario - Group of hives in a location
export interface Apiario extends BaseEntity {
  name: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  colmenasCount: number;
  activeColmenas: number;
  healthAverage: number; // 1-10
  status: 'active' | 'inactive';
  lastRevision?: Date;
  production: {
    honey: number;
    wax: number;
    pollen: number;
  };
  // Costos operativos
  costPerHour?: number;  // Costo por hora de trabajo
  costPerKm?: number;    // Costo por kilómetro de desplazamiento
  notes?: string;
}

// Colmena - Individual hive
export interface Colmena extends BaseEntity {
  code: string;
  apiarioId: string;
  apiarioName?: string;
  queenAge: number; // months
  queenStatus: 'present' | 'absent' | 'new';
  population: 'low' | 'medium' | 'high';
  health: number; // 1-10
  weight: 'bad' | 'regular' | 'good';
  honeyMaturity: number; // percentage
  lastRevision?: Date;
  status: 'active' | 'inactive' | 'producing' | 'resting' | 'quarantine';
  notes?: string;
}

// Revision - Inspection record
export interface Revision extends BaseEntity {
  apiarioId: string;
  apiarioName?: string;
  colmenaId?: string;
  colmenaCode?: string;
  type: 'general' | 'individual';
  date: Date;
  inspector: string;

  // General state
  generalState: number; // 1-10
  queenAge?: number;
  queenChanged: boolean;
  queenPresent: boolean;
  postureState: 'excellent' | 'good' | 'regular' | 'bad' | 'none';
  sanity: number; // 1-10

  // Physical inspection
  weight: 'bad' | 'regular' | 'good';
  honeyMaturity: number; // percentage

  // Internal revision
  population: 'low' | 'medium' | 'high';
  broodAmount: 'none' | 'low' | 'medium' | 'high';
  foodReserves: {
    pollen: 'none' | 'low' | 'medium' | 'high';
    nectar: 'none' | 'low' | 'medium' | 'high';
  };

  comments?: string;
}

// Tipo de reproducción apícola
export type ApiculturaReproductionType =
  | 'free_mating'        // Apareamiento libre
  | 'insemination'       // Inseminación
  | 'queen_introduction' // Introducción de reinas con genética mejorada
  | 'queen_raising';     // Crianza de reinas (Método Do Little)

// Tipos de actividad para Plan de Trabajo
export type WorkPlanActivityType =
  | 'medication'      // Aplicación de medicamentos
  | 'panel_change'    // Cambio de panales
  | 'feeding'         // Alimentación
  | 'revision'        // Revisión
  | 'queen_change'    // Cambio de reinas
  | 'reproduction'    // Reproducción
  | 'harvest'         // Cosecha
  | 'maintenance'     // Mantenimiento general
  | 'other';          // Otros

// Estado del Plan de Trabajo
export type WorkPlanStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

// Plan de Trabajo - Planificación de actividades
export interface WorkPlan extends BaseEntity {
  title: string;
  description?: string;
  apiarioId?: string;
  apiarioName?: string;
  colmenaId?: string;
  colmenaCode?: string;
  activityType: WorkPlanActivityType;
  scheduledDate: Date;
  estimatedDuration?: number; // en horas
  assignedTo?: string;
  priority: 'high' | 'medium' | 'low';
  status: WorkPlanStatus;
  completedDate?: Date;
  notes?: string;
}

// Accion - Actions performed on apiario/colmena
export interface AccionApicultura extends BaseEntity {
  apiarioId: string;
  apiarioName?: string;
  colmenaId?: string;
  colmenaCode?: string;
  type:
    | 'medication'
    | 'panel_change'
    | 'feeding'
    | 'revision'
    | 'queen_change'
    | 'reproduction'
    | 'harvest';
  reproductionType?: ApiculturaReproductionType; // Detalle si type es 'reproduction'
  date: Date;
  description: string;
  performedBy: string;
  // Campos para Medicamentos
  medication?: string;
  dosage?: string;
  applicationMethod?: string;
  nextApplicationDate?: Date;
  // Campos para Cambio de Panales
  panelCount?: number;
  waxOrigin?: string;
  // Campos para Alimentacion
  feedingType?: string;
  insumoUsed?: string;
  quantity?: number;
  unit?: string;
  // Campos para Reproduccion
  reproductionDetails?: string;
  notes?: string;
}

// Cosecha - Harvest record
export interface Cosecha extends BaseEntity {
  apiarioId: string;
  apiarioName?: string;
  colmenaId?: string;
  colmenaCode?: string;
  date: Date;
  productType: 'honey' | 'wax' | 'royal_jelly' | 'propolis' | 'pollen' | 'hives';
  quantity: number;
  unit: string;
  quality?: 'A' | 'B' | 'C';
  performedBy: string;
  notes?: string;
}

// Dashboard stats
export interface ApiculturaDashboardStats {
  totalApiarios: number;
  totalColmenas: number;
  activeColmenas: number;
  monthlyProduction: {
    honey: number;
    wax: number;
    pollen: number;
  };
  averageHealth: number;
  pendingRevisions: number;
  lastHarvest?: Date;
}

// Production by month for charts
export interface ApiculturaProductionData {
  month: string;
  honey: number;
  wax: number;
  pollen: number;
  propolis: number;
}

// Task/Action item
export interface ApiculturaTask {
  id: string;
  title: string;
  type: 'revision' | 'feeding' | 'medication' | 'harvest';
  apiarioName: string;
  colmenaCode?: string;
  dueDate: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
}

// Health distribution for charts
export interface HealthDistribution {
  status: string;
  count: number;
  color: string;
}
