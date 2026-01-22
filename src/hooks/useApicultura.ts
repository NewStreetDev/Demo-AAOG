import { useQuery } from '@tanstack/react-query';
import {
  getMockApiarios,
  getMockColmenas,
  getMockApiculturaStats,
  getMockApiculturaProduction,
  getMockApiculturaTasks,
  getMockHealthDistribution,
  getMockRecentActions,
} from '../services/mock/apicultura.mock';

export function useApiarios() {
  return useQuery({
    queryKey: ['apiarios'],
    queryFn: getMockApiarios,
  });
}

export function useColmenas() {
  return useQuery({
    queryKey: ['colmenas'],
    queryFn: getMockColmenas,
  });
}

export function useApiculturaStats() {
  return useQuery({
    queryKey: ['apicultura-stats'],
    queryFn: getMockApiculturaStats,
  });
}

export function useApiculturaProduction() {
  return useQuery({
    queryKey: ['apicultura-production'],
    queryFn: getMockApiculturaProduction,
  });
}

export function useApiculturaTasks() {
  return useQuery({
    queryKey: ['apicultura-tasks'],
    queryFn: getMockApiculturaTasks,
  });
}

export function useHealthDistribution() {
  return useQuery({
    queryKey: ['health-distribution'],
    queryFn: getMockHealthDistribution,
  });
}

export function useRecentActions() {
  return useQuery({
    queryKey: ['recent-actions'],
    queryFn: getMockRecentActions,
  });
}
