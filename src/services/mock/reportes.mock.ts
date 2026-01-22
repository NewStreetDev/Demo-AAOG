import type {
  ModuleComparison,
  ConsolidatedStats,
  PeriodComparison,
  TrendData,
  GeneratedReport,
  ReportesDashboardStats,
  ReportesTask,
} from '../../types/reportes.types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Module Comparisons
export const getMockModuleComparisons = async (): Promise<ModuleComparison[]> => {
  await delay(300);
  return [
    {
      module: 'agro',
      moduleName: 'Agricultura',
      production: 45000,
      productionUnit: 'kg',
      revenue: 6300000,
      revenuePercentage: 36.7,
      expense: 2500000,
      profitability: 60.3,
      efficiency: 92,
      color: '#10b981',
    },
    {
      module: 'pecuario',
      moduleName: 'Pecuario',
      production: 125000,
      productionUnit: 'L',
      revenue: 5220000,
      revenuePercentage: 30.4,
      expense: 2800000,
      profitability: 46.4,
      efficiency: 85,
      color: '#f97316',
    },
    {
      module: 'apicultura',
      moduleName: 'Apicultura',
      production: 850,
      productionUnit: 'kg',
      revenue: 2520000,
      revenuePercentage: 14.7,
      expense: 450000,
      profitability: 82.1,
      efficiency: 88,
      color: '#fbbf24',
    },
    {
      module: 'procesamiento',
      moduleName: 'Procesamiento',
      production: 12500,
      productionUnit: 'kg',
      revenue: 3150000,
      revenuePercentage: 18.3,
      expense: 1200000,
      profitability: 61.9,
      efficiency: 79,
      color: '#8b5cf6',
    },
  ];
};

// Consolidated Stats
export const getMockConsolidatedStats = async (): Promise<ConsolidatedStats> => {
  await delay(300);
  return {
    totalIncome: 17190000,
    totalExpense: 7550000,
    netProfit: 9640000,
    profitMargin: 56.1,
    totalProduction: 183350,
    productionUnit: 'kg eq.',
    agroProduction: 45000,
    pecuarioProduction: 125000,
    apiculturaProduction: 850,
    procesamientoProduction: 12500,
    totalInventoryValue: 8060000,
    lowStockAlerts: 25,
    criticalStockAlerts: 8,
  };
};

// Period Comparison
export const getMockPeriodComparison = async (): Promise<PeriodComparison> => {
  await delay(300);
  return {
    currentPeriod: {
      production: 183350,
      revenue: 17190000,
      expense: 7550000,
      profit: 9640000,
    },
    previousPeriod: {
      production: 169800,
      revenue: 15275000,
      expense: 6825000,
      profit: 8450000,
    },
    variance: {
      productionChangePercent: 7.98,
      revenueChangePercent: 12.53,
      expenseChangePercent: 10.62,
      profitChangePercent: 14.07,
    },
    trend: 'improving',
  };
};

// Trend Data
export const getMockTrendData = async (): Promise<TrendData[]> => {
  await delay(300);
  return [
    {
      period: 'Ago',
      production: 158500,
      revenue: 13850000,
      expense: 6200000,
      profit: 7650000,
      agroProduction: 38500,
      pecuarioProduction: 110000,
      apiculturaProduction: 620,
      procesamientoProduction: 9380,
    },
    {
      period: 'Sep',
      production: 170200,
      revenue: 14920000,
      expense: 6550000,
      profit: 8370000,
      agroProduction: 40200,
      pecuarioProduction: 118500,
      apiculturaProduction: 700,
      procesamientoProduction: 10800,
    },
    {
      period: 'Oct',
      production: 175780,
      revenue: 15750000,
      expense: 6750000,
      profit: 9000000,
      agroProduction: 42300,
      pecuarioProduction: 121200,
      apiculturaProduction: 780,
      procesamientoProduction: 11500,
    },
    {
      period: 'Nov',
      production: 172250,
      revenue: 15275000,
      expense: 6825000,
      profit: 8450000,
      agroProduction: 41000,
      pecuarioProduction: 119500,
      apiculturaProduction: 750,
      procesamientoProduction: 11000,
    },
    {
      period: 'Dic',
      production: 174800,
      revenue: 15430000,
      expense: 6900000,
      profit: 8530000,
      agroProduction: 42800,
      pecuarioProduction: 120000,
      apiculturaProduction: 800,
      procesamientoProduction: 11200,
    },
    {
      period: 'Ene',
      production: 183350,
      revenue: 17190000,
      expense: 7550000,
      profit: 9640000,
      agroProduction: 45000,
      pecuarioProduction: 125000,
      apiculturaProduction: 850,
      procesamientoProduction: 12500,
    },
  ];
};

// Generated Reports
export const getMockGeneratedReports = async (): Promise<GeneratedReport[]> => {
  await delay(300);
  return [
    {
      id: '1',
      reportCode: 'REP-2026-001',
      title: 'Reporte Mensual - Enero 2026',
      description: 'Reporte consolidado de producción y finanzas',
      reportType: 'comprehensive',
      period: 'monthly',
      periodStart: new Date('2026-01-01'),
      periodEnd: new Date('2026-01-31'),
      fincaName: 'Finca La Esperanza',
      status: 'generated',
      generatedBy: 'Sistema',
      formats: ['pdf', 'excel'],
      fileSize: 2150000,
      viewCount: 5,
      downloadCount: 3,
      createdAt: new Date('2026-01-20'),
      updatedAt: new Date('2026-01-20'),
    },
    {
      id: '2',
      reportCode: 'REP-2025-Q4',
      title: 'Reporte Trimestral - Q4 2025',
      description: 'Análisis del cuarto trimestre',
      reportType: 'financial',
      period: 'quarterly',
      periodStart: new Date('2025-10-01'),
      periodEnd: new Date('2025-12-31'),
      fincaName: 'Finca La Esperanza',
      status: 'generated',
      generatedBy: 'admin@finca.cr',
      formats: ['pdf', 'excel', 'csv'],
      fileSize: 3850000,
      viewCount: 8,
      downloadCount: 2,
      createdAt: new Date('2026-01-10'),
      updatedAt: new Date('2026-01-18'),
    },
    {
      id: '3',
      reportCode: 'REP-2025-ANUAL',
      title: 'Reporte Anual - 2025',
      description: 'Resumen ejecutivo anual',
      reportType: 'comprehensive',
      period: 'annual',
      periodStart: new Date('2025-01-01'),
      periodEnd: new Date('2025-12-31'),
      fincaName: 'Finca La Esperanza',
      status: 'generated',
      generatedBy: 'director@finca.cr',
      formats: ['pdf', 'excel'],
      fileSize: 5200000,
      viewCount: 12,
      downloadCount: 5,
      createdAt: new Date('2026-01-05'),
      updatedAt: new Date('2026-01-05'),
    },
    {
      id: '4',
      reportCode: 'REP-2025-012',
      title: 'Reporte Producción - Diciembre 2025',
      reportType: 'production',
      period: 'monthly',
      periodStart: new Date('2025-12-01'),
      periodEnd: new Date('2025-12-31'),
      fincaName: 'Finca La Esperanza',
      status: 'archived',
      generatedBy: 'Sistema',
      formats: ['pdf'],
      fileSize: 1850000,
      viewCount: 3,
      downloadCount: 1,
      createdAt: new Date('2025-12-31'),
      updatedAt: new Date('2025-12-31'),
    },
  ];
};

// Dashboard Stats
export const getMockReportesDashboardStats = async (): Promise<ReportesDashboardStats> => {
  await delay(300);
  return {
    totalReports: 28,
    reportsThisMonth: 4,
    generatedToday: 1,
    pendingExports: 2,
    latestReportDate: new Date('2026-01-20'),
    latestReportType: 'comprehensive',
  };
};

// Tasks
export const getMockReportesTasks = async (): Promise<ReportesTask[]> => {
  await delay(300);
  return [
    {
      id: '1',
      title: 'Generar reporte mensual febrero',
      type: 'report_generation',
      relatedPeriod: 'monthly',
      dueDate: new Date('2026-02-05'),
      priority: 'high',
      status: 'pending',
      assignedTo: 'Sistema',
    },
    {
      id: '2',
      title: 'Exportar reporte Q4 a PDF',
      type: 'export',
      reportId: '2',
      dueDate: new Date('2026-01-25'),
      priority: 'medium',
      status: 'in_progress',
      progress: 65,
    },
    {
      id: '3',
      title: 'Revisar reporte mensual enero',
      type: 'review',
      reportId: '1',
      dueDate: new Date('2026-01-22'),
      priority: 'high',
      status: 'pending',
      assignedTo: 'Director',
    },
    {
      id: '4',
      title: 'Archivar reportes antiguos',
      type: 'archive',
      dueDate: new Date('2026-02-01'),
      priority: 'low',
      status: 'pending',
    },
    {
      id: '5',
      title: 'Distribuir reporte anual',
      type: 'distribution',
      reportId: '3',
      dueDate: new Date('2026-01-28'),
      priority: 'high',
      status: 'pending',
      assignedTo: 'Admin',
    },
  ];
};
