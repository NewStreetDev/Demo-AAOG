/**
 * AAOG - Sistema Integral de Gestión
 * Archivo de índice de tipos
 *
 * Este archivo centraliza todas las exportaciones de tipos del sistema.
 * Permite imports simplificados desde un único punto de entrada.
 *
 * Uso:
 *   import type { Finca, Livestock, SaleRecord } from '@/types';
 *   import { ROLE_PERMISSIONS, hasPermission } from '@/types';
 */

// ============================================================================
// COMMON - Tipos base y compartidos
// ============================================================================
export type {
  // Entidades base
  BaseEntity,
  TenantEntity,

  // Estados unificados
  EntityStatus,
  ProcessStatus,
  PaymentStatus,

  // Módulos del sistema
  SystemModule,

  // Períodos
  PeriodType,
  Period,

  // Formatos de exportación
  ExportFormat,

  // Insumos y herramientas
  InsumoUtilizado,
  HerramientaUtilizada,

  // Tipos deprecados (mantener para compatibilidad)
  Status,
  ActionInsumo,
  Farm,
  GenericAction,
} from './common.types';

// ============================================================================
// AUTH - Autenticación, usuarios y permisos
// ============================================================================
export type {
  // Roles
  UserRole,

  // Usuario
  User,
  UserPreferences,

  // Autenticación
  AuthState,
  LoginCredentials,
  LoginResponse,
  PasswordResetRequest,
  PasswordChange,

  // Permisos
  PermissionAction,
  ModulePermissions,
  SystemPermissions,
} from './auth.types';

// Exportar constantes y helpers de auth
export {
  ROLE_DESCRIPTIONS,
  ROLE_PERMISSIONS,
  hasPermission,
  canViewOthersData,
  canModifyData,
  isReadOnlyRole,
} from './auth.types';

// ============================================================================
// FINCA - Mi Finca, divisiones, planificación central
// ============================================================================
export type {
  // Finca principal
  Finca,

  // Divisiones
  Division,
  DivisionType,
  DivisionSummary,

  // Croquis y clima
  FincaCroquis,
  CurrentWeather,
  WeatherForecast,
  ActiveFincaContext,

  // Plan anual
  AnnualPlan,
  AnnualPlanStatus,
  PlanPhase,

  // Plan general (acciones)
  GeneralPlan,
  GeneralPlanActionType,
  PlanPriority,
  PlanStatus,

  // Vistas de planificación
  PlanningViewType,
  PlanningFilters,
  MonthlyPlanningView,
  WeeklyPlanningView,
  GanttPlanningView,
  PlanningVsExecutionSummary,

  // Dashboard
  ModuleSummary,
  FincaDashboardStats,
  MonthlyAggregatedData,
  AggregatedTask,
  QuickAction,
} from './finca.types';

// ============================================================================
// AGRO - Módulo Agrícola
// ============================================================================
export type {
  // Entidades principales
  Lote,
  Crop,
  Harvest,
  AgroAction,
  AgroPlan,
  AgroInsumo,

  // Tipos de acción
  AgroActionType,
  ProductType,
  CropStatus,

  // Destino de producción
  DestinoProduccion,

  // Reportes RG (Agrícola)
  RG01Record,        // Plan de Manejo (SIC)
  RG02Record,        // Estimación de Producción (SIC)
  RG03Record,        // Bitácora de Labores (ejecución)
  RG04Record,        // Insumos (ejecución)
  RG05Record,        // Registro de Cosechas (ejecución)

  // Balance de Masas
  BalanceMasasAgro,

  // Dashboard y estadísticas
  AgroDashboardStats,
  AgroProductionData,
  CropDistribution,
  AgroTask,
  CropSummary,

  // Clima
  WeatherInfo,
} from './agro.types';

// ============================================================================
// PECUARIO - Módulo Pecuario (ganado y colmenas)
// ============================================================================
export type {
  // Ganado
  Livestock,
  LivestockSpecies,
  LivestockCategory,
  LivestockGroup,

  // Salud animal (RP02)
  HealthRecord,
  GroupHealthAction,

  // Reproducción (RP04)
  ReproductionRecord,

  // Potreros
  Potrero,
  PotreroAssignment,
  PotreroRestInfo,
  PotreroOccupancyHistory,

  // Movimientos
  LivestockMovement,

  // Producción de leche
  MilkProduction,

  // Colmenas
  Beehive,
  BeehiveStatus,
  BeehiveHealthRecord,
  BeehiveReproductionRecord,
  HoneyProduction,

  // Apiario
  ApiaryStats,
  GroupBeehiveAction,

  // Dashboard y estadísticas
  PecuarioDashboardStats,
  PecuarioProductionData,
  CategoryDistribution,
  PecuarioTask,
} from './pecuario.types';

// Exportar constantes de pecuario
export {
  categoriesBySpecies,
  speciesWithParentTracking,
  requiresParentTracking,
} from './pecuario.types';

// ============================================================================
// PROCESAMIENTO - Módulo de Procesamiento
// ============================================================================
export type {
  // Lotes y procesamiento
  ProcessingBatch,
  BatchStatus,
  InputSourceType,
  ProcessType,
  ProcessCategory,
  BatchCodeComponents,

  // Cadena de trazabilidad
  SelectableBatch,
  BatchChain,
  BatchChainStep,

  // Reportes RG (Procesamiento)
  RG06Record,        // Registro de Procesamiento
  ProcessedProductSale,
  RG07Record,        // Venta de Productos Procesados
  RG07SaleItem,
  PresentationDescription,

  // Inventario
  BatchInventoryItem,
  BatchForSale,

  // Dashboard y tareas
  ProcesamientoDashboardStats,
  ProcesamientoTask,
} from './procesamiento.types';

// ============================================================================
// FINANZAS - Módulo Financiero
// ============================================================================
export type {
  // Ventas
  SaleRecord,
  SaleType,
  ModuleSource,

  // Compras
  PurchaseRecord,
  Transaction,
  TransactionStatus,

  // Clientes
  Client,

  // Cuentas por cobrar/pagar
  AccountsReceivable,
  AccountsPayable,

  // Vinculación con otros módulos
  LivestockSaleLink,
  BatchSaleLink,

  // Resúmenes
  SalesSummaryByPeriod,
  FinanzasSummaryView,
  FinanzasDashboardStats,
  MonthlyFinancialData,
  SalesByModule,

  // Exportación
  FinanzasExportFormat,
  ExportConfig,
  ExportRecord,
} from './finanzas.types';

// ============================================================================
// REGLAMENTOS - Repositorio de Documentos
// ============================================================================
export type {
  // Carpetas y categorías
  DocumentFolder,
  FolderType,
  DocumentCategory,

  // Documentos
  Document,
  DocumentUpload,
  MoveDocumentRequest,
  DocumentMoveLog,

  // Búsqueda y navegación
  DocumentSearchParams,
  FolderView,

  // Permisos
  DocumentPermissions,
  DocumentAction,

  // Auditoría
  DocumentActivityLog,

  // Visualización
  DocumentViewer,
} from './reglamentos.types';

// Exportar constantes de reglamentos
export { ROLE_PERMISSIONS as DOCUMENT_ROLE_PERMISSIONS } from './reglamentos.types';

// ============================================================================
// REPORTES - Generación y Análisis de Reportes
// ============================================================================
export type {
  // Tipos de reportes
  RGReportType,
  RPReportType,
  ReportType,
  ReportCategory,
  ReportTypeInfo,

  // Generación
  ReportGenerationConfig,
  GeneratedReportRecord,
  ReportPackage,

  // Historial
  ReportHistoryByAssociate,
  ReportHistoryByYear,
  ReportHistoryFilters,

  // Permisos
  ReportPermissions,

  // Balance de Masas (consolidado)
  BalanceMasasData,
} from './reportes.types';

// Exportar catálogo y constantes de reportes
export {
  REPORT_TYPES_CATALOG,
  REPORT_ROLE_PERMISSIONS,
} from './reportes.types';

