import { useQuery } from '@tanstack/react-query';
import {
  getMockModuleComparisons,
  getMockConsolidatedStats,
  getMockPeriodComparison,
  getMockTrendData,
  getMockGeneratedReports,
  getMockReportesDashboardStats,
  getMockReportesTasks,
} from '../services/mock/reportes.mock';

export function useModuleComparisons() {
  return useQuery({
    queryKey: ['reportes', 'modules'],
    queryFn: getMockModuleComparisons,
  });
}

export function useConsolidatedStats() {
  return useQuery({
    queryKey: ['reportes', 'consolidated'],
    queryFn: getMockConsolidatedStats,
  });
}

export function usePeriodComparison() {
  return useQuery({
    queryKey: ['reportes', 'comparison'],
    queryFn: getMockPeriodComparison,
  });
}

export function useTrendData() {
  return useQuery({
    queryKey: ['reportes', 'trends'],
    queryFn: getMockTrendData,
  });
}

export function useGeneratedReports() {
  return useQuery({
    queryKey: ['reportes', 'reports'],
    queryFn: getMockGeneratedReports,
  });
}

export function useReportesDashboardStats() {
  return useQuery({
    queryKey: ['reportes', 'stats'],
    queryFn: getMockReportesDashboardStats,
  });
}

export function useReportesTasks() {
  return useQuery({
    queryKey: ['reportes', 'tasks'],
    queryFn: getMockReportesTasks,
  });
}
