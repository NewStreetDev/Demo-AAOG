import type { BaseEntity } from './common.types';

export interface Transaction extends BaseEntity {
  date: Date;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  module: 'apicultura' | 'agro' | 'pecuario' | 'finca' | 'general';
  status: 'pending' | 'completed' | 'cancelled';
}

export interface Budget extends BaseEntity {
  name: string;
  category: string;
  amount: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  startDate: Date;
  endDate: Date;
  spent: number;
}
