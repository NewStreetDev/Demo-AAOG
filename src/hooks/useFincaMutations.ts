import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
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
      toast.success('Finca actualizada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['finca'] });
      queryClient.invalidateQueries({ queryKey: ['finca-dashboard'] });
    },
    onError: () => { toast.error('Error al actualizar finca'); },
  });
}

// ==================== DIVISION MUTATIONS ====================

export function useCreateDivision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DivisionFormData) => createMockDivision(data),
    onSuccess: () => {
      toast.success('Division creada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['divisions'] });
      queryClient.invalidateQueries({ queryKey: ['finca-dashboard'] });
    },
    onError: () => { toast.error('Error al crear division'); },
  });
}

export function useUpdateDivision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DivisionFormData }) =>
      updateMockDivision(id, data),
    onSuccess: () => {
      toast.success('Division actualizada');
      queryClient.invalidateQueries({ queryKey: ['divisions'] });
      queryClient.invalidateQueries({ queryKey: ['division'] });
      queryClient.invalidateQueries({ queryKey: ['finca-dashboard'] });
    },
    onError: () => { toast.error('Error al actualizar division'); },
  });
}

export function useDeleteDivision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockDivision(id),
    onSuccess: () => {
      toast.success('Division eliminada');
      queryClient.invalidateQueries({ queryKey: ['divisions'] });
      queryClient.invalidateQueries({ queryKey: ['finca-dashboard'] });
    },
    onError: () => { toast.error('Error al eliminar division'); },
  });
}

// ==================== GENERAL PLAN MUTATIONS ====================

export function useCreateGeneralPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GeneralPlanFormData) => createMockGeneralPlan(data),
    onSuccess: () => {
      toast.success('Plan general creado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['general-plans'] });
      queryClient.invalidateQueries({ queryKey: ['annual-plan-plans'] });
      queryClient.invalidateQueries({ queryKey: ['aggregated-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['finca-dashboard'] });
    },
    onError: () => { toast.error('Error al crear plan general'); },
  });
}

export function useUpdateGeneralPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: GeneralPlanFormData }) =>
      updateMockGeneralPlan(id, data),
    onSuccess: () => {
      toast.success('Plan general actualizado');
      queryClient.invalidateQueries({ queryKey: ['general-plans'] });
      queryClient.invalidateQueries({ queryKey: ['general-plan'] });
      queryClient.invalidateQueries({ queryKey: ['annual-plan-plans'] });
      queryClient.invalidateQueries({ queryKey: ['aggregated-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['finca-dashboard'] });
    },
    onError: () => { toast.error('Error al actualizar plan general'); },
  });
}

export function useDeleteGeneralPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockGeneralPlan(id),
    onSuccess: () => {
      toast.success('Plan general eliminado');
      queryClient.invalidateQueries({ queryKey: ['general-plans'] });
      queryClient.invalidateQueries({ queryKey: ['annual-plan-plans'] });
      queryClient.invalidateQueries({ queryKey: ['aggregated-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['finca-dashboard'] });
    },
    onError: () => { toast.error('Error al eliminar plan general'); },
  });
}
