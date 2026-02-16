import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
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
      toast.success('Lote de procesamiento creado');
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'batches'] });
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'completedBatches'] });
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'stats'] });
    },
    onError: () => { toast.error('Error al crear lote de procesamiento'); },
  });
}

export function useUpdateProcessingBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProcessingBatchFormData }) =>
      updateMockProcessingBatch(id, data),
    onSuccess: () => {
      toast.success('Lote de procesamiento actualizado');
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'batches'] });
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'completedBatches'] });
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'stats'] });
    },
    onError: () => { toast.error('Error al actualizar lote'); },
  });
}

export function useDeleteProcessingBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockProcessingBatch(id),
    onSuccess: () => {
      toast.success('Lote de procesamiento eliminado');
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'batches'] });
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'completedBatches'] });
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'stats'] });
    },
    onError: () => { toast.error('Error al eliminar lote'); },
  });
}
