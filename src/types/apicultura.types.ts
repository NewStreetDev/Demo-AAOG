import type { BaseEntity } from './common.types';

export interface Apiary extends BaseEntity {
  name: string;
  location: { lat: number; lng: number };
  hiveCount: number;
  activeHives: number;
  lastInspection: string;
  status: 'healthy' | 'warning' | 'critical';
  production: {
    honey: number;
    wax: number;
    pollen: number;
  };
}

export interface Hive extends BaseEntity {
  apiaryId: string;
  hiveNumber: string;
  queenAge: number;
  population: 'low' | 'medium' | 'high';
  healthRating: number;
  weight: 'poor' | 'regular' | 'good';
  honeyMaturity: number;
  status: 'active' | 'inactive' | 'quarantine';
}

export interface Inspection extends BaseEntity {
  apiaryId: string;
  hiveId?: string;
  date: Date;
  queenPresent: boolean;
  queenAge?: number;
  layingStatus: 'excellent' | 'good' | 'poor' | 'none';
  healthRating: number;
  population: number;
  broodCount: number;
  foodReserves: {
    pollen: number;
    nectar: number;
  };
  comments: string;
}
