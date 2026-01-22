import type { BaseEntity } from './common.types';

// Tipo de producto agrícola
export type ProductType = 'primary' | 'secondary';

// Estado del cultivo
export type CropStatus = 'planned' | 'planted' | 'growing' | 'flowering' | 'fruiting' | 'ready' | 'harvested';

// Lote/Parcela agrícola
export interface Lote extends BaseEntity {
  name: string;
  code: string;
  area: number; // hectáreas
  soilType?: string;
  irrigationType?: 'drip' | 'sprinkler' | 'flood' | 'none';
  status: 'active' | 'resting' | 'preparation';
  currentCropId?: string;
  location?: {
    lat: number;
    lng: number;
  };
  notes?: string;
}

// Cultivo
export interface Crop extends BaseEntity {
  name: string;
  variety: string;
  productType: ProductType;
  loteId: string;
  loteName?: string;
  area: number; // hectáreas sembradas
  plantingDate: Date;
  expectedHarvestDate: Date;
  actualHarvestDate?: Date;
  status: CropStatus;
  seedsUsed?: number;
  seedsUnit?: string;
  estimatedYield?: number;
  actualYield?: number;
  yieldUnit?: string;
  notes?: string;
}

// Cosecha
export interface Harvest extends BaseEntity {
  cropId: string;
  cropName?: string;
  loteId: string;
  loteName?: string;
  date: Date;
  quantity: number;
  unit: string;
  quality: 'A' | 'B' | 'C';
  destination: 'sale' | 'processing' | 'storage' | 'seeds';
  pricePerUnit?: number;
  totalValue?: number;
  harvestedBy?: string;
  notes?: string;
}

// Acción agrícola (aplicaciones, riegos, etc.)
export interface AgroAction extends BaseEntity {
  cropId?: string;
  cropName?: string;
  loteId: string;
  loteName?: string;
  type: 'planting' | 'irrigation' | 'fertilization' | 'pesticide' | 'weeding' | 'pruning' | 'harvest' | 'soil_preparation';
  date: Date;
  description: string;
  insumoUsed?: string;
  quantity?: number;
  unit?: string;
  cost?: number;
  performedBy: string;
  weatherConditions?: string;
  notes?: string;
}

// Planificación agrícola
export interface AgroPlan extends BaseEntity {
  name: string;
  season: string; // e.g., "2026-A", "2026-B"
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  lotes: {
    loteId: string;
    loteName: string;
    plannedCrop: string;
    plannedVariety: string;
    plannedArea: number;
    expectedYield: number;
  }[];
  totalArea: number;
  estimatedCost?: number;
  estimatedRevenue?: number;
  notes?: string;
}

// Insumo agrícola
export interface AgroInsumo extends BaseEntity {
  name: string;
  type: 'seed' | 'fertilizer' | 'pesticide' | 'herbicide' | 'tool' | 'other';
  unit: string;
  currentStock: number;
  minStock: number;
  costPerUnit: number;
  supplier?: string;
  expirationDate?: Date;
}

// Dashboard stats
export interface AgroDashboardStats {
  totalLotes: number;
  activeLotes: number;
  totalArea: number;
  cultivatedArea: number;
  activeCrops: number;
  readyToHarvest: number;
  monthlyHarvest: {
    quantity: number;
    unit: string;
  };
  monthlyRevenue: number;
  pendingActions: number;
}

// Datos de producción para gráficos
export interface AgroProductionData {
  month: string;
  harvest: number; // kg
  revenue: number; // $
  area: number; // hectáreas cosechadas
}

// Distribución de cultivos
export interface CropDistribution {
  crop: string;
  area: number;
  percentage: number;
  color: string;
}

// Tarea agrícola pendiente
export interface AgroTask {
  id: string;
  title: string;
  type: 'planting' | 'irrigation' | 'fertilization' | 'pesticide' | 'harvest' | 'maintenance';
  cropName?: string;
  loteName?: string;
  dueDate: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
}

// Estado del clima para widget
export interface WeatherInfo {
  temperature: number;
  humidity: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'partly_cloudy';
  windSpeed: number;
  precipitation: number;
  forecast: {
    day: string;
    high: number;
    low: number;
    condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'partly_cloudy';
  }[];
}

// Resumen de cultivo para cards
export interface CropSummary {
  id: string;
  name: string;
  variety: string;
  loteName: string;
  area: number;
  status: CropStatus;
  progress: number; // porcentaje de avance
  daysToHarvest: number;
  healthStatus: 'excellent' | 'good' | 'fair' | 'poor';
}
