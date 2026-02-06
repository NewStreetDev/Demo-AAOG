import type {
  ProcessingBatch,
  ProcesamientoDashboardStats,
} from '../../types/procesamiento.types';
import type { ProcessingBatchFormData } from '../../schemas/procesamiento.schema';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ========================================
// In-memory store
// ========================================

let batchesStore: ProcessingBatch[] = [];

// Track daily counters for batch code generation
const dailyCounters: Record<string, number> = {};

// ========================================
// Batch Code Generation
// ========================================

/**
 * Generate batch code in format: L-YYYYMMDD-FINCAID-CONSECUTIVO
 * - L: Identifies as "lote"
 * - YYYYMMDD: Process date
 * - FINCAID: Farm identifier (using "001" for now)
 * - CONSECUTIVO: Sequential number for that day
 */
function generateBatchCode(processDate: Date): string {
  const year = processDate.getFullYear();
  const month = String(processDate.getMonth() + 1).padStart(2, '0');
  const day = String(processDate.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  const fincaId = '001'; // Fixed farm ID for now

  // Get or initialize daily counter
  const counterKey = `${dateStr}-${fincaId}`;
  if (!dailyCounters[counterKey]) {
    // Count existing batches for this day to initialize counter
    const existingCount = batchesStore.filter(b => {
      const batchDateStr = b.batchCode.split('-')[1];
      return batchDateStr === dateStr;
    }).length;
    dailyCounters[counterKey] = existingCount + 1;
  } else {
    dailyCounters[counterKey]++;
  }

  const consecutivo = String(dailyCounters[counterKey]).padStart(3, '0');
  return `L-${dateStr}-${fincaId}-${consecutivo}`;
}

// ========================================
// Initial Mock Data
// ========================================

const initialBatches: ProcessingBatch[] = [
  // Batch 1: Completed batch from fresh harvest (Miel filtrada)
  {
    id: '1',
    fincaId: '1',
    batchCode: 'L-20260115-001-001',
    processTypeId: 'proc-filtracion',
    processTypeName: 'Filtracion',
    processDate: new Date('2026-01-15T08:00:00'),
    inputProduct: 'Miel Cruda',
    inputQuantity: 50,
    inputUnit: 'kg',
    inputSourceType: 'cosecha',
    outputProduct: 'Miel Filtrada',
    outputQuantity: 48,
    outputUnit: 'kg',
    merma: 2,
    status: 'completado',
    isFinalProduct: false,
    operator: 'Ana Lopez',
    storageLocation: 'Bodega Apicola',
    completionDate: new Date('2026-01-15T14:00:00'),
    notes: 'Miel de primera cosecha del ano. Excelente calidad.',
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-15'),
  },
  // Batch 2: Completed batch using batch 1 output (Miel envasada - PRODUCTO FINAL)
  {
    id: '2',
    fincaId: '1',
    batchCode: 'L-20260118-001-001',
    processTypeId: 'proc-envasado',
    processTypeName: 'Envasado',
    processDate: new Date('2026-01-18T07:00:00'),
    inputProduct: 'Miel Filtrada',
    inputQuantity: 48,
    inputUnit: 'kg',
    inputSourceType: 'lote_anterior',
    inputSourceBatchId: '1',
    inputSourceBatchCode: 'L-20260115-001-001',
    outputProduct: 'Miel Envasada 500g',
    outputQuantity: 47,
    outputUnit: 'kg',
    merma: 1,
    status: 'completado',
    isFinalProduct: true,
    operator: 'Ana Lopez',
    supervisor: 'Maria Garcia',
    storageLocation: 'Almacen de Productos Terminados',
    completionDate: new Date('2026-01-18T12:00:00'),
    notes: 'Producidas 94 unidades de 500g cada una. Listo para venta.',
    createdAt: new Date('2026-01-18'),
    updatedAt: new Date('2026-01-18'),
  },
  // Batch 3: En proceso - Secado de jengibre
  {
    id: '3',
    fincaId: '1',
    batchCode: '', // Will be generated on completion
    processTypeId: 'proc-secado',
    processTypeName: 'Secado',
    processDate: new Date('2026-01-28T08:00:00'),
    inputProduct: 'Jengibre en Laminas',
    inputQuantity: 45,
    inputUnit: 'kg',
    inputSourceType: 'cosecha',
    status: 'en_proceso',
    isFinalProduct: false,
    operator: 'Pedro Mora',
    notes: 'Secado solar estimado de 4-10 dias segun condiciones climaticas.',
    createdAt: new Date('2026-01-28'),
    updatedAt: new Date('2026-02-02'),
  },
  // Batch 4: Completed - Queso fresco (PRODUCTO FINAL)
  {
    id: '4',
    fincaId: '1',
    batchCode: 'L-20260120-001-001',
    processTypeId: 'proc-pasteurizacion',
    processTypeName: 'Pasteurizacion',
    processDate: new Date('2026-01-20T05:00:00'),
    inputProduct: 'Leche Fresca',
    inputQuantity: 100,
    inputUnit: 'L',
    inputSourceType: 'cosecha',
    outputProduct: 'Queso Fresco',
    outputQuantity: 10,
    outputUnit: 'kg',
    merma: 90, // Most volume is whey
    status: 'completado',
    isFinalProduct: true,
    operator: 'Carlos Rodriguez',
    supervisor: 'Maria Garcia',
    storageLocation: 'Camara Fria',
    completionDate: new Date('2026-01-20T15:00:00'),
    notes: 'Rendimiento normal para queso fresco. Suero reservado para otros usos.',
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date('2026-01-20'),
  },
];

// ========================================
// Store Initialization
// ========================================

function initializeBatchesStore() {
  if (batchesStore.length === 0) {
    batchesStore = [...initialBatches];
    // Initialize daily counters based on existing batches
    batchesStore.forEach(b => {
      if (b.batchCode) {
        const parts = b.batchCode.split('-');
        if (parts.length >= 4) {
          const dateStr = parts[1];
          const fincaId = parts[2];
          const counterKey = `${dateStr}-${fincaId}`;
          const num = parseInt(parts[3], 10);
          if (!dailyCounters[counterKey] || num >= dailyCounters[counterKey]) {
            dailyCounters[counterKey] = num;
          }
        }
      }
    });
  }
}

// ========================================
// Processing Batches CRUD
// ========================================

export const getMockProcessingBatches = async (): Promise<ProcessingBatch[]> => {
  await delay(300);
  initializeBatchesStore();
  return [...batchesStore].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
};

export const getMockProcessingBatchById = async (id: string): Promise<ProcessingBatch | undefined> => {
  await delay(200);
  initializeBatchesStore();
  return batchesStore.find(b => b.id === id);
};

/**
 * Get only completed batches (available as input for new processes)
 */
export const getMockCompletedBatches = async (): Promise<ProcessingBatch[]> => {
  await delay(200);
  initializeBatchesStore();
  return batchesStore
    .filter(b => b.status === 'completado')
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
};

export const createMockProcessingBatch = async (data: ProcessingBatchFormData): Promise<ProcessingBatch> => {
  await delay(400);
  initializeBatchesStore();

  const processDate = new Date(data.processDate);
  const inputQty = parseFloat(data.inputQuantity);
  const outputQty = data.outputQuantity ? parseFloat(data.outputQuantity) : undefined;

  // Find source batch if from previous batch
  let sourceBatchCode: string | undefined;
  if (data.inputSourceType === 'lote_anterior' && data.inputSourceBatchId) {
    const sourceBatch = batchesStore.find(b => b.id === data.inputSourceBatchId);
    sourceBatchCode = sourceBatch?.batchCode;
  }

  // Generate batch code only if completing
  const batchCode = data.status === 'completado'
    ? generateBatchCode(processDate)
    : '';

  // Calculate merma if completed
  const merma = data.status === 'completado' && outputQty !== undefined
    ? inputQty - outputQty
    : undefined;

  const newBatch: ProcessingBatch = {
    id: String(Date.now()),
    fincaId: '1', // Default finca for mock
    batchCode,
    processTypeId: `proc-${data.processType.toLowerCase().replace(/\s+/g, '-')}`,
    processTypeName: data.processType,
    processDate,
    inputProduct: data.inputProduct,
    inputQuantity: inputQty,
    inputUnit: data.inputUnit,
    inputSourceType: data.inputSourceType,
    inputSourceBatchId: data.inputSourceBatchId,
    inputSourceBatchCode: sourceBatchCode,
    outputProduct: data.outputProduct,
    outputQuantity: outputQty,
    outputUnit: data.outputUnit,
    merma,
    status: data.status,
    isFinalProduct: data.isFinalProduct,
    operator: data.operator,
    supervisor: data.supervisor,
    storageLocation: data.storageLocation,
    completionDate: data.status === 'completado' && data.completionDate
      ? new Date(data.completionDate)
      : data.status === 'completado'
      ? new Date()
      : undefined,
    notes: data.notes,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  batchesStore.push(newBatch);
  return newBatch;
};

export const updateMockProcessingBatch = async (id: string, data: ProcessingBatchFormData): Promise<ProcessingBatch> => {
  await delay(400);
  initializeBatchesStore();

  const index = batchesStore.findIndex(b => b.id === id);
  if (index === -1) throw new Error('Processing batch not found');

  const existing = batchesStore[index];
  const processDate = new Date(data.processDate);
  const inputQty = parseFloat(data.inputQuantity);
  const outputQty = data.outputQuantity ? parseFloat(data.outputQuantity) : undefined;

  // Find source batch if from previous batch
  let sourceBatchCode: string | undefined;
  if (data.inputSourceType === 'lote_anterior' && data.inputSourceBatchId) {
    const sourceBatch = batchesStore.find(b => b.id === data.inputSourceBatchId);
    sourceBatchCode = sourceBatch?.batchCode;
  }

  // Generate batch code if transitioning to completed and doesn't have one
  let batchCode = existing.batchCode;
  if (data.status === 'completado' && !batchCode) {
    batchCode = generateBatchCode(processDate);
  }

  // Calculate merma if completed
  const merma = data.status === 'completado' && outputQty !== undefined
    ? inputQty - outputQty
    : undefined;

  const updated: ProcessingBatch = {
    ...existing,
    batchCode,
    processTypeId: `proc-${data.processType.toLowerCase().replace(/\s+/g, '-')}`,
    processTypeName: data.processType,
    processDate,
    inputProduct: data.inputProduct,
    inputQuantity: inputQty,
    inputUnit: data.inputUnit,
    inputSourceType: data.inputSourceType,
    inputSourceBatchId: data.inputSourceBatchId,
    inputSourceBatchCode: sourceBatchCode,
    outputProduct: data.outputProduct,
    outputQuantity: outputQty,
    outputUnit: data.outputUnit,
    merma,
    status: data.status,
    isFinalProduct: data.isFinalProduct,
    operator: data.operator,
    supervisor: data.supervisor,
    storageLocation: data.storageLocation,
    completionDate: data.status === 'completado'
      ? (data.completionDate ? new Date(data.completionDate) : existing.completionDate || new Date())
      : undefined,
    notes: data.notes,
    updatedAt: new Date(),
  };

  batchesStore[index] = updated;
  return updated;
};

export const deleteMockProcessingBatch = async (id: string): Promise<void> => {
  await delay(300);
  initializeBatchesStore();
  const index = batchesStore.findIndex(b => b.id === id);
  if (index === -1) throw new Error('Processing batch not found');
  batchesStore.splice(index, 1);
};

// ========================================
// Dashboard Stats
// ========================================

export const getMockProcesamientoStats = async (): Promise<ProcesamientoDashboardStats> => {
  await delay(300);
  initializeBatchesStore();

  const enProceso = batchesStore.filter(b => b.status === 'en_proceso').length;
  const completados = batchesStore.filter(b => b.status === 'completado').length;
  const productoFinal = batchesStore.filter(b => b.status === 'completado' && b.isFinalProduct).length;
  const totalMerma = batchesStore
    .filter(b => b.status === 'completado' && b.merma !== undefined)
    .reduce((sum, b) => sum + (b.merma || 0), 0);

  return {
    batchesEnProceso: enProceso,
    batchesCompletados: completados,
    batchesProductoFinal: productoFinal,
    totalMerma,
    mermaUnit: 'kg',
  };
};

// ========================================
// Mock Tasks (for finca dashboard integration)
// ========================================

interface ProcesamientoTask {
  id: string;
  title: string;
  type: string;
  dueDate: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assignedTo?: string;
}

export const getMockProcesamientoTasks = async (): Promise<ProcesamientoTask[]> => {
  await delay(200);
  initializeBatchesStore();

  // Convert batches en_proceso to tasks
  return batchesStore
    .filter(b => b.status === 'en_proceso')
    .map(b => ({
      id: b.id,
      title: `${b.processType}: ${b.inputProduct}`,
      type: 'proceso',
      dueDate: new Date(b.processDate),
      priority: 'medium' as const,
      status: 'in_progress' as const,
      assignedTo: b.operator,
    }));
};
