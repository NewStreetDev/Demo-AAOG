import type { BaseEntity } from './common.types';

// ========================================
// Batch Status
// ========================================

export type BatchStatus = 'en_proceso' | 'completado';

// ========================================
// Input Source Types
// ========================================

export type InputSourceType = 'cosecha' | 'lote_anterior' | 'miel' | 'otro';

// ========================================
// Processing Batch (Lote de Procesamiento)
// ========================================

export interface ProcessingBatch extends BaseEntity {
  // Identificación de finca (trazabilidad)
  fincaId: string;              // ID de la finca donde se realiza el procesamiento

  // Batch identification
  batchCode?: string;           // Format: L-YYYYMMDD-ID-CONSECUTIVO (generated on completion)
  tempCode?: string;            // Código temporal mientras está en proceso

  // Campos para generar el código de trazabilidad
  chainOriginDate?: Date;       // Fecha del PRIMER proceso de la cadena (FECHA_BASE)
  chainIdentifier?: string;     // Identificador único de la cadena (ej: "37")
  chainSequence?: number;       // Consecutivo dentro de la cadena (1, 2, 3...)
  isChainStart?: boolean;       // true si es el primer proceso de la cadena

  // Process info (obligatorio)
  processTypeId: string;        // ID del tipo de proceso (del catálogo)
  processTypeName: string;      // Nombre del proceso (denormalizado)
  processDate: Date;            // Fecha cuando inició el proceso

  // Input (obligatorio)
  inputProduct: string;         // Producto que entra al proceso
  inputQuantity: number;
  inputUnit: string;
  inputSourceType: InputSourceType;

  // Trazabilidad del input
  inputSourceBatchId?: string;  // Si viene de lote anterior
  inputSourceBatchCode?: string;
  inputHarvestId?: string;      // Referencia a Harvest de agro.types.ts (RG05)
  inputHarvestDate?: Date;      // Fecha de cosecha original
  inputHoneyProductionId?: string; // Referencia a HoneyProduction de pecuario.types.ts

  // Output (obligatorio cuando status = 'completado')
  outputProduct?: string;
  outputQuantity?: number;
  outputUnit?: string;

  // Calculated (when completed)
  merma?: number;               // inputQuantity - outputQuantity
  mermaPercentage?: number;     // (merma / inputQuantity) * 100

  // State
  status: BatchStatus;
  isFinalProduct: boolean;      // "Proceso Final" checkbox

  // Inventario/Disponibilidad
  availableQuantity?: number;   // Cantidad disponible (output - cantidad usada en otros lotes)
  isFullyConsumed?: boolean;    // true si todo el output fue usado
  usedInBatchIds?: string[];    // IDs de lotes que usaron este como input

  // Vinculación con planificación (Mi Finca)
  annualPlanId?: string;        // Referencia a AnnualPlan de finca.types.ts
  linkedActionId?: string;      // Acción de planificación relacionada
  linkedActionTitle?: string;

  // Additional info
  operator?: string;
  supervisor?: string;
  storageLocation?: string;
  completionDate?: Date;        // Fecha cuando se completó

  // Notes
  notes?: string;
}

// ========================================
// Process Type Catalog (Dropdown reutilizable)
// ========================================

export interface ProcessType extends BaseEntity {
  name: string;                 // Nombre del proceso (ej: "Lavado", "Secado", "Envasado")
  description?: string;
  category?: ProcessCategory;   // Categoría del proceso
  isActive: boolean;            // Para desactivar sin eliminar
  defaultUnit?: string;         // Unidad por defecto para output
  estimatedDuration?: number;   // Duración estimada en horas
  requiresSupervisor?: boolean; // Si requiere supervisor obligatorio
  isFinalByDefault?: boolean;   // Si típicamente es proceso final
  order?: number;               // Orden en el flujo típico
}

// Categorías de proceso
export type ProcessCategory =
  | 'limpieza'          // Lavado, clasificación
  | 'transformacion'    // Molienda, extracción, fermentación
  | 'conservacion'      // Secado, congelado, pasteurizado
  | 'empaque'           // Envasado, etiquetado, sellado
  | 'otro';

// ========================================
// Batch Code Generation Logic
// ========================================
//
// Formato: L-<FECHA_BASE>-<IDENTIFICADOR>-<CONSECUTIVO>
// Ejemplo: L-20260215-37-1, L-20260215-37-2, L-20260215-37-3
//
// - L: Prefijo que identifica como lote
// - FECHA_BASE: Fecha del PRIMER proceso de la cadena (formato YYYYMMDD)
// - IDENTIFICADOR: Código único generado por el sistema
// - CONSECUTIVO: Orden del proceso en la cadena (1, 2, 3...)
//
// Reglas:
// 1. El código se genera SOLO al marcar el lote como "Completado"
// 2. Si es el primer proceso (isChainStart=true), se genera nuevo chainIdentifier
// 3. Si viene de lote anterior, hereda chainOriginDate y chainIdentifier
// 4. El código NO es editable por el usuario

// Helper type for code generation
export interface BatchCodeComponents {
  prefix: 'L';
  baseDate: string;           // YYYYMMDD format
  identifier: string;         // Short unique ID (ej: "37")
  sequence: number;           // 1, 2, 3...
}

// ========================================
// Inventory Selection Rules
// ========================================
//
// REGLA DE DISPONIBILIDAD:
// - Solo lotes con status="completado" son SELECCIONABLES como input
// - Lotes con status="en_proceso" son VISIBLES pero NO seleccionables
// - Un lote con isFullyConsumed=true NO aparece como disponible
// - availableQuantity = outputQuantity - (suma de cantidades usadas en otros lotes)

// Lote seleccionable para ser usado como input
export interface SelectableBatch {
  batchId: string;
  batchCode: string;
  fincaId: string;              // ID de la finca del lote
  product: string;
  availableQuantity: number;
  unit: string;
  completionDate: Date;
  storageLocation?: string;
  // Solo aparecen lotes que cumplan:
  // - status === 'completado'
  // - availableQuantity > 0
  // - isFullyConsumed === false
}

// ========================================
// Batch Chain (Cadena de trazabilidad)
// ========================================

// Representa la cadena completa desde materia prima hasta producto final
export interface BatchChain {
  finalProductBatchId: string;
  finalProductBatchCode: string;
  fincaId: string;              // ID de la finca de la cadena de procesamiento
  finalProduct: string;
  chainSteps: BatchChainStep[];
  totalProcessingDays: number;
  totalMerma: number;
  totalMermaPercentage: number;
  originType: 'cosecha' | 'miel' | 'otro';
  originDate: Date;
  originProduct: string;
}

export interface BatchChainStep {
  order: number;
  batchId: string;
  batchCode: string;
  processName: string;
  inputProduct: string;
  inputQuantity: number;
  outputProduct: string;
  outputQuantity: number;
  merma: number;
  processDate: Date;
  completionDate?: Date;
}

// ========================================
// RG06 - Registro de Procesamiento
// ========================================

// RG06 se genera por cada PRODUCTO FINAL (isFinalProduct = true)
export interface RG06Record extends BaseEntity {
  // Identificación de finca (trazabilidad)
  fincaId: string;              // ID de la finca donde se realizó el procesamiento

  // Identificación
  reportCode: string;           // Código del reporte RG06
  generatedDate: Date;          // Fecha de generación
  generatedBy: string;          // Usuario que generó

  // Producto final
  finalBatchId: string;
  finalBatchCode: string;
  finalProduct: string;
  finalQuantity: number;
  finalUnit: string;

  // Resumen de la cadena de procesamiento
  chainSummary: BatchChainStep[];
  totalProcesses: number;
  totalMerma: number;
  totalMermaPercentage: number;

  // Origen
  originType: 'cosecha' | 'miel' | 'otro';
  originDate: Date;
  originProduct: string;
  originQuantity: number;

  // Período
  year: number;
  /**
   * Etiqueta del período para display
   * Formatos válidos: "Enero 2026" (mensual), "Q1 2026" (trimestral), "2026" (anual)
   */
  period?: string;

  // Estado
  status: 'draft' | 'generated' | 'exported';
}

// ========================================
// Vinculación con RG07 (Ventas)
// ========================================

// Información del lote para ventas (RG07)
export interface BatchForSale {
  batchId: string;
  batchCode: string;
  product: string;
  availableQuantity: number;
  unit: string;
  storageLocation?: string;
  completionDate: Date;
  // Para RG07
  rg06ReportId?: string;        // RG06 asociado
}

// Registro de venta de producto procesado (para RG07)
export interface ProcessedProductSale extends BaseEntity {
  // Identificación de finca (trazabilidad)
  fincaId: string;              // ID de la finca donde se realizó la venta

  // Referencia al lote
  batchId: string;
  batchCode: string;
  product: string;

  // Venta
  saleDate: Date;
  quantity: number;
  unit: string;

  // Presentación comercial
  presentationType: string;     // Ej: "Envase", "Saco", "Caja"
  presentationSize: number;     // Ej: 500
  presentationUnit: string;     // Ej: "ml", "g", "kg"
  presentationCount: number;    // Cantidad de presentaciones

  // Cliente
  clientName: string;
  clientId?: string;

  // Precio
  pricePerUnit: number;
  totalPrice: number;

  // Para generar RG07
  rg07ReportId?: string;

  // Vinculación con SaleRecord de finanzas
  saleRecordId?: string;

  notes?: string;
}

// ========================================
// RG07 - Venta de Productos Procesados
// ========================================
//
// RG07 se genera a partir de las ventas registradas en Finanzas
// sobre productos finales (lotes con isFinalProduct = true)
//
// Campos requeridos según especificación:
// - Fecha de la venta
// - Producto
// - Cantidad
// - Presentación
// - Número de lote
// - Cliente

export interface RG07Record extends BaseEntity {
  // Identificación de finca (trazabilidad)
  fincaId: string;              // ID de la finca donde se realizaron las ventas

  // Identificación del reporte
  reportCode: string;           // Código del reporte RG07
  generatedDate: Date;          // Fecha de generación
  generatedBy: string;          // Usuario que generó

  // Período del reporte
  year: number;
  /**
   * Etiqueta del período para display
   * Formatos válidos: "Enero 2026" (mensual), "Q1 2026" (trimestral), "2026" (anual)
   */
  period?: string;

  // Ventas incluidas en este reporte
  salesIncluded: RG07SaleItem[];
  totalSalesCount: number;
  totalQuantitySold: number;
  totalRevenue: number;

  // Estado
  status: 'draft' | 'generated' | 'exported';
}

// Cada venta individual dentro del RG07
export interface RG07SaleItem {
  // Referencia a la venta original
  saleId: string;

  // Campos requeridos por RG07
  saleDate: Date;               // Fecha de la venta
  product: string;              // Producto
  quantity: number;             // Cantidad
  unit: string;

  // Presentación (requerido)
  presentation: string;         // Ej: "50 envases de 500ml"
  presentationType: string;     // Tipo: Envase, Saco, Caja
  presentationSize: number;     // Tamaño: 500
  presentationUnit: string;     // Unidad: ml, g, kg
  presentationCount: number;    // Cantidad: 50

  // Número de lote (requerido)
  batchCode: string;            // Código del lote (L-YYYYMMDD-ID-SEQ)
  batchId: string;

  // Cliente (requerido)
  clientName: string;
  clientId?: string;

  // Información adicional
  unitPrice: number;
  totalPrice: number;

  // Vinculación con RG06
  rg06ReportId?: string;        // RG06 del producto final
}

// Helper para generar descripción de presentación
// Ej: "50 envases de 500 ml" o "10 sacos de 25 kg"
export interface PresentationDescription {
  count: number;                // Cantidad de unidades
  type: string;                 // Tipo de presentación
  size: number;                 // Tamaño por unidad
  unit: string;                 // Unidad de medida
  formatted: string;            // "50 envases de 500 ml"
}

// ========================================
// Inventory View (Vista de inventario)
// ========================================

// Vista consolidada de inventario de lotes disponibles
export interface BatchInventoryItem {
  batchId: string;
  batchCode: string;
  fincaId: string;              // ID de la finca del lote
  product: string;
  availableQuantity: number;
  unit: string;
  status: 'disponible' | 'parcialmente_usado' | 'agotado';
  isFinalProduct: boolean;
  storageLocation?: string;
  completionDate: Date;
  daysInStorage: number;
  // Si es producto final, puede venderse
  canBeSold: boolean;
  // Si no es final, puede usarse como input
  canBeUsedAsInput: boolean;
}

// ========================================
// Dashboard Stats
// ========================================

export interface ProcesamientoDashboardStats {
  // Conteos
  batchesEnProceso: number;
  batchesCompletados: number;
  batchesProductoFinal: number;
  batchesDisponiblesVenta: number;

  // Merma
  totalMerma: number;
  mermaUnit: string;
  averageMermaPercentage: number;

  // Inventario
  totalInventoryItems: number;
  lowStockItems: number;

  // Producción del mes
  monthlyOutputQuantity: number;
  monthlyOutputUnit: string;
  monthlyProcessedBatches: number;

  // Pendientes
  pendingRG06: number;
  pendingSales: number;
}

// ========================================
// Tasks
// ========================================

export interface ProcesamientoTask {
  id: string;
  fincaId: string;              // ID de la finca asociada a la tarea
  title: string;
  type: 'process_pending' | 'low_stock' | 'rg06_pending' | 'sale_pending';
  batchId?: string;
  batchCode?: string;
  description?: string;
  dueDate?: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
}
