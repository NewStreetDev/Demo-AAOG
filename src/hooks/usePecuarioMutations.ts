import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createMockLivestock,
  updateMockLivestock,
  deleteMockLivestock,
  createMockPotrero,
  updateMockPotrero,
  deleteMockPotrero,
  createMockHealthRecord,
  updateMockHealthRecord,
  deleteMockHealthRecord,
  createMockGroupHealthAction,
  createMockReproductionRecord,
  updateMockReproductionRecord,
  deleteMockReproductionRecord,
  createMockMilkProduction,
  updateMockMilkProduction,
  deleteMockMilkProduction,
  createMockLivestockGroup,
  updateMockLivestockGroup,
  deleteMockLivestockGroup,
  createMockBeehive,
  updateMockBeehive,
  deleteMockBeehive,
} from '../services/mock/pecuario.mock';
import type {
  LivestockFormData,
  PotreroFormData,
  HealthRecordFormData,
  GroupHealthActionFormData,
  ReproductionRecordFormData,
  MilkProductionFormData,
  LivestockGroupFormData,
  BeehiveFormData,
} from '../schemas/pecuario.schema';

// Livestock mutations
export function useCreateLivestock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LivestockFormData) => createMockLivestock(data),
    onSuccess: () => {
      toast.success('Animal registrado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['livestock'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
      queryClient.invalidateQueries({ queryKey: ['category-distribution'] });
    },
    onError: () => { toast.error('Error al registrar animal'); },
  });
}

export function useUpdateLivestock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: LivestockFormData }) =>
      updateMockLivestock(id, data),
    onSuccess: () => {
      toast.success('Animal actualizado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['livestock'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
      queryClient.invalidateQueries({ queryKey: ['category-distribution'] });
    },
    onError: () => { toast.error('Error al actualizar animal'); },
  });
}

export function useDeleteLivestock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockLivestock(id),
    onSuccess: () => {
      toast.success('Animal eliminado');
      queryClient.invalidateQueries({ queryKey: ['livestock'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
      queryClient.invalidateQueries({ queryKey: ['category-distribution'] });
    },
    onError: () => { toast.error('Error al eliminar animal'); },
  });
}

// Potrero mutations
export function useCreatePotrero() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PotreroFormData) => createMockPotrero(data),
    onSuccess: () => {
      toast.success('Potrero creado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['potreros'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
    },
    onError: () => { toast.error('Error al crear potrero'); },
  });
}

export function useUpdatePotrero() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PotreroFormData }) =>
      updateMockPotrero(id, data),
    onSuccess: () => {
      toast.success('Potrero actualizado');
      queryClient.invalidateQueries({ queryKey: ['potreros'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
    },
    onError: () => { toast.error('Error al actualizar potrero'); },
  });
}

export function useDeletePotrero() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockPotrero(id),
    onSuccess: () => {
      toast.success('Potrero eliminado');
      queryClient.invalidateQueries({ queryKey: ['potreros'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
    },
    onError: () => { toast.error('Error al eliminar potrero'); },
  });
}

// ========================================
// Health Record mutations
// ========================================

export function useCreateHealthRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: HealthRecordFormData) => createMockHealthRecord(data),
    onSuccess: () => {
      toast.success('Registro de salud creado');
      queryClient.invalidateQueries({ queryKey: ['health-records'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-tasks'] });
    },
    onError: () => { toast.error('Error al crear registro de salud'); },
  });
}

export function useUpdateHealthRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: HealthRecordFormData }) =>
      updateMockHealthRecord(id, data),
    onSuccess: () => {
      toast.success('Registro de salud actualizado');
      queryClient.invalidateQueries({ queryKey: ['health-records'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-tasks'] });
    },
    onError: () => { toast.error('Error al actualizar registro de salud'); },
  });
}

export function useDeleteHealthRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockHealthRecord(id),
    onSuccess: () => {
      toast.success('Registro de salud eliminado');
      queryClient.invalidateQueries({ queryKey: ['health-records'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-tasks'] });
    },
    onError: () => { toast.error('Error al eliminar registro de salud'); },
  });
}

// ========================================
// Group Health Action mutations
// ========================================

export function useCreateGroupHealthAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GroupHealthActionFormData) => createMockGroupHealthAction(data),
    onSuccess: () => {
      toast.success('Accion grupal de salud registrada');
      queryClient.invalidateQueries({ queryKey: ['group-health-actions'] });
      queryClient.invalidateQueries({ queryKey: ['recent-health-actions'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-tasks'] });
    },
    onError: () => { toast.error('Error al registrar accion grupal'); },
  });
}

// ========================================
// Reproduction Record mutations
// ========================================

export function useCreateReproductionRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReproductionRecordFormData) => createMockReproductionRecord(data),
    onSuccess: () => {
      toast.success('Registro de reproduccion creado');
      queryClient.invalidateQueries({ queryKey: ['reproduction-records'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-tasks'] });
    },
    onError: () => { toast.error('Error al crear registro de reproduccion'); },
  });
}

export function useUpdateReproductionRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReproductionRecordFormData }) =>
      updateMockReproductionRecord(id, data),
    onSuccess: () => {
      toast.success('Registro de reproduccion actualizado');
      queryClient.invalidateQueries({ queryKey: ['reproduction-records'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-tasks'] });
    },
    onError: () => { toast.error('Error al actualizar registro'); },
  });
}

export function useDeleteReproductionRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockReproductionRecord(id),
    onSuccess: () => {
      toast.success('Registro de reproduccion eliminado');
      queryClient.invalidateQueries({ queryKey: ['reproduction-records'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-tasks'] });
    },
    onError: () => { toast.error('Error al eliminar registro'); },
  });
}

// ========================================
// Milk Production mutations
// ========================================

export function useCreateMilkProduction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MilkProductionFormData) => createMockMilkProduction(data),
    onSuccess: () => {
      toast.success('Produccion de leche registrada');
      queryClient.invalidateQueries({ queryKey: ['milk-production'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-production'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-production-data'] });
    },
    onError: () => { toast.error('Error al registrar produccion'); },
  });
}

export function useUpdateMilkProduction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MilkProductionFormData }) =>
      updateMockMilkProduction(id, data),
    onSuccess: () => {
      toast.success('Produccion de leche actualizada');
      queryClient.invalidateQueries({ queryKey: ['milk-production'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-production'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-production-data'] });
    },
    onError: () => { toast.error('Error al actualizar produccion'); },
  });
}

export function useDeleteMilkProduction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockMilkProduction(id),
    onSuccess: () => {
      toast.success('Produccion de leche eliminada');
      queryClient.invalidateQueries({ queryKey: ['milk-production'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-production'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-production-data'] });
    },
    onError: () => { toast.error('Error al eliminar produccion'); },
  });
}

// ========================================
// Livestock Group mutations
// ========================================

export function useCreateLivestockGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LivestockGroupFormData) => createMockLivestockGroup(data),
    onSuccess: () => {
      toast.success('Grupo creado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['livestock-groups'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-dashboard'] });
    },
    onError: () => { toast.error('Error al crear grupo'); },
  });
}

export function useUpdateLivestockGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: LivestockGroupFormData }) =>
      updateMockLivestockGroup(id, data),
    onSuccess: () => {
      toast.success('Grupo actualizado');
      queryClient.invalidateQueries({ queryKey: ['livestock-groups'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-dashboard'] });
    },
    onError: () => { toast.error('Error al actualizar grupo'); },
  });
}

export function useDeleteLivestockGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockLivestockGroup(id),
    onSuccess: () => {
      toast.success('Grupo eliminado');
      queryClient.invalidateQueries({ queryKey: ['livestock-groups'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-dashboard'] });
    },
    onError: () => { toast.error('Error al eliminar grupo'); },
  });
}

// ========================================
// Beehive (Colmena) mutations
// ========================================

export function useCreateBeehive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BeehiveFormData) => createMockBeehive(data),
    onSuccess: () => {
      toast.success('Colmena registrada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['beehives'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-dashboard'] });
    },
    onError: () => { toast.error('Error al registrar colmena'); },
  });
}

export function useUpdateBeehive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: BeehiveFormData }) =>
      updateMockBeehive(id, data),
    onSuccess: () => {
      toast.success('Colmena actualizada');
      queryClient.invalidateQueries({ queryKey: ['beehives'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-dashboard'] });
    },
    onError: () => { toast.error('Error al actualizar colmena'); },
  });
}

export function useDeleteBeehive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockBeehive(id),
    onSuccess: () => {
      toast.success('Colmena eliminada');
      queryClient.invalidateQueries({ queryKey: ['beehives'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pecuario-dashboard'] });
    },
    onError: () => { toast.error('Error al eliminar colmena'); },
  });
}
