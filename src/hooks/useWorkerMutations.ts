import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createMockWorker,
  updateMockWorker,
  deleteMockWorker,
} from '../services/mock/trabajadores.mock';
import type { WorkerFormData } from '../schemas/worker.schema';

export function useCreateWorker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WorkerFormData) => createMockWorker(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trabajadores', 'workers'] });
      queryClient.invalidateQueries({ queryKey: ['trabajadores', 'stats'] });
    },
  });
}

export function useUpdateWorker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: WorkerFormData }) =>
      updateMockWorker(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trabajadores', 'workers'] });
      queryClient.invalidateQueries({ queryKey: ['trabajadores', 'stats'] });
    },
  });
}

export function useDeleteWorker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockWorker(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trabajadores', 'workers'] });
      queryClient.invalidateQueries({ queryKey: ['trabajadores', 'stats'] });
    },
  });
}
