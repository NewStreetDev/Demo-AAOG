import { useQuery } from '@tanstack/react-query';
import {
  getMockSalesRecords,
  getMockPurchaseRecords,
  getMockFinanzasStats,
  getMockMonthlyFinancialData,
  getMockSalesByModule,
  getMockBudgetComparisons,
  getMockFinanzasTasks,
  getMockAccountsReceivable,
  getMockAccountsPayable,
} from '../services/mock/finanzas.mock';

export function useFinanzasStats() {
  return useQuery({
    queryKey: ['finanzas', 'stats'],
    queryFn: getMockFinanzasStats,
  });
}

export function useSalesRecords() {
  return useQuery({
    queryKey: ['finanzas', 'sales'],
    queryFn: getMockSalesRecords,
  });
}

export function usePurchaseRecords() {
  return useQuery({
    queryKey: ['finanzas', 'purchases'],
    queryFn: getMockPurchaseRecords,
  });
}

export function useMonthlyFinancialData() {
  return useQuery({
    queryKey: ['finanzas', 'monthly'],
    queryFn: getMockMonthlyFinancialData,
  });
}

export function useSalesByModule() {
  return useQuery({
    queryKey: ['finanzas', 'byModule'],
    queryFn: getMockSalesByModule,
  });
}

export function useBudgetComparisons() {
  return useQuery({
    queryKey: ['finanzas', 'budgets'],
    queryFn: getMockBudgetComparisons,
  });
}

export function useFinanzasTasks() {
  return useQuery({
    queryKey: ['finanzas', 'tasks'],
    queryFn: getMockFinanzasTasks,
  });
}

export function useAccountsReceivable() {
  return useQuery({
    queryKey: ['finanzas', 'receivable'],
    queryFn: getMockAccountsReceivable,
  });
}

export function useAccountsPayable() {
  return useQuery({
    queryKey: ['finanzas', 'payable'],
    queryFn: getMockAccountsPayable,
  });
}
