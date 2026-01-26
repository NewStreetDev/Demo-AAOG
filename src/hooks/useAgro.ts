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
  getMockAgroActions,
  getMockAgroActionsByLote,
  getMockAgroActionsByCrop,
  getMockHarvests,
  getMockHarvestsByLote,
  getMockHarvestsByCrop,
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

// ==================== AGRO ACTIONS ====================

export function useAgroActions() {
  return useQuery({
    queryKey: ['agro-actions'],
    queryFn: getMockAgroActions,
  });
}

export function useAgroActionsByLote(loteId: string | undefined) {
  return useQuery({
    queryKey: ['agro-actions', 'lote', loteId],
    queryFn: () => getMockAgroActionsByLote(loteId!),
    enabled: !!loteId,
  });
}

export function useAgroActionsByCrop(cropId: string | undefined) {
  return useQuery({
    queryKey: ['agro-actions', 'crop', cropId],
    queryFn: () => getMockAgroActionsByCrop(cropId!),
    enabled: !!cropId,
  });
}

// ==================== HARVESTS ====================

export function useHarvests() {
  return useQuery({
    queryKey: ['harvests'],
    queryFn: getMockHarvests,
  });
}

export function useHarvestsByLote(loteId: string | undefined) {
  return useQuery({
    queryKey: ['harvests', 'lote', loteId],
    queryFn: () => getMockHarvestsByLote(loteId!),
    enabled: !!loteId,
  });
}

export function useHarvestsByCrop(cropId: string | undefined) {
  return useQuery({
    queryKey: ['harvests', 'crop', cropId],
    queryFn: () => getMockHarvestsByCrop(cropId!),
    enabled: !!cropId,
  });
}
