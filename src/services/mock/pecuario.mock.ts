import type {
  Livestock,
  LivestockGroup,
  HealthRecord,
  Potrero,
  PecuarioDashboardStats,
  PecuarioProductionData,
  PecuarioTask,
  CategoryDistribution,
  GroupHealthAction,
  ReproductionRecord,
  MilkProduction,
  LivestockSpecies,
} from '../../types/pecuario.types';
import type {
  LivestockFormData,
  PotreroFormData,
  HealthRecordFormData,
  GroupHealthActionFormData,
  ReproductionRecordFormData,
  MilkProductionFormData,
  LivestockGroupFormData,
} from '../../schemas/pecuario.schema';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory stores
let livestockStore: Livestock[] = [];
let potrerosStore: Potrero[] = [];
let healthRecordsStore: HealthRecord[] = [];
let groupHealthActionsStore: GroupHealthAction[] = [];
let reproductionRecordsStore: ReproductionRecord[] = [];
let milkProductionStore: MilkProduction[] = [];
let livestockGroupsStore: LivestockGroup[] = [];

// Initial Livestock Data - Multiple species
const initialLivestock: Livestock[] = [
    // === BOVINOS ===
    {
      id: '1',
      tag: 'BOV-001',
      name: 'Estrella',
      species: 'bovine',
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
      species: 'bovine',
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
      species: 'bovine',
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
      species: 'bovine',
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
      species: 'bovine',
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
      species: 'bovine',
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
    // === PORCINOS ===
    {
      id: '9',
      tag: 'POR-001',
      name: 'Pancho',
      species: 'porcine',
      category: 'verraco',
      breed: 'Casco de Mula',
      birthDate: new Date('2022-04-10'),
      gender: 'male',
      weight: 180,
      status: 'active',
      location: 'Corral Porcinos',
      entryDate: new Date('2022-08-15'),
      entryReason: 'purchase',
      createdAt: new Date('2022-08-15'),
      updatedAt: new Date('2026-01-10'),
    },
    {
      id: '10',
      tag: 'POR-002',
      name: 'Rosa',
      species: 'porcine',
      category: 'cerda',
      breed: 'Casco de Mula',
      birthDate: new Date('2023-02-20'),
      gender: 'female',
      weight: 145,
      status: 'active',
      location: 'Corral Porcinos',
      entryDate: new Date('2023-06-01'),
      entryReason: 'purchase',
      createdAt: new Date('2023-06-01'),
      updatedAt: new Date('2026-01-12'),
    },
    {
      id: '11',
      tag: 'POR-003',
      name: 'Chanchito',
      species: 'porcine',
      category: 'lechon',
      breed: 'Casco de Mula',
      birthDate: new Date('2025-12-15'),
      gender: 'male',
      weight: 12,
      status: 'active',
      location: 'Corral Crías Porcinos',
      motherId: '10',
      motherTag: 'POR-002',
      fatherId: '9',
      fatherTag: 'POR-001',
      entryDate: new Date('2025-12-15'),
      entryReason: 'birth',
      createdAt: new Date('2025-12-15'),
      updatedAt: new Date('2026-01-15'),
    },
    // === AVES (sin seguimiento de padres) ===
    {
      id: '12',
      tag: 'AVE-001',
      name: '',
      species: 'poultry',
      category: 'gallina',
      breed: 'Rhode Island',
      birthDate: new Date('2024-06-01'),
      gender: 'female',
      weight: 2.5,
      status: 'active',
      location: 'Gallinero Principal',
      entryDate: new Date('2024-06-01'),
      entryReason: 'purchase',
      createdAt: new Date('2024-06-01'),
      updatedAt: new Date('2026-01-10'),
    },
    {
      id: '13',
      tag: 'AVE-002',
      name: 'Cantador',
      species: 'poultry',
      category: 'gallo',
      breed: 'Rhode Island',
      birthDate: new Date('2024-03-15'),
      gender: 'male',
      weight: 3.2,
      status: 'active',
      location: 'Gallinero Principal',
      entryDate: new Date('2024-06-01'),
      entryReason: 'purchase',
      createdAt: new Date('2024-06-01'),
      updatedAt: new Date('2026-01-10'),
    },
    {
      id: '14',
      tag: 'AVE-003',
      name: '',
      species: 'poultry',
      category: 'chompipe',
      breed: 'Bronceado',
      birthDate: new Date('2024-08-20'),
      gender: 'male',
      weight: 8.5,
      status: 'active',
      location: 'Corral Pavos',
      entryDate: new Date('2024-10-01'),
      entryReason: 'purchase',
      createdAt: new Date('2024-10-01'),
      updatedAt: new Date('2026-01-05'),
    },
    // === CAPRINOS ===
    {
      id: '15',
      tag: 'CAP-001',
      name: 'Blanca',
      species: 'caprine',
      category: 'cabra',
      breed: 'Saanen',
      birthDate: new Date('2022-05-10'),
      gender: 'female',
      weight: 55,
      status: 'active',
      location: 'Corral Caprinos',
      entryDate: new Date('2022-09-01'),
      entryReason: 'purchase',
      createdAt: new Date('2022-09-01'),
      updatedAt: new Date('2026-01-10'),
    },
    {
      id: '16',
      tag: 'CAP-002',
      name: 'Barbas',
      species: 'caprine',
      category: 'semental_caprino',
      breed: 'Boer',
      birthDate: new Date('2021-11-20'),
      gender: 'male',
      weight: 75,
      status: 'active',
      location: 'Corral Caprinos',
      entryDate: new Date('2022-03-15'),
      entryReason: 'purchase',
      createdAt: new Date('2022-03-15'),
      updatedAt: new Date('2026-01-12'),
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
    species: data.species,
    category: data.category,
    breed: data.breed,
    birthDate: new Date(data.birthDate),
    gender: data.gender,
    weight: parseFloat(data.weight),
    status: data.status,
    location: data.location,
    motherId: data.motherId || undefined,
    motherTag: data.motherTag || undefined,
    fatherId: data.fatherId || undefined,
    fatherTag: data.fatherTag || undefined,
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
    species: data.species,
    category: data.category,
    breed: data.breed,
    birthDate: new Date(data.birthDate),
    gender: data.gender,
    weight: parseFloat(data.weight),
    status: data.status,
    location: data.location,
    motherId: data.motherId || undefined,
    motherTag: data.motherTag || undefined,
    fatherId: data.fatherId || undefined,
    fatherTag: data.fatherTag || undefined,
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

// ========================================
// Health Records CRUD
// ========================================

// Initial Health Records Data
const initialHealthRecords: HealthRecord[] = [
  {
    id: '1',
    livestockId: '1',
    livestockTag: 'BOV-001',
    date: new Date('2026-01-15'),
    type: 'vaccination',
    description: 'Vacuna contra fiebre aftosa',
    medication: 'Aftogan',
    dosage: '5ml',
    veterinarian: 'Dr. Garcia',
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
    veterinarian: 'Dr. Garcia',
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
    description: 'Desparasitacion rutinaria',
    medication: 'Ivermectina',
    dosage: '10ml',
    cost: 8000,
    createdAt: new Date('2026-01-08'),
    updatedAt: new Date('2026-01-08'),
  },
  {
    id: '4',
    livestockId: '2',
    livestockTag: 'BOV-002',
    date: new Date('2026-01-05'),
    type: 'treatment',
    description: 'Tratamiento por cojera leve',
    medication: 'Antiinflamatorio',
    veterinarian: 'Dr. Rodriguez',
    cost: 25000,
    notes: 'Mejoria notable despues de 3 dias',
    createdAt: new Date('2026-01-05'),
    updatedAt: new Date('2026-01-05'),
  },
  {
    id: '5',
    livestockId: '9',
    livestockTag: 'POR-001',
    date: new Date('2026-01-03'),
    type: 'vaccination',
    description: 'Vacuna contra peste porcina',
    medication: 'Pestivac',
    dosage: '2ml',
    veterinarian: 'Dr. Garcia',
    cost: 12000,
    createdAt: new Date('2026-01-03'),
    updatedAt: new Date('2026-01-03'),
  },
  {
    id: '6',
    livestockId: '15',
    livestockTag: 'CAP-001',
    date: new Date('2026-01-02'),
    type: 'deworming',
    description: 'Desparasitacion interna',
    medication: 'Albendazol',
    dosage: '5ml',
    cost: 5000,
    createdAt: new Date('2026-01-02'),
    updatedAt: new Date('2026-01-02'),
  },
];

// Initialize health records store
export const initializeHealthRecordsStore = () => {
  if (healthRecordsStore.length === 0) {
    healthRecordsStore = [...initialHealthRecords];
  }
};

// Get all Health Records
export const getMockHealthRecords = async (): Promise<HealthRecord[]> => {
  await delay(300);
  initializeHealthRecordsStore();
  return [...healthRecordsStore].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Get Health Records by Livestock ID
export const getMockHealthRecordsByLivestockId = async (livestockId: string): Promise<HealthRecord[]> => {
  await delay(300);
  initializeHealthRecordsStore();
  return healthRecordsStore
    .filter(hr => hr.livestockId === livestockId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Get single Health Record
export const getMockHealthRecordById = async (id: string): Promise<HealthRecord | undefined> => {
  await delay(200);
  initializeHealthRecordsStore();
  return healthRecordsStore.find(hr => hr.id === id);
};

// Create Health Record
export const createMockHealthRecord = async (data: HealthRecordFormData): Promise<HealthRecord> => {
  await delay(400);
  initializeHealthRecordsStore();
  const newRecord: HealthRecord = {
    id: String(Date.now()),
    livestockId: data.livestockId,
    livestockTag: data.livestockTag,
    date: new Date(data.date),
    type: data.type,
    description: data.description,
    medication: data.medication || undefined,
    dosage: data.dosage || undefined,
    veterinarian: data.veterinarian || undefined,
    cost: data.cost ? parseFloat(data.cost) : undefined,
    nextCheckup: data.nextCheckup ? new Date(data.nextCheckup) : undefined,
    notes: data.notes || undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  healthRecordsStore.push(newRecord);
  return newRecord;
};

// Update Health Record
export const updateMockHealthRecord = async (id: string, data: HealthRecordFormData): Promise<HealthRecord> => {
  await delay(400);
  initializeHealthRecordsStore();
  const index = healthRecordsStore.findIndex(hr => hr.id === id);
  if (index === -1) throw new Error('Health record not found');

  const existingRecord = healthRecordsStore[index];
  const updatedRecord: HealthRecord = {
    ...existingRecord,
    livestockId: data.livestockId,
    livestockTag: data.livestockTag,
    date: new Date(data.date),
    type: data.type,
    description: data.description,
    medication: data.medication || undefined,
    dosage: data.dosage || undefined,
    veterinarian: data.veterinarian || undefined,
    cost: data.cost ? parseFloat(data.cost) : undefined,
    nextCheckup: data.nextCheckup ? new Date(data.nextCheckup) : undefined,
    notes: data.notes || undefined,
    updatedAt: new Date(),
  };
  healthRecordsStore[index] = updatedRecord;
  return updatedRecord;
};

// Delete Health Record
export const deleteMockHealthRecord = async (id: string): Promise<void> => {
  await delay(300);
  initializeHealthRecordsStore();
  const index = healthRecordsStore.findIndex(hr => hr.id === id);
  if (index === -1) throw new Error('Health record not found');
  healthRecordsStore.splice(index, 1);
};

// Dashboard stats
export const getMockPecuarioStats = async (): Promise<PecuarioDashboardStats> => {
  await delay(300);
  return {
    totalLivestock: 78,
    bySpecies: {
      bovine: 48,
      porcine: 12,
      caprine: 8,
      buffalo: 0,
      equine: 0,
      ovine: 0,
      poultry: 10,
    },
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

// ========================================
// Group Health Actions CRUD
// ========================================

// Initial Group Health Actions Data
const initialGroupHealthActions: GroupHealthAction[] = [
  {
    id: '1',
    groupName: 'Vacas lecheras',
    species: 'bovine',
    category: 'vaca',
    affectedCount: 28,
    date: new Date('2026-01-15'),
    type: 'vaccination',
    description: 'Vacunacion contra fiebre aftosa',
    medication: 'Aftogan',
    performedBy: 'Dr. Garcia',
    cost: 420000,
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-15'),
  },
  {
    id: '2',
    groupName: 'Terneros',
    species: 'bovine',
    category: 'ternero',
    affectedCount: 14,
    date: new Date('2026-01-12'),
    type: 'deworming',
    description: 'Desparasitacion de crias',
    medication: 'Ivermectina',
    performedBy: 'Juan Perez',
    cost: 70000,
    createdAt: new Date('2026-01-12'),
    updatedAt: new Date('2026-01-12'),
  },
  {
    id: '3',
    species: 'bovine',
    category: 'novillo',
    affectedCount: 12,
    date: new Date('2026-01-08'),
    type: 'checkup',
    description: 'Control de peso y condicion corporal',
    performedBy: 'Maria Lopez',
    createdAt: new Date('2026-01-08'),
    updatedAt: new Date('2026-01-08'),
  },
  {
    id: '4',
    groupName: 'Porcinos adultos',
    species: 'porcine',
    affectedCount: 8,
    date: new Date('2026-01-05'),
    type: 'vaccination',
    description: 'Vacunacion contra peste porcina',
    medication: 'Pestivac',
    performedBy: 'Dr. Garcia',
    cost: 96000,
    createdAt: new Date('2026-01-05'),
    updatedAt: new Date('2026-01-05'),
  },
];

// Initialize group health actions store
export const initializeGroupHealthActionsStore = () => {
  if (groupHealthActionsStore.length === 0) {
    groupHealthActionsStore = [...initialGroupHealthActions];
  }
};

// Get all Group Health Actions
export const getMockGroupHealthActions = async (): Promise<GroupHealthAction[]> => {
  await delay(300);
  initializeGroupHealthActionsStore();
  return [...groupHealthActionsStore].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Get recent Group Health Actions (alias for backwards compatibility)
export const getMockRecentHealthActions = async (): Promise<GroupHealthAction[]> => {
  return getMockGroupHealthActions();
};

// Create Group Health Action
export const createMockGroupHealthAction = async (data: GroupHealthActionFormData): Promise<GroupHealthAction> => {
  await delay(400);
  initializeGroupHealthActionsStore();
  const newAction: GroupHealthAction = {
    id: String(Date.now()),
    groupId: data.groupId || undefined,
    groupName: data.groupName || undefined,
    species: data.species || undefined,
    category: data.category || undefined,
    affectedCount: parseInt(data.affectedCount),
    date: new Date(data.date),
    type: data.type,
    description: data.description,
    medication: data.medication || undefined,
    performedBy: data.performedBy,
    cost: data.cost ? parseFloat(data.cost) : undefined,
    notes: data.notes || undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  groupHealthActionsStore.push(newAction);
  return newAction;
};

// ========================================
// Reproduction Records CRUD
// ========================================

// Initial Reproduction Records Data
const initialReproductionRecords: ReproductionRecord[] = [
  {
    id: '1',
    cowId: '1',
    cowTag: 'BOV-001',
    bullId: '2',
    bullTag: 'BOV-002',
    type: 'natural',
    serviceDate: new Date('2025-09-15'),
    expectedBirthDate: new Date('2026-06-15'),
    status: 'confirmed',
    notes: 'Prenez confirmada por palpacion',
    createdAt: new Date('2025-09-15'),
    updatedAt: new Date('2025-11-20'),
  },
  {
    id: '2',
    cowId: '3',
    cowTag: 'BOV-003',
    type: 'artificial_insemination',
    serviceDate: new Date('2025-10-20'),
    expectedBirthDate: new Date('2026-07-20'),
    status: 'pending',
    notes: 'Semen importado de Holstein superior',
    createdAt: new Date('2025-10-20'),
    updatedAt: new Date('2025-10-20'),
  },
  {
    id: '3',
    cowId: '1',
    cowTag: 'BOV-001',
    bullId: '2',
    bullTag: 'BOV-002',
    type: 'natural',
    serviceDate: new Date('2025-02-10'),
    expectedBirthDate: new Date('2025-11-10'),
    actualBirthDate: new Date('2025-11-20'),
    status: 'born',
    calfId: '5',
    calfTag: 'BOV-005',
    notes: 'Parto normal, cria hembra saludable',
    createdAt: new Date('2025-02-10'),
    updatedAt: new Date('2025-11-20'),
  },
  {
    id: '4',
    cowId: '3',
    cowTag: 'BOV-003',
    type: 'artificial_insemination',
    serviceDate: new Date('2025-06-05'),
    status: 'failed',
    notes: 'No hubo prenez, se intentara nuevamente',
    createdAt: new Date('2025-06-05'),
    updatedAt: new Date('2025-07-10'),
  },
  {
    id: '5',
    cowId: '10',
    cowTag: 'POR-002',
    bullId: '9',
    bullTag: 'POR-001',
    type: 'natural',
    serviceDate: new Date('2025-08-15'),
    expectedBirthDate: new Date('2025-12-15'),
    actualBirthDate: new Date('2025-12-15'),
    status: 'born',
    calfId: '11',
    calfTag: 'POR-003',
    notes: 'Camada de 8 lechones',
    createdAt: new Date('2025-08-15'),
    updatedAt: new Date('2025-12-15'),
  },
];

// Initialize reproduction records store
export const initializeReproductionRecordsStore = () => {
  if (reproductionRecordsStore.length === 0) {
    reproductionRecordsStore = [...initialReproductionRecords];
  }
};

// Get all Reproduction Records
export const getMockReproductionRecords = async (): Promise<ReproductionRecord[]> => {
  await delay(300);
  initializeReproductionRecordsStore();
  return [...reproductionRecordsStore].sort((a, b) =>
    new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime()
  );
};

// Get Reproduction Records by Livestock ID
export const getMockReproductionRecordsByLivestockId = async (livestockId: string): Promise<ReproductionRecord[]> => {
  await delay(300);
  initializeReproductionRecordsStore();
  return reproductionRecordsStore
    .filter(rr => rr.cowId === livestockId || rr.bullId === livestockId)
    .sort((a, b) => new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime());
};

// Get single Reproduction Record
export const getMockReproductionRecordById = async (id: string): Promise<ReproductionRecord | undefined> => {
  await delay(200);
  initializeReproductionRecordsStore();
  return reproductionRecordsStore.find(rr => rr.id === id);
};

// Create Reproduction Record
export const createMockReproductionRecord = async (data: ReproductionRecordFormData): Promise<ReproductionRecord> => {
  await delay(400);
  initializeReproductionRecordsStore();
  const newRecord: ReproductionRecord = {
    id: String(Date.now()),
    cowId: data.cowId,
    cowTag: data.cowTag,
    bullId: data.bullId || undefined,
    bullTag: data.bullTag || undefined,
    type: data.type,
    serviceDate: new Date(data.serviceDate),
    expectedBirthDate: data.expectedBirthDate ? new Date(data.expectedBirthDate) : undefined,
    actualBirthDate: data.actualBirthDate ? new Date(data.actualBirthDate) : undefined,
    status: data.status,
    calfId: data.calfId || undefined,
    calfTag: data.calfTag || undefined,
    notes: data.notes || undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  reproductionRecordsStore.push(newRecord);
  return newRecord;
};

// Update Reproduction Record
export const updateMockReproductionRecord = async (id: string, data: ReproductionRecordFormData): Promise<ReproductionRecord> => {
  await delay(400);
  initializeReproductionRecordsStore();
  const index = reproductionRecordsStore.findIndex(rr => rr.id === id);
  if (index === -1) throw new Error('Reproduction record not found');

  const existingRecord = reproductionRecordsStore[index];
  const updatedRecord: ReproductionRecord = {
    ...existingRecord,
    cowId: data.cowId,
    cowTag: data.cowTag,
    bullId: data.bullId || undefined,
    bullTag: data.bullTag || undefined,
    type: data.type,
    serviceDate: new Date(data.serviceDate),
    expectedBirthDate: data.expectedBirthDate ? new Date(data.expectedBirthDate) : undefined,
    actualBirthDate: data.actualBirthDate ? new Date(data.actualBirthDate) : undefined,
    status: data.status,
    calfId: data.calfId || undefined,
    calfTag: data.calfTag || undefined,
    notes: data.notes || undefined,
    updatedAt: new Date(),
  };
  reproductionRecordsStore[index] = updatedRecord;
  return updatedRecord;
};

// Delete Reproduction Record
export const deleteMockReproductionRecord = async (id: string): Promise<void> => {
  await delay(300);
  initializeReproductionRecordsStore();
  const index = reproductionRecordsStore.findIndex(rr => rr.id === id);
  if (index === -1) throw new Error('Reproduction record not found');
  reproductionRecordsStore.splice(index, 1);
};

// ========================================
// Milk Production CRUD
// ========================================

// Generate initial milk production data for the last 30 days
const generateInitialMilkProduction = (): MilkProduction[] => {
  const data: MilkProduction[] = [];
  const today = new Date();

  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Morning shift
    const morningLiters = 120 + Math.floor(Math.random() * 40); // 120-160 liters
    const morningCows = 28;
    data.push({
      id: `milk-m-${i}`,
      date: new Date(date.setHours(6, 0, 0, 0)),
      shift: 'morning',
      totalLiters: morningLiters,
      cowsMilked: morningCows,
      avgPerCow: parseFloat((morningLiters / morningCows).toFixed(2)),
      temperature: 4 + Math.random() * 2,
      quality: Math.random() > 0.2 ? 'A' : 'B',
      destination: 'sale',
      createdAt: new Date(date),
      updatedAt: new Date(date),
    });

    // Afternoon shift
    const afternoonLiters = 100 + Math.floor(Math.random() * 30); // 100-130 liters
    const afternoonCows = 28;
    data.push({
      id: `milk-a-${i}`,
      date: new Date(date.setHours(16, 0, 0, 0)),
      shift: 'afternoon',
      totalLiters: afternoonLiters,
      cowsMilked: afternoonCows,
      avgPerCow: parseFloat((afternoonLiters / afternoonCows).toFixed(2)),
      temperature: 4 + Math.random() * 2,
      quality: Math.random() > 0.3 ? 'A' : 'B',
      destination: 'sale',
      createdAt: new Date(date),
      updatedAt: new Date(date),
    });
  }

  return data;
};

const initialMilkProduction = generateInitialMilkProduction();

// Initialize milk production store
export const initializeMilkProductionStore = () => {
  if (milkProductionStore.length === 0) {
    milkProductionStore = [...initialMilkProduction];
  }
};

// Get all Milk Production records
export const getMockMilkProduction = async (): Promise<MilkProduction[]> => {
  await delay(300);
  initializeMilkProductionStore();
  return [...milkProductionStore].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

// Get Milk Production by date range
export const getMockMilkProductionByDateRange = async (startDate: Date, endDate: Date): Promise<MilkProduction[]> => {
  await delay(300);
  initializeMilkProductionStore();
  return milkProductionStore
    .filter(mp => {
      const date = new Date(mp.date);
      return date >= startDate && date <= endDate;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Get single Milk Production record
export const getMockMilkProductionById = async (id: string): Promise<MilkProduction | undefined> => {
  await delay(200);
  initializeMilkProductionStore();
  return milkProductionStore.find(mp => mp.id === id);
};

// Create Milk Production record
export const createMockMilkProduction = async (data: MilkProductionFormData): Promise<MilkProduction> => {
  await delay(400);
  initializeMilkProductionStore();

  const totalLiters = parseFloat(data.totalLiters);
  const cowsMilked = parseInt(data.cowsMilked);
  const avgPerCow = data.avgPerCow ? parseFloat(data.avgPerCow) : parseFloat((totalLiters / cowsMilked).toFixed(2));

  const newRecord: MilkProduction = {
    id: String(Date.now()),
    date: new Date(data.date),
    shift: data.shift,
    totalLiters,
    cowsMilked,
    avgPerCow,
    temperature: data.temperature ? parseFloat(data.temperature) : undefined,
    quality: data.quality || undefined,
    destination: data.destination || undefined,
    notes: data.notes || undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  milkProductionStore.push(newRecord);
  return newRecord;
};

// Update Milk Production record
export const updateMockMilkProduction = async (id: string, data: MilkProductionFormData): Promise<MilkProduction> => {
  await delay(400);
  initializeMilkProductionStore();
  const index = milkProductionStore.findIndex(mp => mp.id === id);
  if (index === -1) throw new Error('Milk production record not found');

  const existingRecord = milkProductionStore[index];
  const totalLiters = parseFloat(data.totalLiters);
  const cowsMilked = parseInt(data.cowsMilked);
  const avgPerCow = data.avgPerCow ? parseFloat(data.avgPerCow) : parseFloat((totalLiters / cowsMilked).toFixed(2));

  const updatedRecord: MilkProduction = {
    ...existingRecord,
    date: new Date(data.date),
    shift: data.shift,
    totalLiters,
    cowsMilked,
    avgPerCow,
    temperature: data.temperature ? parseFloat(data.temperature) : undefined,
    quality: data.quality || undefined,
    destination: data.destination || undefined,
    notes: data.notes || undefined,
    updatedAt: new Date(),
  };
  milkProductionStore[index] = updatedRecord;
  return updatedRecord;
};

// Delete Milk Production record
export const deleteMockMilkProduction = async (id: string): Promise<void> => {
  await delay(300);
  initializeMilkProductionStore();
  const index = milkProductionStore.findIndex(mp => mp.id === id);
  if (index === -1) throw new Error('Milk production record not found');
  milkProductionStore.splice(index, 1);
};

// ========================================
// Livestock Groups CRUD
// ========================================

// Initial Livestock Groups Data
const initialLivestockGroups: LivestockGroup[] = [
  {
    id: 'grp-1',
    name: 'Vacas lecheras',
    species: 'bovine',
    category: 'vaca',
    count: 28,
    location: 'Potrero Norte',
    description: 'Grupo principal de vacas en produccion lechera',
    createdAt: new Date('2025-06-01'),
    updatedAt: new Date('2026-01-15'),
  },
  {
    id: 'grp-2',
    name: 'Novillas de cria',
    species: 'bovine',
    category: 'novilla',
    count: 10,
    location: 'Potrero Central',
    description: 'Novillas seleccionadas para programa de cria',
    createdAt: new Date('2025-08-10'),
    updatedAt: new Date('2026-01-10'),
  },
  {
    id: 'grp-3',
    name: 'Terneros destete',
    species: 'bovine',
    category: 'ternero',
    count: 8,
    location: 'Corral de Crias',
    description: 'Terneros en proceso de destete, 3-6 meses de edad',
    createdAt: new Date('2025-10-01'),
    updatedAt: new Date('2026-01-12'),
  },
  {
    id: 'grp-4',
    name: 'Novillos engorde',
    species: 'bovine',
    category: 'novillo',
    count: 12,
    location: 'Potrero Sur',
    description: 'Novillos en etapa de engorde para venta',
    createdAt: new Date('2025-07-15'),
    updatedAt: new Date('2026-01-08'),
  },
  {
    id: 'grp-5',
    name: 'Cerdas reproductoras',
    species: 'porcine',
    category: 'cerda',
    count: 6,
    location: 'Corral Porcinos',
    description: 'Cerdas activas en programa de reproduccion',
    createdAt: new Date('2025-09-01'),
    updatedAt: new Date('2026-01-05'),
  },
  {
    id: 'grp-6',
    name: 'Gallinas ponedoras',
    species: 'poultry',
    category: 'gallina',
    count: 45,
    location: 'Gallinero Principal',
    description: 'Gallinas en produccion de huevos',
    createdAt: new Date('2025-06-15'),
    updatedAt: new Date('2026-01-14'),
  },
  {
    id: 'grp-7',
    name: 'Cabras lecheras',
    species: 'caprine',
    category: 'cabra',
    count: 8,
    location: 'Corral Caprinos',
    description: 'Cabras Saanen para produccion de leche',
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2026-01-10'),
  },
];

// Initialize livestock groups store
export const initializeLivestockGroupsStore = () => {
  if (livestockGroupsStore.length === 0) {
    livestockGroupsStore = [...initialLivestockGroups];
  }
};

// Get all Livestock Groups
export const getMockLivestockGroups = async (): Promise<LivestockGroup[]> => {
  await delay(300);
  initializeLivestockGroupsStore();
  return [...livestockGroupsStore].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
};

// Get single Livestock Group
export const getMockLivestockGroupById = async (id: string): Promise<LivestockGroup | undefined> => {
  await delay(200);
  initializeLivestockGroupsStore();
  return livestockGroupsStore.find(g => g.id === id);
};

// Get Livestock Groups by Species
export const getMockLivestockGroupsBySpecies = async (species: LivestockSpecies): Promise<LivestockGroup[]> => {
  await delay(300);
  initializeLivestockGroupsStore();
  return livestockGroupsStore
    .filter(g => g.species === species)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
};

// Create Livestock Group
export const createMockLivestockGroup = async (data: LivestockGroupFormData): Promise<LivestockGroup> => {
  await delay(400);
  initializeLivestockGroupsStore();
  const newGroup: LivestockGroup = {
    id: String(Date.now()),
    name: data.name,
    species: data.species,
    category: data.category,
    count: parseInt(data.count),
    location: data.location,
    description: data.description || undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  livestockGroupsStore.push(newGroup);
  return newGroup;
};

// Update Livestock Group
export const updateMockLivestockGroup = async (id: string, data: LivestockGroupFormData): Promise<LivestockGroup> => {
  await delay(400);
  initializeLivestockGroupsStore();
  const index = livestockGroupsStore.findIndex(g => g.id === id);
  if (index === -1) throw new Error('Livestock group not found');

  const existingGroup = livestockGroupsStore[index];
  const updatedGroup: LivestockGroup = {
    ...existingGroup,
    name: data.name,
    species: data.species,
    category: data.category,
    count: parseInt(data.count),
    location: data.location,
    description: data.description || undefined,
    updatedAt: new Date(),
  };
  livestockGroupsStore[index] = updatedGroup;
  return updatedGroup;
};

// Delete Livestock Group
export const deleteMockLivestockGroup = async (id: string): Promise<void> => {
  await delay(300);
  initializeLivestockGroupsStore();
  const index = livestockGroupsStore.findIndex(g => g.id === id);
  if (index === -1) throw new Error('Livestock group not found');
  livestockGroupsStore.splice(index, 1);
};

// ========================================
// Dashboard Stats (Enhanced)
// ========================================

export const getMockPecuarioDashboardStats = async (): Promise<PecuarioDashboardStats> => {
  await delay(300);
  initializeLivestockStore();
  initializeMilkProductionStore();
  initializeReproductionRecordsStore();
  initializePotrerosStore();

  // Calculate real stats from stores
  const activeLivestock = livestockStore.filter(l => l.status === 'active');
  const totalLivestock = activeLivestock.length;

  const bySpecies = {
    bovine: activeLivestock.filter(l => l.species === 'bovine').length,
    porcine: activeLivestock.filter(l => l.species === 'porcine').length,
    caprine: activeLivestock.filter(l => l.species === 'caprine').length,
    buffalo: activeLivestock.filter(l => l.species === 'buffalo').length,
    equine: activeLivestock.filter(l => l.species === 'equine').length,
    ovine: activeLivestock.filter(l => l.species === 'ovine').length,
    poultry: activeLivestock.filter(l => l.species === 'poultry').length,
  };

  const bovines = activeLivestock.filter(l => l.species === 'bovine');
  const byCategory = {
    terneros: bovines.filter(l => l.category === 'ternero').length,
    terneras: bovines.filter(l => l.category === 'ternera').length,
    novillos: bovines.filter(l => l.category === 'novillo').length,
    novillas: bovines.filter(l => l.category === 'novilla').length,
    vacas: bovines.filter(l => l.category === 'vaca').length,
    toros: bovines.filter(l => l.category === 'toro').length,
  };

  // Calculate monthly milk production
  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);
  const monthlyMilk = milkProductionStore
    .filter(mp => new Date(mp.date) >= thisMonth)
    .reduce((sum, mp) => sum + mp.totalLiters, 0);

  // Active potreros
  const activePotreros = potrerosStore.filter(p => p.status === 'active').length;

  // Recent births (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentBirths = reproductionRecordsStore.filter(
    rr => rr.status === 'born' && rr.actualBirthDate && new Date(rr.actualBirthDate) >= thirtyDaysAgo
  ).length;

  return {
    totalLivestock,
    bySpecies,
    byCategory,
    healthyPercentage: 94,
    pendingHealthActions: 5,
    monthlyMilkProduction: Math.round(monthlyMilk),
    activePotrerosCount: activePotreros,
    recentBirths,
    pendingSales: 3,
  };
};

// Production data for charts (Enhanced)
export const getMockPecuarioProductionData = async (): Promise<PecuarioProductionData[]> => {
  await delay(300);
  initializeMilkProductionStore();
  initializeReproductionRecordsStore();

  // Generate data for the last 6 months
  const data: PecuarioProductionData[] = [];
  const months = ['Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene'];

  for (let i = 0; i < 6; i++) {
    const monthDate = new Date();
    monthDate.setMonth(monthDate.getMonth() - (5 - i));
    const startOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const endOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

    // Calculate milk production for this month
    const monthMilk = milkProductionStore
      .filter(mp => {
        const date = new Date(mp.date);
        return date >= startOfMonth && date <= endOfMonth;
      })
      .reduce((sum, mp) => sum + mp.totalLiters, 0);

    // Calculate births for this month
    const monthBirths = reproductionRecordsStore.filter(rr => {
      if (!rr.actualBirthDate) return false;
      const date = new Date(rr.actualBirthDate);
      return date >= startOfMonth && date <= endOfMonth;
    }).length;

    data.push({
      month: months[i],
      milk: Math.round(monthMilk) || (3800 + Math.floor(Math.random() * 600)),
      births: monthBirths || Math.floor(Math.random() * 4) + 1,
      sales: Math.floor(Math.random() * 4) + 1,
      weight: 425 + Math.floor(Math.random() * 15),
    });
  }

  return data;
};
