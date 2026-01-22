import type { BaseEntity } from './common.types';

// Processing Status
export type ProcessingStatus = 'pending' | 'in_progress' | 'quality_control' | 'completed' | 'rejected' | 'paused';

// Product Type
export type ProcessingProductType = 'tomate' | 'chile' | 'pepino' | 'leche' | 'carne' | 'miel' | 'cera' | 'polen';

// Quality Grade
export type QualityGrade = 'A' | 'B' | 'C' | 'descarte';

// Processing Line Status
export type ProcessingLineStatus = 'active' | 'maintenance' | 'idle' | 'calibration';

// Processing Batch
export interface ProcessingBatch extends BaseEntity {
  batchCode: string;
  inputProductName: string;
  inputProductType: ProcessingProductType;
  sourceModule: 'agro' | 'pecuario' | 'apicultura';
  sourceLocation?: string;
  inputQuantity: number;
  inputUnit: string;
  outputQuantity?: number;
  outputUnit?: string;
  yieldPercentage?: number;
  status: ProcessingStatus;
  processingLineId: string;
  processingLineName?: string;
  startDate: Date;
  expectedEndDate: Date;
  actualEndDate?: Date;
  operator?: string;
  supervisor?: string;
  temperature?: number;
  outputProductCode?: string;
  outputProductName?: string;
  outputGrade?: QualityGrade;
  storageLocation?: string;
  notes?: string;
}

// Processing Line
export interface ProcessingLine extends BaseEntity {
  lineCode: string;
  name: string;
  description?: string;
  productTypes: ProcessingProductType[];
  status: ProcessingLineStatus;
  capacity: number;
  capacityUnit: string;
  location: string;
  lastMaintenance?: Date;
  nextScheduledMaintenance?: Date;
  operator?: string;
  currentBatchId?: string;
  currentBatchCode?: string;
  utilizationPercentage: number;
  notes?: string;
}

// Quality Control
export interface QualityControl extends BaseEntity {
  batchId: string;
  batchCode: string;
  inspectionDate: Date;
  inspector: string;
  overallResult: 'pass' | 'fail' | 'retest';
  finalGrade: QualityGrade;
  defectsFound?: {
    type: string;
    description: string;
    severity: 'critical' | 'major' | 'minor';
  }[];
  approved: boolean;
  approvedBy?: string;
  notes?: string;
}

// Dashboard Stats
export interface ProcesamientoDashboardStats {
  activeBatches: number;
  completedBatchesToday: number;
  totalBatchesThisMonth: number;
  totalProcessed: number;
  processedUnit: string;
  totalProduced: number;
  producedUnit: string;
  utilizationRate: number;
  qualityPassRate: number;
  averageYield: number;
  pendingQualityControl: number;
  rejectedBatches: number;
  activeProcessingLines: number;
  totalProcessingLines: number;
  linesUnderMaintenance: number;
}

// Production Data for Charts
export interface ProcesamientoProductionData {
  month: string;
  processed: number;
  produced: number;
  yieldRate: number;
}

// Output by Product Type
export interface ProductionByType {
  productType: string;
  quantity: number;
  unit: string;
  percentage: number;
  color: string;
}

// Task
export interface ProcesamientoTask {
  id: string;
  title: string;
  type: 'quality_control' | 'line_maintenance' | 'batch_processing' | 'equipment_calibration';
  batchCode?: string;
  lineCode?: string;
  dueDate: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo?: string;
}

// Batch Summary for Lists
export interface BatchSummary {
  id: string;
  batchCode: string;
  inputProductName: string;
  inputProductType: ProcessingProductType;
  inputQuantity: number;
  inputUnit: string;
  outputProductName?: string;
  status: ProcessingStatus;
  processingLineName: string;
  startDate: Date;
  expectedEndDate: Date;
  progress: number;
  operator?: string;
  qualityStatus?: 'pending' | 'pass' | 'fail';
}
