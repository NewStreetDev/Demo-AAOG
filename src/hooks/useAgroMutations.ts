import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createMockLote,
  updateMockLote,
  deleteMockLote,
  createMockCrop,
  updateMockCrop,
  deleteMockCrop,
} from '../services/mock/agro.mock';
import type { LoteFormData, CropFormData } from '../schemas/agro.schema';

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
