import type {
  Lote,
  Crop,
  AgroDashboardStats,
  AgroProductionData,
  AgroTask,
  CropDistribution,
  CropSummary,
  AgroAction,
  Harvest,
} from '../../types/agro.types';
import type { LoteFormData, CropFormData, AgroActionFormData, HarvestFormData } from '../../schemas/agro.schema';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory stores
let lotesStore: Lote[] = [];
let cropsStore: Crop[] = [];
let agroActionsStore: AgroAction[] = [];
let harvestsStore: Harvest[] = [];

// Initial Lotes Data
const initialLotes: Lote[] = [
  {
    id: '1',
    name: 'Lote Norte',
    code: 'LT-001',
    area: 5.5,
    soilType: 'Franco arcilloso',
    irrigationType: 'drip',
    status: 'active',
    currentCropId: '1',
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2026-01-15'),
  },
  {
    id: '2',
    name: 'Lote Central',
    code: 'LT-002',
    area: 8.2,
    soilType: 'Franco arenoso',
    irrigationType: 'sprinkler',
    status: 'active',
    currentCropId: '2',
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2026-01-10'),
  },
  {
    id: '3',
    name: 'Lote Sur',
    code: 'LT-003',
    area: 4.0,
    soilType: 'Franco',
    irrigationType: 'drip',
    status: 'active',
    currentCropId: '3',
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2026-01-18'),
  },
  {
    id: '4',
    name: 'Lote Este',
    code: 'LT-004',
    area: 3.5,
    soilType: 'Arcilloso',
    irrigationType: 'flood',
    status: 'preparation',
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2026-01-05'),
  },
  {
    id: '5',
    name: 'Lote Oeste',
    code: 'LT-005',
    area: 2.8,
    soilType: 'Franco arenoso',
    irrigationType: 'none',
    status: 'resting',
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2025-12-20'),
  },
];

// Initial Crops Data
const initialCrops: Crop[] = [
    {
      id: '1',
      name: 'Tomate',
      variety: 'Roma',
      productType: 'primary',
      loteId: '1',
      loteName: 'Lote Norte',
      area: 5.5,
      plantingDate: new Date('2025-10-15'),
      expectedHarvestDate: new Date('2026-02-15'),
      status: 'fruiting',
      estimatedYield: 45000,
      yieldUnit: 'kg',
      createdAt: new Date('2025-10-15'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: '2',
      name: 'Chile',
      variety: 'Jalapeño',
      productType: 'primary',
      loteId: '2',
      loteName: 'Lote Central',
      area: 8.2,
      plantingDate: new Date('2025-11-01'),
      expectedHarvestDate: new Date('2026-03-01'),
      status: 'flowering',
      estimatedYield: 32000,
      yieldUnit: 'kg',
      createdAt: new Date('2025-11-01'),
      updatedAt: new Date('2026-01-10'),
    },
    {
      id: '3',
      name: 'Pepino',
      variety: 'Americano',
      productType: 'primary',
      loteId: '3',
      loteName: 'Lote Sur',
      area: 4.0,
      plantingDate: new Date('2025-12-01'),
      expectedHarvestDate: new Date('2026-02-28'),
      status: 'growing',
      estimatedYield: 28000,
      yieldUnit: 'kg',
      createdAt: new Date('2025-12-01'),
      updatedAt: new Date('2026-01-18'),
    },
    {
      id: '4',
      name: 'Cilantro',
      variety: 'Común',
      productType: 'secondary',
      loteId: '1',
      loteName: 'Lote Norte',
      area: 0.5,
      plantingDate: new Date('2025-12-15'),
      expectedHarvestDate: new Date('2026-01-30'),
      status: 'ready',
      estimatedYield: 800,
      yieldUnit: 'kg',
      createdAt: new Date('2025-12-15'),
      updatedAt: new Date('2026-01-20'),
    },
  ];

// Initialize stores
export const initializeLotesStore = () => {
  if (lotesStore.length === 0) {
    lotesStore = [...initialLotes];
  }
};

export const initializeCropsStore = () => {
  if (cropsStore.length === 0) {
    cropsStore = [...initialCrops];
  }
};

// Get Lotes
export const getMockLotes = async (): Promise<Lote[]> => {
  await delay(300);
  initializeLotesStore();
  return [...lotesStore].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
};

// Get single Lote
export const getMockLoteById = async (id: string): Promise<Lote | undefined> => {
  await delay(200);
  initializeLotesStore();
  return lotesStore.find(l => l.id === id);
};

// Create Lote
export const createMockLote = async (data: LoteFormData): Promise<Lote> => {
  await delay(400);
  initializeLotesStore();
  const newLote: Lote = {
    id: String(Date.now()),
    name: data.name,
    code: data.code,
    area: parseFloat(data.area),
    soilType: data.soilType,
    irrigationType: data.irrigationType,
    status: data.status,
    notes: data.notes,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  lotesStore.push(newLote);
  return newLote;
};

// Update Lote
export const updateMockLote = async (id: string, data: LoteFormData): Promise<Lote> => {
  await delay(400);
  initializeLotesStore();
  const index = lotesStore.findIndex(l => l.id === id);
  if (index === -1) throw new Error('Lote not found');

  const existingLote = lotesStore[index];
  const updatedLote: Lote = {
    ...existingLote,
    name: data.name,
    code: data.code,
    area: parseFloat(data.area),
    soilType: data.soilType,
    irrigationType: data.irrigationType,
    status: data.status,
    notes: data.notes,
    updatedAt: new Date(),
  };
  lotesStore[index] = updatedLote;
  return updatedLote;
};

// Delete Lote
export const deleteMockLote = async (id: string): Promise<void> => {
  await delay(300);
  initializeLotesStore();
  const index = lotesStore.findIndex(l => l.id === id);
  if (index === -1) throw new Error('Lote not found');
  lotesStore.splice(index, 1);
};

// Get Crops
export const getMockCrops = async (): Promise<Crop[]> => {
  await delay(300);
  initializeCropsStore();
  initializeLotesStore();
  return [...cropsStore].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
};

// Get single Crop
export const getMockCropById = async (id: string): Promise<Crop | undefined> => {
  await delay(200);
  initializeCropsStore();
  return cropsStore.find(c => c.id === id);
};

// Create Crop
export const createMockCrop = async (data: CropFormData): Promise<Crop> => {
  await delay(400);
  initializeCropsStore();
  initializeLotesStore();

  const lote = lotesStore.find(l => l.id === data.loteId);
  const newCrop: Crop = {
    id: String(Date.now()),
    name: data.name,
    variety: data.variety,
    productType: data.productType,
    loteId: data.loteId,
    loteName: lote?.name || '',
    area: parseFloat(data.area),
    plantingDate: new Date(data.plantingDate),
    expectedHarvestDate: new Date(data.expectedHarvestDate),
    actualHarvestDate: data.actualHarvestDate ? new Date(data.actualHarvestDate) : undefined,
    status: data.status,
    seedsUsed: data.seedsUsed ? parseFloat(data.seedsUsed) : undefined,
    seedsUnit: data.seedsUnit,
    estimatedYield: data.estimatedYield ? parseFloat(data.estimatedYield) : undefined,
    actualYield: data.actualYield ? parseFloat(data.actualYield) : undefined,
    yieldUnit: data.yieldUnit,
    notes: data.notes,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  cropsStore.push(newCrop);
  return newCrop;
};

// Update Crop
export const updateMockCrop = async (id: string, data: CropFormData): Promise<Crop> => {
  await delay(400);
  initializeCropsStore();
  initializeLotesStore();

  const index = cropsStore.findIndex(c => c.id === id);
  if (index === -1) throw new Error('Crop not found');

  const lote = lotesStore.find(l => l.id === data.loteId);
  const existingCrop = cropsStore[index];
  const updatedCrop: Crop = {
    ...existingCrop,
    name: data.name,
    variety: data.variety,
    productType: data.productType,
    loteId: data.loteId,
    loteName: lote?.name || '',
    area: parseFloat(data.area),
    plantingDate: new Date(data.plantingDate),
    expectedHarvestDate: new Date(data.expectedHarvestDate),
    actualHarvestDate: data.actualHarvestDate ? new Date(data.actualHarvestDate) : undefined,
    status: data.status,
    seedsUsed: data.seedsUsed ? parseFloat(data.seedsUsed) : undefined,
    seedsUnit: data.seedsUnit,
    estimatedYield: data.estimatedYield ? parseFloat(data.estimatedYield) : undefined,
    actualYield: data.actualYield ? parseFloat(data.actualYield) : undefined,
    yieldUnit: data.yieldUnit,
    notes: data.notes,
    updatedAt: new Date(),
  };
  cropsStore[index] = updatedCrop;
  return updatedCrop;
};

// Delete Crop
export const deleteMockCrop = async (id: string): Promise<void> => {
  await delay(300);
  initializeCropsStore();
  const index = cropsStore.findIndex(c => c.id === id);
  if (index === -1) throw new Error('Crop not found');
  cropsStore.splice(index, 1);
};

// Dashboard stats
export const getMockAgroStats = async (): Promise<AgroDashboardStats> => {
  await delay(300);
  return {
    totalLotes: 5,
    activeLotes: 3,
    totalArea: 24.0,
    cultivatedArea: 18.2,
    activeCrops: 4,
    readyToHarvest: 1,
    monthlyHarvest: {
      quantity: 12500,
      unit: 'kg',
    },
    monthlyRevenue: 8750000,
    pendingActions: 6,
  };
};

// Production data for charts
export const getMockAgroProduction = async (): Promise<AgroProductionData[]> => {
  await delay(300);
  return [
    { month: 'Ago', harvest: 8500, revenue: 5950000, area: 12.5 },
    { month: 'Sep', harvest: 10200, revenue: 7140000, area: 14.0 },
    { month: 'Oct', harvest: 11800, revenue: 8260000, area: 15.5 },
    { month: 'Nov', harvest: 9500, revenue: 6650000, area: 13.0 },
    { month: 'Dic', harvest: 7200, revenue: 5040000, area: 10.5 },
    { month: 'Ene', harvest: 12500, revenue: 8750000, area: 16.2 },
  ];
};

// Tasks
export const getMockAgroTasks = async (): Promise<AgroTask[]> => {
  await delay(300);
  return [
    {
      id: '1',
      title: 'Cosecha de cilantro',
      type: 'harvest',
      cropName: 'Cilantro',
      loteName: 'Lote Norte',
      dueDate: new Date('2026-01-25'),
      priority: 'high',
      status: 'pending',
    },
    {
      id: '2',
      title: 'Aplicación de fertilizante',
      type: 'fertilization',
      cropName: 'Tomate',
      loteName: 'Lote Norte',
      dueDate: new Date('2026-01-26'),
      priority: 'medium',
      status: 'pending',
    },
    {
      id: '3',
      title: 'Riego programado',
      type: 'irrigation',
      loteName: 'Lote Central',
      dueDate: new Date('2026-01-22'),
      priority: 'high',
      status: 'pending',
    },
    {
      id: '4',
      title: 'Control de plagas',
      type: 'pesticide',
      cropName: 'Chile',
      loteName: 'Lote Central',
      dueDate: new Date('2026-01-28'),
      priority: 'medium',
      status: 'pending',
    },
    {
      id: '5',
      title: 'Preparación de terreno',
      type: 'maintenance',
      loteName: 'Lote Este',
      dueDate: new Date('2026-02-01'),
      priority: 'low',
      status: 'pending',
    },
  ];
};

// Crop distribution for charts
export const getMockCropDistribution = async (): Promise<CropDistribution[]> => {
  await delay(300);
  return [
    { crop: 'Tomate', area: 5.5, percentage: 30.2, color: '#ef4444' },
    { crop: 'Chile', area: 8.2, percentage: 45.1, color: '#22c55e' },
    { crop: 'Pepino', area: 4.0, percentage: 22.0, color: '#3b82f6' },
    { crop: 'Cilantro', area: 0.5, percentage: 2.7, color: '#10b981' },
  ];
};

// Crop summaries for cards
export const getMockCropSummaries = async (): Promise<CropSummary[]> => {
  await delay(300);
  return [
    {
      id: '1',
      name: 'Tomate',
      variety: 'Roma',
      loteName: 'Lote Norte',
      area: 5.5,
      status: 'fruiting',
      progress: 75,
      daysToHarvest: 25,
      healthStatus: 'excellent',
    },
    {
      id: '2',
      name: 'Chile',
      variety: 'Jalapeño',
      loteName: 'Lote Central',
      area: 8.2,
      status: 'flowering',
      progress: 55,
      daysToHarvest: 40,
      healthStatus: 'good',
    },
    {
      id: '3',
      name: 'Pepino',
      variety: 'Americano',
      loteName: 'Lote Sur',
      area: 4.0,
      status: 'growing',
      progress: 35,
      daysToHarvest: 38,
      healthStatus: 'good',
    },
    {
      id: '4',
      name: 'Cilantro',
      variety: 'Común',
      loteName: 'Lote Norte',
      area: 0.5,
      status: 'ready',
      progress: 100,
      daysToHarvest: 0,
      healthStatus: 'excellent',
    },
  ];
};

// Initial AgroActions Data
const initialAgroActions: AgroAction[] = [
  {
    id: '1',
    cropId: '1',
    cropName: 'Tomate',
    loteId: '1',
    loteName: 'Lote Norte',
    type: 'fertilization',
    date: new Date('2026-01-18'),
    description: 'Aplicacion de fertilizante NPK',
    insumoUsed: 'NPK 15-15-15',
    quantity: 50,
    unit: 'kg',
    cost: 45000,
    performedBy: 'Juan Perez',
    weatherConditions: 'sunny',
    createdAt: new Date('2026-01-18'),
    updatedAt: new Date('2026-01-18'),
  },
  {
    id: '2',
    cropId: '2',
    cropName: 'Chile',
    loteId: '2',
    loteName: 'Lote Central',
    type: 'irrigation',
    date: new Date('2026-01-17'),
    description: 'Riego por aspersion',
    quantity: 15000,
    unit: 'L',
    performedBy: 'Maria Lopez',
    weatherConditions: 'cloudy',
    createdAt: new Date('2026-01-17'),
    updatedAt: new Date('2026-01-17'),
  },
  {
    id: '3',
    cropId: '3',
    cropName: 'Pepino',
    loteId: '3',
    loteName: 'Lote Sur',
    type: 'pesticide',
    date: new Date('2026-01-15'),
    description: 'Control preventivo de afidos',
    insumoUsed: 'Insecticida organico',
    quantity: 5,
    unit: 'L',
    cost: 25000,
    performedBy: 'Carlos Sanchez',
    weatherConditions: 'sunny',
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-15'),
  },
  {
    id: '4',
    cropId: '1',
    cropName: 'Tomate',
    loteId: '1',
    loteName: 'Lote Norte',
    type: 'weeding',
    date: new Date('2026-01-12'),
    description: 'Deshierbe manual de camas',
    performedBy: 'Pedro Martinez',
    weatherConditions: 'sunny',
    createdAt: new Date('2026-01-12'),
    updatedAt: new Date('2026-01-12'),
  },
  {
    id: '5',
    loteId: '4',
    loteName: 'Lote Este',
    type: 'soil_preparation',
    date: new Date('2026-01-10'),
    description: 'Preparacion de suelo con tractor',
    cost: 120000,
    performedBy: 'Juan Perez',
    weatherConditions: 'sunny',
    notes: 'Se preparo toda el area para proxima siembra',
    createdAt: new Date('2026-01-10'),
    updatedAt: new Date('2026-01-10'),
  },
];

// Initial Harvests Data
const initialHarvests: Harvest[] = [
  {
    id: '1',
    cropId: '4',
    cropName: 'Cilantro',
    loteId: '1',
    loteName: 'Lote Norte',
    date: new Date('2026-01-20'),
    quantity: 150,
    unit: 'kg',
    quality: 'A',
    destination: 'sale',
    pricePerUnit: 2500,
    totalValue: 375000,
    harvestedBy: 'Maria Lopez',
    notes: 'Excelente calidad, hojas frescas',
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date('2026-01-20'),
  },
  {
    id: '2',
    cropId: '4',
    cropName: 'Cilantro',
    loteId: '1',
    loteName: 'Lote Norte',
    date: new Date('2026-01-15'),
    quantity: 100,
    unit: 'kg',
    quality: 'B',
    destination: 'sale',
    pricePerUnit: 2000,
    totalValue: 200000,
    harvestedBy: 'Carlos Sanchez',
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-15'),
  },
  {
    id: '3',
    cropId: '1',
    cropName: 'Tomate',
    loteId: '1',
    loteName: 'Lote Norte',
    date: new Date('2026-01-08'),
    quantity: 500,
    unit: 'kg',
    quality: 'A',
    destination: 'sale',
    pricePerUnit: 1800,
    totalValue: 900000,
    harvestedBy: 'Juan Perez',
    notes: 'Primera cosecha de la temporada',
    createdAt: new Date('2026-01-08'),
    updatedAt: new Date('2026-01-08'),
  },
];

// Initialize AgroActions store
export const initializeAgroActionsStore = () => {
  if (agroActionsStore.length === 0) {
    agroActionsStore = [...initialAgroActions];
  }
};

// Initialize Harvests store
export const initializeHarvestsStore = () => {
  if (harvestsStore.length === 0) {
    harvestsStore = [...initialHarvests];
  }
};

// ==================== AGRO ACTIONS CRUD ====================

// Get all AgroActions
export const getMockAgroActions = async (): Promise<AgroAction[]> => {
  await delay(300);
  initializeAgroActionsStore();
  return [...agroActionsStore].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Get AgroActions by Lote
export const getMockAgroActionsByLote = async (loteId: string): Promise<AgroAction[]> => {
  await delay(300);
  initializeAgroActionsStore();
  return agroActionsStore
    .filter(a => a.loteId === loteId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Get AgroActions by Crop
export const getMockAgroActionsByCrop = async (cropId: string): Promise<AgroAction[]> => {
  await delay(300);
  initializeAgroActionsStore();
  return agroActionsStore
    .filter(a => a.cropId === cropId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Get single AgroAction
export const getMockAgroActionById = async (id: string): Promise<AgroAction | undefined> => {
  await delay(200);
  initializeAgroActionsStore();
  return agroActionsStore.find(a => a.id === id);
};

// Create AgroAction
export const createMockAgroAction = async (data: AgroActionFormData): Promise<AgroAction> => {
  await delay(400);
  initializeAgroActionsStore();
  initializeLotesStore();
  initializeCropsStore();

  const lote = lotesStore.find(l => l.id === data.loteId);
  const crop = data.cropId ? cropsStore.find(c => c.id === data.cropId) : undefined;

  const newAction: AgroAction = {
    id: String(Date.now()),
    loteId: data.loteId,
    loteName: lote?.name || '',
    cropId: data.cropId || undefined,
    cropName: crop?.name,
    type: data.type,
    date: new Date(data.date),
    description: data.description,
    insumoUsed: data.insumoUsed || undefined,
    quantity: data.quantity ? parseFloat(data.quantity) : undefined,
    unit: data.unit || undefined,
    cost: data.cost ? parseFloat(data.cost) : undefined,
    performedBy: data.performedBy,
    weatherConditions: data.weatherConditions || undefined,
    notes: data.notes || undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  agroActionsStore.push(newAction);
  return newAction;
};

// Update AgroAction
export const updateMockAgroAction = async (id: string, data: AgroActionFormData): Promise<AgroAction> => {
  await delay(400);
  initializeAgroActionsStore();
  initializeLotesStore();
  initializeCropsStore();

  const index = agroActionsStore.findIndex(a => a.id === id);
  if (index === -1) throw new Error('AgroAction not found');

  const lote = lotesStore.find(l => l.id === data.loteId);
  const crop = data.cropId ? cropsStore.find(c => c.id === data.cropId) : undefined;
  const existing = agroActionsStore[index];

  const updatedAction: AgroAction = {
    ...existing,
    loteId: data.loteId,
    loteName: lote?.name || '',
    cropId: data.cropId || undefined,
    cropName: crop?.name,
    type: data.type,
    date: new Date(data.date),
    description: data.description,
    insumoUsed: data.insumoUsed || undefined,
    quantity: data.quantity ? parseFloat(data.quantity) : undefined,
    unit: data.unit || undefined,
    cost: data.cost ? parseFloat(data.cost) : undefined,
    performedBy: data.performedBy,
    weatherConditions: data.weatherConditions || undefined,
    notes: data.notes || undefined,
    updatedAt: new Date(),
  };
  agroActionsStore[index] = updatedAction;
  return updatedAction;
};

// Delete AgroAction
export const deleteMockAgroAction = async (id: string): Promise<void> => {
  await delay(300);
  initializeAgroActionsStore();
  const index = agroActionsStore.findIndex(a => a.id === id);
  if (index === -1) throw new Error('AgroAction not found');
  agroActionsStore.splice(index, 1);
};

// ==================== HARVESTS CRUD ====================

// Get all Harvests
export const getMockHarvests = async (): Promise<Harvest[]> => {
  await delay(300);
  initializeHarvestsStore();
  return [...harvestsStore].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Get Harvests by Lote
export const getMockHarvestsByLote = async (loteId: string): Promise<Harvest[]> => {
  await delay(300);
  initializeHarvestsStore();
  return harvestsStore
    .filter(h => h.loteId === loteId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Get Harvests by Crop
export const getMockHarvestsByCrop = async (cropId: string): Promise<Harvest[]> => {
  await delay(300);
  initializeHarvestsStore();
  return harvestsStore
    .filter(h => h.cropId === cropId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Get single Harvest
export const getMockHarvestById = async (id: string): Promise<Harvest | undefined> => {
  await delay(200);
  initializeHarvestsStore();
  return harvestsStore.find(h => h.id === id);
};

// Create Harvest
export const createMockHarvest = async (data: HarvestFormData): Promise<Harvest> => {
  await delay(400);
  initializeHarvestsStore();
  initializeLotesStore();
  initializeCropsStore();

  const lote = lotesStore.find(l => l.id === data.loteId);
  const crop = cropsStore.find(c => c.id === data.cropId);
  const quantity = parseFloat(data.quantity);
  const pricePerUnit = data.pricePerUnit ? parseFloat(data.pricePerUnit) : undefined;
  const totalValue = pricePerUnit ? quantity * pricePerUnit : undefined;

  const newHarvest: Harvest = {
    id: String(Date.now()),
    cropId: data.cropId,
    cropName: crop?.name || '',
    loteId: data.loteId,
    loteName: lote?.name || '',
    date: new Date(data.date),
    quantity,
    unit: data.unit,
    quality: data.quality,
    destination: data.destination,
    pricePerUnit,
    totalValue,
    harvestedBy: data.harvestedBy || undefined,
    notes: data.notes || undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  harvestsStore.push(newHarvest);
  return newHarvest;
};

// Update Harvest
export const updateMockHarvest = async (id: string, data: HarvestFormData): Promise<Harvest> => {
  await delay(400);
  initializeHarvestsStore();
  initializeLotesStore();
  initializeCropsStore();

  const index = harvestsStore.findIndex(h => h.id === id);
  if (index === -1) throw new Error('Harvest not found');

  const lote = lotesStore.find(l => l.id === data.loteId);
  const crop = cropsStore.find(c => c.id === data.cropId);
  const existing = harvestsStore[index];
  const quantity = parseFloat(data.quantity);
  const pricePerUnit = data.pricePerUnit ? parseFloat(data.pricePerUnit) : undefined;
  const totalValue = pricePerUnit ? quantity * pricePerUnit : undefined;

  const updatedHarvest: Harvest = {
    ...existing,
    cropId: data.cropId,
    cropName: crop?.name || '',
    loteId: data.loteId,
    loteName: lote?.name || '',
    date: new Date(data.date),
    quantity,
    unit: data.unit,
    quality: data.quality,
    destination: data.destination,
    pricePerUnit,
    totalValue,
    harvestedBy: data.harvestedBy || undefined,
    notes: data.notes || undefined,
    updatedAt: new Date(),
  };
  harvestsStore[index] = updatedHarvest;
  return updatedHarvest;
};

// Delete Harvest
export const deleteMockHarvest = async (id: string): Promise<void> => {
  await delay(300);
  initializeHarvestsStore();
  const index = harvestsStore.findIndex(h => h.id === id);
  if (index === -1) throw new Error('Harvest not found');
  harvestsStore.splice(index, 1);
};

// Recent actions (for dashboard)
export const getMockRecentAgroActions = async (): Promise<AgroAction[]> => {
  await delay(300);
  initializeAgroActionsStore();
  return [...agroActionsStore]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
};
