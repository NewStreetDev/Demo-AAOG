import { useQuery } from '@tanstack/react-query';
import {
  getMockLotes,
  getMockCrops,
  getMockAgroStats,
  getMockAgroProduction,
  getMockAgroTasks,
  getMockCropDistribution,
  getMockCropSummaries,
  getMockRecentAgroActions,
} from '../services/mock/agro.mock';

export function useLotes() {
  return useQuery({
    queryKey: ['lotes'],
    queryFn: getMockLotes,
  });
}

export function useCrops() {
  return useQuery({
    queryKey: ['crops'],
    queryFn: getMockCrops,
  });
}

export function useAgroStats() {
  return useQuery({
    queryKey: ['agro-stats'],
    queryFn: getMockAgroStats,
  });
}

export function useAgroProduction() {
  return useQuery({
    queryKey: ['agro-production'],
    queryFn: getMockAgroProduction,
  });
}

export function useAgroTasks() {
  return useQuery({
    queryKey: ['agro-tasks'],
    queryFn: getMockAgroTasks,
  });
}

export function useCropDistribution() {
  return useQuery({
    queryKey: ['crop-distribution'],
    queryFn: getMockCropDistribution,
  });
}

export function useCropSummaries() {
  return useQuery({
    queryKey: ['crop-summaries'],
    queryFn: getMockCropSummaries,
  });
}

export function useRecentAgroActions() {
  return useQuery({
    queryKey: ['recent-agro-actions'],
    queryFn: getMockRecentAgroActions,
  });
}
