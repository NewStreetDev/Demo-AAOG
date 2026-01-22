import type { BaseEntity } from './common.types';

// Categorías de insumos
export type InsumoCategoryType =
  | 'semillas'
  | 'fertilizantes'
  | 'pesticidas'
  | 'herbicidas'
  | 'alimentos'
  | 'medicamentos'
  | 'herramientas'
  | 'otros';

// Estado de stock
export type StockStatus = 'en_stock' | 'bajo' | 'critico';

// Módulo relacionado
export type RelatedModule = 'agro' | 'pecuario' | 'apicultura' | 'general';

// Tipo de movimiento
export type MovementType = 'entrada' | 'salida' | 'ajuste';

// Insumo individual
export interface Insumo extends BaseEntity {
  code: string;
  name: string;
  category: InsumoCategoryType;
  description?: string;
  currentStock: number;
  minStock: number;
  maxStock?: number;
  unit: string;
  costPerUnit: number;
  totalValue: number;
  supplier?: string;
  supplierPhone?: string;
  expirationDate?: Date;
  batchCode?: string;
  location?: string;
  relatedModule?: RelatedModule;
  status: StockStatus;
  alertEnabled: boolean;
  reorderQuantity?: number;
  notes?: string;
}

// Movimiento de insumo
export interface InsumoMovement extends BaseEntity {
  insumoId: string;
  insumoName?: string;
  insumoCategory?: InsumoCategoryType;
  type: MovementType;
  quantity: number;
  unit: string;
  sourceModule?: RelatedModule;
  relatedItemId?: string;
  date: Date;
  performer?: string;
  reason?: string;
  supplierName?: string;
  invoiceNumber?: string;
  purchaseCost?: number;
  usedFor?: string;
  notes?: string;
}

// Dashboard stats
export interface InsumosDashboardStats {
  totalInsumosCount: number;
  categoryCounts: Record<InsumoCategoryType, number>;
  enStock: number;
  bajoStock: number;
  criticoStock: number;
  totalInventoryValue: number;
  monthlyMovements: number;
  lastMovementDate?: Date;
  pendingReorders: number;
  expiringItems: number;
}

// Resumen por categoría
export interface CategorySummary {
  category: InsumoCategoryType;
  categoryLabel: string;
  count: number;
  totalValue: number;
  bajoStock: number;
  icon: string;
  color: string;
}

// Resumen de insumo para cards
export interface InsumoSummary {
  id: string;
  code: string;
  name: string;
  category: InsumoCategoryType;
  currentStock: number;
  minStock: number;
  unit: string;
  status: StockStatus;
  costPerUnit: number;
  totalValue: number;
  supplier?: string;
  daysToExpiry?: number;
  expirationDate?: Date;
}

// Alerta de stock bajo
export interface LowStockAlert {
  id: string;
  insumoId: string;
  insumoName: string;
  category: InsumoCategoryType;
  currentStock: number;
  minStock: number;
  reorderQuantity?: number;
  supplier?: string;
  costPerReorder?: number;
  priority: 'high' | 'medium' | 'low';
  createdAt: Date;
}

// Datos de consumo por módulo
export interface ConsumptionData {
  month: string;
  agro: number;
  pecuario: number;
  apicultura: number;
  total: number;
}
