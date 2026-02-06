// =============================================================================
// COMMON TYPES - Fuente única de tipos compartidos
// =============================================================================

// -----------------------------------------------------------------------------
// Entidades Base
// -----------------------------------------------------------------------------

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Entidad con fincaId para multitenancy
export interface TenantEntity extends BaseEntity {
  fincaId: string;
}

// -----------------------------------------------------------------------------
// Farm (Finca)
// -----------------------------------------------------------------------------

export interface Farm {
  id: string;
  name: string;
  totalArea: number;
  location: {
    lat: number;
    lng: number;
  };
  owner: string;
}

// -----------------------------------------------------------------------------
// Módulos del Sistema
// -----------------------------------------------------------------------------

// Módulos del sistema (completos)
export type SystemModule = 'mi_finca' | 'agricola' | 'pecuario' | 'procesamiento' | 'finanzas' | 'reglamentos' | 'reportes';

// -----------------------------------------------------------------------------
// Estados Unificados
// -----------------------------------------------------------------------------

/**
 * @deprecated Usar EntityStatus o ProcessStatus según el caso
 */
export type Status = 'active' | 'inactive' | 'pending';

// Estados genéricos de entidades
export type EntityStatus = 'active' | 'inactive' | 'archived';

// Estados de proceso/ejecución (usado por acciones, tareas)
export type ProcessStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

// Estados de pago
export type PaymentStatus = 'pending' | 'partial' | 'paid';

// -----------------------------------------------------------------------------
// Períodos
// -----------------------------------------------------------------------------

export type PeriodType = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface Period {
  type: PeriodType;
  year: number;
  month?: number;      // 1-12 si monthly
  quarter?: number;    // 1-4 si quarterly
  week?: number;       // 1-53 si weekly
  label: string;       // "Enero 2026", "Q1 2026", "2026"
}

// -----------------------------------------------------------------------------
// Formatos de Exportación
// -----------------------------------------------------------------------------

export type ExportFormat = 'pdf' | 'excel' | 'csv';

// -----------------------------------------------------------------------------
// Insumos y Herramientas
// -----------------------------------------------------------------------------

/**
 * @deprecated Usar InsumoUtilizado en su lugar
 * Insumo usado en una acción (formato antiguo)
 */
export interface ActionInsumo {
  insumoId: string;
  insumoName: string;
  quantity: number;
  unit: string;
}

// Insumo utilizado en una acción (unificado para todos los módulos)
export interface InsumoUtilizado {
  id?: string;
  insumoId?: string;    // Referencia al catálogo si existe
  nombre: string;
  cantidad: number;
  unidad: string;
  costo?: number;
}

// Herramienta utilizada en una acción
export interface HerramientaUtilizada {
  id?: string;
  herramientaId?: string;
  nombre: string;
  descripcion?: string;
}

// -----------------------------------------------------------------------------
// Acciones Genéricas
// -----------------------------------------------------------------------------

/**
 * @deprecated Considerar usar tipos específicos por módulo que extiendan TenantEntity
 * Acción genérica - aplicable a todos los módulos
 */
export interface GenericAction extends BaseEntity {
  module: SystemModule;
  actionType: string;           // Tipo específico según el módulo
  date: Date;
  workerId: string;
  workerName: string;
  totalHours: number;
  description?: string;
  insumos: ActionInsumo[];      // Insumos utilizados
  targetId?: string;            // ID del objeto relacionado (colmena, animal, lote, etc.)
  targetName?: string;          // Nombre del objeto relacionado
  cost?: number;                // Costo total calculado
  notes?: string;
}
