import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
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
      toast.success('Venta registrada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'sales'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'receivable'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'byModule'] });
    },
    onError: () => { toast.error('Error al registrar venta'); },
  });
}

export function useUpdateSaleRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SaleRecordFormData }) =>
      updateMockSaleRecord(id, data),
    onSuccess: () => {
      toast.success('Venta actualizada');
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'sales'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'receivable'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'byModule'] });
    },
    onError: () => { toast.error('Error al actualizar venta'); },
  });
}

export function useDeleteSaleRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockSaleRecord(id),
    onSuccess: () => {
      toast.success('Venta eliminada');
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'sales'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'receivable'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'byModule'] });
    },
    onError: () => { toast.error('Error al eliminar venta'); },
  });
}

// Purchase Record mutations
export function useCreatePurchaseRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PurchaseRecordFormData) => createMockPurchaseRecord(data),
    onSuccess: () => {
      toast.success('Compra registrada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'purchases'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'payable'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'budgets'] });
    },
    onError: () => { toast.error('Error al registrar compra'); },
  });
}

export function useUpdatePurchaseRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PurchaseRecordFormData }) =>
      updateMockPurchaseRecord(id, data),
    onSuccess: () => {
      toast.success('Compra actualizada');
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'purchases'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'payable'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'budgets'] });
    },
    onError: () => { toast.error('Error al actualizar compra'); },
  });
}

export function useDeletePurchaseRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockPurchaseRecord(id),
    onSuccess: () => {
      toast.success('Compra eliminada');
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'purchases'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'payable'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'budgets'] });
    },
    onError: () => { toast.error('Error al eliminar compra'); },
  });
}

// ==================== Accounts Receivable mutations ====================

export function useCreateAccountReceivable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AccountsReceivableFormData) => createMockAccountReceivable(data),
    onSuccess: () => {
      toast.success('Cuenta por cobrar creada');
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'receivable'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'stats'] });
    },
    onError: () => { toast.error('Error al crear cuenta por cobrar'); },
  });
}

export function useUpdateAccountReceivable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AccountsReceivableFormData }) =>
      updateMockAccountReceivable(id, data),
    onSuccess: () => {
      toast.success('Cuenta por cobrar actualizada');
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'receivable'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'stats'] });
    },
    onError: () => { toast.error('Error al actualizar cuenta por cobrar'); },
  });
}

export function useDeleteAccountReceivable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockAccountReceivable(id),
    onSuccess: () => {
      toast.success('Cuenta por cobrar eliminada');
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'receivable'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'stats'] });
    },
    onError: () => { toast.error('Error al eliminar cuenta por cobrar'); },
  });
}

// ==================== Accounts Payable mutations ====================

export function useCreateAccountPayable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AccountsPayableFormData) => createMockAccountPayable(data),
    onSuccess: () => {
      toast.success('Cuenta por pagar creada');
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'payable'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'stats'] });
    },
    onError: () => { toast.error('Error al crear cuenta por pagar'); },
  });
}

export function useUpdateAccountPayable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AccountsPayableFormData }) =>
      updateMockAccountPayable(id, data),
    onSuccess: () => {
      toast.success('Cuenta por pagar actualizada');
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'payable'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'stats'] });
    },
    onError: () => { toast.error('Error al actualizar cuenta por pagar'); },
  });
}

export function useDeleteAccountPayable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockAccountPayable(id),
    onSuccess: () => {
      toast.success('Cuenta por pagar eliminada');
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'payable'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'stats'] });
    },
    onError: () => { toast.error('Error al eliminar cuenta por pagar'); },
  });
}

// ==================== Budget mutations ====================

export function useCreateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BudgetFormData) => createMockBudget(data),
    onSuccess: () => {
      toast.success('Presupuesto creado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'budgetsList'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'budgets'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'stats'] });
    },
    onError: () => { toast.error('Error al crear presupuesto'); },
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: BudgetFormData }) =>
      updateMockBudget(id, data),
    onSuccess: () => {
      toast.success('Presupuesto actualizado');
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'budgetsList'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'budgets'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'stats'] });
    },
    onError: () => { toast.error('Error al actualizar presupuesto'); },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMockBudget(id),
    onSuccess: () => {
      toast.success('Presupuesto eliminado');
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'budgetsList'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'budgets'] });
      queryClient.invalidateQueries({ queryKey: ['finanzas', 'stats'] });
    },
    onError: () => { toast.error('Error al eliminar presupuesto'); },
  });
}
