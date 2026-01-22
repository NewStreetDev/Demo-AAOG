import { useQuery } from '@tanstack/react-query';
import {
  getMockAssets,
  getMockAssetMovements,
  getMockDepreciationRecords,
  getMockActivosStats,
  getMockAssetsByCategory,
  getMockAssetsByStatus,
  getMockDepreciationSummary,
  getMockAssetValueTrend,
  getMockAssetActivity,
} from '../services/mock/activos.mock';

export function useAssets() {
  return useQuery({
    queryKey: ['activos', 'assets'],
    queryFn: getMockAssets,
  });
}

export function useAssetMovements() {
  return useQuery({
    queryKey: ['activos', 'movements'],
    queryFn: getMockAssetMovements,
  });
}

export function useDepreciationRecords() {
  return useQuery({
    queryKey: ['activos', 'depreciation'],
    queryFn: getMockDepreciationRecords,
  });
}

export function useActivosStats() {
  return useQuery({
    queryKey: ['activos', 'stats'],
    queryFn: getMockActivosStats,
  });
}

export function useAssetsByCategory() {
  return useQuery({
    queryKey: ['activos', 'byCategory'],
    queryFn: getMockAssetsByCategory,
  });
}

export function useAssetsByStatus() {
  return useQuery({
    queryKey: ['activos', 'byStatus'],
    queryFn: getMockAssetsByStatus,
  });
}

export function useDepreciationSummary() {
  return useQuery({
    queryKey: ['activos', 'depreciationSummary'],
    queryFn: getMockDepreciationSummary,
  });
}

export function useAssetValueTrend() {
  return useQuery({
    queryKey: ['activos', 'valueTrend'],
    queryFn: getMockAssetValueTrend,
  });
}

export function useAssetActivity() {
  return useQuery({
    queryKey: ['activos', 'activity'],
    queryFn: getMockAssetActivity,
  });
}
