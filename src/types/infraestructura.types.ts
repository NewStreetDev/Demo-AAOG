import type { BaseEntity } from './common.types';

// Facility Status
export type FacilityStatus = 'operational' | 'maintenance' | 'out_of_service' | 'under_construction';

// Facility Type
export type FacilityType =
  | 'building'
  | 'storage'
  | 'processing'
  | 'housing'
  | 'greenhouse'
  | 'barn'
  | 'water_reservoir'  // Reservorios de agua
  | 'tank'             // Tanques
  | 'irrigation_system' // Sistemas de Riego
  | 'well'             // Pozos
  | 'water_intake'     // Captaciones de agua
  | 'other';

// Equipment Status
export type EquipmentStatus = 'operational' | 'maintenance' | 'repair' | 'out_of_service';

// Equipment Type
export type EquipmentType = 'vehicle' | 'machinery' | 'tool' | 'irrigation' | 'electrical' | 'other';

// Maintenance Priority
export type MaintenancePriority = 'high' | 'medium' | 'low';

// Maintenance Status
export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed' | 'overdue';

// Facility record
export interface Facility extends BaseEntity {
  name: string;
  type: FacilityType;
  description?: string;
  location: string;
  area?: number; // in square meters
  capacity?: string;
  status: FacilityStatus;
  constructionDate?: Date;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  assignedModule?: 'agro' | 'pecuario' | 'apicultura' | 'procesamiento' | 'general';
  notes?: string;
}

// Equipment record
export interface Equipment extends BaseEntity {
  name: string;
  type: EquipmentType;
  brand?: string;
  model?: string;
  serialNumber?: string;
  status: EquipmentStatus;
  purchaseDate?: Date;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  location: string;
  assignedTo?: string;
  value?: number;
  notes?: string;
}

// Maintenance record
export interface MaintenanceRecord extends BaseEntity {
  targetType: 'facility' | 'equipment';
  targetId: string;
  targetName: string;
  description: string;
  scheduledDate: Date;
  completedDate?: Date;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  assignedTo?: string;
  cost?: number;
  notes?: string;
}

// Dashboard Stats
export interface InfraestructuraDashboardStats {
  totalFacilities: number;
  operationalFacilities: number;
  facilitiesInMaintenance: number;
  totalEquipment: number;
  operationalEquipment: number;
  equipmentInRepair: number;
  pendingMaintenances: number;
  overdueMaintenances: number;
}

// Facility by Type Summary
export interface FacilitiesByType {
  type: string;
  count: number;
  operational: number;
}

// Equipment by Status
export interface EquipmentByStatus {
  status: string;
  count: number;
}

// Maintenance Timeline
export interface MaintenanceTimeline {
  month: string;
  completed: number;
  scheduled: number;
}

// Recent Activity
export interface InfrastructureActivity extends BaseEntity {
  type: 'maintenance' | 'repair' | 'inspection' | 'installation';
  targetName: string;
  description: string;
  date: Date;
  status: 'completed' | 'in_progress' | 'scheduled';
}
