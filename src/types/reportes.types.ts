import type { BaseEntity } from './common.types';

// Report types
export type ReportType = 'production' | 'financial' | 'inventory' | 'comprehensive';

// Report periods
export type ReportPeriod = 'monthly' | 'quarterly' | 'annual';

// Report status
export type ReportStatus = 'draft' | 'generated' | 'exported' | 'archived';

// Export format
export type ExportFormat = 'pdf' | 'excel' | 'csv';

// Module names
export type ModuleName = 'agro' | 'pecuario' | 'apicultura' | 'procesamiento' | 'finanzas' | 'insumos';

// Module comparison data
export interface ModuleComparison {
  module: ModuleName;
  moduleName: string;
  production: number;
  productionUnit: string;
  revenue: number;
  revenuePercentage: number;
  expense: number;
  profitability: number;
  efficiency: number;
  color: string;
}

// Consolidated statistics
export interface ConsolidatedStats {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  profitMargin: number;
  totalProduction: number;
  productionUnit: string;
  agroProduction: number;
  pecuarioProduction: number;
  apiculturaProduction: number;
  procesamientoProduction: number;
  totalInventoryValue: number;
  lowStockAlerts: number;
  criticalStockAlerts: number;
}

// Period comparison
export interface PeriodComparison {
  currentPeriod: {
    production: number;
    revenue: number;
    expense: number;
    profit: number;
  };
  previousPeriod: {
    production: number;
    revenue: number;
    expense: number;
    profit: number;
  };
  variance: {
    productionChangePercent: number;
    revenueChangePercent: number;
    expenseChangePercent: number;
    profitChangePercent: number;
  };
  trend: 'improving' | 'declining' | 'stable';
}

// Trend data for charts
export interface TrendData {
  period: string;
  production: number;
  revenue: number;
  expense: number;
  profit: number;
  agroProduction: number;
  pecuarioProduction: number;
  apiculturaProduction: number;
  procesamientoProduction: number;
}

// Generated report
export interface GeneratedReport extends BaseEntity {
  reportCode: string;
  title: string;
  description?: string;
  reportType: ReportType;
  period: ReportPeriod;
  periodStart: Date;
  periodEnd: Date;
  fincaName: string;
  status: ReportStatus;
  generatedBy: string;
  formats: ExportFormat[];
  fileSize?: number;
  viewCount: number;
  downloadCount: number;
}

// Dashboard stats
export interface ReportesDashboardStats {
  totalReports: number;
  reportsThisMonth: number;
  generatedToday: number;
  pendingExports: number;
  latestReportDate?: Date;
  latestReportType?: ReportType;
}

// Report task
export interface ReportesTask {
  id: string;
  title: string;
  type: 'report_generation' | 'export' | 'review' | 'archive' | 'distribution';
  reportId?: string;
  relatedPeriod?: ReportPeriod;
  dueDate: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo?: string;
  progress?: number;
}
