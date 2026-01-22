import type {
  Lote,
  Crop,
  AgroDashboardStats,
  AgroProductionData,
  AgroTask,
  CropDistribution,
  CropSummary,
  AgroAction,
} from '../../types/agro.types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Lotes mock data
export const getMockLotes = async (): Promise<Lote[]> => {
  await delay(300);
  return [
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
};

// Crops mock data
export const getMockCrops = async (): Promise<Crop[]> => {
  await delay(300);
  return [
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

// Recent actions
export const getMockRecentAgroActions = async (): Promise<AgroAction[]> => {
  await delay(300);
  return [
    {
      id: '1',
      cropId: '1',
      cropName: 'Tomate',
      loteId: '1',
      loteName: 'Lote Norte',
      type: 'fertilization',
      date: new Date('2026-01-18'),
      description: 'Aplicación de fertilizante NPK',
      insumoUsed: 'NPK 15-15-15',
      quantity: 50,
      unit: 'kg',
      cost: 45000,
      performedBy: 'Juan Pérez',
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
      description: 'Riego por aspersión',
      quantity: 15000,
      unit: 'L',
      performedBy: 'María López',
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
      description: 'Control preventivo de áfidos',
      insumoUsed: 'Insecticida orgánico',
      quantity: 5,
      unit: 'L',
      cost: 25000,
      performedBy: 'Carlos Sánchez',
      createdAt: new Date('2026-01-15'),
      updatedAt: new Date('2026-01-15'),
    },
  ];
};
