import type { BaseEntity } from './common.types';

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

export type PaymentStatus = 'pending' | 'partial' | 'paid';
export type ModuleSource = 'agro' | 'pecuario' | 'apicultura' | 'general';

// Sale Record
export interface SaleRecord extends BaseEntity {
  date: Date;
  invoiceNumber: string;
  moduleSource: ModuleSource;
  productDescription: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalAmount: number;
  buyerName: string;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  dueDate?: Date;
  notes?: string;
}

// Purchase/Expense Record
export interface PurchaseRecord extends BaseEntity {
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
  dueDate: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  amount?: number;
}
