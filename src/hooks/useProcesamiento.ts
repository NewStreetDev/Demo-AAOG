import { useQuery } from '@tanstack/react-query';
import {
  getMockProcessingBatches,
  getMockCompletedBatches,
  getMockProcesamientoStats,
} from '../services/mock/procesamiento.mock';

/**
 * Fetch all processing batches
 */
export function useProcessingBatches() {
  return useQuery({
    queryKey: ['procesamiento', 'batches'],
    queryFn: getMockProcessingBatches,
  });
}

/**
 * Fetch only completed batches (available as input for new processes)
 */
export function useCompletedBatches() {
  return useQuery({
    queryKey: ['procesamiento', 'completedBatches'],
    queryFn: getMockCompletedBatches,
  });
}

/**
 * Fetch procesamiento dashboard stats
 */
export function useProcesamientoStats() {
  return useQuery({
    queryKey: ['procesamiento', 'stats'],
    queryFn: getMockProcesamientoStats,
  });
}
