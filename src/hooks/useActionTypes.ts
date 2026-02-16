import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getMockAllActionTypes,
  addMockCustomActionType,
} from '../services/mock/actionTypes.mock';

// Hook to get all action types (built-in + custom)
export function useActionTypes() {
  return useQuery({
    queryKey: ['action-types'],
    queryFn: getMockAllActionTypes,
  });
}

// Hook to add a new custom action type
export function useAddActionType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ label, value }: { label: string; value: string }) =>
      addMockCustomActionType(label, value),
    onSuccess: () => {
      toast.success('Tipo de accion agregado');
      queryClient.invalidateQueries({ queryKey: ['action-types'] });
    },
    onError: () => { toast.error('Error al agregar tipo de accion'); },
  });
}
