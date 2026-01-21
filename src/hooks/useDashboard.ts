import { useQuery } from '@tanstack/react-query';
import {
  getMockMetrics,
  getMockProductionSummary,
  getMockInventory,
  getMockActivities,
  getMockWorkers,
  getMockTasks,
  getMockWeather,
  getMockMonthlyIncome,
} from '../services/mock/dashboard.mock';

// Query keys
export const dashboardKeys = {
  all: ['dashboard'] as const,
  metrics: () => [...dashboardKeys.all, 'metrics'] as const,
  production: () => [...dashboardKeys.all, 'production'] as const,
  inventory: () => [...dashboardKeys.all, 'inventory'] as const,
  activities: () => [...dashboardKeys.all, 'activities'] as const,
  workers: () => [...dashboardKeys.all, 'workers'] as const,
  tasks: () => [...dashboardKeys.all, 'tasks'] as const,
  weather: () => [...dashboardKeys.all, 'weather'] as const,
  income: () => [...dashboardKeys.all, 'income'] as const,
};

// Hooks
export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: dashboardKeys.metrics(),
    queryFn: getMockMetrics,
  });
};

export const useProductionSummary = () => {
  return useQuery({
    queryKey: dashboardKeys.production(),
    queryFn: getMockProductionSummary,
  });
};

export const useInventory = () => {
  return useQuery({
    queryKey: dashboardKeys.inventory(),
    queryFn: getMockInventory,
  });
};

export const useActivities = () => {
  return useQuery({
    queryKey: dashboardKeys.activities(),
    queryFn: getMockActivities,
  });
};

export const useWorkers = () => {
  return useQuery({
    queryKey: dashboardKeys.workers(),
    queryFn: getMockWorkers,
  });
};

export const useTasks = () => {
  return useQuery({
    queryKey: dashboardKeys.tasks(),
    queryFn: getMockTasks,
  });
};

export const useWeather = () => {
  return useQuery({
    queryKey: dashboardKeys.weather(),
    queryFn: getMockWeather,
  });
};

export const useMonthlyIncome = () => {
  return useQuery({
    queryKey: dashboardKeys.income(),
    queryFn: getMockMonthlyIncome,
  });
};
