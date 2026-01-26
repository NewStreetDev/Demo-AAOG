import type { BaseEntity } from './common.types';

// Especies de ganado según documento de requisitos
export type LivestockSpecies =
  | 'bovine'    // Bovinos (con seguimiento de padres)
  | 'porcine'   // Porcinos (con seguimiento de padres)
  | 'caprine'   // Caprinos (con seguimiento de padres)
  | 'buffalo'   // Bufalinos (con seguimiento de padres)
  | 'equine'    // Equinos (con seguimiento de padres)
  | 'ovine'     // Ovinos (con seguimiento de padres)
  | 'poultry';  // Aves (SIN seguimiento de padres)

// Categorías de ganado - ahora dinámicas por especie
export type LivestockCategory =
  // Bovinos
  | 'ternero' | 'ternera' | 'novillo' | 'novilla' | 'vaca' | 'toro'
  // Porcinos
  | 'lechon' | 'lechona' | 'cerdo' | 'cerda' | 'verraco'
  // Caprinos
  | 'cabrito' | 'cabrita' | 'chivo' | 'cabra' | 'semental_caprino'
  // Bufalinos
  | 'bucerro' | 'bucerra' | 'bubillo' | 'bubilla' | 'bufala' | 'bufalo'
  // Equinos
  | 'potro' | 'potra' | 'caballo' | 'yegua' | 'semental_equino'
  // Ovinos
  | 'cordero' | 'cordera' | 'borrego' | 'oveja' | 'carnero'
  // Aves
  | 'gallina' | 'gallo' | 'pollo' | 'chompipe' | 'pato' | 'pata' | 'ave_otro';

// Mapeo de categorías por especie (para validación y UI)
export const categoriesBySpecies: Record<LivestockSpecies, LivestockCategory[]> = {
  bovine: ['ternero', 'ternera', 'novillo', 'novilla', 'vaca', 'toro'],
  porcine: ['lechon', 'lechona', 'cerdo', 'cerda', 'verraco'],
  caprine: ['cabrito', 'cabrita', 'chivo', 'cabra', 'semental_caprino'],
  buffalo: ['bucerro', 'bucerra', 'bubillo', 'bubilla', 'bufala', 'bufalo'],
  equine: ['potro', 'potra', 'caballo', 'yegua', 'semental_equino'],
  ovine: ['cordero', 'cordera', 'borrego', 'oveja', 'carnero'],
  poultry: ['gallina', 'gallo', 'pollo', 'chompipe', 'pato', 'pata', 'ave_otro'],
};

// Especies que requieren seguimiento de padres
export const speciesWithParentTracking: LivestockSpecies[] = [
  'bovine', 'porcine', 'caprine', 'buffalo', 'equine', 'ovine'
];

// Verificar si una especie requiere seguimiento de padres
export const requiresParentTracking = (species: LivestockSpecies): boolean => {
  return speciesWithParentTracking.includes(species);
};

// Ganado individual
export interface Livestock extends BaseEntity {
  tag: string; // Identificador único (arete)
  name?: string;
  species: LivestockSpecies; // NUEVO: Especie del animal
  category: LivestockCategory;
  breed: string;
  birthDate: Date;
  gender: 'male' | 'female';
  weight: number;
  status: 'active' | 'sold' | 'deceased' | 'transferred';
  location: string; // Potrero o ubicación
  // Seguimiento de padres (solo para especies que lo requieren)
  motherId?: string;
  fatherId?: string;
  motherTag?: string;
  fatherTag?: string;
  entryDate: Date;
  entryReason: 'birth' | 'purchase' | 'transfer';
  exitDate?: Date;
  exitReason?: 'sale' | 'death' | 'transfer' | 'slaughter';
  notes?: string;
  imageUrl?: string;
}

// Grupo de ganado
export interface LivestockGroup extends BaseEntity {
  name: string;
  species: LivestockSpecies;
  category: LivestockCategory;
  count: number;
  location: string;
  description?: string;
}

// Registro de salud
export interface HealthRecord extends BaseEntity {
  livestockId: string;
  livestockTag: string;
  date: Date;
  type: 'vaccination' | 'treatment' | 'checkup' | 'deworming' | 'surgery';
  description: string;
  medication?: string;
  dosage?: string;
  veterinarian?: string;
  cost?: number;
  nextCheckup?: Date;
  notes?: string;
}

// Acción de grupo (salud animal)
export interface GroupHealthAction extends BaseEntity {
  groupId?: string;
  groupName?: string;
  species?: LivestockSpecies;
  category?: LivestockCategory;
  affectedCount: number;
  date: Date;
  type: 'vaccination' | 'treatment' | 'deworming' | 'checkup';
  description: string;
  medication?: string;
  performedBy: string;
  cost?: number;
  notes?: string;
}

// Potrero
export interface Potrero extends BaseEntity {
  name: string;
  area: number; // hectáreas
  capacity: number; // cabezas de ganado
  currentOccupancy: number;
  status: 'active' | 'resting' | 'maintenance';
  grassType?: string;
  lastRotation?: Date;
  nextRotation?: Date;
  notes?: string;
}

// Reproducción
export interface ReproductionRecord extends BaseEntity {
  cowId: string;
  cowTag: string;
  bullId?: string;
  bullTag?: string;
  type: 'natural' | 'artificial_insemination';
  serviceDate: Date;
  expectedBirthDate?: Date;
  actualBirthDate?: Date;
  status: 'pending' | 'confirmed' | 'failed' | 'born';
  calfId?: string;
  calfTag?: string;
  notes?: string;
}

// Producción de leche
export interface MilkProduction extends BaseEntity {
  date: Date;
  shift: 'morning' | 'afternoon';
  totalLiters: number;
  cowsMilked: number;
  avgPerCow: number;
  temperature?: number;
  quality?: 'A' | 'B' | 'C';
  destination?: 'sale' | 'processing' | 'calves';
  notes?: string;
}

// Dashboard stats
export interface PecuarioDashboardStats {
  totalLivestock: number;
  bySpecies: {
    bovine: number;
    porcine: number;
    caprine: number;
    buffalo: number;
    equine: number;
    ovine: number;
    poultry: number;
  };
  // Mantenemos byCategory para compatibilidad (bovinos)
  byCategory: {
    terneros: number;
    terneras: number;
    novillos: number;
    novillas: number;
    vacas: number;
    toros: number;
  };
  healthyPercentage: number;
  pendingHealthActions: number;
  monthlyMilkProduction: number;
  activePotrerosCount: number;
  recentBirths: number;
  pendingSales: number;
}

// Datos de producción para gráficos
export interface PecuarioProductionData {
  month: string;
  milk: number; // litros
  births: number;
  sales: number;
  weight: number; // peso promedio
}

// Tarea pendiente
export interface PecuarioTask {
  id: string;
  title: string;
  type: 'health' | 'reproduction' | 'rotation' | 'sale' | 'checkup';
  livestockTag?: string;
  potreroName?: string;
  dueDate: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
}

// Movimiento de ganado (entrada/salida)
export interface LivestockMovement extends BaseEntity {
  livestockId: string;
  livestockTag: string;
  type: 'entry' | 'exit';
  reason: 'birth' | 'purchase' | 'transfer' | 'sale' | 'death' | 'slaughter';
  date: Date;
  fromLocation?: string;
  toLocation?: string;
  price?: number;
  buyer?: string;
  seller?: string;
  notes?: string;
}

// Distribución por categoría para gráficos
export interface CategoryDistribution {
  category: string;
  count: number;
  color: string;
}
