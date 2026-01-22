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
  insumoUsed?: string;
  quantity?: number;
  unit?: string;
  performedBy: string;
  notes?: string;
}

// Cosecha - Harvest record
export interface Cosecha extends BaseEntity {
  apiarioId: string;
  apiarioName?: string;
  colmenaId?: string;
  date: Date;
  productType: 'honey' | 'wax' | 'royal_jelly' | 'propolis' | 'pollen' | 'hives';
  quantity: number;
  unit: string;
  quality?: 'A' | 'B' | 'C';
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
