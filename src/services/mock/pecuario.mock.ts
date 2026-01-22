import type {
  Livestock,
  HealthRecord,
  Potrero,
  PecuarioDashboardStats,
  PecuarioProductionData,
  PecuarioTask,
  CategoryDistribution,
  GroupHealthAction,
} from '../../types/pecuario.types';
import type { LivestockFormData, PotreroFormData } from '../../schemas/pecuario.schema';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory stores
let livestockStore: Livestock[] = [];
let potrerosStore: Potrero[] = [];

// Initial Livestock Data
const initialLivestock: Livestock[] = [
    {
      id: '1',
      tag: 'BOV-001',
      name: 'Estrella',
      category: 'vaca',
      breed: 'Holstein',
      birthDate: new Date('2020-03-15'),
      gender: 'female',
      weight: 520,
      status: 'active',
      location: 'Potrero Norte',
      entryDate: new Date('2020-03-15'),
      entryReason: 'birth',
      createdAt: new Date('2020-03-15'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: '2',
      tag: 'BOV-002',
      name: 'Tornado',
      category: 'toro',
      breed: 'Brahman',
      birthDate: new Date('2019-06-20'),
      gender: 'male',
      weight: 850,
      status: 'active',
      location: 'Potrero Central',
      entryDate: new Date('2021-01-10'),
      entryReason: 'purchase',
      createdAt: new Date('2021-01-10'),
      updatedAt: new Date('2026-01-10'),
    },
    {
      id: '3',
      tag: 'BOV-003',
      name: 'Luna',
      category: 'novilla',
      breed: 'Jersey',
      birthDate: new Date('2023-08-12'),
      gender: 'female',
      weight: 320,
      status: 'active',
      location: 'Potrero Norte',
      motherId: '1',
      motherTag: 'BOV-001',
      entryDate: new Date('2023-08-12'),
      entryReason: 'birth',
      createdAt: new Date('2023-08-12'),
      updatedAt: new Date('2026-01-18'),
    },
    {
      id: '4',
      tag: 'BOV-004',
      name: 'Relámpago',
      category: 'novillo',
      breed: 'Brahman',
      birthDate: new Date('2023-05-08'),
      gender: 'male',
      weight: 380,
      status: 'active',
      location: 'Potrero Sur',
      fatherId: '2',
      fatherTag: 'BOV-002',
      entryDate: new Date('2023-05-08'),
      entryReason: 'birth',
      createdAt: new Date('2023-05-08'),
      updatedAt: new Date('2026-01-12'),
    },
    {
      id: '5',
      tag: 'BOV-005',
      name: 'Manchita',
      category: 'ternera',
      breed: 'Holstein',
      birthDate: new Date('2025-11-20'),
      gender: 'female',
      weight: 85,
      status: 'active',
      location: 'Corral de Crías',
      motherId: '1',
      motherTag: 'BOV-001',
      entryDate: new Date('2025-11-20'),
      entryReason: 'birth',
      createdAt: new Date('2025-11-20'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: '6',
      tag: 'BOV-006',
      name: 'Canelo',
      category: 'ternero',
      breed: 'Brahman',
      birthDate: new Date('2025-12-05'),
      gender: 'male',
      weight: 72,
      status: 'active',
      location: 'Corral de Crías',
      fatherId: '2',
      fatherTag: 'BOV-002',
      entryDate: new Date('2025-12-05'),
      entryReason: 'birth',
      createdAt: new Date('2025-12-05'),
      updatedAt: new Date('2026-01-10'),
    },
    {
      id: '7',
      tag: 'BOV-007',
      name: 'Paloma',
      category: 'vaca',
      breed: 'Jersey',
      birthDate: new Date('2018-02-28'),
      gender: 'female',
      weight: 480,
      status: 'active',
      location: 'Potrero Norte',
      entryDate: new Date('2018-02-28'),
      entryReason: 'birth',
      createdAt: new Date('2018-02-28'),
      updatedAt: new Date('2026-01-18'),
    },
    {
      id: '8',
      tag: 'BOV-008',
      name: 'Negrita',
      category: 'vaca',
      breed: 'Angus',
      birthDate: new Date('2019-09-10'),
      gender: 'female',
      weight: 550,
      status: 'active',
      location: 'Potrero Central',
      entryDate: new Date('2022-03-15'),
      entryReason: 'purchase',
      createdAt: new Date('2022-03-15'),
      updatedAt: new Date('2026-01-16'),
    },
  ];

// Initial Potreros Data
const initialPotreros: Potrero[] = [
  {
    id: '1',
    name: 'Potrero Norte',
    area: 5.5,
    capacity: 25,
    currentOccupancy: 18,
    status: 'active',
    grassType: 'Brachiaria',
    lastRotation: new Date('2026-01-10'),
    nextRotation: new Date('2026-02-10'),
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2026-01-10'),
  },
  {
    id: '2',
    name: 'Potrero Central',
    area: 8.0,
    capacity: 35,
    currentOccupancy: 22,
    status: 'active',
    grassType: 'Estrella',
    lastRotation: new Date('2026-01-05'),
    nextRotation: new Date('2026-02-05'),
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2026-01-05'),
  },
  {
    id: '3',
    name: 'Potrero Sur',
    area: 4.2,
    capacity: 18,
    currentOccupancy: 12,
    status: 'active',
    grassType: 'Brachiaria',
    lastRotation: new Date('2025-12-20'),
    nextRotation: new Date('2026-01-25'),
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2025-12-20'),
  },
  {
    id: '4',
    name: 'Potrero Este',
    area: 3.8,
    capacity: 15,
    currentOccupancy: 0,
    status: 'resting',
    grassType: 'Estrella',
    lastRotation: new Date('2025-12-01'),
    nextRotation: new Date('2026-02-01'),
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2025-12-01'),
  },
];

// Initialize stores
export const initializeLivestockStore = () => {
  if (livestockStore.length === 0) {
    livestockStore = [...initialLivestock];
  }
};

export const initializePotrerosStore = () => {
  if (potrerosStore.length === 0) {
    potrerosStore = [...initialPotreros];
  }
};

// Get Livestock
export const getMockLivestock = async (): Promise<Livestock[]> => {
  await delay(300);
  initializeLivestockStore();
  return [...livestockStore].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
};

// Get single Livestock
export const getMockLivestockById = async (id: string): Promise<Livestock | undefined> => {
  await delay(200);
  initializeLivestockStore();
  return livestockStore.find(l => l.id === id);
};

// Create Livestock
export const createMockLivestock = async (data: LivestockFormData): Promise<Livestock> => {
  await delay(400);
  initializeLivestockStore();
  const newLivestock: Livestock = {
    id: String(Date.now()),
    tag: data.tag,
    name: data.name,
    category: data.category,
    breed: data.breed,
    birthDate: new Date(data.birthDate),
    gender: data.gender,
    weight: parseFloat(data.weight),
    status: data.status,
    location: data.location,
    motherId: data.motherId,
    motherTag: data.motherTag,
    fatherId: data.fatherId,
    fatherTag: data.fatherTag,
    entryDate: new Date(data.entryDate),
    entryReason: data.entryReason,
    exitDate: data.exitDate ? new Date(data.exitDate) : undefined,
    exitReason: data.exitReason,
    notes: data.notes,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  livestockStore.push(newLivestock);
  return newLivestock;
};

// Update Livestock
export const updateMockLivestock = async (id: string, data: LivestockFormData): Promise<Livestock> => {
  await delay(400);
  initializeLivestockStore();
  const index = livestockStore.findIndex(l => l.id === id);
  if (index === -1) throw new Error('Livestock not found');

  const existingLivestock = livestockStore[index];
  const updatedLivestock: Livestock = {
    ...existingLivestock,
    tag: data.tag,
    name: data.name,
    category: data.category,
    breed: data.breed,
    birthDate: new Date(data.birthDate),
    gender: data.gender,
    weight: parseFloat(data.weight),
    status: data.status,
    location: data.location,
    motherId: data.motherId,
    motherTag: data.motherTag,
    fatherId: data.fatherId,
    fatherTag: data.fatherTag,
    entryDate: new Date(data.entryDate),
    entryReason: data.entryReason,
    exitDate: data.exitDate ? new Date(data.exitDate) : undefined,
    exitReason: data.exitReason,
    notes: data.notes,
    updatedAt: new Date(),
  };
  livestockStore[index] = updatedLivestock;
  return updatedLivestock;
};

// Delete Livestock
export const deleteMockLivestock = async (id: string): Promise<void> => {
  await delay(300);
  initializeLivestockStore();
  const index = livestockStore.findIndex(l => l.id === id);
  if (index === -1) throw new Error('Livestock not found');
  livestockStore.splice(index, 1);
};

// Get Potreros
export const getMockPotreros = async (): Promise<Potrero[]> => {
  await delay(300);
  initializePotrerosStore();
  return [...potrerosStore].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
};

// Get single Potrero
export const getMockPotreroById = async (id: string): Promise<Potrero | undefined> => {
  await delay(200);
  initializePotrerosStore();
  return potrerosStore.find(p => p.id === id);
};

// Create Potrero
export const createMockPotrero = async (data: PotreroFormData): Promise<Potrero> => {
  await delay(400);
  initializePotrerosStore();
  const newPotrero: Potrero = {
    id: String(Date.now()),
    name: data.name,
    area: parseFloat(data.area),
    capacity: parseInt(data.capacity),
    currentOccupancy: parseInt(data.currentOccupancy),
    status: data.status,
    grassType: data.grassType,
    lastRotation: data.lastRotation ? new Date(data.lastRotation) : undefined,
    nextRotation: data.nextRotation ? new Date(data.nextRotation) : undefined,
    notes: data.notes,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  potrerosStore.push(newPotrero);
  return newPotrero;
};

// Update Potrero
export const updateMockPotrero = async (id: string, data: PotreroFormData): Promise<Potrero> => {
  await delay(400);
  initializePotrerosStore();
  const index = potrerosStore.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Potrero not found');

  const existingPotrero = potrerosStore[index];
  const updatedPotrero: Potrero = {
    ...existingPotrero,
    name: data.name,
    area: parseFloat(data.area),
    capacity: parseInt(data.capacity),
    currentOccupancy: parseInt(data.currentOccupancy),
    status: data.status,
    grassType: data.grassType,
    lastRotation: data.lastRotation ? new Date(data.lastRotation) : undefined,
    nextRotation: data.nextRotation ? new Date(data.nextRotation) : undefined,
    notes: data.notes,
    updatedAt: new Date(),
  };
  potrerosStore[index] = updatedPotrero;
  return updatedPotrero;
};

// Delete Potrero
export const deleteMockPotrero = async (id: string): Promise<void> => {
  await delay(300);
  initializePotrerosStore();
  const index = potrerosStore.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Potrero not found');
  potrerosStore.splice(index, 1);
};

// Health records mock data
export const getMockHealthRecords = async (): Promise<HealthRecord[]> => {
  await delay(300);
  return [
    {
      id: '1',
      livestockId: '1',
      livestockTag: 'BOV-001',
      date: new Date('2026-01-15'),
      type: 'vaccination',
      description: 'Vacuna contra fiebre aftosa',
      medication: 'Aftogan',
      dosage: '5ml',
      veterinarian: 'Dr. García',
      cost: 15000,
      nextCheckup: new Date('2026-07-15'),
      createdAt: new Date('2026-01-15'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: '2',
      livestockId: '5',
      livestockTag: 'BOV-005',
      date: new Date('2026-01-10'),
      type: 'checkup',
      description: 'Control de peso y desarrollo',
      veterinarian: 'Dr. García',
      nextCheckup: new Date('2026-02-10'),
      createdAt: new Date('2026-01-10'),
      updatedAt: new Date('2026-01-10'),
    },
    {
      id: '3',
      livestockId: '3',
      livestockTag: 'BOV-003',
      date: new Date('2026-01-08'),
      type: 'deworming',
      description: 'Desparasitación rutinaria',
      medication: 'Ivermectina',
      dosage: '10ml',
      cost: 8000,
      createdAt: new Date('2026-01-08'),
      updatedAt: new Date('2026-01-08'),
    },
    {
      id: '4',
      livestockId: '8',
      livestockTag: 'BOV-008',
      date: new Date('2026-01-05'),
      type: 'treatment',
      description: 'Tratamiento por cojera leve',
      medication: 'Antiinflamatorio',
      veterinarian: 'Dr. Rodríguez',
      cost: 25000,
      notes: 'Mejoría notable después de 3 días',
      createdAt: new Date('2026-01-05'),
      updatedAt: new Date('2026-01-05'),
    },
  ];
};

// Dashboard stats
export const getMockPecuarioStats = async (): Promise<PecuarioDashboardStats> => {
  await delay(300);
  return {
    totalLivestock: 68,
    byCategory: {
      terneros: 8,
      terneras: 6,
      novillos: 12,
      novillas: 10,
      vacas: 28,
      toros: 4,
    },
    healthyPercentage: 94,
    pendingHealthActions: 5,
    monthlyMilkProduction: 4250,
    activePotrerosCount: 3,
    recentBirths: 4,
    pendingSales: 3,
  };
};

// Production data for charts
export const getMockPecuarioProduction = async (): Promise<PecuarioProductionData[]> => {
  await delay(300);
  return [
    { month: 'Ago', milk: 3800, births: 2, sales: 3, weight: 425 },
    { month: 'Sep', milk: 4100, births: 1, sales: 2, weight: 430 },
    { month: 'Oct', milk: 4300, births: 3, sales: 4, weight: 428 },
    { month: 'Nov', milk: 4150, births: 2, sales: 1, weight: 432 },
    { month: 'Dic', milk: 4050, births: 4, sales: 2, weight: 435 },
    { month: 'Ene', milk: 4250, births: 2, sales: 3, weight: 438 },
  ];
};

// Tasks
export const getMockPecuarioTasks = async (): Promise<PecuarioTask[]> => {
  await delay(300);
  return [
    {
      id: '1',
      title: 'Vacunación contra brucelosis',
      type: 'health',
      dueDate: new Date('2026-01-23'),
      priority: 'high',
      status: 'pending',
    },
    {
      id: '2',
      title: 'Rotación de ganado',
      type: 'rotation',
      potreroName: 'Potrero Sur',
      dueDate: new Date('2026-01-25'),
      priority: 'medium',
      status: 'pending',
    },
    {
      id: '3',
      title: 'Revisión de preñez',
      type: 'reproduction',
      livestockTag: 'BOV-003',
      dueDate: new Date('2026-01-28'),
      priority: 'medium',
      status: 'pending',
    },
    {
      id: '4',
      title: 'Venta programada',
      type: 'sale',
      livestockTag: 'BOV-004',
      dueDate: new Date('2026-02-01'),
      priority: 'low',
      status: 'pending',
    },
    {
      id: '5',
      title: 'Control de peso terneros',
      type: 'checkup',
      dueDate: new Date('2026-02-05'),
      priority: 'low',
      status: 'pending',
    },
  ];
};

// Category distribution for charts
export const getMockCategoryDistribution = async (): Promise<CategoryDistribution[]> => {
  await delay(300);
  return [
    { category: 'Vacas', count: 28, color: '#ec4899' },
    { category: 'Novillos', count: 12, color: '#3b82f6' },
    { category: 'Novillas', count: 10, color: '#8b5cf6' },
    { category: 'Terneros', count: 8, color: '#10b981' },
    { category: 'Terneras', count: 6, color: '#f59e0b' },
    { category: 'Toros', count: 4, color: '#ef4444' },
  ];
};

// Recent health actions
export const getMockRecentHealthActions = async (): Promise<GroupHealthAction[]> => {
  await delay(300);
  return [
    {
      id: '1',
      groupName: 'Vacas lecheras',
      category: 'vaca',
      affectedCount: 28,
      date: new Date('2026-01-15'),
      type: 'vaccination',
      description: 'Vacunación contra fiebre aftosa',
      medication: 'Aftogan',
      performedBy: 'Dr. García',
      cost: 420000,
      createdAt: new Date('2026-01-15'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: '2',
      groupName: 'Terneros',
      category: 'ternero',
      affectedCount: 14,
      date: new Date('2026-01-12'),
      type: 'deworming',
      description: 'Desparasitación de crías',
      medication: 'Ivermectina',
      performedBy: 'Juan Pérez',
      cost: 70000,
      createdAt: new Date('2026-01-12'),
      updatedAt: new Date('2026-01-12'),
    },
    {
      id: '3',
      category: 'novillo',
      affectedCount: 12,
      date: new Date('2026-01-08'),
      type: 'checkup',
      description: 'Control de peso y condición corporal',
      performedBy: 'María López',
      createdAt: new Date('2026-01-08'),
      updatedAt: new Date('2026-01-08'),
    },
  ];
};
