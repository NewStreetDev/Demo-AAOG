import type { BaseEntity } from './common.types';

export interface Worker extends BaseEntity {
  name: string;
  role: string;
  email?: string;
  phone: string;
  hireDate: Date;
  status: 'active' | 'inactive';
  salary: number;
}

export interface Equipment extends BaseEntity {
  name: string;
  type: string;
  purchaseDate: Date;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  maintenanceSchedule: Date;
  status: 'active' | 'maintenance' | 'retired';
}
