import type {
  Apiario,
  Colmena,
  ApiculturaDashboardStats,
  ApiculturaProductionData,
  ApiculturaTask,
  HealthDistribution,
  AccionApicultura,
} from '../../types/apicultura.types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Apiarios mock data
export const getMockApiarios = async (): Promise<Apiario[]> => {
  await delay(300);
  return [
    {
      id: '1',
      name: 'Apiario El Roble',
      location: { lat: 10.2, lng: -84.1, address: 'Sector Norte, Finca El Roble' },
      colmenasCount: 25,
      activeColmenas: 23,
      healthAverage: 8.5,
      status: 'active',
      lastRevision: new Date('2026-01-15'),
      production: { honey: 120, wax: 8, pollen: 5 },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: '2',
      name: 'Apiario Las Brisas',
      location: { lat: 10.15, lng: -84.05, address: 'Zona Este, Finca Las Brisas' },
      colmenasCount: 18,
      activeColmenas: 18,
      healthAverage: 9.2,
      status: 'active',
      lastRevision: new Date('2026-01-18'),
      production: { honey: 95, wax: 6, pollen: 4 },
      createdAt: new Date('2024-03-15'),
      updatedAt: new Date('2026-01-18'),
    },
    {
      id: '3',
      name: 'Apiario Monte Verde',
      location: { lat: 10.3, lng: -84.2, address: 'Sector Sur, Monte Verde' },
      colmenasCount: 12,
      activeColmenas: 10,
      healthAverage: 7.0,
      status: 'active',
      lastRevision: new Date('2026-01-10'),
      production: { honey: 45, wax: 3, pollen: 2 },
      createdAt: new Date('2024-06-01'),
      updatedAt: new Date('2026-01-10'),
    },
  ];
};

// Colmenas mock data
export const getMockColmenas = async (): Promise<Colmena[]> => {
  await delay(300);
  return [
    {
      id: '1',
      code: 'COL-001',
      apiarioId: '1',
      apiarioName: 'Apiario El Roble',
      queenAge: 8,
      queenStatus: 'present',
      population: 'high',
      health: 9,
      weight: 'good',
      honeyMaturity: 85,
      lastRevision: new Date('2026-01-15'),
      status: 'producing',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: '2',
      code: 'COL-002',
      apiarioId: '1',
      apiarioName: 'Apiario El Roble',
      queenAge: 14,
      queenStatus: 'present',
      population: 'medium',
      health: 7,
      weight: 'regular',
      honeyMaturity: 60,
      lastRevision: new Date('2026-01-15'),
      status: 'active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: '3',
      code: 'COL-003',
      apiarioId: '1',
      apiarioName: 'Apiario El Roble',
      queenAge: 3,
      queenStatus: 'new',
      population: 'medium',
      health: 8,
      weight: 'regular',
      honeyMaturity: 40,
      lastRevision: new Date('2026-01-15'),
      status: 'resting',
      createdAt: new Date('2025-10-01'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: '4',
      code: 'COL-004',
      apiarioId: '2',
      apiarioName: 'Apiario Las Brisas',
      queenAge: 6,
      queenStatus: 'present',
      population: 'high',
      health: 9,
      weight: 'good',
      honeyMaturity: 90,
      lastRevision: new Date('2026-01-18'),
      status: 'producing',
      createdAt: new Date('2024-03-15'),
      updatedAt: new Date('2026-01-18'),
    },
    {
      id: '5',
      code: 'COL-005',
      apiarioId: '3',
      apiarioName: 'Apiario Monte Verde',
      queenAge: 20,
      queenStatus: 'absent',
      population: 'low',
      health: 5,
      weight: 'bad',
      honeyMaturity: 20,
      lastRevision: new Date('2026-01-10'),
      status: 'quarantine',
      notes: 'Requiere cambio de reina urgente',
      createdAt: new Date('2024-06-01'),
      updatedAt: new Date('2026-01-10'),
    },
  ];
};

// Dashboard stats
export const getMockApiculturaStats = async (): Promise<ApiculturaDashboardStats> => {
  await delay(300);
  return {
    totalApiarios: 3,
    totalColmenas: 55,
    activeColmenas: 51,
    monthlyProduction: {
      honey: 260,
      wax: 17,
      pollen: 11,
    },
    averageHealth: 8.2,
    pendingRevisions: 4,
    lastHarvest: new Date('2026-01-10'),
  };
};

// Production data for charts
export const getMockApiculturaProduction = async (): Promise<ApiculturaProductionData[]> => {
  await delay(300);
  return [
    { month: 'Ago', honey: 180, wax: 12, pollen: 8, propolis: 3 },
    { month: 'Sep', honey: 210, wax: 14, pollen: 9, propolis: 4 },
    { month: 'Oct', honey: 195, wax: 13, pollen: 8, propolis: 3 },
    { month: 'Nov', honey: 240, wax: 16, pollen: 10, propolis: 5 },
    { month: 'Dic', honey: 280, wax: 18, pollen: 12, propolis: 6 },
    { month: 'Ene', honey: 260, wax: 17, pollen: 11, propolis: 5 },
  ];
};

// Tasks
export const getMockApiculturaTasks = async (): Promise<ApiculturaTask[]> => {
  await delay(300);
  return [
    {
      id: '1',
      title: 'Revisión general de apiario',
      type: 'revision',
      apiarioName: 'Apiario Monte Verde',
      dueDate: new Date('2026-01-22'),
      priority: 'high',
      status: 'pending',
    },
    {
      id: '2',
      title: 'Cambio de reina',
      type: 'revision',
      apiarioName: 'Apiario Monte Verde',
      colmenaCode: 'COL-005',
      dueDate: new Date('2026-01-23'),
      priority: 'high',
      status: 'pending',
    },
    {
      id: '3',
      title: 'Alimentación complementaria',
      type: 'feeding',
      apiarioName: 'Apiario El Roble',
      dueDate: new Date('2026-01-25'),
      priority: 'medium',
      status: 'pending',
    },
    {
      id: '4',
      title: 'Cosecha de miel',
      type: 'harvest',
      apiarioName: 'Apiario Las Brisas',
      dueDate: new Date('2026-01-28'),
      priority: 'medium',
      status: 'pending',
    },
    {
      id: '5',
      title: 'Aplicación de tratamiento preventivo',
      type: 'medication',
      apiarioName: 'Apiario El Roble',
      dueDate: new Date('2026-01-30'),
      priority: 'low',
      status: 'pending',
    },
  ];
};

// Health distribution
export const getMockHealthDistribution = async (): Promise<HealthDistribution[]> => {
  await delay(300);
  return [
    { status: 'Excelente (9-10)', count: 18, color: '#10b981' },
    { status: 'Buena (7-8)', count: 25, color: '#3b82f6' },
    { status: 'Regular (5-6)', count: 8, color: '#f59e0b' },
    { status: 'Crítica (1-4)', count: 4, color: '#ef4444' },
  ];
};

// Recent actions
export const getMockRecentActions = async (): Promise<AccionApicultura[]> => {
  await delay(300);
  return [
    {
      id: '1',
      apiarioId: '1',
      apiarioName: 'Apiario El Roble',
      type: 'revision',
      date: new Date('2026-01-15'),
      description: 'Revisión general del apiario',
      performedBy: 'Juan Pérez',
      createdAt: new Date('2026-01-15'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: '2',
      apiarioId: '2',
      apiarioName: 'Apiario Las Brisas',
      type: 'harvest',
      date: new Date('2026-01-10'),
      description: 'Cosecha de miel',
      quantity: 45,
      unit: 'kg',
      performedBy: 'María López',
      createdAt: new Date('2026-01-10'),
      updatedAt: new Date('2026-01-10'),
    },
    {
      id: '3',
      apiarioId: '1',
      apiarioName: 'Apiario El Roble',
      colmenaId: '2',
      colmenaCode: 'COL-002',
      type: 'feeding',
      date: new Date('2026-01-08'),
      description: 'Alimentación con jarabe de azúcar',
      insumoUsed: 'Azúcar Cruda',
      quantity: 2,
      unit: 'kg',
      performedBy: 'Juan Pérez',
      createdAt: new Date('2026-01-08'),
      updatedAt: new Date('2026-01-08'),
    },
    {
      id: '4',
      apiarioId: '3',
      apiarioName: 'Apiario Monte Verde',
      type: 'medication',
      date: new Date('2026-01-05'),
      description: 'Tratamiento contra varroa',
      insumoUsed: 'Ácido Oxálico',
      performedBy: 'Carlos Sánchez',
      createdAt: new Date('2026-01-05'),
      updatedAt: new Date('2026-01-05'),
    },
  ];
};
