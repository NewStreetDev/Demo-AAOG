import { useQuery } from '@tanstack/react-query';
import {
  getMockFinca,
  getMockDivisions,
  getMockDivisionById,
  getMockGeneralPlans,
  getMockGeneralPlanById,
  getMockFincaDashboardStats,
  getMockMonthlyAggregatedData,
  getMockAggregatedTasks,
} from '../services/mock/finca.mock';

// ==================== FINCA ====================

export function useFinca() {
  return useQuery({
    queryKey: ['finca'],
    queryFn: getMockFinca,
  });
}

// ==================== DIVISIONS ====================

export function useDivisions() {
  return useQuery({
    queryKey: ['divisions'],
    queryFn: getMockDivisions,
  });
}

export function useDivision(id: string | undefined) {
  return useQuery({
    queryKey: ['division', id],
    queryFn: () => getMockDivisionById(id!),
    enabled: !!id,
  });
}

// ==================== GENERAL PLANS ====================

export function useGeneralPlans() {
  return useQuery({
    queryKey: ['general-plans'],
    queryFn: getMockGeneralPlans,
  });
}

export function useGeneralPlan(id: string | undefined) {
  return useQuery({
    queryKey: ['general-plan', id],
    queryFn: () => getMockGeneralPlanById(id!),
    enabled: !!id,
  });
}

// ==================== DASHBOARD ====================

export function useFincaDashboard() {
  return useQuery({
    queryKey: ['finca-dashboard'],
    queryFn: getMockFincaDashboardStats,
  });
}

export function useMonthlyAggregatedData() {
  return useQuery({
    queryKey: ['monthly-aggregated-data'],
    queryFn: getMockMonthlyAggregatedData,
  });
}

export function useAggregatedTasks() {
  return useQuery({
    queryKey: ['aggregated-tasks'],
    queryFn: getMockAggregatedTasks,
  });
}
