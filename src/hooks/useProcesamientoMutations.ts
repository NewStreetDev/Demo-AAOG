import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createMockProcessingLine,
  updateMockProcessingLine,
  deleteMockProcessingLine,
  createMockProcessingBatch,
  updateMockProcessingBatch,
  deleteMockProcessingBatch,
  createMockQualityControl,
  updateMockQualityControl,
  deleteMockQualityControl,
} from '../services/mock/procesamiento.mock';
import type {
  ProcessingLineFormData,
  ProcessingBatchFormData,
  QualityControlFormData,
} from '../schemas/procesamiento.schema';

// ==================== PROCESSING LINES ====================

export function useCreateProcessingLine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProcessingLineFormData) => createMockProcessingLine(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'lines'] });
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'stats'] });
    },
  });
}

export function useUpdateProcessingLine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProcessingLineFormData }) =>
      updateMockProcessingLine(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'lines'] });
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'stats'] });
    },
  });
}

export function useDeleteProcessingLine() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockProcessingLine(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'lines'] });
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'stats'] });
    },
  });
}

// ==================== PROCESSING BATCHES ====================

export function useCreateProcessingBatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProcessingBatchFormData) => createMockProcessingBatch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'batches'] });
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'batchSummaries'] });
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'lines'] });
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
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'batchSummaries'] });
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
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'batchSummaries'] });
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'stats'] });
    },
  });
}

// ==================== QUALITY CONTROL ====================

export function useCreateQualityControl() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: QualityControlFormData) => createMockQualityControl(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'qc'] });
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'batches'] });
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'stats'] });
    },
  });
}

export function useUpdateQualityControl() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: QualityControlFormData }) =>
      updateMockQualityControl(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'qc'] });
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'batches'] });
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'stats'] });
    },
  });
}

export function useDeleteQualityControl() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockQualityControl(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'qc'] });
      queryClient.invalidateQueries({ queryKey: ['procesamiento', 'stats'] });
    },
  });
}
