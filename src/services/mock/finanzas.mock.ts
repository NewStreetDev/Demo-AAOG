import type {
  SaleRecord,
  PurchaseRecord,
  FinanzasDashboardStats,
  MonthlyFinancialData,
  SalesByModule,
  BudgetComparison,
  FinanzasTask,
  AccountsReceivable,
  AccountsPayable,
} from '../../types/finanzas.types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Sales Records
export const getMockSalesRecords = async (): Promise<SaleRecord[]> => {
  await delay(300);
  return [
    {
      id: '1',
      date: new Date('2026-01-20'),
      invoiceNumber: 'FAC-2026-001',
      moduleSource: 'agro',
      productDescription: 'Tomate Roma - 150 kg',
      quantity: 150,
      unit: 'kg',
      unitPrice: 8000,
      totalAmount: 1200000,
      buyerName: 'Mercado Central',
      paymentStatus: 'paid',
      amountPaid: 1200000,
      notes: 'Entrega completa',
      createdAt: new Date('2026-01-20'),
      updatedAt: new Date('2026-01-20'),
    },
    {
      id: '2',
      date: new Date('2026-01-18'),
      invoiceNumber: 'FAC-2026-002',
      moduleSource: 'pecuario',
      productDescription: 'Leche fresca - 500 L',
      quantity: 500,
      unit: 'L',
      unitPrice: 1200,
      totalAmount: 600000,
      buyerName: 'Quesería Los Robles',
      paymentStatus: 'pending',
      amountPaid: 0,
      dueDate: new Date('2026-02-18'),
      notes: 'Plazo 30 días',
      createdAt: new Date('2026-01-18'),
      updatedAt: new Date('2026-01-18'),
    },
    {
      id: '3',
      date: new Date('2026-01-15'),
      invoiceNumber: 'FAC-2026-003',
      moduleSource: 'apicultura',
      productDescription: 'Miel pura - 80 kg',
      quantity: 80,
      unit: 'kg',
      unitPrice: 18000,
      totalAmount: 1440000,
      buyerName: 'Tienda Ecológica',
      paymentStatus: 'partial',
      amountPaid: 720000,
      dueDate: new Date('2026-02-15'),
      createdAt: new Date('2026-01-15'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: '4',
      date: new Date('2026-01-12'),
      invoiceNumber: 'FAC-2026-004',
      moduleSource: 'agro',
      productDescription: 'Chile Jalapeño - 75 kg',
      quantity: 75,
      unit: 'kg',
      unitPrice: 12000,
      totalAmount: 900000,
      buyerName: 'Exportadora Agrícola',
      paymentStatus: 'paid',
      amountPaid: 900000,
      createdAt: new Date('2026-01-12'),
      updatedAt: new Date('2026-01-12'),
    },
  ];
};

// Purchase Records
export const getMockPurchaseRecords = async (): Promise<PurchaseRecord[]> => {
  await delay(300);
  return [
    {
      id: '1',
      date: new Date('2026-01-18'),
      invoiceNumber: 'PROV-2026-001',
      supplierName: 'Agrosemillas CR',
      category: 'insumos',
      description: 'Semillas de tomate (20 kg)',
      quantity: 20,
      unit: 'kg',
      unitCost: 45000,
      totalAmount: 900000,
      paymentStatus: 'paid',
      amountPaid: 900000,
      moduleUsage: 'agro',
      createdAt: new Date('2026-01-18'),
      updatedAt: new Date('2026-01-18'),
    },
    {
      id: '2',
      date: new Date('2026-01-16'),
      invoiceNumber: 'PROV-2026-002',
      supplierName: 'Fertilizantes del Pacífico',
      category: 'insumos',
      description: 'Fertilizante NPK 15-15-15 (100 kg)',
      quantity: 100,
      unit: 'kg',
      unitCost: 9000,
      totalAmount: 900000,
      paymentStatus: 'pending',
      amountPaid: 0,
      dueDate: new Date('2026-02-16'),
      moduleUsage: 'agro',
      createdAt: new Date('2026-01-16'),
      updatedAt: new Date('2026-01-16'),
    },
    {
      id: '3',
      date: new Date('2026-01-14'),
      invoiceNumber: 'PROV-2026-003',
      supplierName: 'Agroalimentaria Central',
      category: 'insumos',
      description: 'Concentrado Lechero (250 kg)',
      quantity: 250,
      unit: 'kg',
      unitCost: 15000,
      totalAmount: 3750000,
      paymentStatus: 'partial',
      amountPaid: 1875000,
      dueDate: new Date('2026-02-14'),
      moduleUsage: 'pecuario',
      createdAt: new Date('2026-01-14'),
      updatedAt: new Date('2026-01-14'),
    },
    {
      id: '4',
      date: new Date('2026-01-10'),
      invoiceNumber: 'PROV-2026-004',
      supplierName: 'Dr. García Veterinario',
      category: 'servicios_externos',
      description: 'Servicios de vacunación (28 cabezas)',
      totalAmount: 420000,
      paymentStatus: 'paid',
      amountPaid: 420000,
      moduleUsage: 'pecuario',
      createdAt: new Date('2026-01-10'),
      updatedAt: new Date('2026-01-10'),
    },
  ];
};

// Dashboard Stats
export const getMockFinanzasStats = async (): Promise<FinanzasDashboardStats> => {
  await delay(300);
  return {
    totalIncome: 15075000,
    totalExpense: 8425000,
    netProfit: 6650000,
    pendingReceivables: 1320000,
    pendingPayables: 2775000,
    thisMonthIncome: 4140000,
    thisMonthExpense: 2900000,
    thisMonthProfit: 1240000,
    overdueSales: 0,
    overduePayments: 0,
    cashFlow: 3445000,
    budgetUtilization: 68,
  };
};

// Monthly Financial Data
export const getMockMonthlyFinancialData = async (): Promise<MonthlyFinancialData[]> => {
  await delay(300);
  return [
    { month: 'Ago', income: 2850000, expense: 1920000, profit: 930000, receivables: 580000, payables: 420000 },
    { month: 'Sep', income: 3120000, expense: 2100000, profit: 1020000, receivables: 620000, payables: 480000 },
    { month: 'Oct', income: 2950000, expense: 1950000, profit: 1000000, receivables: 590000, payables: 450000 },
    { month: 'Nov', income: 3450000, expense: 2250000, profit: 1200000, receivables: 750000, payables: 580000 },
    { month: 'Dic', income: 2605000, expense: 1825000, profit: 780000, receivables: 530000, payables: 415000 },
    { month: 'Ene', income: 4140000, expense: 2900000, profit: 1240000, receivables: 720000, payables: 580000 },
  ];
};

// Sales by Module
export const getMockSalesByModule = async (): Promise<SalesByModule[]> => {
  await delay(300);
  return [
    { module: 'agro', moduleName: 'Agricultura', totalSales: 6300000, percentage: 42.5, color: '#10b981', quantity: 425 },
    { module: 'pecuario', moduleName: 'Pecuario', totalSales: 5220000, percentage: 35.2, color: '#f97316', quantity: 3250 },
    { module: 'apicultura', moduleName: 'Apicultura', totalSales: 2520000, percentage: 17.0, color: '#fbbf24', quantity: 140 },
    { module: 'general', moduleName: 'Otros', totalSales: 1035000, percentage: 5.3, color: '#6b7280', quantity: 0 },
  ];
};

// Budget Comparisons
export const getMockBudgetComparisons = async (): Promise<BudgetComparison[]> => {
  await delay(300);
  return [
    {
      category: 'Insumos',
      budgeted: 4000000,
      actual: 3425000,
      variance: 575000,
      percentageUsed: 85.6,
      status: 'on_track',
    },
    {
      category: 'Mano de Obra',
      budgeted: 2000000,
      actual: 2108000,
      variance: -108000,
      percentageUsed: 105.4,
      status: 'exceeded',
    },
    {
      category: 'Servicios',
      budgeted: 1500000,
      actual: 1256000,
      variance: 244000,
      percentageUsed: 83.7,
      status: 'on_track',
    },
    {
      category: 'Mantenimiento',
      budgeted: 800000,
      actual: 684000,
      variance: 116000,
      percentageUsed: 85.5,
      status: 'on_track',
    },
  ];
};

// Tasks
export const getMockFinanzasTasks = async (): Promise<FinanzasTask[]> => {
  await delay(300);
  return [
    {
      id: '1',
      title: 'Cobrar Quesería Los Robles',
      type: 'collection_due',
      relatedRecordId: '2',
      dueDate: new Date('2026-02-18'),
      priority: 'high',
      status: 'pending',
      amount: 600000,
    },
    {
      id: '2',
      title: 'Cobrar Tienda Ecológica (parcial)',
      type: 'collection_due',
      relatedRecordId: '3',
      dueDate: new Date('2026-02-15'),
      priority: 'medium',
      status: 'pending',
      amount: 720000,
    },
    {
      id: '3',
      title: 'Pagar a Fertilizantes del Pacífico',
      type: 'payment_due',
      relatedRecordId: '2',
      dueDate: new Date('2026-02-16'),
      priority: 'high',
      status: 'pending',
      amount: 900000,
    },
    {
      id: '4',
      title: 'Revisión presupuesto febrero',
      type: 'budget_alert',
      dueDate: new Date('2026-02-01'),
      priority: 'medium',
      status: 'pending',
    },
    {
      id: '5',
      title: 'Reconciliación bancaria - Enero',
      type: 'reconciliation',
      dueDate: new Date('2026-02-05'),
      priority: 'low',
      status: 'pending',
    },
  ];
};

// Accounts Receivable
export const getMockAccountsReceivable = async (): Promise<AccountsReceivable[]> => {
  await delay(300);
  return [
    {
      id: '1',
      saleRecordId: '2',
      buyerName: 'Quesería Los Robles',
      invoiceNumber: 'FAC-2026-002',
      totalAmount: 600000,
      amountPaid: 0,
      amountPending: 600000,
      dueDate: new Date('2026-02-18'),
      status: 'pending',
      createdAt: new Date('2026-01-18'),
      updatedAt: new Date('2026-01-18'),
    },
    {
      id: '2',
      saleRecordId: '3',
      buyerName: 'Tienda Ecológica',
      invoiceNumber: 'FAC-2026-003',
      totalAmount: 1440000,
      amountPaid: 720000,
      amountPending: 720000,
      dueDate: new Date('2026-02-15'),
      status: 'pending',
      createdAt: new Date('2026-01-15'),
      updatedAt: new Date('2026-01-15'),
    },
  ];
};

// Accounts Payable
export const getMockAccountsPayable = async (): Promise<AccountsPayable[]> => {
  await delay(300);
  return [
    {
      id: '1',
      purchaseRecordId: '2',
      supplierName: 'Fertilizantes del Pacífico',
      invoiceNumber: 'PROV-2026-002',
      totalAmount: 900000,
      amountPaid: 0,
      amountPending: 900000,
      dueDate: new Date('2026-02-16'),
      status: 'pending',
      createdAt: new Date('2026-01-16'),
      updatedAt: new Date('2026-01-16'),
    },
    {
      id: '2',
      purchaseRecordId: '3',
      supplierName: 'Agroalimentaria Central',
      invoiceNumber: 'PROV-2026-003',
      totalAmount: 3750000,
      amountPaid: 1875000,
      amountPending: 1875000,
      dueDate: new Date('2026-02-14'),
      status: 'pending',
      createdAt: new Date('2026-01-14'),
      updatedAt: new Date('2026-01-14'),
    },
  ];
};
