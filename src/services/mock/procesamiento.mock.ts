import type {
  ProcessingBatch,
  ProcessingLine,
  ProcessingStage,
  QualityControl,
  ProcesamientoDashboardStats,
  ProcesamientoProductionData,
  ProductionByType,
  ProcesamientoTask,
  BatchSummary,
} from '../../types/procesamiento.types';
import type {
  ProcessingLineFormData,
  ProcessingBatchFormData,
  QualityControlFormData,
} from '../../schemas/procesamiento.schema';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ========================================
// In-memory stores
// ========================================
let linesStore: ProcessingLine[] = [];
let batchesStore: ProcessingBatch[] = [];
let qcStore: QualityControl[] = [];

// ========================================
// Initial Data
// ========================================

const initialLines: ProcessingLine[] = [
  {
    id: '1',
    lineCode: 'LINEA-001',
    name: 'Linea Agricola',
    description: 'Procesamiento de productos agricolas',
    productTypes: ['tomate', 'chile', 'pepino'],
    status: 'active',
    capacity: 500,
    capacityUnit: 'kg/dia',
    location: 'Planta Principal - Seccion A',
    lastMaintenance: new Date('2026-01-10'),
    nextScheduledMaintenance: new Date('2026-02-10'),
    operator: 'Juan Perez',
    currentBatchId: '1',
    currentBatchCode: 'PROC-2026-001',
    utilizationPercentage: 72,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2026-01-20'),
  },
  {
    id: '2',
    lineCode: 'LINEA-002',
    name: 'Linea Lacteos',
    description: 'Procesamiento de productos lacteos',
    productTypes: ['leche'],
    status: 'idle',
    capacity: 600,
    capacityUnit: 'L/dia',
    location: 'Planta Principal - Seccion B',
    lastMaintenance: new Date('2026-01-05'),
    nextScheduledMaintenance: new Date('2026-02-05'),
    utilizationPercentage: 0,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2026-01-19'),
  },
  {
    id: '3',
    lineCode: 'LINEA-003',
    name: 'Linea Apicola',
    description: 'Procesamiento de productos apicolas',
    productTypes: ['miel', 'cera', 'polen'],
    status: 'active',
    capacity: 150,
    capacityUnit: 'kg/dia',
    location: 'Planta Principal - Seccion C',
    lastMaintenance: new Date('2026-01-12'),
    nextScheduledMaintenance: new Date('2026-02-12'),
    operator: 'Ana Lopez',
    currentBatchId: '3',
    currentBatchCode: 'PROC-2026-003',
    utilizationPercentage: 53,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2026-01-20'),
  },
  {
    id: '4',
    lineCode: 'LINEA-004',
    name: 'Linea Carnes',
    description: 'Procesamiento de productos carnicos',
    productTypes: ['carne'],
    status: 'maintenance',
    capacity: 300,
    capacityUnit: 'kg/dia',
    location: 'Planta Principal - Seccion D',
    lastMaintenance: new Date('2025-12-15'),
    nextScheduledMaintenance: new Date('2026-01-25'),
    utilizationPercentage: 0,
    notes: 'En mantenimiento programado',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2026-01-21'),
  },
];

const initialBatches: ProcessingBatch[] = [
  {
    id: '1',
    batchCode: 'PROC-2026-001',
    inputProductName: 'Tomate Roma',
    inputProductType: 'tomate',
    sourceModule: 'agro',
    sourceLocation: 'Lote Norte',
    inputQuantity: 450,
    inputUnit: 'kg',
    outputQuantity: 200,
    outputUnit: 'kg',
    yieldPercentage: 44.4,
    status: 'in_progress',
    processingLineId: '1',
    processingLineName: 'Linea Agricola',
    startDate: new Date('2026-01-20T08:00:00'),
    expectedEndDate: new Date('2026-01-21T16:00:00'),
    operator: 'Juan Perez',
    supervisor: 'Maria Garcia',
    temperature: 85,
    outputProductName: 'Salsa de Tomate',
    storageLocation: 'Bodega Fria A',
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date('2026-01-21'),
  },
  {
    id: '2',
    batchCode: 'PROC-2026-002',
    inputProductName: 'Leche Fresca',
    inputProductType: 'leche',
    sourceModule: 'pecuario',
    sourceLocation: 'Potrero Central',
    inputQuantity: 500,
    inputUnit: 'L',
    outputQuantity: 48,
    outputUnit: 'kg',
    yieldPercentage: 9.6,
    status: 'completed',
    processingLineId: '2',
    processingLineName: 'Linea Lacteos',
    startDate: new Date('2026-01-18T06:00:00'),
    expectedEndDate: new Date('2026-01-19T18:00:00'),
    actualEndDate: new Date('2026-01-19T16:30:00'),
    operator: 'Carlos Rodriguez',
    outputProductName: 'Queso Fresco',
    outputGrade: 'A',
    storageLocation: 'Camara Fria B',
    createdAt: new Date('2026-01-18'),
    updatedAt: new Date('2026-01-19'),
  },
  {
    id: '3',
    batchCode: 'PROC-2026-003',
    inputProductName: 'Miel Pura',
    inputProductType: 'miel',
    sourceModule: 'apicultura',
    sourceLocation: 'Apiario Principal',
    inputQuantity: 80,
    inputUnit: 'kg',
    outputQuantity: 78,
    outputUnit: 'kg',
    yieldPercentage: 97.5,
    status: 'quality_control',
    processingLineId: '3',
    processingLineName: 'Linea Apicola',
    startDate: new Date('2026-01-19T09:00:00'),
    expectedEndDate: new Date('2026-01-20T12:00:00'),
    operator: 'Ana Lopez',
    outputProductName: 'Miel Envasada',
    createdAt: new Date('2026-01-19'),
    updatedAt: new Date('2026-01-20'),
  },
  {
    id: '4',
    batchCode: 'PROC-2026-004',
    inputProductName: 'Chile Jalapeno',
    inputProductType: 'chile',
    sourceModule: 'agro',
    sourceLocation: 'Lote Sur',
    inputQuantity: 120,
    inputUnit: 'kg',
    status: 'pending',
    processingLineId: '1',
    processingLineName: 'Linea Agricola',
    startDate: new Date('2026-01-22T08:00:00'),
    expectedEndDate: new Date('2026-01-22T18:00:00'),
    outputProductName: 'Salsa Picante',
    createdAt: new Date('2026-01-21'),
    updatedAt: new Date('2026-01-21'),
  },
  {
    id: '5',
    batchCode: 'PROC-2026-005',
    inputProductName: 'Pepino',
    inputProductType: 'pepino',
    sourceModule: 'agro',
    inputQuantity: 200,
    inputUnit: 'kg',
    outputQuantity: 180,
    outputUnit: 'kg',
    yieldPercentage: 90,
    status: 'completed',
    processingLineId: '1',
    processingLineName: 'Linea Agricola',
    startDate: new Date('2026-01-15T07:00:00'),
    expectedEndDate: new Date('2026-01-16T15:00:00'),
    actualEndDate: new Date('2026-01-16T14:00:00'),
    operator: 'Pedro Mora',
    outputProductName: 'Encurtido de Pepino',
    outputGrade: 'A',
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-16'),
  },
  {
    id: '6',
    batchCode: 'PROC-2026-006',
    inputProductName: 'Jengibre Fresco',
    inputProductType: 'tomate', // Using existing type, ideally add 'raices' type
    sourceModule: 'agro',
    sourceLocation: 'Lote Este',
    inputQuantity: 50,
    inputUnit: 'kg',
    outputQuantity: 8,
    outputUnit: 'kg',
    yieldPercentage: 16,
    status: 'in_progress',
    processingLineId: '1',
    processingLineName: 'Linea Agricola',
    startDate: new Date('2026-01-25T07:00:00'),
    expectedEndDate: new Date('2026-02-05T17:00:00'),
    operator: 'Pedro Mora',
    supervisor: 'Maria Garcia',
    outputProductName: 'Jengibre en Polvo',
    storageLocation: 'Bodega Seca A',
    createdAt: new Date('2026-01-25'),
    updatedAt: new Date('2026-01-28'),
    currentStageIndex: 3,
    stages: [
      {
        id: 'stg-1',
        order: 1,
        name: 'Cosecha',
        description: 'Recoleccion del jengibre fresco',
        status: 'completed',
        inputProductName: 'Jengibre en tierra',
        inputQuantity: 50,
        outputProductName: 'Jengibre fresco',
        outputQuantity: 50,
        unit: 'kg',
        completedAt: new Date('2026-01-25T09:00:00'),
        operator: 'Pedro Mora',
      },
      {
        id: 'stg-2',
        order: 2,
        name: 'Lavado de raices',
        description: 'Limpieza con agua para remover tierra',
        status: 'completed',
        inputProductName: 'Jengibre fresco',
        inputQuantity: 50,
        outputProductName: 'Jengibre lavado',
        outputQuantity: 49,
        unit: 'kg',
        completedAt: new Date('2026-01-25T11:00:00'),
        operator: 'Pedro Mora',
      },
      {
        id: 'stg-3',
        order: 3,
        name: 'Seleccion de raices',
        description: 'Separar raices danadas o de mala calidad',
        status: 'completed',
        inputProductName: 'Jengibre lavado',
        inputQuantity: 49,
        outputProductName: 'Jengibre seleccionado',
        outputQuantity: 45,
        unit: 'kg',
        completedAt: new Date('2026-01-25T14:00:00'),
        operator: 'Ana Lopez',
      },
      {
        id: 'stg-4',
        order: 4,
        name: 'Rayado en partes iguales',
        description: 'Cortar el jengibre en laminas finas',
        status: 'in_progress',
        inputProductName: 'Jengibre seleccionado',
        inputQuantity: 45,
        outputProductName: 'Jengibre en laminas',
        unit: 'kg',
        startedAt: new Date('2026-01-26T08:00:00'),
        operator: 'Pedro Mora',
      },
      {
        id: 'stg-5',
        order: 5,
        name: 'Colocar en bandejas',
        description: 'Distribuir laminas en bandejas de secado',
        status: 'pending',
        inputProductName: 'Jengibre en laminas',
        outputProductName: 'Jengibre en bandejas',
        unit: 'kg',
      },
      {
        id: 'stg-6',
        order: 6,
        name: 'Secado solar',
        description: 'Secar en secador solar (4-10 dias)',
        status: 'pending',
        inputProductName: 'Jengibre en bandejas',
        outputProductName: 'Hojuelas secas',
        unit: 'kg',
        notes: 'Duracion estimada: 4-10 dias segun clima',
      },
      {
        id: 'stg-7',
        order: 7,
        name: 'Molienda',
        description: 'Pasar por molino electrico (4-6 veces)',
        status: 'pending',
        inputProductName: 'Hojuelas secas',
        outputProductName: 'Jengibre molido',
        unit: 'kg',
      },
      {
        id: 'stg-8',
        order: 8,
        name: 'Cernido',
        description: 'Cernir para estandarizar grado de molienda',
        status: 'pending',
        inputProductName: 'Jengibre molido',
        outputProductName: 'Jengibre en polvo',
        unit: 'kg',
      },
      {
        id: 'stg-9',
        order: 9,
        name: 'Almacenamiento temporal',
        description: 'Guardar en recipiente plastico con tapa',
        status: 'pending',
        inputProductName: 'Jengibre en polvo',
        outputProductName: 'Jengibre almacenado',
        unit: 'kg',
      },
      {
        id: 'stg-10',
        order: 10,
        name: 'Envasado por peso',
        description: 'Pesar y envasar en empaques finales',
        status: 'pending',
        inputProductName: 'Jengibre almacenado',
        outputProductName: 'Jengibre envasado',
        unit: 'kg',
      },
      {
        id: 'stg-11',
        order: 11,
        name: 'Etiquetado',
        description: 'Colocar etiquetas con informacion del producto',
        status: 'pending',
        inputProductName: 'Jengibre envasado',
        outputProductName: 'Jengibre en Polvo (Producto Final)',
        unit: 'kg',
      },
    ],
  },
];

const initialQCs: QualityControl[] = [
  {
    id: '1',
    batchId: '2',
    batchCode: 'PROC-2026-002',
    inspectionDate: new Date('2026-01-19T17:00:00'),
    inspector: 'Maria Garcia',
    overallResult: 'pass',
    finalGrade: 'A',
    approved: true,
    approvedBy: 'Dr. Lopez',
    notes: 'Excelente calidad, sin defectos',
    createdAt: new Date('2026-01-19'),
    updatedAt: new Date('2026-01-19'),
  },
  {
    id: '2',
    batchId: '5',
    batchCode: 'PROC-2026-005',
    inspectionDate: new Date('2026-01-16T15:00:00'),
    inspector: 'Maria Garcia',
    overallResult: 'pass',
    finalGrade: 'A',
    approved: true,
    approvedBy: 'Dr. Lopez',
    createdAt: new Date('2026-01-16'),
    updatedAt: new Date('2026-01-16'),
  },
  {
    id: '3',
    batchId: '3',
    batchCode: 'PROC-2026-003',
    inspectionDate: new Date('2026-01-20T14:00:00'),
    inspector: 'Carlos Mendoza',
    overallResult: 'pass',
    finalGrade: 'A',
    approved: false,
    notes: 'Pendiente aprobacion final',
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date('2026-01-20'),
  },
];

// ========================================
// Store Initialization
// ========================================

function initializeLinesStore() {
  if (linesStore.length === 0) {
    linesStore = [...initialLines];
  }
}

function initializeBatchesStore() {
  if (batchesStore.length === 0) {
    batchesStore = [...initialBatches];
  }
}

function initializeQCStore() {
  if (qcStore.length === 0) {
    qcStore = [...initialQCs];
  }
}

// ========================================
// Processing Lines CRUD
// ========================================

export const getMockProcessingLines = async (): Promise<ProcessingLine[]> => {
  await delay(300);
  initializeLinesStore();
  return [...linesStore].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
};

export const getMockProcessingLineById = async (id: string): Promise<ProcessingLine | undefined> => {
  await delay(200);
  initializeLinesStore();
  return linesStore.find(l => l.id === id);
};

export const createMockProcessingLine = async (data: ProcessingLineFormData): Promise<ProcessingLine> => {
  await delay(400);
  initializeLinesStore();

  const newLine: ProcessingLine = {
    id: String(Date.now()),
    lineCode: data.lineCode,
    name: data.name,
    description: data.description,
    productTypes: data.productTypes,
    status: data.status,
    capacity: parseFloat(data.capacity),
    capacityUnit: data.capacityUnit,
    location: data.location,
    operator: data.operator,
    lastMaintenance: data.lastMaintenance ? new Date(data.lastMaintenance) : undefined,
    nextScheduledMaintenance: data.nextScheduledMaintenance ? new Date(data.nextScheduledMaintenance) : undefined,
    utilizationPercentage: 0,
    notes: data.notes,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  linesStore.push(newLine);
  return newLine;
};

export const updateMockProcessingLine = async (id: string, data: ProcessingLineFormData): Promise<ProcessingLine> => {
  await delay(400);
  initializeLinesStore();

  const index = linesStore.findIndex(l => l.id === id);
  if (index === -1) throw new Error('Processing line not found');

  const existing = linesStore[index];
  const updated: ProcessingLine = {
    ...existing,
    lineCode: data.lineCode,
    name: data.name,
    description: data.description,
    productTypes: data.productTypes,
    status: data.status,
    capacity: parseFloat(data.capacity),
    capacityUnit: data.capacityUnit,
    location: data.location,
    operator: data.operator,
    lastMaintenance: data.lastMaintenance ? new Date(data.lastMaintenance) : existing.lastMaintenance,
    nextScheduledMaintenance: data.nextScheduledMaintenance ? new Date(data.nextScheduledMaintenance) : existing.nextScheduledMaintenance,
    notes: data.notes,
    updatedAt: new Date(),
  };
  linesStore[index] = updated;
  return updated;
};

export const deleteMockProcessingLine = async (id: string): Promise<void> => {
  await delay(300);
  initializeLinesStore();
  const index = linesStore.findIndex(l => l.id === id);
  if (index === -1) throw new Error('Processing line not found');
  linesStore.splice(index, 1);
};

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

export const getMockProcessingBatchesByLine = async (lineId: string): Promise<ProcessingBatch[]> => {
  await delay(200);
  initializeBatchesStore();
  return batchesStore.filter(b => b.processingLineId === lineId);
};

export const createMockProcessingBatch = async (data: ProcessingBatchFormData): Promise<ProcessingBatch> => {
  await delay(400);
  initializeBatchesStore();
  initializeLinesStore();

  const line = linesStore.find(l => l.id === data.processingLineId);
  const inputQty = parseFloat(data.inputQuantity);
  const outputQty = data.outputQuantity ? parseFloat(data.outputQuantity) : undefined;

  const newBatch: ProcessingBatch = {
    id: String(Date.now()),
    batchCode: data.batchCode,
    inputProductName: data.inputProductName,
    inputProductType: data.inputProductType,
    sourceModule: data.sourceModule,
    sourceLocation: data.sourceLocation,
    inputQuantity: inputQty,
    inputUnit: data.inputUnit,
    outputProductName: data.outputProductName,
    outputQuantity: outputQty,
    outputUnit: data.outputUnit,
    outputGrade: data.outputGrade,
    yieldPercentage: outputQty ? (outputQty / inputQty) * 100 : undefined,
    status: data.status,
    processingLineId: data.processingLineId,
    processingLineName: line?.name,
    startDate: new Date(data.startDate),
    expectedEndDate: new Date(data.expectedEndDate),
    actualEndDate: data.actualEndDate ? new Date(data.actualEndDate) : undefined,
    operator: data.operator,
    supervisor: data.supervisor,
    temperature: data.temperature ? parseFloat(data.temperature) : undefined,
    storageLocation: data.storageLocation,
    notes: data.notes,
    stages: data.stages?.map((s, idx) => ({
      id: s.id || `stage-${Date.now()}-${idx}`,
      order: idx + 1,
      name: s.name,
      description: s.description,
      status: s.status || 'pending',
      inputProductName: s.inputProductName,
      inputQuantity: s.inputQuantity ? parseFloat(s.inputQuantity) : undefined,
      outputProductName: s.outputProductName,
      outputQuantity: s.outputQuantity ? parseFloat(s.outputQuantity) : undefined,
      unit: s.unit,
      operator: s.operator,
      notes: s.notes,
    })) as ProcessingStage[] | undefined,
    currentStageIndex: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  batchesStore.push(newBatch);
  return newBatch;
};

export const updateMockProcessingBatch = async (id: string, data: ProcessingBatchFormData): Promise<ProcessingBatch> => {
  await delay(400);
  initializeBatchesStore();
  initializeLinesStore();

  const index = batchesStore.findIndex(b => b.id === id);
  if (index === -1) throw new Error('Processing batch not found');

  const existing = batchesStore[index];
  const line = linesStore.find(l => l.id === data.processingLineId);
  const inputQty = parseFloat(data.inputQuantity);
  const outputQty = data.outputQuantity ? parseFloat(data.outputQuantity) : undefined;

  const updated: ProcessingBatch = {
    ...existing,
    batchCode: data.batchCode,
    inputProductName: data.inputProductName,
    inputProductType: data.inputProductType,
    sourceModule: data.sourceModule,
    sourceLocation: data.sourceLocation,
    inputQuantity: inputQty,
    inputUnit: data.inputUnit,
    outputProductName: data.outputProductName,
    outputQuantity: outputQty,
    outputUnit: data.outputUnit,
    outputGrade: data.outputGrade,
    yieldPercentage: outputQty ? (outputQty / inputQty) * 100 : undefined,
    status: data.status,
    processingLineId: data.processingLineId,
    processingLineName: line?.name,
    startDate: new Date(data.startDate),
    expectedEndDate: new Date(data.expectedEndDate),
    actualEndDate: data.actualEndDate ? new Date(data.actualEndDate) : existing.actualEndDate,
    operator: data.operator,
    supervisor: data.supervisor,
    temperature: data.temperature ? parseFloat(data.temperature) : undefined,
    storageLocation: data.storageLocation,
    notes: data.notes,
    stages: data.stages?.map((s, idx) => ({
      id: s.id || `stage-${Date.now()}-${idx}`,
      order: idx + 1,
      name: s.name,
      description: s.description,
      status: s.status || 'pending',
      inputProductName: s.inputProductName,
      inputQuantity: s.inputQuantity ? parseFloat(s.inputQuantity) : undefined,
      outputProductName: s.outputProductName,
      outputQuantity: s.outputQuantity ? parseFloat(s.outputQuantity) : undefined,
      unit: s.unit,
      operator: s.operator,
      notes: s.notes,
    })) as ProcessingStage[] | undefined,
    currentStageIndex: existing.currentStageIndex,
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
// Quality Control CRUD
// ========================================

export const getMockQualityControls = async (): Promise<QualityControl[]> => {
  await delay(300);
  initializeQCStore();
  return [...qcStore].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
};

export const getMockQualityControlsByBatch = async (batchId: string): Promise<QualityControl[]> => {
  await delay(200);
  initializeQCStore();
  return qcStore.filter(qc => qc.batchId === batchId);
};

export const createMockQualityControl = async (data: QualityControlFormData): Promise<QualityControl> => {
  await delay(400);
  initializeQCStore();
  initializeBatchesStore();

  const batch = batchesStore.find(b => b.id === data.batchId);

  const newQC: QualityControl = {
    id: String(Date.now()),
    batchId: data.batchId,
    batchCode: batch?.batchCode || '',
    inspectionDate: new Date(data.inspectionDate),
    inspector: data.inspector,
    overallResult: data.overallResult,
    finalGrade: data.finalGrade,
    approved: data.approved,
    approvedBy: data.approvedBy,
    defectsFound: data.defectsDescription
      ? [{ type: 'general', description: data.defectsDescription, severity: 'minor' as const }]
      : undefined,
    notes: data.notes
      ? [
          data.notes,
          data.correctiveActions ? `Acciones correctivas: ${data.correctiveActions}` : '',
          data.temperature ? `Temperatura: ${data.temperature} C` : '',
          data.humidity ? `Humedad: ${data.humidity}%` : '',
          data.pH ? `pH: ${data.pH}` : '',
        ].filter(Boolean).join('. ')
      : undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  qcStore.push(newQC);
  return newQC;
};

export const updateMockQualityControl = async (id: string, data: QualityControlFormData): Promise<QualityControl> => {
  await delay(400);
  initializeQCStore();
  initializeBatchesStore();

  const index = qcStore.findIndex(qc => qc.id === id);
  if (index === -1) throw new Error('Quality control not found');

  const existing = qcStore[index];
  const batch = batchesStore.find(b => b.id === data.batchId);

  const updated: QualityControl = {
    ...existing,
    batchId: data.batchId,
    batchCode: batch?.batchCode || existing.batchCode,
    inspectionDate: new Date(data.inspectionDate),
    inspector: data.inspector,
    overallResult: data.overallResult,
    finalGrade: data.finalGrade,
    approved: data.approved,
    approvedBy: data.approvedBy,
    defectsFound: data.defectsDescription
      ? [{ type: 'general', description: data.defectsDescription, severity: 'minor' as const }]
      : undefined,
    notes: [
      data.notes || '',
      data.correctiveActions ? `Acciones correctivas: ${data.correctiveActions}` : '',
      data.temperature ? `Temperatura: ${data.temperature} C` : '',
      data.humidity ? `Humedad: ${data.humidity}%` : '',
      data.pH ? `pH: ${data.pH}` : '',
    ].filter(Boolean).join('. ') || undefined,
    updatedAt: new Date(),
  };
  qcStore[index] = updated;
  return updated;
};

export const deleteMockQualityControl = async (id: string): Promise<void> => {
  await delay(300);
  initializeQCStore();
  const index = qcStore.findIndex(qc => qc.id === id);
  if (index === -1) throw new Error('Quality control not found');
  qcStore.splice(index, 1);
};

// ========================================
// Dashboard & Chart Data (unchanged)
// ========================================

export const getMockProcesamientoStats = async (): Promise<ProcesamientoDashboardStats> => {
  await delay(300);
  return {
    activeBatches: 2,
    completedBatchesToday: 1,
    totalBatchesThisMonth: 12,
    totalProcessed: 1850,
    processedUnit: 'kg',
    totalProduced: 856,
    producedUnit: 'kg',
    utilizationRate: 62,
    qualityPassRate: 94,
    averageYield: 68,
    pendingQualityControl: 1,
    rejectedBatches: 0,
    activeProcessingLines: 2,
    totalProcessingLines: 4,
    linesUnderMaintenance: 1,
  };
};

export const getMockProcesamientoProduction = async (): Promise<ProcesamientoProductionData[]> => {
  await delay(300);
  return [
    { month: 'Ago', processed: 1200, produced: 780, yieldRate: 65 },
    { month: 'Sep', processed: 1450, produced: 1015, yieldRate: 70 },
    { month: 'Oct', processed: 1380, produced: 938, yieldRate: 68 },
    { month: 'Nov', processed: 1620, produced: 1134, yieldRate: 70 },
    { month: 'Dic', processed: 1100, produced: 715, yieldRate: 65 },
    { month: 'Ene', processed: 1850, produced: 1258, yieldRate: 68 },
  ];
};

export const getMockProductionByType = async (): Promise<ProductionByType[]> => {
  await delay(300);
  return [
    { productType: 'Salsas', quantity: 420, unit: 'kg', percentage: 33, color: '#ef4444' },
    { productType: 'Lacteos', quantity: 280, unit: 'kg', percentage: 22, color: '#3b82f6' },
    { productType: 'Miel', quantity: 220, unit: 'kg', percentage: 17, color: '#f59e0b' },
    { productType: 'Encurtidos', quantity: 180, unit: 'kg', percentage: 14, color: '#10b981' },
    { productType: 'Otros', quantity: 156, unit: 'kg', percentage: 14, color: '#6b7280' },
  ];
};

export const getMockProcesamientoTasks = async (): Promise<ProcesamientoTask[]> => {
  await delay(300);
  return [
    {
      id: '1',
      title: 'Control de calidad - Miel',
      type: 'quality_control',
      batchCode: 'PROC-2026-003',
      dueDate: new Date('2026-01-21'),
      priority: 'high',
      status: 'pending',
      assignedTo: 'Dr. Lopez',
    },
    {
      id: '2',
      title: 'Mantenimiento Linea Carnes',
      type: 'line_maintenance',
      lineCode: 'LINEA-004',
      dueDate: new Date('2026-01-25'),
      priority: 'high',
      status: 'in_progress',
      assignedTo: 'Tecnico Ramirez',
    },
    {
      id: '3',
      title: 'Procesar lote de chile',
      type: 'batch_processing',
      batchCode: 'PROC-2026-004',
      dueDate: new Date('2026-01-22'),
      priority: 'medium',
      status: 'pending',
      assignedTo: 'Juan Perez',
    },
    {
      id: '4',
      title: 'Calibracion Linea Lacteos',
      type: 'equipment_calibration',
      lineCode: 'LINEA-002',
      dueDate: new Date('2026-01-23'),
      priority: 'medium',
      status: 'pending',
    },
    {
      id: '5',
      title: 'Planificacion produccion semanal',
      type: 'batch_processing',
      dueDate: new Date('2026-01-26'),
      priority: 'low',
      status: 'pending',
      assignedTo: 'Maria Garcia',
    },
  ];
};

export const getMockBatchSummaries = async (): Promise<BatchSummary[]> => {
  await delay(300);
  initializeBatchesStore();
  return batchesStore
    .filter(b => b.status !== 'completed' && b.status !== 'rejected')
    .map(b => ({
      id: b.id,
      batchCode: b.batchCode,
      inputProductName: b.inputProductName,
      inputProductType: b.inputProductType,
      inputQuantity: b.inputQuantity,
      inputUnit: b.inputUnit,
      outputProductName: b.outputProductName,
      status: b.status,
      processingLineName: b.processingLineName || '',
      startDate: b.startDate,
      expectedEndDate: b.expectedEndDate,
      progress: b.stages && b.stages.length > 0
        ? Math.round((b.stages.filter(s => s.status === 'completed').length / b.stages.length) * 100)
        : b.status === 'pending' ? 0 :
          b.status === 'in_progress' ? 65 :
          b.status === 'quality_control' ? 100 :
          b.status === 'paused' ? 30 : 0,
      operator: b.operator,
      qualityStatus: b.status === 'quality_control' ? 'pending' as const : undefined,
    }))
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
};
