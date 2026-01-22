export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

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

export type Status = 'active' | 'inactive' | 'pending';

// Módulos del sistema
export type SystemModule = 'agro' | 'pecuario' | 'apicultura' | 'procesamiento' | 'activos' | 'infraestructura' | 'general';

// Insumo usado en una acción
export interface ActionInsumo {
  insumoId: string;
  insumoName: string;
  quantity: number;
  unit: string;
}

// Acción genérica - aplicable a todos los módulos
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
