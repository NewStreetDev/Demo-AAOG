import { useQuery } from '@tanstack/react-query';
import {
  getMockWorkers,
  getMockWorkerAssignments,
  getMockWorkLogs,
  getMockTrabajadoresTasks,
  getMockTrabajadoresStats,
  getMockAttendanceSummary,
  getMockWorkerPerformance,
  getMockTasksByWorker,
} from '../services/mock/trabajadores.mock';

export function useWorkers() {
  return useQuery({
    queryKey: ['trabajadores', 'workers'],
    queryFn: getMockWorkers,
  });
}

export function useWorkerAssignments() {
  return useQuery({
    queryKey: ['trabajadores', 'assignments'],
    queryFn: getMockWorkerAssignments,
  });
}

export function useWorkLogs() {
  return useQuery({
    queryKey: ['trabajadores', 'logs'],
    queryFn: getMockWorkLogs,
  });
}

export function useTrabajadoresTasks() {
  return useQuery({
    queryKey: ['trabajadores', 'tasks'],
    queryFn: getMockTrabajadoresTasks,
  });
}

export function useTrabajadoresStats() {
  return useQuery({
    queryKey: ['trabajadores', 'stats'],
    queryFn: getMockTrabajadoresStats,
  });
}

export function useAttendanceSummary() {
  return useQuery({
    queryKey: ['trabajadores', 'attendance'],
    queryFn: getMockAttendanceSummary,
  });
}

export function useWorkerPerformance() {
  return useQuery({
    queryKey: ['trabajadores', 'performance'],
    queryFn: getMockWorkerPerformance,
  });
}

export function useTasksByWorker() {
  return useQuery({
    queryKey: ['trabajadores', 'tasksByWorker'],
    queryFn: getMockTasksByWorker,
  });
}
