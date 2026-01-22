import type { GenericAction, ActionInsumo, SystemModule } from '../../types/common.types';
import type { ActionFormData } from '../../schemas/action.schema';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory store for actions
let actionsStore: GenericAction[] = [];

// Initial mock data
const initialActions: GenericAction[] = [
  {
    id: '1',
    module: 'agro',
    actionType: 'irrigation',
    date: new Date('2026-01-20'),
    workerId: '1',
    workerName: 'Juan García',
    totalHours: 4,
    description: 'Riego del lote norte - tomates',
    insumos: [],
    targetId: 'lote-1',
    targetName: 'Lote Norte',
    cost: 60000,
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date('2026-01-20'),
  },
  {
    id: '2',
    module: 'pecuario',
    actionType: 'vaccination',
    date: new Date('2026-01-19'),
    workerId: '2',
    workerName: 'María López',
    totalHours: 3,
    description: 'Vacunación de terneros - Lote A',
    insumos: [
      { insumoId: 'ins-1', insumoName: 'Vacuna Aftosa', quantity: 20, unit: 'dosis' },
    ],
    targetId: 'grupo-1',
    targetName: 'Terneros Lote A',
    cost: 85000,
    createdAt: new Date('2026-01-19'),
    updatedAt: new Date('2026-01-19'),
  },
  {
    id: '3',
    module: 'apicultura',
    actionType: 'revision',
    date: new Date('2026-01-18'),
    workerId: '3',
    workerName: 'Carlos Rodríguez',
    totalHours: 5,
    description: 'Revisión general del apiario principal',
    insumos: [],
    targetId: 'apiario-1',
    targetName: 'Apiario Principal',
    cost: 90000,
    createdAt: new Date('2026-01-18'),
    updatedAt: new Date('2026-01-18'),
  },
  {
    id: '4',
    module: 'apicultura',
    actionType: 'feeding',
    date: new Date('2026-01-17'),
    workerId: '3',
    workerName: 'Carlos Rodríguez',
    totalHours: 2,
    description: 'Alimentación suplementaria',
    insumos: [
      { insumoId: 'ins-2', insumoName: 'Azúcar Cruda', quantity: 10, unit: 'kg' },
    ],
    targetId: 'apiario-1',
    targetName: 'Apiario Principal',
    cost: 44000,
    createdAt: new Date('2026-01-17'),
    updatedAt: new Date('2026-01-17'),
  },
];

function initializeStore() {
  if (actionsStore.length === 0) {
    actionsStore = [...initialActions];
  }
}

// Get all actions
export const getMockActions = async (): Promise<GenericAction[]> => {
  await delay(300);
  initializeStore();
  return [...actionsStore].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

// Get actions by module
export const getMockActionsByModule = async (module: SystemModule): Promise<GenericAction[]> => {
  await delay(300);
  initializeStore();
  return actionsStore
    .filter(a => a.module === module)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Get action by ID
export const getMockActionById = async (id: string): Promise<GenericAction | null> => {
  await delay(200);
  initializeStore();
  return actionsStore.find(a => a.id === id) || null;
};

// Create new action
export const createMockAction = async (
  data: ActionFormData,
  insumos: ActionInsumo[],
  workerName: string
): Promise<GenericAction> => {
  await delay(400);
  initializeStore();

  const now = new Date();
  const newAction: GenericAction = {
    id: String(Date.now()),
    module: data.module,
    actionType: data.actionType,
    date: new Date(data.date),
    workerId: data.workerId,
    workerName: workerName,
    totalHours: parseFloat(data.totalHours),
    description: data.description,
    insumos: insumos,
    targetId: data.targetId,
    targetName: data.targetName,
    notes: data.notes,
    createdAt: now,
    updatedAt: now,
  };

  actionsStore.push(newAction);
  return newAction;
};

// Update action
export const updateMockAction = async (
  id: string,
  data: ActionFormData,
  insumos: ActionInsumo[],
  workerName: string
): Promise<GenericAction> => {
  await delay(400);
  initializeStore();

  const index = actionsStore.findIndex(a => a.id === id);
  if (index === -1) {
    throw new Error('Acción no encontrada');
  }

  const existing = actionsStore[index];
  const updatedAction: GenericAction = {
    ...existing,
    module: data.module,
    actionType: data.actionType,
    date: new Date(data.date),
    workerId: data.workerId,
    workerName: workerName,
    totalHours: parseFloat(data.totalHours),
    description: data.description,
    insumos: insumos,
    targetId: data.targetId,
    targetName: data.targetName,
    notes: data.notes,
    updatedAt: new Date(),
  };

  actionsStore[index] = updatedAction;
  return updatedAction;
};

// Delete action
export const deleteMockAction = async (id: string): Promise<void> => {
  await delay(300);
  initializeStore();

  const index = actionsStore.findIndex(a => a.id === id);
  if (index === -1) {
    throw new Error('Acción no encontrada');
  }

  actionsStore.splice(index, 1);
};

// Get recent actions (for dashboard)
export const getMockRecentActions = async (limit: number = 5): Promise<GenericAction[]> => {
  await delay(200);
  initializeStore();
  return actionsStore
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};

// Get action stats
export interface ActionStats {
  totalActions: number;
  totalHours: number;
  byModule: Record<string, number>;
  thisMonth: number;
}

export const getMockActionStats = async (): Promise<ActionStats> => {
  await delay(200);
  initializeStore();

  const now = new Date();
  const thisMonth = actionsStore.filter(a => {
    const actionDate = new Date(a.date);
    return actionDate.getMonth() === now.getMonth() &&
           actionDate.getFullYear() === now.getFullYear();
  });

  const byModule: Record<string, number> = {};
  actionsStore.forEach(a => {
    byModule[a.module] = (byModule[a.module] || 0) + 1;
  });

  return {
    totalActions: actionsStore.length,
    totalHours: actionsStore.reduce((sum, a) => sum + a.totalHours, 0),
    byModule,
    thisMonth: thisMonth.length,
  };
};
