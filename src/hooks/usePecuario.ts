import { useQuery } from '@tanstack/react-query';
import {
  getMockLivestock,
  getMockHealthRecords,
  getMockHealthRecordsByLivestockId,
  getMockPotreros,
  getMockPecuarioStats,
  getMockPecuarioProduction,
  getMockPecuarioTasks,
  getMockCategoryDistribution,
  getMockRecentHealthActions,
  getMockGroupHealthActions,
  getMockReproductionRecords,
  getMockReproductionRecordsByLivestockId,
  getMockMilkProduction,
  getMockPecuarioDashboardStats,
  getMockPecuarioProductionData,
  getMockLivestockGroups,
  getMockLivestockGroupsBySpecies,
} from '../services/mock/pecuario.mock';
import type { LivestockSpecies } from '../types/pecuario.types';

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

export function useHealthRecordsByLivestock(livestockId: string | undefined) {
  return useQuery({
    queryKey: ['health-records', 'livestock', livestockId],
    queryFn: () => getMockHealthRecordsByLivestockId(livestockId!),
    enabled: !!livestockId,
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

export function useGroupHealthActions() {
  return useQuery({
    queryKey: ['group-health-actions'],
    queryFn: getMockGroupHealthActions,
  });
}

// ========================================
// Reproduction Records Hooks
// ========================================

export function useReproductionRecords() {
  return useQuery({
    queryKey: ['reproduction-records'],
    queryFn: getMockReproductionRecords,
  });
}

export function useReproductionRecordsByLivestock(livestockId: string | undefined) {
  return useQuery({
    queryKey: ['reproduction-records', 'livestock', livestockId],
    queryFn: () => getMockReproductionRecordsByLivestockId(livestockId!),
    enabled: !!livestockId,
  });
}

// ========================================
// Milk Production Hooks
// ========================================

export function useMilkProduction() {
  return useQuery({
    queryKey: ['milk-production'],
    queryFn: getMockMilkProduction,
  });
}

// ========================================
// Dashboard Hooks (Enhanced)
// ========================================

export function usePecuarioDashboard() {
  return useQuery({
    queryKey: ['pecuario-dashboard'],
    queryFn: getMockPecuarioDashboardStats,
  });
}

export function usePecuarioProductionData() {
  return useQuery({
    queryKey: ['pecuario-production-data'],
    queryFn: getMockPecuarioProductionData,
  });
}

// ========================================
// Livestock Group Hooks
// ========================================

export function useLivestockGroups() {
  return useQuery({
    queryKey: ['livestock-groups'],
    queryFn: getMockLivestockGroups,
  });
}

export function useLivestockGroupsBySpecies(species: LivestockSpecies | undefined) {
  return useQuery({
    queryKey: ['livestock-groups', 'species', species],
    queryFn: () => getMockLivestockGroupsBySpecies(species!),
    enabled: !!species,
  });
}
