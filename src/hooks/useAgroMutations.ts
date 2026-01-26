import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createMockLote,
  updateMockLote,
  deleteMockLote,
  createMockCrop,
  updateMockCrop,
  deleteMockCrop,
  createMockAgroAction,
  updateMockAgroAction,
  deleteMockAgroAction,
  createMockHarvest,
  updateMockHarvest,
  deleteMockHarvest,
} from '../services/mock/agro.mock';
import type { LoteFormData, CropFormData, AgroActionFormData, HarvestFormData } from '../schemas/agro.schema';

// Lote mutations
export function useCreateLote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoteFormData) => createMockLote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lotes'] });
      queryClient.invalidateQueries({ queryKey: ['agro-stats'] });
    },
  });
}

export function useUpdateLote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: LoteFormData }) =>
      updateMockLote(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lotes'] });
      queryClient.invalidateQueries({ queryKey: ['agro-stats'] });
      queryClient.invalidateQueries({ queryKey: ['crops'] });
    },
  });
}

export function useDeleteLote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockLote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lotes'] });
      queryClient.invalidateQueries({ queryKey: ['agro-stats'] });
    },
  });
}

// Crop mutations
export function useCreateCrop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CropFormData) => createMockCrop(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crops'] });
      queryClient.invalidateQueries({ queryKey: ['agro-stats'] });
      queryClient.invalidateQueries({ queryKey: ['crop-distribution'] });
      queryClient.invalidateQueries({ queryKey: ['crop-summaries'] });
    },
  });
}

export function useUpdateCrop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CropFormData }) =>
      updateMockCrop(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crops'] });
      queryClient.invalidateQueries({ queryKey: ['agro-stats'] });
      queryClient.invalidateQueries({ queryKey: ['crop-distribution'] });
      queryClient.invalidateQueries({ queryKey: ['crop-summaries'] });
    },
  });
}

export function useDeleteCrop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockCrop(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crops'] });
      queryClient.invalidateQueries({ queryKey: ['agro-stats'] });
      queryClient.invalidateQueries({ queryKey: ['crop-distribution'] });
      queryClient.invalidateQueries({ queryKey: ['crop-summaries'] });
    },
  });
}

// ==================== AGRO ACTION MUTATIONS ====================

export function useCreateAgroAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AgroActionFormData) => createMockAgroAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agro-actions'] });
      queryClient.invalidateQueries({ queryKey: ['recent-agro-actions'] });
      queryClient.invalidateQueries({ queryKey: ['agro-stats'] });
      queryClient.invalidateQueries({ queryKey: ['agro-tasks'] });
    },
  });
}

export function useUpdateAgroAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AgroActionFormData }) =>
      updateMockAgroAction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agro-actions'] });
      queryClient.invalidateQueries({ queryKey: ['recent-agro-actions'] });
    },
  });
}

export function useDeleteAgroAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockAgroAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agro-actions'] });
      queryClient.invalidateQueries({ queryKey: ['recent-agro-actions'] });
    },
  });
}

// ==================== HARVEST MUTATIONS ====================

export function useCreateHarvest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: HarvestFormData) => createMockHarvest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['harvests'] });
      queryClient.invalidateQueries({ queryKey: ['agro-stats'] });
      queryClient.invalidateQueries({ queryKey: ['agro-production'] });
      queryClient.invalidateQueries({ queryKey: ['crops'] });
      queryClient.invalidateQueries({ queryKey: ['crop-summaries'] });
    },
  });
}

export function useUpdateHarvest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: HarvestFormData }) =>
      updateMockHarvest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['harvests'] });
      queryClient.invalidateQueries({ queryKey: ['agro-production'] });
    },
  });
}

export function useDeleteHarvest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockHarvest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['harvests'] });
      queryClient.invalidateQueries({ queryKey: ['agro-production'] });
    },
  });
}
