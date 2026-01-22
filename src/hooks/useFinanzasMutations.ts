import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createMockSaleRecord,
  updateMockSaleRecord,
  deleteMockSaleRecord,
  createMockPurchaseRecord,
  updateMockPurchaseRecord,
  deleteMockPurchaseRecord,
} from '../services/mock/finanzas.mock';
import type { SaleRecordFormData, PurchaseRecordFormData } from '../schemas/finanzas.schema';

// Sale Record mutations
export function useCreateSaleRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SaleRecordFormData) => createMockSaleRecord(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'sales'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'receivable'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'byModule'] });
    },
  });
}

export function useUpdateSaleRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SaleRecordFormData }) =>
      updateMockSaleRecord(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'sales'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'receivable'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'byModule'] });
    },
  });
}

export function useDeleteSaleRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockSaleRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'sales'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'receivable'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'byModule'] });
    },
  });
}

// Purchase Record mutations
export function useCreatePurchaseRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PurchaseRecordFormData) => createMockPurchaseRecord(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'purchases'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'payable'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'budgets'] });
    },
  });
}

export function useUpdatePurchaseRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PurchaseRecordFormData }) =>
      updateMockPurchaseRecord(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'purchases'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'payable'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'budgets'] });
    },
  });
}

export function useDeletePurchaseRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockPurchaseRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'purchases'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'payable'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'budgets'] });
    },
  });
}
