import type {
  Asset,
  AssetMovement,
  DepreciationRecord,
  ActivosDashboardStats,
  AssetsByCategory,
  AssetsByStatus,
  DepreciationSummary,
  AssetValueTrend,
  AssetActivity,
} from '../../types/activos.types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Assets Mock Data
export const getMockAssets = async (): Promise<Asset[]> => {
  await delay(300);
  return [
    {
      id: '1',
      code: 'ACT-001',
      name: 'Finca La Esperanza - Lote Principal',
      description: 'Terreno principal de la finca, 50 hectáreas',
      category: 'land',
      status: 'active',
      location: 'Sector Central',
      acquisitionDate: new Date('2010-01-15'),
      acquisitionCost: 500000000,
      currentValue: 750000000,
      depreciationMethod: 'none',
      accumulatedDepreciation: 0,
      assignedModule: 'general',
      createdAt: new Date('2010-01-15'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: '2',
      code: 'ACT-002',
      name: 'Tractor John Deere 5075E',
      description: 'Tractor agrícola principal',
      category: 'vehicle',
      status: 'active',
      location: 'Bodega Principal',
      acquisitionDate: new Date('2021-03-15'),
      acquisitionCost: 45000000,
      currentValue: 36000000,
      depreciationMethod: 'straight_line',
      usefulLifeYears: 10,
      salvageValue: 5000000,
      accumulatedDepreciation: 9000000,
      assignedModule: 'agro',
      responsiblePerson: 'Juan García',
      serialNumber: 'JD5075E-2021-001',
      createdAt: new Date('2021-03-15'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: '3',
      code: 'ACT-003',
      name: 'Ordeñadora Mecánica DeLaval',
      description: 'Sistema automatizado de ordeño',
      category: 'machinery',
      status: 'active',
      location: 'Establo Principal',
      acquisitionDate: new Date('2019-09-20'),
      acquisitionCost: 85000000,
      currentValue: 59500000,
      depreciationMethod: 'straight_line',
      usefulLifeYears: 10,
      salvageValue: 8500000,
      accumulatedDepreciation: 25500000,
      assignedModule: 'pecuario',
      responsiblePerson: 'María López',
      serialNumber: 'DL-VMS-2019-045',
      createdAt: new Date('2019-09-20'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: '4',
      code: 'ACT-004',
      name: 'Camión Isuzu NPR 75L',
      description: 'Camión para transporte de productos',
      category: 'vehicle',
      status: 'active',
      location: 'Entrada Principal',
      acquisitionDate: new Date('2022-02-28'),
      acquisitionCost: 35000000,
      currentValue: 28000000,
      depreciationMethod: 'straight_line',
      usefulLifeYears: 8,
      salvageValue: 5000000,
      accumulatedDepreciation: 7000000,
      assignedModule: 'general',
      responsiblePerson: 'Carlos Rodríguez',
      serialNumber: 'ISZ-NPR-2022-089',
      createdAt: new Date('2022-02-28'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: '5',
      code: 'ACT-005',
      name: 'Generador Caterpillar DE110',
      description: 'Generador eléctrico de respaldo',
      category: 'equipment',
      status: 'under_maintenance',
      location: 'Bodega Principal',
      acquisitionDate: new Date('2020-01-20'),
      acquisitionCost: 25000000,
      currentValue: 17500000,
      depreciationMethod: 'straight_line',
      usefulLifeYears: 15,
      salvageValue: 2500000,
      accumulatedDepreciation: 7500000,
      assignedModule: 'general',
      serialNumber: 'CAT-DE110-2020-112',
      createdAt: new Date('2020-01-20'),
      updatedAt: new Date('2026-01-18'),
    },
    {
      id: '6',
      code: 'ACT-006',
      name: 'Sistema de Riego Netafim',
      description: 'Sistema de riego por goteo automatizado',
      category: 'equipment',
      status: 'active',
      location: 'Invernadero #1',
      acquisitionDate: new Date('2020-06-10'),
      acquisitionCost: 15000000,
      currentValue: 10500000,
      depreciationMethod: 'straight_line',
      usefulLifeYears: 10,
      salvageValue: 1500000,
      accumulatedDepreciation: 4500000,
      assignedModule: 'agro',
      createdAt: new Date('2020-06-10'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: '7',
      code: 'ACT-007',
      name: 'Bodega Principal',
      description: 'Edificación para almacenamiento central',
      category: 'building',
      status: 'active',
      location: 'Sector Norte',
      acquisitionDate: new Date('2018-03-15'),
      acquisitionCost: 120000000,
      currentValue: 108000000,
      depreciationMethod: 'straight_line',
      usefulLifeYears: 30,
      salvageValue: 12000000,
      accumulatedDepreciation: 12000000,
      assignedModule: 'general',
      createdAt: new Date('2018-03-15'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: '8',
      code: 'ACT-008',
      name: 'Hato Ganadero',
      description: 'Ganado lechero - 50 cabezas',
      category: 'livestock',
      status: 'active',
      location: 'Potreros',
      acquisitionDate: new Date('2020-01-01'),
      acquisitionCost: 75000000,
      currentValue: 82500000,
      depreciationMethod: 'none',
      accumulatedDepreciation: 0,
      assignedModule: 'pecuario',
      responsiblePerson: 'María López',
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date('2026-01-15'),
    },
  ];
};

// Asset Movements
export const getMockAssetMovements = async (): Promise<AssetMovement[]> => {
  await delay(300);
  return [
    {
      id: '1',
      assetId: '5',
      assetName: 'Generador Caterpillar DE110',
      type: 'maintenance',
      date: new Date('2026-01-18'),
      description: 'Enviado a reparación de sistema de arranque',
      performedBy: 'Técnico Externo',
      amount: 500000,
      createdAt: new Date('2026-01-18'),
      updatedAt: new Date('2026-01-18'),
    },
    {
      id: '2',
      assetId: '8',
      assetName: 'Hato Ganadero',
      type: 'revaluation',
      date: new Date('2026-01-15'),
      description: 'Revalorización anual del hato ganadero',
      performedBy: 'Contador',
      amount: 7500000,
      createdAt: new Date('2026-01-15'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: '3',
      assetId: '2',
      assetName: 'Tractor John Deere 5075E',
      type: 'transfer',
      fromLocation: 'Campo Sur',
      toLocation: 'Bodega Principal',
      date: new Date('2026-01-10'),
      description: 'Retorno de tractor después de labores de preparación',
      performedBy: 'Juan García',
      createdAt: new Date('2026-01-10'),
      updatedAt: new Date('2026-01-10'),
    },
  ];
};

// Depreciation Records
export const getMockDepreciationRecords = async (): Promise<DepreciationRecord[]> => {
  await delay(300);
  return [
    {
      id: '1',
      assetId: '2',
      assetName: 'Tractor John Deere 5075E',
      period: 'Ene 2026',
      depreciationAmount: 333333,
      accumulatedDepreciation: 9333333,
      bookValue: 35666667,
      createdAt: new Date('2026-01-31'),
      updatedAt: new Date('2026-01-31'),
    },
    {
      id: '2',
      assetId: '3',
      assetName: 'Ordeñadora Mecánica DeLaval',
      period: 'Ene 2026',
      depreciationAmount: 637500,
      accumulatedDepreciation: 26137500,
      bookValue: 58862500,
      createdAt: new Date('2026-01-31'),
      updatedAt: new Date('2026-01-31'),
    },
    {
      id: '3',
      assetId: '4',
      assetName: 'Camión Isuzu NPR 75L',
      period: 'Ene 2026',
      depreciationAmount: 312500,
      accumulatedDepreciation: 7312500,
      bookValue: 27687500,
      createdAt: new Date('2026-01-31'),
      updatedAt: new Date('2026-01-31'),
    },
  ];
};

// Dashboard Stats
export const getMockActivosStats = async (): Promise<ActivosDashboardStats> => {
  await delay(300);
  return {
    totalAssets: 8,
    activeAssets: 7,
    totalAcquisitionValue: 900000000,
    totalCurrentValue: 1092000000,
    totalDepreciation: 65500000,
    assetsUnderMaintenance: 1,
    disposedThisYear: 0,
    acquiredThisYear: 0,
  };
};

// Assets by Category
export const getMockAssetsByCategory = async (): Promise<AssetsByCategory[]> => {
  await delay(300);
  return [
    { category: 'Terrenos', count: 1, value: 750000000 },
    { category: 'Edificaciones', count: 1, value: 108000000 },
    { category: 'Vehículos', count: 2, value: 64000000 },
    { category: 'Maquinaria', count: 1, value: 59500000 },
    { category: 'Equipos', count: 2, value: 28000000 },
    { category: 'Semovientes', count: 1, value: 82500000 },
  ];
};

// Assets by Status
export const getMockAssetsByStatus = async (): Promise<AssetsByStatus[]> => {
  await delay(300);
  return [
    { status: 'Activo', count: 7 },
    { status: 'En Mantenimiento', count: 1 },
    { status: 'Inactivo', count: 0 },
    { status: 'Dado de Baja', count: 0 },
  ];
};

// Depreciation Summary
export const getMockDepreciationSummary = async (): Promise<DepreciationSummary[]> => {
  await delay(300);
  return [
    { month: 'Ago', depreciation: 1800000, accumulated: 60000000 },
    { month: 'Sep', depreciation: 1800000, accumulated: 61800000 },
    { month: 'Oct', depreciation: 1800000, accumulated: 63600000 },
    { month: 'Nov', depreciation: 1800000, accumulated: 65400000 },
    { month: 'Dic', depreciation: 1800000, accumulated: 67200000 },
    { month: 'Ene', depreciation: 1283333, accumulated: 68483333 },
  ];
};

// Asset Value Trend
export const getMockAssetValueTrend = async (): Promise<AssetValueTrend[]> => {
  await delay(300);
  return [
    { month: 'Ago', acquisitionValue: 900, currentValue: 1050 },
    { month: 'Sep', acquisitionValue: 900, currentValue: 1055 },
    { month: 'Oct', acquisitionValue: 900, currentValue: 1060 },
    { month: 'Nov', acquisitionValue: 900, currentValue: 1070 },
    { month: 'Dic', acquisitionValue: 900, currentValue: 1080 },
    { month: 'Ene', acquisitionValue: 900, currentValue: 1092 },
  ];
};

// Recent Activity
export const getMockAssetActivity = async (): Promise<AssetActivity[]> => {
  await delay(300);
  return [
    {
      id: '1',
      assetName: 'Generador Caterpillar',
      type: 'maintenance',
      description: 'Enviado a reparación',
      date: new Date('2026-01-18'),
      amount: 500000,
      createdAt: new Date('2026-01-18'),
      updatedAt: new Date('2026-01-18'),
    },
    {
      id: '2',
      assetName: 'Hato Ganadero',
      type: 'revaluation',
      description: 'Revalorización anual +10%',
      date: new Date('2026-01-15'),
      amount: 7500000,
      createdAt: new Date('2026-01-15'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: '3',
      assetName: 'Tractor John Deere',
      type: 'transfer',
      description: 'Trasladado a Bodega Principal',
      date: new Date('2026-01-10'),
      createdAt: new Date('2026-01-10'),
      updatedAt: new Date('2026-01-10'),
    },
    {
      id: '4',
      assetName: 'Todos los activos',
      type: 'maintenance',
      description: 'Depreciación mensual registrada',
      date: new Date('2025-12-31'),
      amount: 1800000,
      createdAt: new Date('2025-12-31'),
      updatedAt: new Date('2025-12-31'),
    },
  ];
};
