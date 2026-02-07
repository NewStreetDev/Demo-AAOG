import type { BaseEntity, ExportFormat } from './common.types';
import type { UserRole } from './auth.types';

// ========================================
// TIPOS DE REPORTES OFICIALES
// ========================================

// Categorías de reportes
export type ReportCategory = 'agricola' | 'pecuario' | 'procesamiento';

// Tipos de reportes RG (Agrícola/Procesamiento)
export type RGReportType =
  | 'RG01'   // Plan de Manejo
  | 'RG02'   // Estimación de Producción
  | 'RG03'   // Bitácora de Labores
  | 'RG04'   // Insumos
  | 'RG05'   // Registro de Cosechas
  | 'RG06'   // Registro de Procesamiento de Productos Orgánicos
  | 'RG07';  // Venta de Productos Procesados

// Tipos de reportes RP (Pecuario)
export type RPReportType =
  | 'RP02'   // Sanidad Animal
  | 'RP03'   // Identificación del Hato
  | 'RP04';  // Reproducción y Control de Partos

// Reportes especiales
export type SpecialReportType = 'BALANCE_MASAS';

// Todos los tipos de reportes
export type ReportType = RGReportType | RPReportType | SpecialReportType;

// Información de cada tipo de reporte
export interface ReportTypeInfo {
  code: ReportType;
  name: string;
  description: string;
  category: ReportCategory | 'special';
  sourceModule: 'agro' | 'pecuario' | 'procesamiento' | 'finanzas' | 'multiple';
  // Indica de qué fase proviene la información
  dataSource: 'planificacion_inicial' | 'plan_ejecucion' | 'ambos';
}

// Catálogo de tipos de reportes
export const REPORT_TYPES_CATALOG: ReportTypeInfo[] = [
  // Agrícolas
  {
    code: 'RG01',
    name: 'Plan de Manejo',
    description: 'Actividades agrícolas planificadas antes de la ejecución',
    category: 'agricola',
    sourceModule: 'agro',
    dataSource: 'planificacion_inicial',
  },
  {
    code: 'RG02',
    name: 'Estimación de Producción',
    description: 'Proyecciones de producción definidas en planificación',
    category: 'agricola',
    sourceModule: 'agro',
    dataSource: 'planificacion_inicial',
  },
  {
    code: 'RG03',
    name: 'Bitácora de Labores',
    description: 'Actividades agrícolas efectivamente realizadas',
    category: 'agricola',
    sourceModule: 'agro',
    dataSource: 'plan_ejecucion',
  },
  {
    code: 'RG04',
    name: 'Insumos',
    description: 'Insumos realmente utilizados durante la ejecución',
    category: 'agricola',
    sourceModule: 'agro',
    dataSource: 'plan_ejecucion',
  },
  {
    code: 'RG05',
    name: 'Registro de Cosechas',
    description: 'Cantidades realmente cosechadas',
    category: 'agricola',
    sourceModule: 'agro',
    dataSource: 'plan_ejecucion',
  },
  // Pecuarios
  {
    code: 'RP02',
    name: 'Sanidad Animal',
    description: 'Registros sanitarios de animales y colmenas',
    category: 'pecuario',
    sourceModule: 'pecuario',
    dataSource: 'plan_ejecucion',
  },
  {
    code: 'RP03',
    name: 'Identificación del Hato',
    description: 'Inventario de identificación del hato y colmenas',
    category: 'pecuario',
    sourceModule: 'pecuario',
    dataSource: 'plan_ejecucion',
  },
  {
    code: 'RP04',
    name: 'Reproducción y Control de Partos',
    description: 'Eventos reproductivos y control de partos',
    category: 'pecuario',
    sourceModule: 'pecuario',
    dataSource: 'plan_ejecucion',
  },
  // Procesamiento
  {
    code: 'RG06',
    name: 'Registro de Procesamiento de Productos Orgánicos',
    description: 'Cadena completa de procesamiento por producto final',
    category: 'procesamiento',
    sourceModule: 'procesamiento',
    dataSource: 'plan_ejecucion',
  },
  {
    code: 'RG07',
    name: 'Venta de Productos Procesados',
    description: 'Ventas de productos procesados con trazabilidad',
    category: 'procesamiento',
    sourceModule: 'finanzas',
    dataSource: 'plan_ejecucion',
  },
  // Especiales
  {
    code: 'BALANCE_MASAS',
    name: 'Balance de Masas',
    description: 'Comparación entre producción estimada (RG02) y real (RG05)',
    category: 'special',
    sourceModule: 'multiple',
    dataSource: 'ambos',
  },
];

// ========================================
// GENERACIÓN DE REPORTES
// ========================================

// Configuración para generar reportes
export interface ReportGenerationConfig {
  // Asociado objetivo
  associateId: string;
  associateName: string;
  fincaId: string;
  fincaName: string;

  // Período
  year: number;
  period?: string;              // Opcional: "Q1", "Enero", etc.

  // Reportes a generar
  reportTypes: ReportType[];    // Uno o varios

  // Formato de salida
  formats: ExportFormat[];      // PDF y/o Excel

  // Si es paquete (múltiples reportes)
  isPackage: boolean;
  // En Excel: cada reporte en una hoja separada
  // En PDF: cada reporte en una sección separada
}

// Resultado de generación
export interface ReportGenerationResult {
  success: boolean;
  generatedReports: GeneratedReportRecord[];
  errors?: {
    reportType: ReportType;
    error: string;
  }[];
  packageFileId?: string;       // Si se generó paquete
}

// ========================================
// REGISTRO DE REPORTES GENERADOS
// ========================================

export type ReportStatus = 'generated' | 'downloaded' | 'archived';

// Registro de reporte generado (historial)
export interface GeneratedReportRecord extends BaseEntity {
  // Identificación
  reportCode: string;           // Código único del reporte generado
  reportType: ReportType;
  reportTypeName: string;       // Nombre legible (denormalizado)
  category: ReportCategory | 'special';

  // Asociado y finca
  associateId: string;
  associateName: string;
  fincaId: string;
  fincaName: string;

  // Período
  year: number;
  period?: string;

  // Generación
  generatedAt: Date;
  generatedBy: string;          // ID del usuario que generó
  generatedByName: string;      // Nombre del usuario
  generatedByRole: 'asociado' | 'administrador' | 'junta_directiva';

  // Archivos disponibles
  formats: {
    format: ExportFormat;
    fileUrl: string;
    fileSize: number;           // bytes
  }[];

  // Paquete (si aplica)
  isPartOfPackage: boolean;
  packageId?: string;

  // Estado y estadísticas
  status: ReportStatus;
  downloadCount: number;
  lastDownloadedAt?: Date;
  lastDownloadedBy?: string;
}

// Paquete de reportes
export interface ReportPackage extends BaseEntity {
  packageCode: string;
  associateId: string;
  associateName: string;
  fincaId: string;
  fincaName: string;
  year: number;
  reportTypes: ReportType[];
  reportCount: number;
  generatedAt: Date;
  generatedBy: string;
  generatedByName: string;
  formats: {
    format: ExportFormat;
    fileUrl: string;
    fileSize: number;
  }[];
  status: ReportStatus;
}

// ========================================
// HISTORIAL DE REPORTES
// ========================================

// Vista del historial organizada por asociado > año > reportes
export interface ReportHistoryByAssociate {
  associateId: string;
  associateName: string;
  fincaId?: string;               // Opcional para filtrar por finca específica
  fincaName: string;
  years: ReportHistoryByYear[];
  totalReports: number;
}

export interface ReportHistoryByYear {
  year: number;
  reports: GeneratedReportRecord[];
  packages: ReportPackage[];
  reportCount: number;
}

// Filtros para consultar historial
export interface ReportHistoryFilters {
  associateId?: string;         // Para admins/junta: filtrar por asociado
  year?: number;
  reportType?: ReportType;
  category?: ReportCategory;
  generatedBy?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

// Resultado de búsqueda en historial
export interface ReportHistorySearchResult {
  reports: GeneratedReportRecord[];
  packages: ReportPackage[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ========================================
// PERMISOS POR ROL (específicos de reportes)
// ========================================

export interface ReportPermissions {
  canGenerateOwn: boolean;      // Puede generar sus propios reportes
  canGenerateOthers: boolean;   // Puede generar reportes de otros asociados
  canViewOwnHistory: boolean;   // Puede ver su historial
  canViewAllHistory: boolean;   // Puede ver historial de todos
  canDownload: boolean;         // Puede descargar reportes
  canArchive: boolean;          // Puede archivar reportes
}

export const REPORT_ROLE_PERMISSIONS: Record<UserRole, ReportPermissions> = {
  asociado: {
    canGenerateOwn: true,
    canGenerateOthers: false,
    canViewOwnHistory: true,
    canViewAllHistory: false,
    canDownload: true,
    canArchive: false,
  },
  administrador: {
    canGenerateOwn: true,
    canGenerateOthers: true,    // Puede generar por cualquier asociado
    canViewOwnHistory: true,
    canViewAllHistory: true,    // Historial unificado
    canDownload: true,
    canArchive: true,
  },
  junta_directiva: {
    canGenerateOwn: false,
    canGenerateOthers: true,    // Puede generar por cualquier asociado
    canViewOwnHistory: false,
    canViewAllHistory: true,    // Historial unificado (solo lectura)
    canDownload: true,
    canArchive: false,
  },
};

// ========================================
// ESTADÍSTICAS Y DASHBOARD
// ========================================

export interface ReportesDashboardStats {
  // Conteos generales
  totalReports: number;
  reportsThisYear: number;
  reportsThisMonth: number;

  // Por categoría
  byCategory: {
    agricola: number;
    pecuario: number;
    procesamiento: number;
    special: number;
  };

  // Por tipo de reporte
  byType: {
    reportType: ReportType;
    count: number;
  }[];

  // Actividad reciente
  recentGenerations: {
    reportCode: string;
    reportType: ReportType;
    reportTypeName: string;
    associateName: string;
    generatedAt: Date;
  }[];

  // Pendientes (asociados sin reportes del año actual)
  pendingAssociates: {
    associateId: string;
    associateName: string;
    missingReports: ReportType[];
  }[];
}

// ========================================
// CONSOLIDADO Y ANÁLISIS
// ========================================

// Datos consolidados para análisis (usado internamente)
export interface ConsolidatedReportData {
  year: number;
  associateId: string;
  fincaId: string;

  // Agrícola
  agroData?: {
    plannedActions: number;
    executedActions: number;
    estimatedProduction: number;
    actualProduction: number;
    insumosUsed: number;
  };

  // Pecuario
  pecuarioData?: {
    totalLivestock: number;
    totalBeehives: number;
    healthRecords: number;
    reproductionRecords: number;
  };

  // Procesamiento
  procesamientoData?: {
    totalBatches: number;
    finalProducts: number;
    totalMerma: number;
  };

  // Finanzas
  finanzasData?: {
    totalSales: number;
    salesByModule: {
      agro: number;
      pecuario: number;
      procesamiento: number;
    };
  };
}

// Balance de Masas específico
export interface BalanceMasasData {
  year: number;
  associateId: string;
  fincaId: string;
  products: {
    product: string;
    estimatedQuantity: number;  // De RG02
    actualQuantity: number;     // De RG05
    difference: number;
    differencePercentage: number;
    status: 'on_target' | 'above' | 'below';
  }[];
  totalEstimated: number;
  totalActual: number;
  overallDifference: number;
  overallDifferencePercentage: number;
}

// ========================================
// MÓDULO NAMES (para compatibilidad)
// ========================================

export type ModuleName = 'agro' | 'pecuario' | 'apicultura' | 'procesamiento' | 'finanzas' | 'insumos';

// Module comparison data (para gráficos consolidados)
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

// ========================================
// TAREAS
// ========================================

export interface ReportesTask {
  id: string;
  title: string;
  type: 'generation_pending' | 'review_required' | 'distribution';
  reportType?: ReportType;
  associateId?: string;
  associateName?: string;
  year?: number;
  dueDate?: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
}

// ========================================
// TIPOS SIMPLIFICADOS PARA UI/MOCK
// ========================================

/**
 * Estadísticas consolidadas para el dashboard (versión simplificada)
 */
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

/**
 * Reporte generado (versión simplificada para listados)
 */
export interface GeneratedReport {
  id: string;
  reportCode: string;
  title: string;
  description?: string;
  reportType: ReportCategory;
  period: 'monthly' | 'quarterly' | 'annual';
  periodStart: Date;
  periodEnd: Date;
  fincaName: string;
  status: ReportStatus;
  generatedBy: string;
  formats: string[];
  fileSize: number;
  viewCount: number;
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
}
