import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createMockFacility,
  updateMockFacility,
  deleteMockFacility,
  createMockEquipment,
  updateMockEquipment,
  deleteMockEquipment,
} from '../services/mock/infraestructura.mock';
import type { FacilityFormData, EquipmentFormData } from '../schemas/infraestructura.schema';

// Facility Mutations
export function useCreateFacility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FacilityFormData) => createMockFacility(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['infraestructura', 'facilities'] });
      queryClient.invalidateQueries({ queryKey: ['infraestructura', 'stats'] });
    },
  });
}

export function useUpdateFacility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FacilityFormData }) =>
      updateMockFacility(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['infraestructura', 'facilities'] });
      queryClient.invalidateQueries({ queryKey: ['infraestructura', 'stats'] });
    },
  });
}

export function useDeleteFacility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockFacility(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['infraestructura', 'facilities'] });
      queryClient.invalidateQueries({ queryKey: ['infraestructura', 'stats'] });
    },
  });
}

// Equipment Mutations
export function useCreateEquipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EquipmentFormData) => createMockEquipment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['infraestructura', 'equipment'] });
      queryClient.invalidateQueries({ queryKey: ['infraestructura', 'stats'] });
    },
  });
}

export function useUpdateEquipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EquipmentFormData }) =>
      updateMockEquipment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['infraestructura', 'equipment'] });
      queryClient.invalidateQueries({ queryKey: ['infraestructura', 'stats'] });
    },
  });
}

export function useDeleteEquipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockEquipment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['infraestructura', 'equipment'] });
      queryClient.invalidateQueries({ queryKey: ['infraestructura', 'stats'] });
    },
  });
}
