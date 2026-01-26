import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateMockFinca,
  createMockDivision,
  updateMockDivision,
  deleteMockDivision,
  createMockGeneralPlan,
  updateMockGeneralPlan,
  deleteMockGeneralPlan,
} from '../services/mock/finca.mock';
import type { FincaFormData, DivisionFormData, GeneralPlanFormData } from '../schemas/finca.schema';

// ==================== FINCA MUTATIONS ====================

export function useUpdateFinca() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FincaFormData) => updateMockFinca(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finca'] });
      queryClient.invalidateQueries({ queryKey: ['finca-dashboard'] });
    },
  });
}

// ==================== DIVISION MUTATIONS ====================

export function useCreateDivision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DivisionFormData) => createMockDivision(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['divisions'] });
      queryClient.invalidateQueries({ queryKey: ['finca-dashboard'] });
    },
  });
}

export function useUpdateDivision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DivisionFormData }) =>
      updateMockDivision(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['divisions'] });
      queryClient.invalidateQueries({ queryKey: ['division'] });
      queryClient.invalidateQueries({ queryKey: ['finca-dashboard'] });
    },
  });
}

export function useDeleteDivision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockDivision(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['divisions'] });
      queryClient.invalidateQueries({ queryKey: ['finca-dashboard'] });
    },
  });
}

// ==================== GENERAL PLAN MUTATIONS ====================

export function useCreateGeneralPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GeneralPlanFormData) => createMockGeneralPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['general-plans'] });
      queryClient.invalidateQueries({ queryKey: ['aggregated-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['finca-dashboard'] });
    },
  });
}

export function useUpdateGeneralPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: GeneralPlanFormData }) =>
      updateMockGeneralPlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['general-plans'] });
      queryClient.invalidateQueries({ queryKey: ['general-plan'] });
      queryClient.invalidateQueries({ queryKey: ['aggregated-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['finca-dashboard'] });
    },
  });
}

export function useDeleteGeneralPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockGeneralPlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['general-plans'] });
      queryClient.invalidateQueries({ queryKey: ['aggregated-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['finca-dashboard'] });
    },
  });
}
