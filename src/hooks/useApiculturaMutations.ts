import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createMockApiario,
  updateMockApiario,
  deleteMockApiario,
  createMockColmena,
  updateMockColmena,
  deleteMockColmena,
  createMockWorkPlan,
  updateMockWorkPlan,
  deleteMockWorkPlan,
  createMockAccion,
  updateMockAccion,
  deleteMockAccion,
  createMockRevision,
  updateMockRevision,
  deleteMockRevision,
  createMockCosecha,
  updateMockCosecha,
  deleteMockCosecha,
} from '../services/mock/apicultura.mock';
import type {
  ApiarioFormData,
  ColmenaFormData,
  WorkPlanFormData,
  AccionApiculturaFormData,
  RevisionFormData,
  CosechaFormData,
} from '../schemas/apicultura.schema';

// Apiario mutations
export function useCreateApiario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ApiarioFormData) => createMockApiario(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiarios'] });
      queryClient.invalidateQueries({ queryKey: ['apicultura-stats'] });
    },
  });
}

export function useUpdateApiario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ApiarioFormData }) =>
      updateMockApiario(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiarios'] });
      queryClient.invalidateQueries({ queryKey: ['apicultura-stats'] });
      queryClient.invalidateQueries({ queryKey: ['colmenas'] });
    },
  });
}

export function useDeleteApiario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockApiario(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiarios'] });
      queryClient.invalidateQueries({ queryKey: ['apicultura-stats'] });
    },
  });
}

// Colmena mutations
export function useCreateColmena() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ColmenaFormData) => createMockColmena(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colmenas'] });
      queryClient.invalidateQueries({ queryKey: ['apiarios'] });
      queryClient.invalidateQueries({ queryKey: ['apicultura-stats'] });
      queryClient.invalidateQueries({ queryKey: ['health-distribution'] });
    },
  });
}

export function useUpdateColmena() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ColmenaFormData }) =>
      updateMockColmena(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colmenas'] });
      queryClient.invalidateQueries({ queryKey: ['apiarios'] });
      queryClient.invalidateQueries({ queryKey: ['apicultura-stats'] });
      queryClient.invalidateQueries({ queryKey: ['health-distribution'] });
    },
  });
}

export function useDeleteColmena() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockColmena(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colmenas'] });
      queryClient.invalidateQueries({ queryKey: ['apiarios'] });
      queryClient.invalidateQueries({ queryKey: ['apicultura-stats'] });
      queryClient.invalidateQueries({ queryKey: ['health-distribution'] });
    },
  });
}

// WorkPlan mutations
export function useCreateWorkPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WorkPlanFormData) => createMockWorkPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-plans'] });
      queryClient.invalidateQueries({ queryKey: ['apicultura-tasks'] });
    },
  });
}

export function useUpdateWorkPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: WorkPlanFormData }) =>
      updateMockWorkPlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-plans'] });
      queryClient.invalidateQueries({ queryKey: ['apicultura-tasks'] });
    },
  });
}

export function useDeleteWorkPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockWorkPlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-plans'] });
      queryClient.invalidateQueries({ queryKey: ['apicultura-tasks'] });
    },
  });
}

// ==================== ACCIONES APICULTURA ====================

export function useCreateAccion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AccionApiculturaFormData) => createMockAccion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['acciones'] });
      queryClient.invalidateQueries({ queryKey: ['recent-actions'] });
    },
  });
}

export function useUpdateAccion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AccionApiculturaFormData }) =>
      updateMockAccion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['acciones'] });
      queryClient.invalidateQueries({ queryKey: ['recent-actions'] });
    },
  });
}

export function useDeleteAccion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockAccion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['acciones'] });
      queryClient.invalidateQueries({ queryKey: ['recent-actions'] });
    },
  });
}

// ==================== REVISIONES ====================

export function useCreateRevision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RevisionFormData) => createMockRevision(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['revisiones'] });
      queryClient.invalidateQueries({ queryKey: ['colmenas'] });
      queryClient.invalidateQueries({ queryKey: ['apiarios'] });
      queryClient.invalidateQueries({ queryKey: ['apicultura-stats'] });
      queryClient.invalidateQueries({ queryKey: ['health-distribution'] });
    },
  });
}

export function useUpdateRevision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RevisionFormData }) =>
      updateMockRevision(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['revisiones'] });
      queryClient.invalidateQueries({ queryKey: ['colmenas'] });
      queryClient.invalidateQueries({ queryKey: ['apiarios'] });
    },
  });
}

export function useDeleteRevision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockRevision(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['revisiones'] });
    },
  });
}

// ==================== COSECHAS ====================

export function useCreateCosecha() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CosechaFormData) => createMockCosecha(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cosechas'] });
      queryClient.invalidateQueries({ queryKey: ['apiarios'] });
      queryClient.invalidateQueries({ queryKey: ['apicultura-stats'] });
      queryClient.invalidateQueries({ queryKey: ['apicultura-production'] });
    },
  });
}

export function useUpdateCosecha() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CosechaFormData }) =>
      updateMockCosecha(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cosechas'] });
      queryClient.invalidateQueries({ queryKey: ['apiarios'] });
      queryClient.invalidateQueries({ queryKey: ['apicultura-production'] });
    },
  });
}

export function useDeleteCosecha() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockCosecha(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cosechas'] });
      queryClient.invalidateQueries({ queryKey: ['apicultura-production'] });
    },
  });
}
