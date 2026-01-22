import { useQuery } from '@tanstack/react-query';
import {
  getMockFacilities,
  getMockEquipment,
  getMockMaintenanceRecords,
  getMockInfraestructuraStats,
  getMockFacilitiesByType,
  getMockEquipmentByStatus,
  getMockMaintenanceTimeline,
  getMockInfrastructureActivity,
} from '../services/mock/infraestructura.mock';

export function useFacilities() {
  return useQuery({
    queryKey: ['infraestructura', 'facilities'],
    queryFn: getMockFacilities,
  });
}

export function useEquipment() {
  return useQuery({
    queryKey: ['infraestructura', 'equipment'],
    queryFn: getMockEquipment,
  });
}

export function useMaintenanceRecords() {
  return useQuery({
    queryKey: ['infraestructura', 'maintenance'],
    queryFn: getMockMaintenanceRecords,
  });
}

export function useInfraestructuraStats() {
  return useQuery({
    queryKey: ['infraestructura', 'stats'],
    queryFn: getMockInfraestructuraStats,
  });
}

export function useFacilitiesByType() {
  return useQuery({
    queryKey: ['infraestructura', 'facilitiesByType'],
    queryFn: getMockFacilitiesByType,
  });
}

export function useEquipmentByStatus() {
  return useQuery({
    queryKey: ['infraestructura', 'equipmentByStatus'],
    queryFn: getMockEquipmentByStatus,
  });
}

export function useMaintenanceTimeline() {
  return useQuery({
    queryKey: ['infraestructura', 'maintenanceTimeline'],
    queryFn: getMockMaintenanceTimeline,
  });
}

export function useInfrastructureActivity() {
  return useQuery({
    queryKey: ['infraestructura', 'activity'],
    queryFn: getMockInfrastructureActivity,
  });
}
