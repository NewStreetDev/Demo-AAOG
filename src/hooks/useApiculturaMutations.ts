import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createMockApiario,
  updateMockApiario,
  deleteMockApiario,
  createMockColmena,
  updateMockColmena,
  deleteMockColmena,
} from '../services/mock/apicultura.mock';
import type { ApiarioFormData, ColmenaFormData } from '../schemas/apicultura.schema';

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
