import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createMockSaleRecord,
  updateMockSaleRecord,
  deleteMockSaleRecord,
  createMockPurchaseRecord,
  updateMockPurchaseRecord,
  deleteMockPurchaseRecord,
  createMockAccountReceivable,
  updateMockAccountReceivable,
  deleteMockAccountReceivable,
  createMockAccountPayable,
  updateMockAccountPayable,
  deleteMockAccountPayable,
  createMockBudget,
  updateMockBudget,
  deleteMockBudget,
} from '../services/mock/finanzas.mock';
import type {
  SaleRecordFormData,
  PurchaseRecordFormData,
  AccountsReceivableFormData,
  AccountsPayableFormData,
  BudgetFormData,
} from '../schemas/finanzas.schema';

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

// ==================== Accounts Receivable mutations ====================

export function useCreateAccountReceivable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AccountsReceivableFormData) => createMockAccountReceivable(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'receivable'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'stats'] });
    },
  });
}

export function useUpdateAccountReceivable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AccountsReceivableFormData }) =>
      updateMockAccountReceivable(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'receivable'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'stats'] });
    },
  });
}

export function useDeleteAccountReceivable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockAccountReceivable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'receivable'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'stats'] });
    },
  });
}

// ==================== Accounts Payable mutations ====================

export function useCreateAccountPayable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AccountsPayableFormData) => createMockAccountPayable(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'payable'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'stats'] });
    },
  });
}

export function useUpdateAccountPayable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AccountsPayableFormData }) =>
      updateMockAccountPayable(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'payable'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'stats'] });
    },
  });
}

export function useDeleteAccountPayable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockAccountPayable(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'payable'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'stats'] });
    },
  });
}

// ==================== Budget mutations ====================

export function useCreateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BudgetFormData) => createMockBudget(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'budgetsList'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'budgets'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'stats'] });
    },
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: BudgetFormData }) =>
      updateMockBudget(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'budgetsList'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'budgets'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'stats'] });
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'budgetsList'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'budgets'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'stats'] });
    },
  });
}
