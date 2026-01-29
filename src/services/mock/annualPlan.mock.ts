import type { AnnualPlan, GeneralPlan, PlanPhase } from '../../types/finca.types';
import type { AnnualPlanFormData } from '../../schemas/finca.schema';
import { initializeGeneralPlansStore } from './finca.mock';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory store
let annualPlansStore: AnnualPlan[] = [];

// Access to general plans store (will be set from finca.mock.ts)
let getGeneralPlansStore: () => GeneralPlan[] = () => [];
let setGeneralPlansStore: (plans: GeneralPlan[]) => void = () => {};

// Initialize the connection to general plans store
export const initializeAnnualPlanStoreConnection = (
  getter: () => GeneralPlan[],
  setter: (plans: GeneralPlan[]) => void
) => {
  getGeneralPlansStore = getter;
  setGeneralPlansStore = setter;
};

// ==================== INITIAL DATA ====================

const initialAnnualPlans: AnnualPlan[] = [
  {
    id: 'ap-2025',
    year: 2025,
    name: 'Planificacion 2025',
    status: 'completed',
    description: 'Plan anual completado del ano 2025',
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2025-12-31'),
    activatedAt: new Date('2025-01-01'),
    completedAt: new Date('2025-12-31'),
  },
  {
    id: 'ap-2026',
    year: 2026,
    name: 'Planificacion 2026',
    status: 'planning',
    description: 'Plan anual en desarrollo para el ano 2026',
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2026-01-20'),
  },
];

// ==================== INITIALIZE STORE ====================

export const initializeAnnualPlansStore = () => {
  if (annualPlansStore.length === 0) {
    annualPlansStore = [...initialAnnualPlans];
  }
};

// ==================== ANNUAL PLAN CRUD ====================

export const getMockAnnualPlans = async (): Promise<AnnualPlan[]> => {
  await delay(300);
  initializeAnnualPlansStore();
  return [...annualPlansStore].sort((a, b) => b.year - a.year);
};

export const getMockAnnualPlanById = async (id: string): Promise<AnnualPlan | undefined> => {
  await delay(200);
  initializeAnnualPlansStore();
  return annualPlansStore.find(ap => ap.id === id);
};

export const getMockAnnualPlanByYear = async (year: number): Promise<AnnualPlan | undefined> => {
  await delay(200);
  initializeAnnualPlansStore();
  return annualPlansStore.find(ap => ap.year === year);
};

export const createMockAnnualPlan = async (data: AnnualPlanFormData): Promise<AnnualPlan> => {
  await delay(400);
  initializeAnnualPlansStore();

  // Check if year already exists
  const existingPlan = annualPlansStore.find(ap => ap.year === data.year);
  if (existingPlan) {
    throw new Error(`Ya existe un plan para el ano ${data.year}`);
  }

  const newPlan: AnnualPlan = {
    id: `ap-${data.year}`,
    year: data.year,
    name: data.name,
    status: 'draft',
    description: data.description,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  annualPlansStore.push(newPlan);
  return newPlan;
};

export const updateMockAnnualPlan = async (
  id: string,
  data: Partial<AnnualPlanFormData> & { status?: AnnualPlan['status'] }
): Promise<AnnualPlan> => {
  await delay(400);
  initializeAnnualPlansStore();

  const index = annualPlansStore.findIndex(ap => ap.id === id);
  if (index === -1) throw new Error('Plan anual no encontrado');

  const existingPlan = annualPlansStore[index];

  // If changing year, check for duplicates
  if (data.year && data.year !== existingPlan.year) {
    const duplicateYear = annualPlansStore.find(ap => ap.year === data.year && ap.id !== id);
    if (duplicateYear) {
      throw new Error(`Ya existe un plan para el ano ${data.year}`);
    }
  }

  const updatedPlan: AnnualPlan = {
    ...existingPlan,
    year: data.year ?? existingPlan.year,
    name: data.name ?? existingPlan.name,
    description: data.description !== undefined ? data.description : existingPlan.description,
    status: data.status ?? existingPlan.status,
    updatedAt: new Date(),
  };

  annualPlansStore[index] = updatedPlan;
  return updatedPlan;
};

export const activateMockAnnualPlan = async (id: string): Promise<AnnualPlan> => {
  await delay(500);
  initializeAnnualPlansStore();
  initializeGeneralPlansStore();

  const index = annualPlansStore.findIndex(ap => ap.id === id);
  if (index === -1) throw new Error('Plan anual no encontrado');

  const existingPlan = annualPlansStore[index];

  if (existingPlan.status !== 'planning' && existingPlan.status !== 'draft') {
    throw new Error('Solo se pueden activar planes en estado borrador o planificacion');
  }

  // Get all initial plans for this annual plan
  const generalPlans = getGeneralPlansStore();
  const initialPlans = generalPlans.filter(
    p => p.annualPlanId === id && p.planPhase === 'initial'
  );

  // Create execution copies
  const executionPlans: GeneralPlan[] = initialPlans.map(initialPlan => ({
    ...initialPlan,
    id: `exec-${initialPlan.id}-${Date.now()}`,
    planPhase: 'execution' as PlanPhase,
    linkedPlanId: initialPlan.id,
    isFromPlanning: true,
    originalScheduledDate: initialPlan.scheduledDate,
    originalDueDate: initialPlan.dueDate,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  // Add execution plans to the store
  setGeneralPlansStore([...generalPlans, ...executionPlans]);

  // Update annual plan status
  const updatedPlan: AnnualPlan = {
    ...existingPlan,
    status: 'active',
    activatedAt: new Date(),
    updatedAt: new Date(),
  };

  annualPlansStore[index] = updatedPlan;
  return updatedPlan;
};

export const completeMockAnnualPlan = async (id: string): Promise<AnnualPlan> => {
  await delay(400);
  initializeAnnualPlansStore();

  const index = annualPlansStore.findIndex(ap => ap.id === id);
  if (index === -1) throw new Error('Plan anual no encontrado');

  const existingPlan = annualPlansStore[index];

  if (existingPlan.status !== 'active') {
    throw new Error('Solo se pueden completar planes activos');
  }

  const updatedPlan: AnnualPlan = {
    ...existingPlan,
    status: 'completed',
    completedAt: new Date(),
    updatedAt: new Date(),
  };

  annualPlansStore[index] = updatedPlan;
  return updatedPlan;
};

export const deleteMockAnnualPlan = async (id: string): Promise<void> => {
  await delay(300);
  initializeAnnualPlansStore();

  const index = annualPlansStore.findIndex(ap => ap.id === id);
  if (index === -1) throw new Error('Plan anual no encontrado');

  const plan = annualPlansStore[index];

  if (plan.status !== 'draft') {
    throw new Error('Solo se pueden eliminar planes en estado borrador');
  }

  // Also delete associated general plans
  const generalPlans = getGeneralPlansStore();
  const filteredPlans = generalPlans.filter(p => p.annualPlanId !== id);
  setGeneralPlansStore(filteredPlans);

  annualPlansStore.splice(index, 1);
};

// ==================== QUERY HELPERS ====================

export const getMockGeneralPlansByAnnualPlan = async (
  annualPlanId: string,
  planPhase?: PlanPhase
): Promise<GeneralPlan[]> => {
  await delay(300);
  initializeGeneralPlansStore();

  const generalPlans = getGeneralPlansStore();

  return generalPlans
    .filter(p => {
      if (p.annualPlanId !== annualPlanId) return false;
      if (planPhase && p.planPhase !== planPhase) return false;
      return true;
    })
    .sort((a, b) => {
      // Sort by status priority (pending/in_progress first), then by scheduledDate
      const statusOrder = { pending: 0, in_progress: 1, completed: 2, cancelled: 3 };
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];
      if (statusDiff !== 0) return statusDiff;
      return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
    });
};
