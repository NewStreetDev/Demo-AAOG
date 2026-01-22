import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMockActions,
  getMockActionsByModule,
  getMockRecentActions,
  getMockActionStats,
  createMockAction,
  updateMockAction,
  deleteMockAction,
} from '../services/mock/actions.mock';
import type { SystemModule, ActionInsumo } from '../types/common.types';
import type { ActionFormData } from '../schemas/action.schema';

// Queries
export function useActions() {
  return useQuery({
    queryKey: ['actions'],
    queryFn: getMockActions,
  });
}

export function useActionsByModule(module: SystemModule) {
  return useQuery({
    queryKey: ['actions', module],
    queryFn: () => getMockActionsByModule(module),
  });
}

export function useRecentActions(limit: number = 5) {
  return useQuery({
    queryKey: ['actions', 'recent', limit],
    queryFn: () => getMockRecentActions(limit),
  });
}

export function useActionStats() {
  return useQuery({
    queryKey: ['actions', 'stats'],
    queryFn: getMockActionStats,
  });
}

// Mutations
export function useCreateAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      insumos,
      workerName,
    }: {
      data: ActionFormData;
      insumos: ActionInsumo[];
      workerName: string;
    }) => createMockAction(data, insumos, workerName),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['actions'] });
      // Also invalidate module-specific queries
      queryClient.invalidateQueries({ queryKey: ['actions', variables.data.module] });
    },
  });
}

export function useUpdateAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
      insumos,
      workerName,
    }: {
      id: string;
      data: ActionFormData;
      insumos: ActionInsumo[];
      workerName: string;
    }) => updateMockAction(id, data, insumos, workerName),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['actions'] });
      queryClient.invalidateQueries({ queryKey: ['actions', variables.data.module] });
    },
  });
}

export function useDeleteAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actions'] });
    },
  });
}
