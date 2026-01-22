import { useQuery } from '@tanstack/react-query';
import {
  getMockProcessingBatches,
  getMockProcessingLines,
  getMockQualityControls,
  getMockProcesamientoStats,
  getMockProcesamientoProduction,
  getMockProductionByType,
  getMockProcesamientoTasks,
  getMockBatchSummaries,
} from '../services/mock/procesamiento.mock';

export function useProcessingBatches() {
  return useQuery({
    queryKey: ['procesamiento', 'batches'],
    queryFn: getMockProcessingBatches,
  });
}

export function useProcessingLines() {
  return useQuery({
    queryKey: ['procesamiento', 'lines'],
    queryFn: getMockProcessingLines,
  });
}

export function useQualityControls() {
  return useQuery({
    queryKey: ['procesamiento', 'qc'],
    queryFn: getMockQualityControls,
  });
}

export function useProcesamientoStats() {
  return useQuery({
    queryKey: ['procesamiento', 'stats'],
    queryFn: getMockProcesamientoStats,
  });
}

export function useProcesamientoProduction() {
  return useQuery({
    queryKey: ['procesamiento', 'production'],
    queryFn: getMockProcesamientoProduction,
  });
}

export function useProductionByType() {
  return useQuery({
    queryKey: ['procesamiento', 'byType'],
    queryFn: getMockProductionByType,
  });
}

export function useProcesamientoTasks() {
  return useQuery({
    queryKey: ['procesamiento', 'tasks'],
    queryFn: getMockProcesamientoTasks,
  });
}

export function useBatchSummaries() {
  return useQuery({
    queryKey: ['procesamiento', 'batchSummaries'],
    queryFn: getMockBatchSummaries,
  });
}
