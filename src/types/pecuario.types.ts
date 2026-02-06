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
  fincaId: string;
  tag: string; // Identificador único (arete)
  name?: string;
  species: LivestockSpecies; // NUEVO: Especie del animal
  category: LivestockCategory;
  breed: string;
  birthDate: Date;
  gender: 'male' | 'female';
  weight: number;
  status: 'active' | 'sold' | 'deceased' | 'transferred';
  location: {
    potreroId: string;
    potreroName: string;
  };
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
  fincaId: string;
  name: string;
  species: LivestockSpecies;
  category?: LivestockCategory;       // Opcional: puede ser grupo mixto de categorías
  memberIds: string[];                // Lista de IDs de animales incluidos
  memberTags: string[];               // Lista de aretes/tags para referencia rápida
  count: number;                      // Cantidad (derivado de memberIds.length)
  location?: {                        // Ubicación actual (consistente con Livestock)
    potreroId: string;
    potreroName: string;
  };
  status: 'active' | 'inactive';      // Para desactivar grupos
  description?: string;               // Observaciones
}

// Registro de salud
export interface HealthRecord extends BaseEntity {
  fincaId: string;
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
  fincaId: string;
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
  fincaId: string;
  name: string;
  code?: string;                      // Identificador/código opcional
  divisionId: string;                 // Referencia a Division de finca.types.ts
  divisionName?: string;              // Nombre de la división
  area: number;                       // hectáreas
  capacity: number;                   // cabezas de ganado
  currentOccupancy: number;
  currentGroupId?: string;            // Grupo actualmente asignado
  currentGroupName?: string;
  status: 'active' | 'inactive' | 'resting' | 'maintenance';
  grassType?: string;
  waterSource?: boolean;              // Tiene fuente de agua
  shade?: boolean;                    // Tiene sombra
  lastRotation?: Date;
  nextRotation?: Date;
  // Campos para cálculo de descanso
  lastOccupancyEntryDate?: Date;      // Última fecha de entrada de grupo
  lastOccupancyExitDate?: Date;       // Última fecha de salida de grupo
  notes?: string;
}

// ==================== ASIGNACIÓN DE GRUPOS A POTREROS ====================

// Asignación de grupo a potrero (historial de ocupaciones)
export interface PotreroAssignment extends BaseEntity {
  fincaId: string;
  potreroId: string;
  potreroName: string;
  groupId: string;
  groupName: string;
  entryDate: Date;                    // Fecha de entrada al potrero
  exitDate?: Date;                    // Fecha de salida (null si aún está ocupado)
  animalCount: number;                // Cantidad de animales al momento de entrada
  status: 'active' | 'completed';     // active = grupo aún en potrero
  exitReason?: 'rotation' | 'sale' | 'health' | 'other';
  notes?: string;
}

// Cálculo de descanso del potrero (tipo auxiliar para UI)
export interface PotreroRestInfo {
  potreroId: string;
  potreroName: string;
  isOccupied: boolean;
  // Si está ocupado
  currentGroupId?: string;
  currentGroupName?: string;
  occupancyStartDate?: Date;
  daysOccupied?: number;
  // Si está en descanso
  lastExitDate?: Date;
  daysSinceLastExit?: number;
  // Recomendación
  recommendedRestDays?: number;
  restStatus?: 'adequate' | 'insufficient' | 'extended';
}

// Historial de ocupación para reportes
export interface PotreroOccupancyHistory {
  potreroId: string;
  potreroName: string;
  assignments: PotreroAssignment[];
  totalOccupancyDays: number;
  totalRestDays: number;
  averageOccupancyDuration: number;
  rotationCount: number;
}

// Reproducción
export interface ReproductionRecord extends BaseEntity {
  fincaId: string;
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
  fincaId: string;
  date: Date;
  shift: 'morning' | 'afternoon';
  totalLiters: number;
  cowsMilked: number;
  avgPerCow: number;
  producingLivestockIds?: string[];  // IDs de animales productores (trazabilidad individual)
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
  // Estadísticas de apicultura
  appiaryStats?: {
    totalBeehives: number;
    activeBeehives: number;
    totalApiaries: number;
    monthlyHoneyProduction: number;
    pendingInspections: number;
  };
}

// Datos de producción para gráficos
export interface PecuarioProductionData {
  month: string;
  milk: number; // litros
  honey: number; // kg de miel
  births: number;
  sales: number;
  weight: number; // peso promedio
}

// Tarea pendiente
export interface PecuarioTask {
  id: string;
  title: string;
  type: 'health' | 'reproduction' | 'rotation' | 'sale' | 'checkup' | 'beehive_inspection' | 'harvest' | 'beehive_treatment';
  livestockTag?: string;
  beehiveCode?: string;      // Para tareas de colmenas
  potreroName?: string;
  apiaryName?: string;       // Para tareas de apiarios
  description?: string;
  dueDate: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
}

// Movimiento de ganado (entrada/salida)
export interface LivestockMovement extends BaseEntity {
  fincaId: string;
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

// ==================== APICULTURA / COLMENAS ====================

// Estado de la colmena
export type BeehiveStatus = 'active' | 'inactive' | 'dead' | 'sold' | 'merged';

// Tipo de colmena
export type BeehiveType = 'langstroth' | 'top_bar' | 'warre' | 'traditional' | 'other';

// Estado de la reina
export type QueenStatus = 'present' | 'absent' | 'virgin' | 'laying' | 'unknown';

// Temperamento de la colmena
export type BeehiveTemperament = 'calm' | 'moderate' | 'aggressive';

// Colmena individual (RP03 - Inventario e Identificación)
export interface Beehive extends BaseEntity {
  fincaId: string;
  // Identificación (equivalente a arete en animales)
  code: string;              // Código/identificador único de la colmena
  name?: string;             // Nombre opcional

  // Ubicación
  apiaryId: string;          // Referencia a Division de tipo 'apiario'
  apiaryName: string;        // Nombre del apiario
  position?: string;         // Posición dentro del apiario (ej: "Fila 2, #5")

  // Características
  type: BeehiveType;         // Tipo de colmena
  frameCount: number;        // Número de cuadros/marcos
  hasQueenExcluder: boolean; // Tiene excluidor de reina
  superCount: number;        // Número de alzas

  // Estado de la colmena
  status: BeehiveStatus;
  strength: 'weak' | 'medium' | 'strong'; // Fortaleza de la colonia
  temperament: BeehiveTemperament;

  // Reina
  queenStatus: QueenStatus;
  queenMarked: boolean;      // Reina marcada
  queenColor?: string;       // Color de marca (año)
  queenAge?: number;         // Edad en años
  queenOrigin?: 'swarm' | 'purchased' | 'raised' | 'unknown';

  // Trazabilidad
  installationDate: Date;    // Fecha de instalación/entrada
  entryReason: 'purchase' | 'swarm_capture' | 'split' | 'transfer' | 'nucleus';
  parentHiveId?: string;     // ID de colmena madre (si fue división)
  parentHiveCode?: string;   // Código de colmena madre

  // Salida (cuando aplique)
  exitDate?: Date;
  exitReason?: 'sale' | 'death' | 'merge' | 'transfer' | 'absconded';

  // Información adicional
  notes?: string;
  imageUrl?: string;

  // Última inspección (resumen rápido)
  lastInspectionDate?: Date;
  lastHarvestDate?: Date;
}

// Registro de salud de colmenas (RP02 - Sanidad)
export interface BeehiveHealthRecord extends BaseEntity {
  fincaId: string;
  beehiveId: string;
  beehiveCode: string;
  date: Date;
  type: 'treatment' | 'inspection' | 'disease_detected' | 'pest_control' | 'feeding';

  // Detalles del tratamiento/inspección
  description: string;

  // Para tratamientos
  treatment?: string;        // Nombre del tratamiento
  dosage?: string;           // Dosis aplicada
  applicationMethod?: string; // Método de aplicación
  withdrawalPeriod?: number; // Días de retiro (antes de cosechar)

  // Para inspecciones
  broodPattern?: 'excellent' | 'good' | 'fair' | 'poor'; // Patrón de cría
  queenSeen?: boolean;
  eggsPresent?: boolean;
  larvaePresent?: boolean;
  honeyStores?: 'abundant' | 'adequate' | 'low' | 'critical';
  pollenStores?: 'abundant' | 'adequate' | 'low' | 'critical';

  // Enfermedades/plagas detectadas
  diseaseDetected?: string;  // Ej: "Varroa", "Nosema", "Loque"
  pestDetected?: string;     // Ej: "Polilla", "Hormigas"
  infestationLevel?: 'low' | 'medium' | 'high' | 'critical';

  // Alimentación
  feedType?: string;         // Tipo de alimento (jarabe, candy, etc.)
  feedQuantity?: number;     // Cantidad
  feedUnit?: string;         // Unidad (kg, litros)

  performedBy: string;
  cost?: number;
  nextActionDate?: Date;
  notes?: string;
}

// Eventos reproductivos de colmenas (RP04 - Reproducción)
export interface BeehiveReproductionRecord extends BaseEntity {
  fincaId: string;
  beehiveId: string;
  beehiveCode: string;
  date: Date;
  type: 'swarm' | 'split' | 'queen_replacement' | 'merge' | 'requeen';

  // Para enjambrazón natural
  swarmCaptured?: boolean;
  newHiveId?: string;        // ID de la nueva colmena (si se capturó)
  newHiveCode?: string;

  // Para división artificial
  splitMethod?: 'walk_away' | 'nucleus' | 'vertical';
  newQueenSource?: 'cell' | 'purchased' | 'raised';

  // Para reemplazo de reina
  oldQueenFate?: 'removed' | 'dead' | 'unknown';
  newQueenOrigin?: 'purchased' | 'raised' | 'swarm_cell';
  newQueenMarked?: boolean;
  newQueenColor?: string;

  // Para fusión de colmenas
  mergedWithHiveId?: string;
  mergedWithHiveCode?: string;
  mergeReason?: 'weak_colony' | 'queenless' | 'disease' | 'other';

  status: 'pending' | 'successful' | 'failed';
  performedBy?: string;
  notes?: string;
}

// Producción de miel y otros productos
export interface HoneyProduction extends BaseEntity {
  fincaId: string;
  beehiveId?: string;        // Opcional: puede ser por apiario completo
  beehiveCode?: string;
  apiaryId: string;
  apiaryName: string;

  harvestDate: Date;
  productType: 'honey' | 'wax' | 'propolis' | 'pollen' | 'royal_jelly';

  // Cantidades
  grossQuantity: number;     // Cantidad bruta
  netQuantity: number;       // Cantidad neta (después de procesamiento)
  unit: 'kg' | 'liters' | 'grams';

  // Calidad (para miel)
  honeyType?: string;        // Tipo de miel (multifloral, específica)
  moistureContent?: number;  // Porcentaje de humedad
  color?: 'water_white' | 'extra_white' | 'white' | 'extra_light_amber' | 'light_amber' | 'amber' | 'dark_amber';
  quality?: 'A' | 'B' | 'C';

  // Destino
  destination: 'sale' | 'processing' | 'personal_use';

  // Precio (si es venta directa)
  pricePerUnit?: number;
  totalValue?: number;

  performedBy?: string;
  notes?: string;
}

// Acción grupal para colmenas (similar a GroupHealthAction)
export interface GroupBeehiveAction extends BaseEntity {
  fincaId: string;
  apiaryId: string;
  apiaryName: string;
  affectedCount: number;     // Número de colmenas afectadas
  date: Date;
  type: 'treatment' | 'feeding' | 'inspection' | 'harvest';
  description: string;

  // Para tratamientos grupales
  treatment?: string;
  dosage?: string;

  // Para alimentación grupal
  feedType?: string;
  feedQuantityPerHive?: number;
  feedUnit?: string;

  performedBy: string;
  cost?: number;
  notes?: string;
}

// Stats del apiario para dashboard
export interface ApiaryStats {
  totalBeehives: number;
  activeBeehives: number;
  byStrength: {
    strong: number;
    medium: number;
    weak: number;
  };
  byStatus: {
    active: number;
    inactive: number;
    dead: number;
  };
  queensPresent: number;
  pendingInspections: number;
  monthlyHoneyProduction: number; // kg
  recentSwarms: number;
}
