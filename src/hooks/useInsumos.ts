import { useQuery } from '@tanstack/react-query';
import {
  getMockInsumos,
  getMockInsumosStats,
  getMockMovements,
  getMockLowStockAlerts,
  getMockCategorySummaries,
  getMockConsumptionData,
} from '../services/mock/insumos.mock';

export function useInsumos() {
  return useQuery({
    queryKey: ['insumos'],
    queryFn: getMockInsumos,
  });
}

export function useInsumosStats() {
  return useQuery({
    queryKey: ['insumos-stats'],
    queryFn: getMockInsumosStats,
  });
}

export function useMovements() {
  return useQuery({
    queryKey: ['insumo-movements'],
    queryFn: getMockMovements,
  });
}

export function useLowStockAlerts() {
  return useQuery({
    queryKey: ['low-stock-alerts'],
    queryFn: getMockLowStockAlerts,
  });
}

export function useCategorySummaries() {
  return useQuery({
    queryKey: ['insumos-category-summaries'],
    queryFn: getMockCategorySummaries,
  });
}

export function useConsumptionData() {
  return useQuery({
    queryKey: ['insumos-consumption'],
    queryFn: getMockConsumptionData,
  });
}
