import type {
  Finca,
  Division,
  GeneralPlan,
  FincaDashboardStats,
  MonthlyAggregatedData,
  AggregatedTask,
} from '../../types/finca.types';
import type { FincaFormData, DivisionFormData, GeneralPlanFormData } from '../../schemas/finca.schema';

// Import stats from other modules
import { getMockApiculturaStats, getMockApiculturaTasks } from './apicultura.mock';
import { getMockPecuarioStats, getMockPecuarioTasks } from './pecuario.mock';
import { getMockAgroStats, getMockAgroTasks } from './agro.mock';
import { getMockFinanzasStats, getMockFinanzasTasks } from './finanzas.mock';
import { getMockTrabajadoresStats, getMockTrabajadoresTasks } from './trabajadores.mock';
import { getMockInsumosStats } from './insumos.mock';
import { getMockInfraestructuraStats } from './infraestructura.mock';
import { getMockActivosStats } from './activos.mock';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory stores
let fincaStore: Finca | null = null;
let divisionsStore: Division[] = [];
let generalPlansStore: GeneralPlan[] = [];

// ==================== INITIAL DATA ====================

// Initial Finca Data
const initialFinca: Finca = {
  id: '1',
  name: 'Finca El Roble',
  totalArea: 85.5,
  location: {
    lat: 10.25,
    lng: -84.15,
    address: 'Km 5, Carretera a San Carlos',
    department: 'Alajuela',
    municipality: 'San Ramon',
  },
  owner: 'Asociacion de Agricultores Organicos de Grecia',
  contactPhone: '2456-7890',
  contactEmail: 'info@fincaelroble.cr',
  status: 'active',
  description: 'Finca integral dedicada a la produccion agricola, pecuaria y apicola con enfoque agroecologico',
  createdAt: new Date('2015-03-15'),
  updatedAt: new Date('2026-01-20'),
};

// Initial Divisions Data
const initialDivisions: Division[] = [
  {
    id: '1',
    name: 'Potrero Norte',
    code: 'POT-001',
    type: 'potrero',
    area: 5.5,
    status: 'active',
    coordinates: { lat: 10.26, lng: -84.14 },
    moduleAssociation: 'pecuario',
    description: 'Potrero para ganado vacuno lechero',
    createdAt: new Date('2015-03-15'),
    updatedAt: new Date('2026-01-15'),
  },
  {
    id: '2',
    name: 'Potrero Central',
    code: 'POT-002',
    type: 'potrero',
    area: 8.0,
    status: 'active',
    coordinates: { lat: 10.25, lng: -84.15 },
    moduleAssociation: 'pecuario',
    description: 'Potrero principal para rotacion de ganado',
    createdAt: new Date('2015-03-15'),
    updatedAt: new Date('2026-01-10'),
  },
  {
    id: '3',
    name: 'Potrero Sur',
    code: 'POT-003',
    type: 'potrero',
    area: 4.2,
    status: 'resting',
    coordinates: { lat: 10.24, lng: -84.16 },
    moduleAssociation: 'pecuario',
    description: 'Potrero en descanso para recuperacion de pasto',
    createdAt: new Date('2015-03-15'),
    updatedAt: new Date('2025-12-20'),
  },
  {
    id: '4',
    name: 'Lote Norte - Tomates',
    code: 'LT-001',
    type: 'lote_agricola',
    area: 5.5,
    status: 'active',
    coordinates: { lat: 10.27, lng: -84.13 },
    moduleAssociation: 'agro',
    description: 'Lote dedicado a cultivo de tomate Roma',
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2026-01-15'),
  },
  {
    id: '5',
    name: 'Lote Central - Chiles',
    code: 'LT-002',
    type: 'lote_agricola',
    area: 8.2,
    status: 'active',
    coordinates: { lat: 10.25, lng: -84.14 },
    moduleAssociation: 'agro',
    description: 'Lote dedicado a cultivo de chile Jalapeno',
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2026-01-10'),
  },
  {
    id: '6',
    name: 'Lote Sur - Pepinos',
    code: 'LT-003',
    type: 'lote_agricola',
    area: 4.0,
    status: 'active',
    coordinates: { lat: 10.24, lng: -84.15 },
    moduleAssociation: 'agro',
    description: 'Lote dedicado a cultivo de pepino Americano',
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2026-01-18'),
  },
  {
    id: '7',
    name: 'Apiario El Roble',
    code: 'API-001',
    type: 'apiario',
    area: 0.5,
    status: 'active',
    coordinates: { lat: 10.26, lng: -84.12 },
    moduleAssociation: 'apicultura',
    description: 'Apiario principal con 25 colmenas',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2026-01-15'),
  },
  {
    id: '8',
    name: 'Apiario Las Brisas',
    code: 'API-002',
    type: 'apiario',
    area: 0.3,
    status: 'active',
    coordinates: { lat: 10.23, lng: -84.17 },
    moduleAssociation: 'apicultura',
    description: 'Apiario secundario con 18 colmenas',
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2026-01-18'),
  },
  {
    id: '9',
    name: 'Zona de Infraestructura',
    code: 'INF-001',
    type: 'infraestructura',
    area: 2.0,
    status: 'active',
    coordinates: { lat: 10.25, lng: -84.15 },
    moduleAssociation: 'infraestructura',
    description: 'Area de bodegas, corrales y procesamiento',
    createdAt: new Date('2015-03-15'),
    updatedAt: new Date('2026-01-05'),
  },
  {
    id: '10',
    name: 'Reserva de Bosque',
    code: 'RES-001',
    type: 'reserva',
    area: 15.0,
    status: 'active',
    coordinates: { lat: 10.28, lng: -84.11 },
    moduleAssociation: 'general',
    description: 'Area de conservacion y proteccion de cuencas',
    createdAt: new Date('2015-03-15'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: '11',
    name: 'Laguna y Naciente',
    code: 'AGU-001',
    type: 'agua',
    area: 1.5,
    status: 'active',
    coordinates: { lat: 10.27, lng: -84.12 },
    moduleAssociation: 'general',
    description: 'Fuente de agua para riego y abrevaderos',
    createdAt: new Date('2015-03-15'),
    updatedAt: new Date('2026-01-01'),
  },
];

// Initial General Plans Data
const initialGeneralPlans: GeneralPlan[] = [
  {
    id: '1',
    title: 'Mantenimiento de cercas perimetrales',
    description: 'Revision y reparacion de cercas en toda la finca',
    actionType: 'mantenimiento',
    targetModule: 'general',
    scheduledDate: new Date('2026-02-01'),
    dueDate: new Date('2026-02-15'),
    estimatedDuration: 40,
    estimatedCost: 350000,
    assignedTo: 'Juan Garcia',
    priority: 'medium',
    status: 'pending',
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-15'),
  },
  {
    id: '2',
    title: 'Capacitacion en manejo integrado de plagas',
    description: 'Taller para trabajadores sobre MIP en cultivos',
    actionType: 'capacitacion',
    targetModule: 'agro',
    scheduledDate: new Date('2026-01-28'),
    estimatedDuration: 8,
    estimatedCost: 150000,
    assignedTo: 'Roberto Sanchez',
    priority: 'high',
    status: 'pending',
    createdAt: new Date('2026-01-10'),
    updatedAt: new Date('2026-01-10'),
  },
  {
    id: '3',
    title: 'Compra de insumos para temporada',
    description: 'Adquisicion de fertilizantes y semillas para proxima siembra',
    actionType: 'compra',
    targetModule: 'agro',
    scheduledDate: new Date('2026-01-25'),
    dueDate: new Date('2026-01-30'),
    estimatedCost: 2500000,
    assignedTo: 'Roberto Sanchez',
    priority: 'high',
    status: 'in_progress',
    createdAt: new Date('2026-01-05'),
    updatedAt: new Date('2026-01-20'),
  },
  {
    id: '4',
    title: 'Revision de sistema de riego',
    description: 'Inspeccion y mantenimiento del sistema de riego por goteo',
    actionType: 'revision',
    targetModule: 'agro',
    targetDivisionId: '4',
    targetDivisionName: 'Lote Norte - Tomates',
    scheduledDate: new Date('2026-01-22'),
    estimatedDuration: 4,
    estimatedCost: 50000,
    assignedTo: 'Juan Garcia',
    priority: 'medium',
    status: 'completed',
    completedDate: new Date('2026-01-22'),
    actualCost: 45000,
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-22'),
  },
  {
    id: '5',
    title: 'Vacunacion de ganado bovino',
    description: 'Aplicacion de vacunas contra fiebre aftosa',
    actionType: 'vacunacion',
    targetModule: 'pecuario',
    scheduledDate: new Date('2026-02-05'),
    dueDate: new Date('2026-02-10'),
    estimatedDuration: 8,
    estimatedCost: 500000,
    assignedTo: 'Maria Lopez',
    priority: 'high',
    status: 'pending',
    createdAt: new Date('2026-01-18'),
    updatedAt: new Date('2026-01-18'),
  },
  {
    id: '6',
    title: 'Cosecha de miel - Temporada alta',
    description: 'Extraccion de miel de todos los apiarios',
    actionType: 'cosecha',
    targetModule: 'apicultura',
    scheduledDate: new Date('2026-02-10'),
    estimatedDuration: 16,
    assignedTo: 'Carlos Rodriguez',
    priority: 'medium',
    status: 'pending',
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date('2026-01-20'),
  },
];

// ==================== INITIALIZE STORES ====================

export const initializeFincaStore = () => {
  if (!fincaStore) {
    fincaStore = { ...initialFinca };
  }
};

export const initializeDivisionsStore = () => {
  if (divisionsStore.length === 0) {
    divisionsStore = [...initialDivisions];
  }
};

export const initializeGeneralPlansStore = () => {
  if (generalPlansStore.length === 0) {
    generalPlansStore = [...initialGeneralPlans];
  }
};

// ==================== FINCA CRUD ====================

export const getMockFinca = async (): Promise<Finca> => {
  await delay(300);
  initializeFincaStore();
  return { ...fincaStore! };
};

export const updateMockFinca = async (data: FincaFormData): Promise<Finca> => {
  await delay(400);
  initializeFincaStore();

  const updatedFinca: Finca = {
    ...fincaStore!,
    name: data.name,
    totalArea: parseFloat(data.totalArea),
    location: {
      lat: data.lat ? parseFloat(data.lat) : fincaStore!.location.lat,
      lng: data.lng ? parseFloat(data.lng) : fincaStore!.location.lng,
      address: data.address || fincaStore!.location.address,
      department: data.department || fincaStore!.location.department,
      municipality: data.municipality || fincaStore!.location.municipality,
    },
    owner: data.owner,
    contactPhone: data.contactPhone,
    contactEmail: data.contactEmail,
    status: data.status,
    description: data.description,
    notes: data.notes,
    updatedAt: new Date(),
  };

  fincaStore = updatedFinca;
  return updatedFinca;
};

// ==================== DIVISIONS CRUD ====================

export const getMockDivisions = async (): Promise<Division[]> => {
  await delay(300);
  initializeDivisionsStore();
  return [...divisionsStore].sort((a, b) => a.name.localeCompare(b.name));
};

export const getMockDivisionById = async (id: string): Promise<Division | undefined> => {
  await delay(200);
  initializeDivisionsStore();
  return divisionsStore.find(d => d.id === id);
};

export const createMockDivision = async (data: DivisionFormData): Promise<Division> => {
  await delay(400);
  initializeDivisionsStore();

  const newDivision: Division = {
    id: String(Date.now()),
    name: data.name,
    code: data.code,
    type: data.type,
    area: parseFloat(data.area),
    status: data.status,
    coordinates: data.lat && data.lng ? {
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lng),
    } : undefined,
    parentDivisionId: data.parentDivisionId || undefined,
    moduleAssociation: data.moduleAssociation || undefined,
    description: data.description,
    notes: data.notes,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  divisionsStore.push(newDivision);
  return newDivision;
};

export const updateMockDivision = async (id: string, data: DivisionFormData): Promise<Division> => {
  await delay(400);
  initializeDivisionsStore();

  const index = divisionsStore.findIndex(d => d.id === id);
  if (index === -1) throw new Error('Division not found');

  const existingDivision = divisionsStore[index];
  const updatedDivision: Division = {
    ...existingDivision,
    name: data.name,
    code: data.code,
    type: data.type,
    area: parseFloat(data.area),
    status: data.status,
    coordinates: data.lat && data.lng ? {
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lng),
    } : existingDivision.coordinates,
    parentDivisionId: data.parentDivisionId || undefined,
    moduleAssociation: data.moduleAssociation || undefined,
    description: data.description,
    notes: data.notes,
    updatedAt: new Date(),
  };

  divisionsStore[index] = updatedDivision;
  return updatedDivision;
};

export const deleteMockDivision = async (id: string): Promise<void> => {
  await delay(300);
  initializeDivisionsStore();

  const index = divisionsStore.findIndex(d => d.id === id);
  if (index === -1) throw new Error('Division not found');

  divisionsStore.splice(index, 1);
};

// ==================== GENERAL PLANS CRUD ====================

export const getMockGeneralPlans = async (): Promise<GeneralPlan[]> => {
  await delay(300);
  initializeGeneralPlansStore();
  return [...generalPlansStore].sort((a, b) => {
    // Sort by status priority (pending/in_progress first), then by scheduledDate
    const statusOrder = { pending: 0, in_progress: 1, completed: 2, cancelled: 3 };
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;
    return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
  });
};

export const getMockGeneralPlanById = async (id: string): Promise<GeneralPlan | undefined> => {
  await delay(200);
  initializeGeneralPlansStore();
  return generalPlansStore.find(p => p.id === id);
};

export const createMockGeneralPlan = async (data: GeneralPlanFormData): Promise<GeneralPlan> => {
  await delay(400);
  initializeGeneralPlansStore();
  initializeDivisionsStore();

  const division = data.targetDivisionId
    ? divisionsStore.find(d => d.id === data.targetDivisionId)
    : undefined;

  const newPlan: GeneralPlan = {
    id: String(Date.now()),
    title: data.title,
    description: data.description,
    actionType: data.actionType,
    targetModule: data.targetModule || undefined,
    targetDivisionId: data.targetDivisionId || undefined,
    targetDivisionName: division?.name,
    scheduledDate: new Date(data.scheduledDate),
    dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    estimatedDuration: data.estimatedDuration ? parseFloat(data.estimatedDuration) : undefined,
    estimatedCost: data.estimatedCost ? parseFloat(data.estimatedCost) : undefined,
    actualCost: data.actualCost ? parseFloat(data.actualCost) : undefined,
    assignedTo: data.assignedTo || undefined,
    priority: data.priority,
    status: data.status,
    notes: data.notes,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  generalPlansStore.push(newPlan);
  return newPlan;
};

export const updateMockGeneralPlan = async (id: string, data: GeneralPlanFormData): Promise<GeneralPlan> => {
  await delay(400);
  initializeGeneralPlansStore();
  initializeDivisionsStore();

  const index = generalPlansStore.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Plan not found');

  const division = data.targetDivisionId
    ? divisionsStore.find(d => d.id === data.targetDivisionId)
    : undefined;

  const existingPlan = generalPlansStore[index];
  const updatedPlan: GeneralPlan = {
    ...existingPlan,
    title: data.title,
    description: data.description,
    actionType: data.actionType,
    targetModule: data.targetModule || undefined,
    targetDivisionId: data.targetDivisionId || undefined,
    targetDivisionName: division?.name,
    scheduledDate: new Date(data.scheduledDate),
    dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    completedDate: data.status === 'completed' && existingPlan.status !== 'completed'
      ? new Date()
      : existingPlan.completedDate,
    estimatedDuration: data.estimatedDuration ? parseFloat(data.estimatedDuration) : undefined,
    estimatedCost: data.estimatedCost ? parseFloat(data.estimatedCost) : undefined,
    actualCost: data.actualCost ? parseFloat(data.actualCost) : undefined,
    assignedTo: data.assignedTo || undefined,
    priority: data.priority,
    status: data.status,
    notes: data.notes,
    updatedAt: new Date(),
  };

  generalPlansStore[index] = updatedPlan;
  return updatedPlan;
};

export const deleteMockGeneralPlan = async (id: string): Promise<void> => {
  await delay(300);
  initializeGeneralPlansStore();

  const index = generalPlansStore.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Plan not found');

  generalPlansStore.splice(index, 1);
};

// ==================== DASHBOARD AGGREGATED DATA ====================

export const getMockFincaDashboardStats = async (): Promise<FincaDashboardStats> => {
  await delay(500);
  initializeFincaStore();
  initializeDivisionsStore();
  initializeGeneralPlansStore();

  // Get stats from all modules
  const [
    apiculturaStats,
    pecuarioStats,
    agroStats,
    finanzasStats,
    trabajadoresStats,
    insumosStats,
    infraestructuraStats,
    activosStats,
  ] = await Promise.all([
    getMockApiculturaStats(),
    getMockPecuarioStats(),
    getMockAgroStats(),
    getMockFinanzasStats(),
    getMockTrabajadoresStats(),
    getMockInsumosStats(),
    getMockInfraestructuraStats(),
    getMockActivosStats(),
  ]);

  // Count pending plans
  const pendingPlans = generalPlansStore.filter(
    p => p.status === 'pending' || p.status === 'in_progress'
  ).length;

  // Count upcoming deadlines (next 7 days)
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const upcomingDeadlines = generalPlansStore.filter(
    p => (p.status === 'pending' || p.status === 'in_progress') &&
      new Date(p.scheduledDate) <= nextWeek
  ).length;

  return {
    // Finca info
    fincaName: fincaStore!.name,
    totalArea: fincaStore!.totalArea,
    location: `${fincaStore!.location.municipality}, ${fincaStore!.location.department}`,

    // Financial summary
    totalIncome: finanzasStats.totalIncome,
    totalExpense: finanzasStats.totalExpense,
    netProfit: finanzasStats.netProfit,
    profitMargin: finanzasStats.totalIncome > 0
      ? Math.round((finanzasStats.netProfit / finanzasStats.totalIncome) * 100)
      : 0,

    // Module summaries
    apicultura: {
      totalApiarios: apiculturaStats.totalApiarios,
      totalColmenas: apiculturaStats.totalColmenas,
      activeColmenas: apiculturaStats.activeColmenas,
      monthlyHoneyProduction: apiculturaStats.monthlyProduction.honey,
      pendingTasks: apiculturaStats.pendingRevisions,
    },
    pecuario: {
      totalLivestock: pecuarioStats.totalLivestock,
      bySpecies: {
        bovine: pecuarioStats.bySpecies.bovine,
        porcine: pecuarioStats.bySpecies.porcine,
        caprine: pecuarioStats.bySpecies.caprine,
        poultry: pecuarioStats.bySpecies.poultry,
        other: pecuarioStats.bySpecies.buffalo + pecuarioStats.bySpecies.equine + pecuarioStats.bySpecies.ovine,
      },
      monthlyMilkProduction: pecuarioStats.monthlyMilkProduction,
      pendingTasks: pecuarioStats.pendingHealthActions,
    },
    agro: {
      totalLotes: agroStats.totalLotes,
      activeLotes: agroStats.activeLotes,
      totalArea: agroStats.totalArea,
      cultivatedArea: agroStats.cultivatedArea,
      activeCrops: agroStats.activeCrops,
      pendingTasks: agroStats.pendingActions,
    },
    finanzas: {
      thisMonthIncome: finanzasStats.thisMonthIncome,
      thisMonthExpense: finanzasStats.thisMonthExpense,
      pendingReceivables: finanzasStats.pendingReceivables,
      pendingPayables: finanzasStats.pendingPayables,
    },
    trabajadores: {
      totalWorkers: trabajadoresStats.totalWorkers,
      activeWorkers: trabajadoresStats.activeWorkers,
      averageAttendance: trabajadoresStats.averageAttendance,
      pendingTasks: trabajadoresStats.pendingTasks,
    },
    insumos: {
      totalItems: insumosStats.totalInsumosCount,
      lowStockItems: insumosStats.bajoStock,
      criticalStockItems: insumosStats.criticoStock,
      totalValue: insumosStats.totalInventoryValue,
    },
    infraestructura: {
      totalFacilities: infraestructuraStats.totalFacilities,
      operationalFacilities: infraestructuraStats.operationalFacilities,
      pendingMaintenances: infraestructuraStats.pendingMaintenances,
    },
    activos: {
      totalAssets: activosStats.totalAssets,
      activeAssets: activosStats.activeAssets,
      totalValue: activosStats.totalCurrentValue,
    },

    // Aggregated counts
    totalDivisions: divisionsStore.length,
    totalPendingPlans: pendingPlans,
    upcomingDeadlines,
  };
};

export const getMockMonthlyAggregatedData = async (): Promise<MonthlyAggregatedData[]> => {
  await delay(300);
  return [
    {
      month: 'Ago',
      agroRevenue: 5950000,
      pecuarioRevenue: 1800000,
      apiculturaRevenue: 980000,
      totalExpenses: 1920000,
      netProfit: 6810000,
    },
    {
      month: 'Sep',
      agroRevenue: 7140000,
      pecuarioRevenue: 2100000,
      apiculturaRevenue: 1050000,
      totalExpenses: 2100000,
      netProfit: 8190000,
    },
    {
      month: 'Oct',
      agroRevenue: 8260000,
      pecuarioRevenue: 1950000,
      apiculturaRevenue: 975000,
      totalExpenses: 1950000,
      netProfit: 9235000,
    },
    {
      month: 'Nov',
      agroRevenue: 6650000,
      pecuarioRevenue: 2250000,
      apiculturaRevenue: 1200000,
      totalExpenses: 2250000,
      netProfit: 7850000,
    },
    {
      month: 'Dic',
      agroRevenue: 5040000,
      pecuarioRevenue: 1825000,
      apiculturaRevenue: 1400000,
      totalExpenses: 1825000,
      netProfit: 6440000,
    },
    {
      month: 'Ene',
      agroRevenue: 8750000,
      pecuarioRevenue: 2200000,
      apiculturaRevenue: 1300000,
      totalExpenses: 2900000,
      netProfit: 9350000,
    },
  ];
};

export const getMockAggregatedTasks = async (): Promise<AggregatedTask[]> => {
  await delay(400);
  initializeGeneralPlansStore();

  // Get tasks from all modules
  const [
    apiculturaTasks,
    pecuarioTasks,
    agroTasks,
    finanzasTasks,
    trabajadoresTasks,
  ] = await Promise.all([
    getMockApiculturaTasks(),
    getMockPecuarioTasks(),
    getMockAgroTasks(),
    getMockFinanzasTasks(),
    getMockTrabajadoresTasks(),
  ]);

  const aggregatedTasks: AggregatedTask[] = [];

  // Add apicultura tasks
  apiculturaTasks.slice(0, 3).forEach(task => {
    aggregatedTasks.push({
      id: `api-${task.id}`,
      title: task.title,
      module: 'apicultura',
      moduleName: 'Apicultura',
      type: task.type,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
    });
  });

  // Add pecuario tasks
  pecuarioTasks.slice(0, 3).forEach(task => {
    aggregatedTasks.push({
      id: `pec-${task.id}`,
      title: task.title,
      module: 'pecuario',
      moduleName: 'Pecuario',
      type: task.type,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
    });
  });

  // Add agro tasks
  agroTasks.slice(0, 3).forEach(task => {
    aggregatedTasks.push({
      id: `agro-${task.id}`,
      title: task.title,
      module: 'agro',
      moduleName: 'Agricultura',
      type: task.type,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
    });
  });

  // Add finanzas tasks
  finanzasTasks.slice(0, 2).forEach(task => {
    aggregatedTasks.push({
      id: `fin-${task.id}`,
      title: task.title,
      module: 'general',
      moduleName: 'Finanzas',
      type: task.type,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
    });
  });

  // Add trabajadores tasks
  trabajadoresTasks.slice(0, 2).forEach(task => {
    aggregatedTasks.push({
      id: `trab-${task.id}`,
      title: task.title,
      module: 'general',
      moduleName: 'Trabajadores',
      type: 'task',
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
    });
  });

  // Add general plans as tasks
  generalPlansStore
    .filter(p => p.status === 'pending' || p.status === 'in_progress')
    .slice(0, 3)
    .forEach(plan => {
      aggregatedTasks.push({
        id: `plan-${plan.id}`,
        title: plan.title,
        module: plan.targetModule || 'general',
        moduleName: 'Plan General',
        type: plan.actionType,
        dueDate: plan.scheduledDate,
        priority: plan.priority,
        status: plan.status,
        assignedTo: plan.assignedTo,
      });
    });

  // Sort by due date and priority
  return aggregatedTasks.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
};
