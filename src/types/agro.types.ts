import type { BaseEntity } from './common.types';

export interface Crop extends BaseEntity {
  name: string;
  variety: string;
  area: number;
  plantingDate: Date;
  expectedHarvestDate: Date;
  status: 'planted' | 'growing' | 'harvested';
  location: string;
}

export interface Harvest extends BaseEntity {
  cropId: string;
  date: Date;
  quantity: number;
  unit: string;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  notes?: string;
}
