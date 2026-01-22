import { useQuery } from '@tanstack/react-query';
import {
  getMockLivestock,
  getMockHealthRecords,
  getMockPotreros,
  getMockPecuarioStats,
  getMockPecuarioProduction,
  getMockPecuarioTasks,
  getMockCategoryDistribution,
  getMockRecentHealthActions,
} from '../services/mock/pecuario.mock';

export function useLivestock() {
  return useQuery({
    queryKey: ['livestock'],
    queryFn: getMockLivestock,
  });
}

export function useHealthRecords() {
  return useQuery({
    queryKey: ['health-records'],
    queryFn: getMockHealthRecords,
  });
}

export function usePotreros() {
  return useQuery({
    queryKey: ['potreros'],
    queryFn: getMockPotreros,
  });
}

export function usePecuarioStats() {
  return useQuery({
    queryKey: ['pecuario-stats'],
    queryFn: getMockPecuarioStats,
  });
}

export function usePecuarioProduction() {
  return useQuery({
    queryKey: ['pecuario-production'],
    queryFn: getMockPecuarioProduction,
  });
}

export function usePecuarioTasks() {
  return useQuery({
    queryKey: ['pecuario-tasks'],
    queryFn: getMockPecuarioTasks,
  });
}

export function useCategoryDistribution() {
  return useQuery({
    queryKey: ['category-distribution'],
    queryFn: getMockCategoryDistribution,
  });
}

export function useRecentHealthActions() {
  return useQuery({
    queryKey: ['recent-health-actions'],
    queryFn: getMockRecentHealthActions,
  });
}
