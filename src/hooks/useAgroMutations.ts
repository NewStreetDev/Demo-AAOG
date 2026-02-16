import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createMockLote,
  updateMockLote,
  deleteMockLote,
  createMockCrop,
  updateMockCrop,
  deleteMockCrop,
  createMockAgroAction,
  updateMockAgroAction,
  deleteMockAgroAction,
  createMockHarvest,
  updateMockHarvest,
  deleteMockHarvest,
} from '../services/mock/agro.mock';
import type { LoteFormData, CropFormData, AgroActionFormData, HarvestFormData } from '../schemas/agro.schema';

// Lote mutations
export function useCreateLote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoteFormData) => createMockLote(data),
    onSuccess: () => {
      toast.success('Lote creado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['lotes'] });
      queryClient.invalidateQueries({ queryKey: ['agro-stats'] });
    },
    onError: () => { toast.error('Error al crear lote'); },
  });
}

export function useUpdateLote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: LoteFormData }) =>
      updateMockLote(id, data),
    onSuccess: () => {
      toast.success('Lote actualizado');
      queryClient.invalidateQueries({ queryKey: ['lotes'] });
      queryClient.invalidateQueries({ queryKey: ['agro-stats'] });
      queryClient.invalidateQueries({ queryKey: ['crops'] });
    },
    onError: () => { toast.error('Error al actualizar lote'); },
  });
}

export function useDeleteLote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockLote(id),
    onSuccess: () => {
      toast.success('Lote eliminado');
      queryClient.invalidateQueries({ queryKey: ['lotes'] });
      queryClient.invalidateQueries({ queryKey: ['agro-stats'] });
    },
    onError: () => { toast.error('Error al eliminar lote'); },
  });
}

// Crop mutations
export function useCreateCrop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CropFormData) => createMockCrop(data),
    onSuccess: () => {
      toast.success('Cultivo registrado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['crops'] });
      queryClient.invalidateQueries({ queryKey: ['agro-stats'] });
      queryClient.invalidateQueries({ queryKey: ['crop-distribution'] });
      queryClient.invalidateQueries({ queryKey: ['crop-summaries'] });
    },
    onError: () => { toast.error('Error al registrar cultivo'); },
  });
}

export function useUpdateCrop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CropFormData }) =>
      updateMockCrop(id, data),
    onSuccess: () => {
      toast.success('Cultivo actualizado');
      queryClient.invalidateQueries({ queryKey: ['crops'] });
      queryClient.invalidateQueries({ queryKey: ['agro-stats'] });
      queryClient.invalidateQueries({ queryKey: ['crop-distribution'] });
      queryClient.invalidateQueries({ queryKey: ['crop-summaries'] });
    },
    onError: () => { toast.error('Error al actualizar cultivo'); },
  });
}

export function useDeleteCrop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockCrop(id),
    onSuccess: () => {
      toast.success('Cultivo eliminado');
      queryClient.invalidateQueries({ queryKey: ['crops'] });
      queryClient.invalidateQueries({ queryKey: ['agro-stats'] });
      queryClient.invalidateQueries({ queryKey: ['crop-distribution'] });
      queryClient.invalidateQueries({ queryKey: ['crop-summaries'] });
    },
    onError: () => { toast.error('Error al eliminar cultivo'); },
  });
}

// ==================== AGRO ACTION MUTATIONS ====================

export function useCreateAgroAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AgroActionFormData) => createMockAgroAction(data),
    onSuccess: () => {
      toast.success('Accion agricola registrada');
      queryClient.invalidateQueries({ queryKey: ['agro-actions'] });
      queryClient.invalidateQueries({ queryKey: ['recent-agro-actions'] });
      queryClient.invalidateQueries({ queryKey: ['agro-stats'] });
      queryClient.invalidateQueries({ queryKey: ['agro-tasks'] });
    },
    onError: () => { toast.error('Error al registrar accion'); },
  });
}

export function useUpdateAgroAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AgroActionFormData }) =>
      updateMockAgroAction(id, data),
    onSuccess: () => {
      toast.success('Accion agricola actualizada');
      queryClient.invalidateQueries({ queryKey: ['agro-actions'] });
      queryClient.invalidateQueries({ queryKey: ['recent-agro-actions'] });
    },
    onError: () => { toast.error('Error al actualizar accion'); },
  });
}

export function useDeleteAgroAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockAgroAction(id),
    onSuccess: () => {
      toast.success('Accion agricola eliminada');
      queryClient.invalidateQueries({ queryKey: ['agro-actions'] });
      queryClient.invalidateQueries({ queryKey: ['recent-agro-actions'] });
    },
    onError: () => { toast.error('Error al eliminar accion'); },
  });
}

// ==================== HARVEST MUTATIONS ====================

export function useCreateHarvest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: HarvestFormData) => createMockHarvest(data),
    onSuccess: () => {
      toast.success('Cosecha registrada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['harvests'] });
      queryClient.invalidateQueries({ queryKey: ['agro-stats'] });
      queryClient.invalidateQueries({ queryKey: ['agro-production'] });
      queryClient.invalidateQueries({ queryKey: ['crops'] });
      queryClient.invalidateQueries({ queryKey: ['crop-summaries'] });
    },
    onError: () => { toast.error('Error al registrar cosecha'); },
  });
}

export function useUpdateHarvest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: HarvestFormData }) =>
      updateMockHarvest(id, data),
    onSuccess: () => {
      toast.success('Cosecha actualizada');
      queryClient.invalidateQueries({ queryKey: ['harvests'] });
      queryClient.invalidateQueries({ queryKey: ['agro-production'] });
    },
    onError: () => { toast.error('Error al actualizar cosecha'); },
  });
}

export function useDeleteHarvest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockHarvest(id),
    onSuccess: () => {
      toast.success('Cosecha eliminada');
      queryClient.invalidateQueries({ queryKey: ['harvests'] });
      queryClient.invalidateQueries({ queryKey: ['agro-production'] });
    },
    onError: () => { toast.error('Error al eliminar cosecha'); },
  });
}
