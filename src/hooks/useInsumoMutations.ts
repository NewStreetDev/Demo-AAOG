import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createMockInsumo,
  updateMockInsumo,
  deleteMockInsumo,
} from '../services/mock/insumos.mock';
import type { InsumoFormData } from '../schemas/insumo.schema';

export function useCreateInsumo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InsumoFormData) => createMockInsumo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insumos'] });
      queryClient.invalidateQueries({ queryKey: ['insumos-stats'] });
      queryClient.invalidateQueries({ queryKey: ['insumos-category-summaries'] });
      queryClient.invalidateQueries({ queryKey: ['low-stock-alerts'] });
    },
  });
}

export function useUpdateInsumo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: InsumoFormData }) =>
      updateMockInsumo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insumos'] });
      queryClient.invalidateQueries({ queryKey: ['insumos-stats'] });
      queryClient.invalidateQueries({ queryKey: ['insumos-category-summaries'] });
      queryClient.invalidateQueries({ queryKey: ['low-stock-alerts'] });
    },
  });
}

export function useDeleteInsumo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockInsumo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insumos'] });
      queryClient.invalidateQueries({ queryKey: ['insumos-stats'] });
      queryClient.invalidateQueries({ queryKey: ['insumos-category-summaries'] });
      queryClient.invalidateQueries({ queryKey: ['low-stock-alerts'] });
    },
  });
}
