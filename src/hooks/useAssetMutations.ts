import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createMockAsset,
  updateMockAsset,
  deleteMockAsset,
} from '../services/mock/activos.mock';
import type { AssetFormData } from '../schemas/asset.schema';

export function useCreateAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssetFormData) => createMockAsset(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activos'] });
      queryClient.invalidateQueries({ queryKey: ['activos-stats'] });
    },
  });
}

export function useUpdateAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AssetFormData }) =>
      updateMockAsset(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activos'] });
      queryClient.invalidateQueries({ queryKey: ['activos-stats'] });
    },
  });
}

export function useDeleteAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockAsset(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activos'] });
      queryClient.invalidateQueries({ queryKey: ['activos-stats'] });
    },
  });
}
