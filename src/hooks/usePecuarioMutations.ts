import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createMockLivestock,
  updateMockLivestock,
  deleteMockLivestock,
  createMockPotrero,
  updateMockPotrero,
  deleteMockPotrero,
} from '../services/mock/pecuario.mock';
import type { LivestockFormData, PotreroFormData } from '../schemas/pecuario.schema';

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
