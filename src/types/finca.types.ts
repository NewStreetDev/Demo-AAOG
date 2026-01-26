import type { BaseEntity, SystemModule } from './common.types';

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
  owner: string;
  contactPhone?: string;
  contactEmail?: string;
  status: 'active' | 'inactive';
  description?: string;
  imageUrl?: string;
  notes?: string;
}

// ==================== DIVISIONS ====================

// Division types
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
  name: string;
  code: string;
  type: DivisionType;
  area: number; // hectareas
  status: 'active' | 'inactive' | 'maintenance' | 'resting';
  coordinates?: {
    lat: number;
    lng: number;
  };
  parentDivisionId?: string; // For nested divisions
  moduleAssociation?: SystemModule; // Which module uses this division
  description?: string;
  notes?: string;
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

// General Plan - Cross-module planning
export interface GeneralPlan extends BaseEntity {
  title: string;
  description?: string;
  actionType: GeneralPlanActionType;
  targetModule?: SystemModule;
  targetDivisionId?: string;
  targetDivisionName?: string;
  scheduledDate: Date;
  dueDate?: Date;
  completedDate?: Date;
  estimatedDuration?: number; // hours
  estimatedCost?: number;
  actualCost?: number;
  assignedTo?: string;
  priority: PlanPriority;
  status: PlanStatus;
  notes?: string;
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

// Finca Dashboard Stats - Aggregated data from all modules
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

  // Module summaries
  apicultura: {
    totalApiarios: number;
    totalColmenas: number;
    activeColmenas: number;
    monthlyHoneyProduction: number;
    pendingTasks: number;
  };
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
  trabajadores: {
    totalWorkers: number;
    activeWorkers: number;
    averageAttendance: number;
    pendingTasks: number;
  };
  insumos: {
    totalItems: number;
    lowStockItems: number;
    criticalStockItems: number;
    totalValue: number;
  };
  infraestructura: {
    totalFacilities: number;
    operationalFacilities: number;
    pendingMaintenances: number;
  };
  activos: {
    totalAssets: number;
    activeAssets: number;
    totalValue: number;
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
  apiculturaRevenue: number;
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
}

// Division summary for map/grid
export interface DivisionSummary {
  id: string;
  name: string;
  code: string;
  type: DivisionType;
  area: number;
  status: string;
  moduleAssociation?: SystemModule;
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
