import type { BaseEntity } from './common.types';

// Dashboard Metrics
export interface DashboardMetric {
  label: string;
  value: string | number;
  trend?: number; // percentage change
  sparklineData?: number[];
  icon?: string;
  color?: string;
}

// Production Summary
export interface ProductionItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  icon?: string;
  color?: string;
}

export interface ProductionSummary {
  month: string;
  items: ProductionItem[];
  totalValue: number;
}

// Inventory Item
export interface InventoryItem extends BaseEntity {
  name: string;
  category: 'insumo' | 'equipo' | 'medicamento' | 'alimento';
  quantity: number;
  unit: string;
  minStock: number;
  status: 'en_stock' | 'bajo' | 'critico';
  location?: string;
}

// Task
export interface Task extends BaseEntity {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo?: string;
  dueDate?: Date;
  category: 'revision' | 'maintenance' | 'harvest' | 'treatment' | 'other';
}

// Worker with extended info for dashboard
export interface WorkerSummary {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status: 'active' | 'inactive';
  currentTask?: string;
}

// Activity for pie chart
export interface Activity {
  name: string;
  value: number;
  color: string;
}

// Weather
export interface WeatherData {
  current: {
    temperature: number;
    condition: string;
    humidity: number;
    icon: string;
  };
  forecast: WeatherForecast[];
}

export interface WeatherForecast {
  day: string;
  tempHigh: number;
  tempLow: number;
  condition: string;
  icon: string;
}

// Monthly income
export interface MonthlyIncome {
  month: string;
  amount: number;
  breakdown: {
    category: string;
    amount: number;
  }[];
}

// Panel General (Admin) Types
export interface GeneralStats {
  registeredFarms: number;
  activeWorkers: number;
  monthlyProduction: { value: number; unit: string };
  monthlyIncome: number;
}

export interface FarmSummary {
  id: string;
  name: string;
  production: number;
  productionUnit: string;
  color: string;
  location: { lat: number; lng: number };
}

export interface Document {
  id: string;
  name: string;
  type: 'certificate' | 'report' | 'audit';
  status: 'pending' | 'approved' | 'review';
}

export interface StatsChartData {
  month: string;
  production: number;
  income: number;
}

export interface AuditSummary {
  total: number;
  inReview: number;
  approved: number;
  pending: number;
}
