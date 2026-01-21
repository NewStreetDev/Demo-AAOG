import type { BaseEntity } from './common.types';

export interface Livestock extends BaseEntity {
  tag: string;
  species: 'cattle' | 'sheep' | 'goat' | 'pig' | 'other';
  breed: string;
  birthDate: Date;
  gender: 'male' | 'female';
  weight: number;
  status: 'active' | 'sold' | 'deceased';
  location: string;
  motherId?: string;
  fatherId?: string;
}

export interface HealthRecord extends BaseEntity {
  livestockId: string;
  date: Date;
  type: 'vaccination' | 'treatment' | 'checkup';
  description: string;
  veterinarian?: string;
  nextCheckup?: Date;
}
