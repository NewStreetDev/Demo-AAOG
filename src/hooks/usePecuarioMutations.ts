import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createMockLivestock,
  updateMockLivestock,
  deleteMockLivestock,
  createMockPotrero,
  updateMockPotrero,
  deleteMockPotrero,
  createMockHealthRecord,
  updateMockHealthRecord,
  deleteMockHealthRecord,
  createMockGroupHealthAction,
  createMockReproductionRecord,
  updateMockReproductionRecord,
  deleteMockReproductionRecord,
  createMockMilkProduction,
  updateMockMilkProduction,
  deleteMockMilkProduction,
  createMockLivestockGroup,
  updateMockLivestockGroup,
  deleteMockLivestockGroup,
} from '../services/mock/pecuario.mock';
import type {
  LivestockFormData,
  PotreroFormData,
  HealthRecordFormData,
  GroupHealthActionFormData,
  ReproductionRecordFormData,
  MilkProductionFormData,
  LivestockGroupFormData,
} from '../schemas/pecuario.schema';

// Livestock mutations
export function useCreateLivestock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LivestockFormData) => createMockLivestock(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['livestock'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
      queryClient.invalidateQueries({ queryKey: ['category-distribution'] });
    },
  });
}

export function useUpdateLivestock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: LivestockFormData }) =>
      updateMockLivestock(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['livestock'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
      queryClient.invalidateQueries({ queryKey: ['category-distribution'] });
    },
  });
}

export function useDeleteLivestock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockLivestock(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['livestock'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
      queryClient.invalidateQueries({ queryKey: ['category-distribution'] });
    },
  });
}

// Potrero mutations
export function useCreatePotrero() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PotreroFormData) => createMockPotrero(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['potreros'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
    },
  });
}

export function useUpdatePotrero() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PotreroFormData }) =>
      updateMockPotrero(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['potreros'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
    },
  });
}

export function useDeletePotrero() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockPotrero(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['potreros'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
    },
  });
}

// ========================================
// Health Record mutations
// ========================================

export function useCreateHealthRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: HealthRecordFormData) => createMockHealthRecord(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-records'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-tasks'] });
    },
  });
}

export function useUpdateHealthRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: HealthRecordFormData }) =>
      updateMockHealthRecord(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-records'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-tasks'] });
    },
  });
}

export function useDeleteHealthRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockHealthRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-records'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-tasks'] });
    },
  });
}

// ========================================
// Group Health Action mutations
// ========================================

export function useCreateGroupHealthAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GroupHealthActionFormData) => createMockGroupHealthAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-health-actions'] });
      queryClient.invalidateQueries({ queryKey: ['recent-health-actions'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-tasks'] });
    },
  });
}

// ========================================
// Reproduction Record mutations
// ========================================

export function useCreateReproductionRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReproductionRecordFormData) => createMockReproductionRecord(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reproduction-records'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-tasks'] });
    },
  });
}

export function useUpdateReproductionRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReproductionRecordFormData }) =>
      updateMockReproductionRecord(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reproduction-records'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-tasks'] });
    },
  });
}

export function useDeleteReproductionRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockReproductionRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reproduction-records'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-tasks'] });
    },
  });
}

// ========================================
// Milk Production mutations
// ========================================

export function useCreateMilkProduction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MilkProductionFormData) => createMockMilkProduction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milk-production'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-production'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-production-data'] });
    },
  });
}

export function useUpdateMilkProduction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MilkProductionFormData }) =>
      updateMockMilkProduction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milk-production'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-production'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-production-data'] });
    },
  });
}

export function useDeleteMilkProduction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockMilkProduction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milk-production'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-production'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-production-data'] });
    },
  });
}

// ========================================
// Livestock Group mutations
// ========================================

export function useCreateLivestockGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LivestockGroupFormData) => createMockLivestockGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['livestock-groups'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-dashboard'] });
    },
  });
}

export function useUpdateLivestockGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: LivestockGroupFormData }) =>
      updateMockLivestockGroup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['livestock-groups'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-dashboard'] });
    },
  });
}

export function useDeleteLivestockGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockLivestockGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['livestock-groups'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-dashboard'] });
    },
  });
}
