import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createMockProcessingBatch,
  updateMockProcessingBatch,
  deleteMockProcessingBatch,
} from '../services/mock/procesamiento.mock';
import type { ProcessingBatchFormData } from '../schemas/procesamiento.schema';

// ==================== PROCESSING BATCHES ====================

export function useCreateProcessingBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProcessingBatchFormData) => createMockProcessingBatch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'batches'] });
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'completedBatches'] });
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'stats'] });
    },
  });
}

export function useUpdateProcessingBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProcessingBatchFormData }) =>
      updateMockProcessingBatch(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'batches'] });
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'completedBatches'] });
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'stats'] });
    },
  });
}

export function useDeleteProcessingBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockProcessingBatch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'batches'] });
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'completedBatches'] });
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'stats'] });
    },
  });
}
