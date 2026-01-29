import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMockAnnualPlans,
  getMockAnnualPlanById,
  getMockAnnualPlanByYear,
  createMockAnnualPlan,
  updateMockAnnualPlan,
  activateMockAnnualPlan,
  completeMockAnnualPlan,
  deleteMockAnnualPlan,
} from '../services/mock/annualPlan.mock';
import { getMockGeneralPlansByAnnualPlan } from '../services/mock/finca.mock';
import type { AnnualPlanFormData } from '../schemas/finca.schema';
import type { AnnualPlan, PlanPhase } from '../types/finca.types';

// ==================== QUERIES ====================

export function useAnnualPlans() {
  return useQuery({
    queryKey: ['annual-plans'],
    queryFn: getMockAnnualPlans,
  });
}

export function useAnnualPlan(id: string | undefined) {
  return useQuery({
    queryKey: ['annual-plan', id],
    queryFn: () => getMockAnnualPlanById(id!),
    enabled: !!id,
  });
}

export function useAnnualPlanByYear(year: number | undefined) {
  return useQuery({
    queryKey: ['annual-plan-by-year', year],
    queryFn: () => getMockAnnualPlanByYear(year!),
    enabled: !!year,
  });
}

export function useAnnualPlanPlans(
  annualPlanId: string | undefined,
  planPhase?: PlanPhase
) {
  return useQuery({
    queryKey: ['annual-plan-plans', annualPlanId, planPhase],
    queryFn: () => getMockGeneralPlansByAnnualPlan(annualPlanId!, planPhase),
    enabled: !!annualPlanId,
  });
}

// ==================== MUTATIONS ====================

export function useCreateAnnualPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AnnualPlanFormData) => createMockAnnualPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['annual-plans'] });
      queryClient.invalidateQueries({ queryKey: ['annual-plan-by-year'] });
    },
  });
}

export function useUpdateAnnualPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<AnnualPlanFormData> & { status?: AnnualPlan['status'] };
    }) => updateMockAnnualPlan(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['annual-plans'] });
      queryClient.invalidateQueries({ queryKey: ['annual-plan', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['annual-plan-by-year'] });
    },
  });
}

export function useActivateAnnualPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => activateMockAnnualPlan(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['annual-plans'] });
      queryClient.invalidateQueries({ queryKey: ['annual-plan', id] });
      queryClient.invalidateQueries({ queryKey: ['annual-plan-by-year'] });
      queryClient.invalidateQueries({ queryKey: ['annual-plan-plans'] });
      queryClient.invalidateQueries({ queryKey: ['general-plans'] });
      queryClient.invalidateQueries({ queryKey: ['aggregated-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['finca-dashboard'] });
    },
  });
}

export function useCompleteAnnualPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => completeMockAnnualPlan(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['annual-plans'] });
      queryClient.invalidateQueries({ queryKey: ['annual-plan', id] });
      queryClient.invalidateQueries({ queryKey: ['annual-plan-by-year'] });
    },
  });
}

export function useDeleteAnnualPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockAnnualPlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['annual-plans'] });
      queryClient.invalidateQueries({ queryKey: ['annual-plan-by-year'] });
      queryClient.invalidateQueries({ queryKey: ['annual-plan-plans'] });
      queryClient.invalidateQueries({ queryKey: ['general-plans'] });
    },
  });
}
