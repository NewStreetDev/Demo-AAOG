import type { BaseEntity } from './common.types';

// ========================================
// Batch Status
// ========================================

export type BatchStatus = 'en_proceso' | 'completado';

// ========================================
// Input Source Types
// ========================================

export type InputSourceType = 'cosecha' | 'lote_anterior';

// ========================================
// Processing Batch (Lote de Procesamiento)
// ========================================

export interface ProcessingBatch extends BaseEntity {
  // Batch identification
  batchCode: string; // Format: L-YYYYMMDD-FINCAID-CONSECUTIVO (generated on completion)

  // Process info
  processType: string; // Type of process (from catalog, e.g., "Lavado", "Secado", "Molienda")
  processDescription?: string; // Optional description
  processDate: Date; // Date when process started/occurred

  // Input
  inputProduct: string; // Product name entering the process
  inputQuantity: number;
  inputUnit: string;
  inputSourceType: InputSourceType; // Fresh harvest or previous batch
  inputSourceBatchId?: string; // If from previous batch, reference it
  inputSourceBatchCode?: string; // Display code of source batch (denormalized for convenience)

  // Output (filled when status = 'completado')
  outputProduct?: string;
  outputQuantity?: number;
  outputUnit?: string;

  // Calculated (when completed)
  merma?: number; // inputQuantity - outputQuantity

  // State
  status: BatchStatus;
  isFinalProduct: boolean; // "Proceso Final" checkbox

  // Additional info
  operator?: string;
  supervisor?: string;
  storageLocation?: string;
  completionDate?: Date; // Date when batch was completed

  // Notes
  notes?: string;
}

// ========================================
// Process Type Catalog
// ========================================

export interface ProcessType {
  id: string;
  name: string;
  description?: string;
}

// ========================================
// Dashboard Stats (simplified)
// ========================================

export interface ProcesamientoDashboardStats {
  batchesEnProceso: number;
  batchesCompletados: number;
  batchesProductoFinal: number;
  totalMerma: number;
  mermaUnit: string;
}
