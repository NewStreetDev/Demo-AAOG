import type {
  Apiario,
  Colmena,
  ApiculturaDashboardStats,
  ApiculturaProductionData,
  ApiculturaTask,
  HealthDistribution,
  AccionApicultura,
} from '../../types/apicultura.types';
import type { ApiarioFormData, ColmenaFormData } from '../../schemas/apicultura.schema';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory stores
let apiariosStore: Apiario[] = [];
let colmenasStore: Colmena[] = [];

// Initial Apiarios Data
const initialApiarios: Apiario[] = [
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

// Initial Colmenas Data
const initialColmenas: Colmena[] = [
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

// Initialize stores
export const initializeApiariosStore = () => {
  if (apiariosStore.length === 0) {
    apiariosStore = [...initialApiarios];
  }
};

export const initializeColmenasStore = () => {
  if (colmenasStore.length === 0) {
    colmenasStore = [...initialColmenas];
  }
};

// Get Apiarios
export const getMockApiarios = async (): Promise<Apiario[]> => {
  await delay(300);
  initializeApiariosStore();
  return [...apiariosStore].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
};

// Get single Apiario
export const getMockApiarioById = async (id: string): Promise<Apiario | undefined> => {
  await delay(200);
  initializeApiariosStore();
  return apiariosStore.find(a => a.id === id);
};

// Create Apiario
export const createMockApiario = async (data: ApiarioFormData): Promise<Apiario> => {
  await delay(400);
  initializeApiariosStore();
  const newApiario: Apiario = {
    id: String(Date.now()),
    name: data.name,
    location: {
      lat: data.lat ? parseFloat(data.lat) : 0,
      lng: data.lng ? parseFloat(data.lng) : 0,
      address: data.address,
    },
    colmenasCount: 0,
    activeColmenas: 0,
    healthAverage: 0,
    status: data.status,
    production: { honey: 0, wax: 0, pollen: 0 },
    costPerHour: data.costPerHour ? parseFloat(data.costPerHour) : undefined,
    costPerKm: data.costPerKm ? parseFloat(data.costPerKm) : undefined,
    notes: data.notes,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  apiariosStore.push(newApiario);
  return newApiario;
};

// Update Apiario
export const updateMockApiario = async (id: string, data: ApiarioFormData): Promise<Apiario> => {
  await delay(400);
  initializeApiariosStore();
  const index = apiariosStore.findIndex(a => a.id === id);
  if (index === -1) throw new Error('Apiario not found');

  const existingApiario = apiariosStore[index];
  const updatedApiario: Apiario = {
    ...existingApiario,
    name: data.name,
    location: {
      lat: data.lat ? parseFloat(data.lat) : existingApiario.location.lat,
      lng: data.lng ? parseFloat(data.lng) : existingApiario.location.lng,
      address: data.address,
    },
    status: data.status,
    costPerHour: data.costPerHour ? parseFloat(data.costPerHour) : undefined,
    costPerKm: data.costPerKm ? parseFloat(data.costPerKm) : undefined,
    notes: data.notes,
    updatedAt: new Date(),
  };
  apiariosStore[index] = updatedApiario;
  return updatedApiario;
};

// Delete Apiario
export const deleteMockApiario = async (id: string): Promise<void> => {
  await delay(300);
  initializeApiariosStore();
  const index = apiariosStore.findIndex(a => a.id === id);
  if (index === -1) throw new Error('Apiario not found');
  apiariosStore.splice(index, 1);
};

// Get Colmenas
export const getMockColmenas = async (): Promise<Colmena[]> => {
  await delay(300);
  initializeColmenasStore();
  initializeApiariosStore();
  return [...colmenasStore].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
};

// Get single Colmena
export const getMockColmenaById = async (id: string): Promise<Colmena | undefined> => {
  await delay(200);
  initializeColmenasStore();
  return colmenasStore.find(c => c.id === id);
};

// Create Colmena
export const createMockColmena = async (data: ColmenaFormData): Promise<Colmena> => {
  await delay(400);
  initializeColmenasStore();
  initializeApiariosStore();

  const apiario = apiariosStore.find(a => a.id === data.apiarioId);
  const newColmena: Colmena = {
    id: String(Date.now()),
    code: data.code,
    apiarioId: data.apiarioId,
    apiarioName: apiario?.name,
    queenAge: parseInt(data.queenAge),
    queenStatus: data.queenStatus,
    population: data.population,
    health: parseInt(data.health),
    weight: data.weight,
    honeyMaturity: parseInt(data.honeyMaturity),
    status: data.status,
    notes: data.notes,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  colmenasStore.push(newColmena);

  // Update apiario counts
  if (apiario) {
    const apiarioIndex = apiariosStore.findIndex(a => a.id === data.apiarioId);
    apiariosStore[apiarioIndex] = {
      ...apiario,
      colmenasCount: apiario.colmenasCount + 1,
      activeColmenas: data.status !== 'inactive' ? apiario.activeColmenas + 1 : apiario.activeColmenas,
      updatedAt: new Date(),
    };
  }

  return newColmena;
};

// Update Colmena
export const updateMockColmena = async (id: string, data: ColmenaFormData): Promise<Colmena> => {
  await delay(400);
  initializeColmenasStore();
  initializeApiariosStore();

  const index = colmenasStore.findIndex(c => c.id === id);
  if (index === -1) throw new Error('Colmena not found');

  const apiario = apiariosStore.find(a => a.id === data.apiarioId);
  const existingColmena = colmenasStore[index];
  const updatedColmena: Colmena = {
    ...existingColmena,
    code: data.code,
    apiarioId: data.apiarioId,
    apiarioName: apiario?.name,
    queenAge: parseInt(data.queenAge),
    queenStatus: data.queenStatus,
    population: data.population,
    health: parseInt(data.health),
    weight: data.weight,
    honeyMaturity: parseInt(data.honeyMaturity),
    status: data.status,
    notes: data.notes,
    updatedAt: new Date(),
  };
  colmenasStore[index] = updatedColmena;
  return updatedColmena;
};

// Delete Colmena
export const deleteMockColmena = async (id: string): Promise<void> => {
  await delay(300);
  initializeColmenasStore();
  initializeApiariosStore();

  const index = colmenasStore.findIndex(c => c.id === id);
  if (index === -1) throw new Error('Colmena not found');

  const colmena = colmenasStore[index];
  const apiario = apiariosStore.find(a => a.id === colmena.apiarioId);

  colmenasStore.splice(index, 1);

  // Update apiario counts
  if (apiario) {
    const apiarioIndex = apiariosStore.findIndex(a => a.id === colmena.apiarioId);
    apiariosStore[apiarioIndex] = {
      ...apiario,
      colmenasCount: Math.max(0, apiario.colmenasCount - 1),
      activeColmenas: colmena.status !== 'inactive' ? Math.max(0, apiario.activeColmenas - 1) : apiario.activeColmenas,
      updatedAt: new Date(),
    };
  }
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
