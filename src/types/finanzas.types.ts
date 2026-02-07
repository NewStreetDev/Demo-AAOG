import type { BaseEntity, PaymentStatus } from './common.types';

// Transaction Types
export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'pending' | 'completed' | 'cancelled';
export type TransactionCategory =
  | 'ventas'
  | 'devoluciones'
  | 'servicios'
  | 'otros_ingresos'
  | 'insumos'
  | 'mano_obra'
  | 'servicios_externos'
  | 'mantenimiento'
  | 'transporte'
  | 'otros_gastos';

// Re-export PaymentStatus for backwards compatibility
export type { PaymentStatus };

export type ModuleSource = 'agro' | 'pecuario' | 'procesamiento';
export type SaleType = 'agricola' | 'procesado' | 'animal_vivo' | 'carnico';

/**
 * Registro de venta
 *
 * REGLA DE NEGOCIO - Campos mutuamente excluyentes según saleType:
 *
 * | saleType     | Campos requeridos                     | Campos NO aplicables                    |
 * |--------------|---------------------------------------|-----------------------------------------|
 * | 'agricola'   | quantityMode                          | batchId, livestockId, priceType         |
 * | 'procesado'  | batchId, batchCode, package*          | livestockId, priceType, quantityMode    |
 * | 'animal_vivo'| livestockId, livestockTag             | batchId, package*, priceType            |
 * | 'carnico'    | priceType                             | batchId, livestockId, quantityMode      |
 *
 * La validación de estos campos debe hacerse en runtime ya que TypeScript
 * no puede expresar tipos condicionales basados en valores de enum.
 */
export interface SaleRecord extends BaseEntity {
  fincaId: string;
  date: Date;
  invoiceNumber?: string;
  moduleSource: ModuleSource;
  productDescription: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalAmount: number;
  buyerName: string;
  buyerId?: string;             // ID del cliente si existe en catálogo
  paymentStatus: PaymentStatus;
  amountPaid: number;
  dueDate?: Date;
  notes?: string;

  // Sale type
  saleType: SaleType;

  // Agricola-specific: which measurement mode was used
  quantityMode?: 'unidades' | 'peso';

  // Procesado-specific (para RG07)
  packageType?: string;         // Tipo de presentación: "Envase", "Saco", "Caja"
  packageSize?: number;         // Tamaño: 500
  packageSizeUnit?: string;     // Unidad: "ml", "g", "kg"
  packageCount?: number;        // Cantidad de presentaciones
  batchId?: string;             // ID del lote de procesamiento
  batchCode?: string;           // Código del lote (L-YYYYMMDD-ID-SEQ)
  rg06ReportId?: string;        // RG06 asociado al producto final

  // Animal vivo-specific
  animalWeight?: number;
  /**
   * ID del animal vendido
   * @required cuando saleType === 'animal_vivo'
   */
  livestockId?: string;
  /**
   * Arete/tag del animal vendido
   * @required cuando saleType === 'animal_vivo'
   */
  livestockTag?: string;

  // Carnico-specific
  priceType?: 'per_kilo' | 'total';

  // Vinculación con planificación
  linkedActionId?: string;      // Acción de planificación relacionada
}

// Purchase/Expense Record
export interface PurchaseRecord extends BaseEntity {
  fincaId: string;
  date: Date;
  invoiceNumber: string;
  supplierName: string;
  category: TransactionCategory;
  description: string;
  quantity?: number;
  unit?: string;
  unitCost?: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  dueDate?: Date;
  moduleUsage?: ModuleSource;
  notes?: string;
}

// Transaction (Generic income/expense)
export interface Transaction extends BaseEntity {
  fincaId: string;
  date: Date;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  description: string;
  module?: ModuleSource | 'finca';
  status: TransactionStatus;
  relatedRecordId?: string;
}

// Budget
export interface Budget extends BaseEntity {
  name: string;
  category: string;
  amount: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  startDate: Date;
  endDate: Date;
  spent: number;
}

// Accounts Receivable
export interface AccountsReceivable extends BaseEntity {
  saleRecordId: string;
  buyerName: string;
  invoiceNumber: string;
  totalAmount: number;
  amountPaid: number;
  amountPending: number;
  dueDate: Date;
  status: 'pending' | 'overdue' | 'paid';
  daysPastDue?: number;
  notes?: string;
}

// Accounts Payable
export interface AccountsPayable extends BaseEntity {
  purchaseRecordId: string;
  supplierName: string;
  invoiceNumber: string;
  totalAmount: number;
  amountPaid: number;
  amountPending: number;
  dueDate: Date;
  status: 'pending' | 'overdue' | 'paid';
  daysPastDue?: number;
  notes?: string;
}

// Financial Summary Stats
export interface FinanzasDashboardStats {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  pendingReceivables: number;
  pendingPayables: number;
  thisMonthIncome: number;
  thisMonthExpense: number;
  thisMonthProfit: number;
  overdueSales: number;
  overduePayments: number;
  cashFlow: number;
  budgetUtilization: number;
}

// Monthly Financial Data for Charts
export interface MonthlyFinancialData {
  month: string;
  income: number;
  expense: number;
  profit: number;
  receivables: number;
  payables: number;
}

// Sales by Module
export interface SalesByModule {
  module: ModuleSource;
  moduleName: string;
  totalSales: number;
  percentage: number;
  color: string;
  quantity: number;
}

// Expense Distribution
export interface ExpenseDistribution {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

// Budget vs Actual
export interface BudgetComparison {
  category: string;
  budgeted: number;
  actual: number;
  variance: number;
  percentageUsed: number;
  status: 'on_track' | 'warning' | 'exceeded';
}

// Task (Payment reminder)
export interface FinanzasTask {
  id: string;
  title: string;
  type: 'payment_due' | 'collection_due' | 'budget_alert' | 'reconciliation';
  relatedRecordId?: string;
  description?: string;
  dueDate: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  amount?: number;
}

// ========================================
// CATÁLOGO DE CLIENTES/COMPRADORES
// ========================================

export interface Client extends BaseEntity {
  fincaId: string;
  name: string;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
  taxId?: string;              // Cédula jurídica o física
  type: 'individual' | 'business';
  status: 'active' | 'inactive';
  notes?: string;
  // Estadísticas calculadas
  totalPurchases?: number;
  lastPurchaseDate?: Date;
}

// ========================================
// RESUMEN DE VENTAS (Sección "Resumen")
// ========================================

// Resumen de ventas por período
export interface SalesSummaryByPeriod {
  period: string;              // "Enero 2026", "Q1 2026", "2026"
  periodType: 'monthly' | 'quarterly' | 'yearly';
  startDate: Date;
  endDate: Date;

  // Totales por módulo
  agroSales: number;
  procesamientoSales: number;
  pecuarioSales: number;

  // Total general
  totalSales: number;
  totalTransactions: number;

  // Desglose por tipo de venta
  byType: {
    agricola: number;
    procesado: number;
    animal_vivo: number;
    carnico: number;
  };

  // Comparación con período anterior
  previousPeriodSales?: number;
  growthPercentage?: number;
}

// Resumen consolidado para la vista "Resumen"
export interface FinanzasSummaryView {
  // Período seleccionado
  currentPeriod: SalesSummaryByPeriod;

  // Totales acumulados
  yearToDate: {
    totalSales: number;
    byModule: {
      agro: number;
      procesamiento: number;
      pecuario: number;
    };
  };

  // Top clientes
  topClients: {
    clientId: string;
    clientName: string;
    totalPurchases: number;
    transactionCount: number;
  }[];

  // Top productos
  topProducts: {
    product: string;
    moduleSource: ModuleSource;
    totalSold: number;
    totalRevenue: number;
  }[];
}

// ========================================
// EXPORTACIONES (Sección "Exportaciones")
// ========================================

// Formato de exportación específico de finanzas (sin PDF)
export type FinanzasExportFormat = 'excel' | 'csv';
export type ExportScope = 'individual' | 'consolidated';

// Configuración de exportación
export interface ExportConfig {
  format: FinanzasExportFormat;
  scope: ExportScope;

  // Período a exportar
  startDate: Date;
  endDate: Date;

  // Filtros opcionales
  moduleFilter?: ModuleSource[];
  saleTypeFilter?: SaleType[];
  clientFilter?: string[];

  // Campos a incluir
  includeFields: ExportFieldOption[];

  // Agrupación
  groupBy?: 'none' | 'date' | 'module' | 'client' | 'product';
}

// Campos disponibles para exportar
export type ExportFieldOption =
  | 'date'
  | 'invoiceNumber'
  | 'productDescription'
  | 'quantity'
  | 'unit'
  | 'unitPrice'
  | 'totalAmount'
  | 'buyerName'
  | 'moduleSource'
  | 'saleType'
  | 'paymentStatus'
  | 'batchCode'
  | 'notes';

// Registro de exportación realizada
export interface ExportRecord extends BaseEntity {
  fincaId: string;
  exportDate: Date;
  exportedBy: string;
  format: FinanzasExportFormat;
  scope: ExportScope;
  periodStart: Date;
  periodEnd: Date;
  recordCount: number;
  totalAmount: number;
  fileName: string;
  filePath?: string;
}

// ========================================
// TIPOS DE VENTA - DOCUMENTACIÓN
// ========================================
//
// PRODUCTOS PROCESADOS (saleType: 'procesado'):
// Usa modelo de presentación comercial:
// - packageType: "Envase", "Saco", "Caja", "Frasco", "Bolsa"
// - packageCount: Cantidad de unidades (ej: 50)
// - packageSize: Tamaño por unidad (ej: 500)
// - packageSizeUnit: Unidad de medida (ej: "ml", "g", "kg")
// - batchCode: Código del lote de procesamiento
// Ejemplo: "50 envases de 500 ml" = packageCount:50, packageSize:500, packageSizeUnit:"ml"
//
// CARNE/CÁRNICOS (saleType: 'carnico'):
// Registro por peso:
// - quantity: Cantidad (ej: 250)
// - unit: Unidad de peso (ej: "kg")
// - priceType: 'per_kilo' | 'total'
// No usa presentaciones comerciales
//
// ANIMALES VIVOS (saleType: 'animal_vivo'):
// Registro simple por unidad:
// - quantity: Generalmente 1
// - unit: "animal" | "unidad"
// - animalWeight: Peso opcional como referencia
// - livestockId/livestockTag: Vinculación con Pecuario
//
// PRODUCTOS AGRÍCOLAS (saleType: 'agricola'):
// Elegir UNA modalidad con quantityMode:
// - 'unidades': quantity=10, unit="lechugas"
// - 'peso': quantity=20, unit="kg"

// ========================================
// VINCULACIÓN CON OTROS MÓDULOS
// ========================================

// Venta que actualiza inventario pecuario
export interface LivestockSaleLink {
  saleRecordId: string;
  livestockId: string;
  livestockTag: string;
  // Al registrar la venta, el animal se marca como:
  // exitReason: 'sale', exitDate: saleDate
}

// Venta que descuenta de lote de procesamiento
export interface BatchSaleLink {
  saleRecordId: string;
  batchId: string;
  batchCode: string;
  quantitySold: number;
  // Actualiza availableQuantity del lote
}
