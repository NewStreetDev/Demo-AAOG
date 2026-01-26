import { useQuery } from '@tanstack/react-query';
import {
  getMockApiarios,
  getMockColmenas,
  getMockApiculturaStats,
  getMockApiculturaProduction,
  getMockApiculturaTasks,
  getMockHealthDistribution,
  getMockRecentActions,
  getMockWorkPlans,
  getMockAcciones,
  getMockAccionesByApiario,
  getMockAccionesByColmena,
  getMockRevisiones,
  getMockRevisionesByApiario,
  getMockRevisionesByColmena,
  getMockCosechas,
  getMockCosechasByApiario,
  getMockCosechasByColmena,
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

export function useWorkPlans() {
  return useQuery({
    queryKey: ['work-plans'],
    queryFn: getMockWorkPlans,
  });
}

// ==================== ACCIONES ====================

export function useAcciones() {
  return useQuery({
    queryKey: ['acciones'],
    queryFn: getMockAcciones,
  });
}

export function useAccionesByApiario(apiarioId: string | undefined) {
  return useQuery({
    queryKey: ['acciones', 'apiario', apiarioId],
    queryFn: () => getMockAccionesByApiario(apiarioId!),
    enabled: !!apiarioId,
  });
}

export function useAccionesByColmena(colmenaId: string | undefined) {
  return useQuery({
    queryKey: ['acciones', 'colmena', colmenaId],
    queryFn: () => getMockAccionesByColmena(colmenaId!),
    enabled: !!colmenaId,
  });
}

// ==================== REVISIONES ====================

export function useRevisiones() {
  return useQuery({
    queryKey: ['revisiones'],
    queryFn: getMockRevisiones,
  });
}

export function useRevisionesByApiario(apiarioId: string | undefined) {
  return useQuery({
    queryKey: ['revisiones', 'apiario', apiarioId],
    queryFn: () => getMockRevisionesByApiario(apiarioId!),
    enabled: !!apiarioId,
  });
}

export function useRevisionesByColmena(colmenaId: string | undefined) {
  return useQuery({
    queryKey: ['revisiones', 'colmena', colmenaId],
    queryFn: () => getMockRevisionesByColmena(colmenaId!),
    enabled: !!colmenaId,
  });
}

// ==================== COSECHAS ====================

export function useCosechas() {
  return useQuery({
    queryKey: ['cosechas'],
    queryFn: getMockCosechas,
  });
}

export function useCosechasByApiario(apiarioId: string | undefined) {
  return useQuery({
    queryKey: ['cosechas', 'apiario', apiarioId],
    queryFn: () => getMockCosechasByApiario(apiarioId!),
    enabled: !!apiarioId,
  });
}

export function useCosechasByColmena(colmenaId: string | undefined) {
  return useQuery({
    queryKey: ['cosechas', 'colmena', colmenaId],
    queryFn: () => getMockCosechasByColmena(colmenaId!),
    enabled: !!colmenaId,
  });
}
