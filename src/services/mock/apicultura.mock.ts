import type {
  Apiario,
  Colmena,
  ApiculturaDashboardStats,
  ApiculturaProductionData,
  ApiculturaTask,
  HealthDistribution,
  AccionApicultura,
  WorkPlan,
  Revision,
  Cosecha,
} from '../../types/apicultura.types';
import type {
  ApiarioFormData,
  ColmenaFormData,
  WorkPlanFormData,
  AccionApiculturaFormData,
  RevisionFormData,
  CosechaFormData,
} from '../../schemas/apicultura.schema';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory stores
let apiariosStore: Apiario[] = [];
let colmenasStore: Colmena[] = [];
let workPlansStore: WorkPlan[] = [];
let accionesStore: AccionApicultura[] = [];
let revisionesStore: Revision[] = [];
let cosechasStore: Cosecha[] = [];

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

// Initial WorkPlans Data
const initialWorkPlans: WorkPlan[] = [
  {
    id: '1',
    title: 'Revisión general Apiario El Roble',
    description: 'Inspección completa de todas las colmenas del apiario',
    apiarioId: '1',
    apiarioName: 'Apiario El Roble',
    activityType: 'revision',
    scheduledDate: new Date('2026-01-28'),
    estimatedDuration: 4,
    assignedTo: 'Juan Pérez',
    priority: 'high',
    status: 'pending',
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date('2026-01-20'),
  },
  {
    id: '2',
    title: 'Cambio de reina COL-005',
    description: 'Reemplazo urgente de reina en colmena con problemas',
    apiarioId: '3',
    apiarioName: 'Apiario Monte Verde',
    colmenaId: '5',
    colmenaCode: 'COL-005',
    activityType: 'queen_change',
    scheduledDate: new Date('2026-01-26'),
    estimatedDuration: 2,
    assignedTo: 'María López',
    priority: 'high',
    status: 'in_progress',
    createdAt: new Date('2026-01-18'),
    updatedAt: new Date('2026-01-25'),
  },
  {
    id: '3',
    title: 'Alimentación complementaria Las Brisas',
    description: 'Suministrar jarabe de azúcar a colmenas con bajas reservas',
    apiarioId: '2',
    apiarioName: 'Apiario Las Brisas',
    activityType: 'feeding',
    scheduledDate: new Date('2026-01-30'),
    estimatedDuration: 3,
    assignedTo: 'Carlos Sánchez',
    priority: 'medium',
    status: 'pending',
    createdAt: new Date('2026-01-22'),
    updatedAt: new Date('2026-01-22'),
  },
  {
    id: '4',
    title: 'Cosecha de miel Apiario El Roble',
    description: 'Extracción de miel de colmenas con madurez óptima',
    apiarioId: '1',
    apiarioName: 'Apiario El Roble',
    activityType: 'harvest',
    scheduledDate: new Date('2026-02-05'),
    estimatedDuration: 6,
    assignedTo: 'Juan Pérez',
    priority: 'medium',
    status: 'pending',
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-15'),
  },
  {
    id: '5',
    title: 'Tratamiento preventivo varroa',
    description: 'Aplicación de tratamiento preventivo en todo el apiario',
    apiarioId: '1',
    apiarioName: 'Apiario El Roble',
    activityType: 'medication',
    scheduledDate: new Date('2026-01-20'),
    estimatedDuration: 3,
    assignedTo: 'María López',
    priority: 'low',
    status: 'completed',
    completedDate: new Date('2026-01-20'),
    createdAt: new Date('2026-01-10'),
    updatedAt: new Date('2026-01-20'),
  },
];

export const initializeWorkPlansStore = () => {
  if (workPlansStore.length === 0) {
    workPlansStore = [...initialWorkPlans];
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

// ==================== WORK PLANS ====================

// Get WorkPlans
export const getMockWorkPlans = async (): Promise<WorkPlan[]> => {
  await delay(300);
  initializeWorkPlansStore();
  initializeApiariosStore();
  return [...workPlansStore].sort((a, b) => {
    // Sort by status priority (pending/in_progress first), then by scheduledDate
    const statusOrder = { pending: 0, in_progress: 1, completed: 2, cancelled: 3 };
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;
    return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
  });
};

// Get single WorkPlan
export const getMockWorkPlanById = async (id: string): Promise<WorkPlan | undefined> => {
  await delay(200);
  initializeWorkPlansStore();
  return workPlansStore.find(wp => wp.id === id);
};

// Create WorkPlan
export const createMockWorkPlan = async (data: WorkPlanFormData): Promise<WorkPlan> => {
  await delay(400);
  initializeWorkPlansStore();
  initializeApiariosStore();
  initializeColmenasStore();

  const apiario = data.apiarioId ? apiariosStore.find(a => a.id === data.apiarioId) : undefined;
  const colmena = data.colmenaId ? colmenasStore.find(c => c.id === data.colmenaId) : undefined;

  const newWorkPlan: WorkPlan = {
    id: String(Date.now()),
    title: data.title,
    description: data.description,
    apiarioId: data.apiarioId || undefined,
    apiarioName: apiario?.name,
    colmenaId: data.colmenaId || undefined,
    colmenaCode: colmena?.code,
    activityType: data.activityType,
    scheduledDate: new Date(data.scheduledDate),
    estimatedDuration: data.estimatedDuration ? parseFloat(data.estimatedDuration) : undefined,
    assignedTo: data.assignedTo || undefined,
    priority: data.priority,
    status: data.status,
    notes: data.notes,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  workPlansStore.push(newWorkPlan);
  return newWorkPlan;
};

// Update WorkPlan
export const updateMockWorkPlan = async (id: string, data: WorkPlanFormData): Promise<WorkPlan> => {
  await delay(400);
  initializeWorkPlansStore();
  initializeApiariosStore();
  initializeColmenasStore();

  const index = workPlansStore.findIndex(wp => wp.id === id);
  if (index === -1) throw new Error('WorkPlan not found');

  const apiario = data.apiarioId ? apiariosStore.find(a => a.id === data.apiarioId) : undefined;
  const colmena = data.colmenaId ? colmenasStore.find(c => c.id === data.colmenaId) : undefined;
  const existingWorkPlan = workPlansStore[index];

  const updatedWorkPlan: WorkPlan = {
    ...existingWorkPlan,
    title: data.title,
    description: data.description,
    apiarioId: data.apiarioId || undefined,
    apiarioName: apiario?.name,
    colmenaId: data.colmenaId || undefined,
    colmenaCode: colmena?.code,
    activityType: data.activityType,
    scheduledDate: new Date(data.scheduledDate),
    estimatedDuration: data.estimatedDuration ? parseFloat(data.estimatedDuration) : undefined,
    assignedTo: data.assignedTo || undefined,
    priority: data.priority,
    status: data.status,
    completedDate: data.status === 'completed' && existingWorkPlan.status !== 'completed'
      ? new Date()
      : existingWorkPlan.completedDate,
    notes: data.notes,
    updatedAt: new Date(),
  };
  workPlansStore[index] = updatedWorkPlan;
  return updatedWorkPlan;
};

// Delete WorkPlan
export const deleteMockWorkPlan = async (id: string): Promise<void> => {
  await delay(300);
  initializeWorkPlansStore();
  const index = workPlansStore.findIndex(wp => wp.id === id);
  if (index === -1) throw new Error('WorkPlan not found');
  workPlansStore.splice(index, 1);
};

// ==================== ACCIONES APICULTURA ====================

// Initial Acciones Data
const initialAcciones: AccionApicultura[] = [
  {
    id: '1',
    apiarioId: '1',
    apiarioName: 'Apiario El Roble',
    type: 'medication',
    date: new Date('2026-01-20'),
    description: 'Tratamiento preventivo contra varroa',
    performedBy: 'Juan Perez',
    medication: 'Acido Oxalico',
    dosage: '5ml por colmena',
    applicationMethod: 'drip',
    nextApplicationDate: new Date('2026-02-20'),
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date('2026-01-20'),
  },
  {
    id: '2',
    apiarioId: '1',
    apiarioName: 'Apiario El Roble',
    colmenaId: '2',
    colmenaCode: 'COL-002',
    type: 'panel_change',
    date: new Date('2026-01-18'),
    description: 'Cambio de 4 panales viejos',
    performedBy: 'Maria Lopez',
    panelCount: 4,
    waxOrigin: 'Proveedora Apicola Nacional',
    createdAt: new Date('2026-01-18'),
    updatedAt: new Date('2026-01-18'),
  },
  {
    id: '3',
    apiarioId: '2',
    apiarioName: 'Apiario Las Brisas',
    type: 'feeding',
    date: new Date('2026-01-15'),
    description: 'Alimentacion complementaria con jarabe',
    performedBy: 'Carlos Sanchez',
    feedingType: 'sugar_syrup',
    insumoUsed: 'Azucar Cruda',
    quantity: 10,
    unit: 'kg',
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-15'),
  },
  {
    id: '4',
    apiarioId: '3',
    apiarioName: 'Apiario Monte Verde',
    colmenaId: '5',
    colmenaCode: 'COL-005',
    type: 'reproduction',
    date: new Date('2026-01-12'),
    description: 'Introduccion de reina con genetica mejorada',
    performedBy: 'Maria Lopez',
    reproductionType: 'queen_introduction',
    reproductionDetails: 'Reina italiana F1, proveedor GenApis',
    createdAt: new Date('2026-01-12'),
    updatedAt: new Date('2026-01-12'),
  },
];

export const initializeAccionesStore = () => {
  if (accionesStore.length === 0) {
    accionesStore = [...initialAcciones];
  }
};

// Get all Acciones
export const getMockAcciones = async (): Promise<AccionApicultura[]> => {
  await delay(300);
  initializeAccionesStore();
  initializeApiariosStore();
  return [...accionesStore].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Get Acciones by Apiario
export const getMockAccionesByApiario = async (apiarioId: string): Promise<AccionApicultura[]> => {
  await delay(300);
  initializeAccionesStore();
  return accionesStore
    .filter(a => a.apiarioId === apiarioId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Get Acciones by Colmena
export const getMockAccionesByColmena = async (colmenaId: string): Promise<AccionApicultura[]> => {
  await delay(300);
  initializeAccionesStore();
  return accionesStore
    .filter(a => a.colmenaId === colmenaId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Create Accion
export const createMockAccion = async (data: AccionApiculturaFormData): Promise<AccionApicultura> => {
  await delay(400);
  initializeAccionesStore();
  initializeApiariosStore();
  initializeColmenasStore();

  const apiario = apiariosStore.find(a => a.id === data.apiarioId);
  const colmena = data.colmenaId ? colmenasStore.find(c => c.id === data.colmenaId) : undefined;

  const newAccion: AccionApicultura = {
    id: String(Date.now()),
    apiarioId: data.apiarioId,
    apiarioName: apiario?.name,
    colmenaId: data.colmenaId || undefined,
    colmenaCode: colmena?.code,
    type: data.type,
    date: new Date(data.date),
    description: data.description,
    performedBy: data.performedBy,
    // Medicamentos
    medication: data.medication || undefined,
    dosage: data.dosage || undefined,
    applicationMethod: data.applicationMethod || undefined,
    nextApplicationDate: data.nextApplicationDate ? new Date(data.nextApplicationDate) : undefined,
    // Cambio de Panales
    panelCount: data.panelCount ? parseInt(data.panelCount) : undefined,
    waxOrigin: data.waxOrigin || undefined,
    // Alimentacion
    feedingType: data.feedingType || undefined,
    insumoUsed: data.insumoUsed || undefined,
    quantity: data.quantity ? parseFloat(data.quantity) : undefined,
    unit: data.unit || undefined,
    // Reproduccion
    reproductionType: data.reproductionType || undefined,
    reproductionDetails: data.reproductionDetails || undefined,
    notes: data.notes || undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  accionesStore.push(newAccion);
  return newAccion;
};

// Update Accion
export const updateMockAccion = async (id: string, data: AccionApiculturaFormData): Promise<AccionApicultura> => {
  await delay(400);
  initializeAccionesStore();
  initializeApiariosStore();
  initializeColmenasStore();

  const index = accionesStore.findIndex(a => a.id === id);
  if (index === -1) throw new Error('Accion not found');

  const apiario = apiariosStore.find(a => a.id === data.apiarioId);
  const colmena = data.colmenaId ? colmenasStore.find(c => c.id === data.colmenaId) : undefined;
  const existingAccion = accionesStore[index];

  const updatedAccion: AccionApicultura = {
    ...existingAccion,
    apiarioId: data.apiarioId,
    apiarioName: apiario?.name,
    colmenaId: data.colmenaId || undefined,
    colmenaCode: colmena?.code,
    type: data.type,
    date: new Date(data.date),
    description: data.description,
    performedBy: data.performedBy,
    medication: data.medication || undefined,
    dosage: data.dosage || undefined,
    applicationMethod: data.applicationMethod || undefined,
    nextApplicationDate: data.nextApplicationDate ? new Date(data.nextApplicationDate) : undefined,
    panelCount: data.panelCount ? parseInt(data.panelCount) : undefined,
    waxOrigin: data.waxOrigin || undefined,
    feedingType: data.feedingType || undefined,
    insumoUsed: data.insumoUsed || undefined,
    quantity: data.quantity ? parseFloat(data.quantity) : undefined,
    unit: data.unit || undefined,
    reproductionType: data.reproductionType || undefined,
    reproductionDetails: data.reproductionDetails || undefined,
    notes: data.notes || undefined,
    updatedAt: new Date(),
  };
  accionesStore[index] = updatedAccion;
  return updatedAccion;
};

// Delete Accion
export const deleteMockAccion = async (id: string): Promise<void> => {
  await delay(300);
  initializeAccionesStore();
  const index = accionesStore.findIndex(a => a.id === id);
  if (index === -1) throw new Error('Accion not found');
  accionesStore.splice(index, 1);
};

// ==================== REVISIONES ====================

// Initial Revisiones Data
const initialRevisiones: Revision[] = [
  {
    id: '1',
    apiarioId: '1',
    apiarioName: 'Apiario El Roble',
    type: 'general',
    date: new Date('2026-01-15'),
    inspector: 'Juan Perez',
    generalState: 8,
    queenChanged: false,
    queenPresent: true,
    postureState: 'good',
    sanity: 9,
    weight: 'good',
    honeyMaturity: 75,
    population: 'high',
    broodAmount: 'medium',
    foodReserves: {
      pollen: 'medium',
      nectar: 'high',
    },
    comments: 'Apiario en buen estado general. Preparar para proxima cosecha.',
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-15'),
  },
  {
    id: '2',
    apiarioId: '1',
    apiarioName: 'Apiario El Roble',
    colmenaId: '1',
    colmenaCode: 'COL-001',
    type: 'individual',
    date: new Date('2026-01-15'),
    inspector: 'Juan Perez',
    generalState: 9,
    queenAge: 8,
    queenChanged: false,
    queenPresent: true,
    postureState: 'excellent',
    sanity: 9,
    weight: 'good',
    honeyMaturity: 85,
    population: 'high',
    broodAmount: 'high',
    foodReserves: {
      pollen: 'high',
      nectar: 'high',
    },
    comments: 'Colmena productora. Lista para cosecha.',
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-15'),
  },
  {
    id: '3',
    apiarioId: '3',
    apiarioName: 'Apiario Monte Verde',
    colmenaId: '5',
    colmenaCode: 'COL-005',
    type: 'individual',
    date: new Date('2026-01-10'),
    inspector: 'Maria Lopez',
    generalState: 4,
    queenAge: 20,
    queenChanged: false,
    queenPresent: false,
    postureState: 'none',
    sanity: 5,
    weight: 'bad',
    honeyMaturity: 20,
    population: 'low',
    broodAmount: 'none',
    foodReserves: {
      pollen: 'low',
      nectar: 'low',
    },
    comments: 'Colmena sin reina. Requiere intervencion urgente.',
    createdAt: new Date('2026-01-10'),
    updatedAt: new Date('2026-01-10'),
  },
];

export const initializeRevisionesStore = () => {
  if (revisionesStore.length === 0) {
    revisionesStore = [...initialRevisiones];
  }
};

// Get all Revisiones
export const getMockRevisiones = async (): Promise<Revision[]> => {
  await delay(300);
  initializeRevisionesStore();
  return [...revisionesStore].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Get Revisiones by Apiario
export const getMockRevisionesByApiario = async (apiarioId: string): Promise<Revision[]> => {
  await delay(300);
  initializeRevisionesStore();
  return revisionesStore
    .filter(r => r.apiarioId === apiarioId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Get Revisiones by Colmena
export const getMockRevisionesByColmena = async (colmenaId: string): Promise<Revision[]> => {
  await delay(300);
  initializeRevisionesStore();
  return revisionesStore
    .filter(r => r.colmenaId === colmenaId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Create Revision
export const createMockRevision = async (data: RevisionFormData): Promise<Revision> => {
  await delay(400);
  initializeRevisionesStore();
  initializeApiariosStore();
  initializeColmenasStore();

  const apiario = apiariosStore.find(a => a.id === data.apiarioId);
  const colmena = data.colmenaId ? colmenasStore.find(c => c.id === data.colmenaId) : undefined;

  const newRevision: Revision = {
    id: String(Date.now()),
    apiarioId: data.apiarioId,
    apiarioName: apiario?.name,
    colmenaId: data.colmenaId || undefined,
    colmenaCode: colmena?.code,
    type: data.type,
    date: new Date(data.date),
    inspector: data.inspector,
    generalState: parseInt(data.generalState),
    queenAge: data.queenAge ? parseInt(data.queenAge) : undefined,
    queenChanged: data.queenChanged,
    queenPresent: data.queenPresent,
    postureState: data.postureState,
    sanity: parseInt(data.sanity),
    weight: data.weight,
    honeyMaturity: parseInt(data.honeyMaturity),
    population: data.population,
    broodAmount: data.broodAmount,
    foodReserves: {
      pollen: data.pollenReserves,
      nectar: data.nectarReserves,
    },
    comments: data.comments || undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  revisionesStore.push(newRevision);

  // Update colmena if individual revision
  if (colmena && data.type === 'individual') {
    const colmenaIndex = colmenasStore.findIndex(c => c.id === data.colmenaId);
    if (colmenaIndex !== -1) {
      colmenasStore[colmenaIndex] = {
        ...colmena,
        health: parseInt(data.generalState),
        queenStatus: data.queenPresent ? (data.queenChanged ? 'new' : 'present') : 'absent',
        population: data.population,
        weight: data.weight,
        honeyMaturity: parseInt(data.honeyMaturity),
        lastRevision: new Date(data.date),
        updatedAt: new Date(),
      };
    }
  }

  // Update apiario last revision
  if (apiario) {
    const apiarioIndex = apiariosStore.findIndex(a => a.id === data.apiarioId);
    if (apiarioIndex !== -1) {
      apiariosStore[apiarioIndex] = {
        ...apiario,
        lastRevision: new Date(data.date),
        updatedAt: new Date(),
      };
    }
  }

  return newRevision;
};

// Update Revision
export const updateMockRevision = async (id: string, data: RevisionFormData): Promise<Revision> => {
  await delay(400);
  initializeRevisionesStore();
  initializeApiariosStore();
  initializeColmenasStore();

  const index = revisionesStore.findIndex(r => r.id === id);
  if (index === -1) throw new Error('Revision not found');

  const apiario = apiariosStore.find(a => a.id === data.apiarioId);
  const colmena = data.colmenaId ? colmenasStore.find(c => c.id === data.colmenaId) : undefined;
  const existingRevision = revisionesStore[index];

  const updatedRevision: Revision = {
    ...existingRevision,
    apiarioId: data.apiarioId,
    apiarioName: apiario?.name,
    colmenaId: data.colmenaId || undefined,
    colmenaCode: colmena?.code,
    type: data.type,
    date: new Date(data.date),
    inspector: data.inspector,
    generalState: parseInt(data.generalState),
    queenAge: data.queenAge ? parseInt(data.queenAge) : undefined,
    queenChanged: data.queenChanged,
    queenPresent: data.queenPresent,
    postureState: data.postureState,
    sanity: parseInt(data.sanity),
    weight: data.weight,
    honeyMaturity: parseInt(data.honeyMaturity),
    population: data.population,
    broodAmount: data.broodAmount,
    foodReserves: {
      pollen: data.pollenReserves,
      nectar: data.nectarReserves,
    },
    comments: data.comments || undefined,
    updatedAt: new Date(),
  };
  revisionesStore[index] = updatedRevision;
  return updatedRevision;
};

// Delete Revision
export const deleteMockRevision = async (id: string): Promise<void> => {
  await delay(300);
  initializeRevisionesStore();
  const index = revisionesStore.findIndex(r => r.id === id);
  if (index === -1) throw new Error('Revision not found');
  revisionesStore.splice(index, 1);
};

// ==================== COSECHAS ====================

// Initial Cosechas Data
const initialCosechas: Cosecha[] = [
  {
    id: '1',
    apiarioId: '1',
    apiarioName: 'Apiario El Roble',
    date: new Date('2026-01-10'),
    productType: 'honey',
    quantity: 45,
    unit: 'kg',
    quality: 'A',
    performedBy: 'Juan Perez',
    notes: 'Miel de floracion multifloral',
    createdAt: new Date('2026-01-10'),
    updatedAt: new Date('2026-01-10'),
  },
  {
    id: '2',
    apiarioId: '2',
    apiarioName: 'Apiario Las Brisas',
    date: new Date('2026-01-05'),
    productType: 'honey',
    quantity: 32,
    unit: 'kg',
    quality: 'A',
    performedBy: 'Maria Lopez',
    createdAt: new Date('2026-01-05'),
    updatedAt: new Date('2026-01-05'),
  },
  {
    id: '3',
    apiarioId: '1',
    apiarioName: 'Apiario El Roble',
    date: new Date('2025-12-20'),
    productType: 'wax',
    quantity: 3,
    unit: 'kg',
    quality: 'B',
    performedBy: 'Carlos Sanchez',
    createdAt: new Date('2025-12-20'),
    updatedAt: new Date('2025-12-20'),
  },
  {
    id: '4',
    apiarioId: '1',
    apiarioName: 'Apiario El Roble',
    colmenaId: '1',
    colmenaCode: 'COL-001',
    date: new Date('2025-12-15'),
    productType: 'pollen',
    quantity: 500,
    unit: 'g',
    quality: 'A',
    performedBy: 'Juan Perez',
    createdAt: new Date('2025-12-15'),
    updatedAt: new Date('2025-12-15'),
  },
];

export const initializeCosechasStore = () => {
  if (cosechasStore.length === 0) {
    cosechasStore = [...initialCosechas];
  }
};

// Get all Cosechas
export const getMockCosechas = async (): Promise<Cosecha[]> => {
  await delay(300);
  initializeCosechasStore();
  return [...cosechasStore].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Get Cosechas by Apiario
export const getMockCosechasByApiario = async (apiarioId: string): Promise<Cosecha[]> => {
  await delay(300);
  initializeCosechasStore();
  return cosechasStore
    .filter(c => c.apiarioId === apiarioId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Get Cosechas by Colmena
export const getMockCosechasByColmena = async (colmenaId: string): Promise<Cosecha[]> => {
  await delay(300);
  initializeCosechasStore();
  return cosechasStore
    .filter(c => c.colmenaId === colmenaId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Create Cosecha
export const createMockCosecha = async (data: CosechaFormData): Promise<Cosecha> => {
  await delay(400);
  initializeCosechasStore();
  initializeApiariosStore();
  initializeColmenasStore();

  const apiario = apiariosStore.find(a => a.id === data.apiarioId);
  const colmena = data.colmenaId ? colmenasStore.find(c => c.id === data.colmenaId) : undefined;

  const newCosecha: Cosecha = {
    id: String(Date.now()),
    apiarioId: data.apiarioId,
    apiarioName: apiario?.name,
    colmenaId: data.colmenaId || undefined,
    colmenaCode: colmena?.code,
    date: new Date(data.date),
    productType: data.productType,
    quantity: parseFloat(data.quantity),
    unit: data.unit,
    quality: data.quality || undefined,
    performedBy: data.performedBy,
    notes: data.notes || undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  cosechasStore.push(newCosecha);

  // Update apiario production stats
  if (apiario) {
    const apiarioIndex = apiariosStore.findIndex(a => a.id === data.apiarioId);
    if (apiarioIndex !== -1) {
      const quantity = parseFloat(data.quantity);
      const production = { ...apiario.production };
      if (data.productType === 'honey') production.honey += quantity;
      if (data.productType === 'wax') production.wax += quantity;
      if (data.productType === 'pollen') production.pollen += quantity;

      apiariosStore[apiarioIndex] = {
        ...apiario,
        production,
        updatedAt: new Date(),
      };
    }
  }

  return newCosecha;
};

// Update Cosecha
export const updateMockCosecha = async (id: string, data: CosechaFormData): Promise<Cosecha> => {
  await delay(400);
  initializeCosechasStore();
  initializeApiariosStore();
  initializeColmenasStore();

  const index = cosechasStore.findIndex(c => c.id === id);
  if (index === -1) throw new Error('Cosecha not found');

  const apiario = apiariosStore.find(a => a.id === data.apiarioId);
  const colmena = data.colmenaId ? colmenasStore.find(c => c.id === data.colmenaId) : undefined;
  const existingCosecha = cosechasStore[index];

  const updatedCosecha: Cosecha = {
    ...existingCosecha,
    apiarioId: data.apiarioId,
    apiarioName: apiario?.name,
    colmenaId: data.colmenaId || undefined,
    colmenaCode: colmena?.code,
    date: new Date(data.date),
    productType: data.productType,
    quantity: parseFloat(data.quantity),
    unit: data.unit,
    quality: data.quality || undefined,
    performedBy: data.performedBy,
    notes: data.notes || undefined,
    updatedAt: new Date(),
  };
  cosechasStore[index] = updatedCosecha;
  return updatedCosecha;
};

// Delete Cosecha
export const deleteMockCosecha = async (id: string): Promise<void> => {
  await delay(300);
  initializeCosechasStore();
  const index = cosechasStore.findIndex(c => c.id === id);
  if (index === -1) throw new Error('Cosecha not found');
  cosechasStore.splice(index, 1);
};
