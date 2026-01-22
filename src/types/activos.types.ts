import type { BaseEntity } from './common.types';

// Asset Status
export type AssetStatus = 'active' | 'inactive' | 'disposed' | 'under_maintenance';

// Asset Category
export type AssetCategory =
  | 'land'
  | 'building'
  | 'vehicle'
  | 'machinery'
  | 'livestock'
  | 'equipment'
  | 'seeds'           // Semillas criollas y material genético
  | 'genetic_material' // Material genético (reinas, semen, etc.)
  | 'other';

// Depreciation Method
export type DepreciationMethod = 'straight_line' | 'declining_balance' | 'none';

// Asset record
export interface Asset extends BaseEntity {
  code: string;
  name: string;
  description?: string;
  category: AssetCategory;
  status: AssetStatus;
  location: string;
  acquisitionDate: Date;
  acquisitionCost: number;
  currentValue: number;
  depreciationMethod: DepreciationMethod;
  usefulLifeYears?: number;
  salvageValue?: number;
  accumulatedDepreciation: number;
  assignedModule?: 'agro' | 'pecuario' | 'apicultura' | 'procesamiento' | 'general';
  responsiblePerson?: string;
  serialNumber?: string;
  notes?: string;
}

// Asset Movement/Transaction
export interface AssetMovement extends BaseEntity {
  assetId: string;
  assetName: string;
  type: 'acquisition' | 'transfer' | 'maintenance' | 'revaluation' | 'disposal';
  fromLocation?: string;
  toLocation?: string;
  date: Date;
  description: string;
  amount?: number;
  performedBy: string;
}

// Depreciation Record
export interface DepreciationRecord extends BaseEntity {
  assetId: string;
  assetName: string;
  period: string;
  depreciationAmount: number;
  accumulatedDepreciation: number;
  bookValue: number;
}

// Dashboard Stats
export interface ActivosDashboardStats {
  totalAssets: number;
  activeAssets: number;
  totalAcquisitionValue: number;
  totalCurrentValue: number;
  totalDepreciation: number;
  assetsUnderMaintenance: number;
  disposedThisYear: number;
  acquiredThisYear: number;
}

// Assets by Category
export interface AssetsByCategory {
  category: string;
  count: number;
  value: number;
}

// Assets by Status
export interface AssetsByStatus {
  status: string;
  count: number;
}

// Depreciation Summary
export interface DepreciationSummary {
  month: string;
  depreciation: number;
  accumulated: number;
}

// Asset Value Trend
export interface AssetValueTrend {
  month: string;
  acquisitionValue: number;
  currentValue: number;
}

// Recent Asset Activity
export interface AssetActivity extends BaseEntity {
  assetName: string;
  type: 'acquisition' | 'transfer' | 'maintenance' | 'revaluation' | 'disposal';
  description: string;
  date: Date;
  amount?: number;
}
