import type {
  Insumo,
  InsumoMovement,
  InsumosDashboardStats,
  CategorySummary,
  LowStockAlert,
  ConsumptionData,
  StockStatus,
} from '../../types/insumos.types';
import type { InsumoFormData } from '../../schemas/insumo.schema';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory store
let insumosStore: Insumo[] = [];

// Calculate stock status based on current and min stock
function calculateStockStatus(currentStock: number, minStock: number): StockStatus {
  if (currentStock <= minStock * 0.3) return 'critico';
  if (currentStock <= minStock) return 'bajo';
  return 'en_stock';
}

// Initial Insumos Data
const initialInsumos: Insumo[] = [
  {
    id: '1',
    code: 'SEM-001',
    name: 'Semilla de Tomate Roma',
      category: 'semillas',
      description: 'Semilla híbrida de alto rendimiento',
      currentStock: 25,
      minStock: 10,
      maxStock: 50,
      unit: 'kg',
      costPerUnit: 45000,
      totalValue: 1125000,
      supplier: 'Agrosemillas CR',
      expirationDate: new Date('2027-06-30'),
      location: 'Bodega A - Estante 2',
      relatedModule: 'agro',
      status: 'en_stock',
      alertEnabled: true,
      reorderQuantity: 15,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: '2',
      code: 'SEM-002',
      name: 'Semilla de Chile Jalapeño',
      category: 'semillas',
      currentStock: 8,
      minStock: 10,
      unit: 'kg',
      costPerUnit: 52000,
      totalValue: 416000,
      supplier: 'Agrosemillas CR',
      expirationDate: new Date('2027-03-15'),
      location: 'Bodega A - Estante 2',
      relatedModule: 'agro',
      status: 'bajo',
      alertEnabled: true,
      reorderQuantity: 10,
      createdAt: new Date('2025-01-05'),
      updatedAt: new Date('2026-01-10'),
    },
    {
      id: '3',
      code: 'SEM-003',
      name: 'Semilla de Pepino',
      category: 'semillas',
      currentStock: 2,
      minStock: 10,
      unit: 'kg',
      costPerUnit: 48000,
      totalValue: 96000,
      supplier: 'Agrosemillas CR',
      status: 'critico',
      alertEnabled: true,
      reorderQuantity: 12,
      createdAt: new Date('2025-01-08'),
      updatedAt: new Date('2026-01-18'),
    },
    {
      id: '4',
      code: 'FERT-001',
      name: 'Fertilizante NPK 15-15-15',
      category: 'fertilizantes',
      description: 'Fertilizante granulado de uso general',
      currentStock: 150,
      minStock: 50,
      maxStock: 300,
      unit: 'kg',
      costPerUnit: 9000,
      totalValue: 1350000,
      supplier: 'Fertilizantes del Pacífico',
      expirationDate: new Date('2028-06-30'),
      location: 'Bodega B',
      relatedModule: 'agro',
      status: 'en_stock',
      alertEnabled: true,
      reorderQuantity: 100,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2026-01-16'),
    },
    {
      id: '5',
      code: 'FERT-002',
      name: 'Compost Orgánico',
      category: 'fertilizantes',
      currentStock: 75,
      minStock: 30,
      unit: 'kg',
      costPerUnit: 6000,
      totalValue: 450000,
      supplier: 'Biotech Agrícola',
      location: 'Bodega B',
      relatedModule: 'agro',
      status: 'en_stock',
      alertEnabled: true,
      createdAt: new Date('2025-01-03'),
      updatedAt: new Date('2026-01-12'),
    },
    {
      id: '6',
      code: 'PEST-001',
      name: 'Insecticida Orgánico',
      category: 'pesticidas',
      currentStock: 45,
      minStock: 20,
      unit: 'L',
      costPerUnit: 25000,
      totalValue: 1125000,
      supplier: 'BioControl',
      expirationDate: new Date('2026-08-30'),
      location: 'Bodega C - Químicos',
      relatedModule: 'agro',
      status: 'en_stock',
      alertEnabled: true,
      createdAt: new Date('2025-01-02'),
      updatedAt: new Date('2026-01-14'),
    },
    {
      id: '7',
      code: 'PEST-002',
      name: 'Fungicida Preventivo',
      category: 'pesticidas',
      currentStock: 12,
      minStock: 20,
      unit: 'L',
      costPerUnit: 32000,
      totalValue: 384000,
      supplier: 'BioControl',
      expirationDate: new Date('2026-11-15'),
      location: 'Bodega C - Químicos',
      relatedModule: 'agro',
      status: 'bajo',
      alertEnabled: true,
      createdAt: new Date('2025-01-04'),
      updatedAt: new Date('2026-01-09'),
    },
    {
      id: '8',
      code: 'ALIM-001',
      name: 'Concentrado Lechero',
      category: 'alimentos',
      description: 'Alimento balanceado para ganado',
      currentStock: 500,
      minStock: 200,
      maxStock: 800,
      unit: 'kg',
      costPerUnit: 15000,
      totalValue: 7500000,
      supplier: 'Agroalimentaria Central',
      location: 'Bodega D - Alimentos',
      relatedModule: 'pecuario',
      status: 'en_stock',
      alertEnabled: true,
      reorderQuantity: 300,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2026-01-17'),
    },
    {
      id: '9',
      code: 'ALIM-002',
      name: 'Suplemento Mineral',
      category: 'alimentos',
      currentStock: 80,
      minStock: 40,
      unit: 'kg',
      costPerUnit: 22000,
      totalValue: 1760000,
      supplier: 'Agroalimentaria Central',
      location: 'Bodega D - Alimentos',
      relatedModule: 'pecuario',
      status: 'en_stock',
      alertEnabled: true,
      createdAt: new Date('2025-01-07'),
      updatedAt: new Date('2026-01-13'),
    },
    {
      id: '10',
      code: 'MED-001',
      name: 'Antibiótico Ganadero',
      category: 'medicamentos',
      currentStock: 25,
      minStock: 15,
      unit: 'L',
      costPerUnit: 85000,
      totalValue: 2125000,
      supplier: 'Laboratorio Veterinario',
      expirationDate: new Date('2026-09-15'),
      location: 'Bodega C - Refrigerado',
      relatedModule: 'pecuario',
      status: 'en_stock',
      alertEnabled: true,
      createdAt: new Date('2025-01-02'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: '11',
      code: 'MED-002',
      name: 'Tratamiento Varroa',
      category: 'medicamentos',
      currentStock: 8,
      minStock: 5,
      unit: 'unidades',
      costPerUnit: 45000,
      totalValue: 360000,
      supplier: 'Laboratorio Apícola',
      expirationDate: new Date('2027-12-31'),
      location: 'Bodega C',
      relatedModule: 'apicultura',
      status: 'en_stock',
      alertEnabled: true,
      createdAt: new Date('2025-01-05'),
      updatedAt: new Date('2026-01-10'),
    },
    {
      id: '12',
      code: 'HERR-001',
      name: 'Bomba de Fumigar',
      category: 'herramientas',
      currentStock: 5,
      minStock: 2,
      unit: 'unidades',
      costPerUnit: 185000,
      totalValue: 925000,
      supplier: 'Herramientas Agrícolas',
      location: 'Bodega E',
      status: 'en_stock',
      alertEnabled: false,
      createdAt: new Date('2025-02-01'),
      updatedAt: new Date('2026-01-20'),
    },
];

// Initialize store
function initializeInsumosStore() {
  if (insumosStore.length === 0) {
    insumosStore = [...initialInsumos];
  }
}

// Read operation
export const getMockInsumos = async (): Promise<Insumo[]> => {
  await delay(300);
  initializeInsumosStore();
  return [...insumosStore];
};

// CRUD Operations
export const createMockInsumo = async (data: InsumoFormData): Promise<Insumo> => {
  await delay(400);
  initializeInsumosStore();

  const currentStock = parseFloat(data.currentStock);
  const minStock = parseFloat(data.minStock);
  const costPerUnit = parseFloat(data.costPerUnit);

  const newInsumo: Insumo = {
    id: String(Date.now()),
    code: data.code,
    name: data.name,
    category: data.category,
    description: data.description || undefined,
    currentStock,
    minStock,
    maxStock: data.maxStock ? parseFloat(data.maxStock) : undefined,
    unit: data.unit,
    costPerUnit,
    totalValue: currentStock * costPerUnit,
    supplier: data.supplier || undefined,
    supplierPhone: data.supplierPhone || undefined,
    expirationDate: data.expirationDate ? new Date(data.expirationDate) : undefined,
    batchCode: data.batchCode || undefined,
    location: data.location || undefined,
    relatedModule: data.relatedModule || undefined,
    status: calculateStockStatus(currentStock, minStock),
    alertEnabled: data.alertEnabled,
    reorderQuantity: data.reorderQuantity ? parseFloat(data.reorderQuantity) : undefined,
    notes: data.notes || undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  insumosStore.push(newInsumo);
  return newInsumo;
};

export const updateMockInsumo = async (id: string, data: InsumoFormData): Promise<Insumo> => {
  await delay(400);
  initializeInsumosStore();

  const index = insumosStore.findIndex((i) => i.id === id);
  if (index === -1) throw new Error('Insumo no encontrado');

  const currentStock = parseFloat(data.currentStock);
  const minStock = parseFloat(data.minStock);
  const costPerUnit = parseFloat(data.costPerUnit);

  const updated: Insumo = {
    ...insumosStore[index],
    code: data.code,
    name: data.name,
    category: data.category,
    description: data.description || undefined,
    currentStock,
    minStock,
    maxStock: data.maxStock ? parseFloat(data.maxStock) : undefined,
    unit: data.unit,
    costPerUnit,
    totalValue: currentStock * costPerUnit,
    supplier: data.supplier || undefined,
    supplierPhone: data.supplierPhone || undefined,
    expirationDate: data.expirationDate ? new Date(data.expirationDate) : undefined,
    batchCode: data.batchCode || undefined,
    location: data.location || undefined,
    relatedModule: data.relatedModule || undefined,
    status: calculateStockStatus(currentStock, minStock),
    alertEnabled: data.alertEnabled,
    reorderQuantity: data.reorderQuantity ? parseFloat(data.reorderQuantity) : undefined,
    notes: data.notes || undefined,
    updatedAt: new Date(),
  };

  insumosStore[index] = updated;
  return updated;
};

export const deleteMockInsumo = async (id: string): Promise<void> => {
  await delay(300);
  initializeInsumosStore();

  const index = insumosStore.findIndex((i) => i.id === id);
  if (index === -1) throw new Error('Insumo no encontrado');

  insumosStore.splice(index, 1);
};

// Dashboard stats
export const getMockInsumosStats = async (): Promise<InsumosDashboardStats> => {
  await delay(300);
  return {
    totalInsumosCount: 12,
    categoryCounts: {
      semillas: 3,
      fertilizantes: 2,
      pesticidas: 2,
      herbicidas: 0,
      alimentos: 2,
      medicamentos: 2,
      herramientas: 1,
      otros: 0,
    },
    enStock: 9,
    bajoStock: 2,
    criticoStock: 1,
    totalInventoryValue: 17616000,
    monthlyMovements: 34,
    lastMovementDate: new Date('2026-01-20'),
    pendingReorders: 3,
    expiringItems: 2,
  };
};

// Movimientos
export const getMockMovements = async (): Promise<InsumoMovement[]> => {
  await delay(300);
  return [
    {
      id: '1',
      insumoId: '1',
      insumoName: 'Semilla de Tomate Roma',
      insumoCategory: 'semillas',
      type: 'entrada',
      quantity: 20,
      unit: 'kg',
      sourceModule: 'agro',
      date: new Date('2026-01-18'),
      performer: 'Juan Pérez',
      supplierName: 'Agrosemillas CR',
      invoiceNumber: 'INV-2026-001',
      purchaseCost: 900000,
      createdAt: new Date('2026-01-18'),
      updatedAt: new Date('2026-01-18'),
    },
    {
      id: '2',
      insumoId: '4',
      insumoName: 'Fertilizante NPK',
      insumoCategory: 'fertilizantes',
      type: 'salida',
      quantity: 50,
      unit: 'kg',
      sourceModule: 'agro',
      relatedItemId: '1',
      date: new Date('2026-01-17'),
      performer: 'María López',
      usedFor: 'Aplicación en Tomate - Lote Norte',
      createdAt: new Date('2026-01-17'),
      updatedAt: new Date('2026-01-17'),
    },
    {
      id: '3',
      insumoId: '8',
      insumoName: 'Concentrado Lechero',
      insumoCategory: 'alimentos',
      type: 'entrada',
      quantity: 250,
      unit: 'kg',
      sourceModule: 'pecuario',
      date: new Date('2026-01-16'),
      performer: 'Carlos Sánchez',
      supplierName: 'Agroalimentaria Central',
      invoiceNumber: 'INV-2026-002',
      purchaseCost: 3750000,
      createdAt: new Date('2026-01-16'),
      updatedAt: new Date('2026-01-16'),
    },
    {
      id: '4',
      insumoId: '10',
      insumoName: 'Antibiótico Ganadero',
      insumoCategory: 'medicamentos',
      type: 'salida',
      quantity: 2,
      unit: 'L',
      sourceModule: 'pecuario',
      date: new Date('2026-01-15'),
      performer: 'Dr. Rodríguez',
      usedFor: 'Tratamiento BOV-008',
      createdAt: new Date('2026-01-15'),
      updatedAt: new Date('2026-01-15'),
    },
  ];
};

// Alertas de stock bajo
export const getMockLowStockAlerts = async (): Promise<LowStockAlert[]> => {
  await delay(300);
  return [
    {
      id: '1',
      insumoId: '3',
      insumoName: 'Semilla de Pepino',
      category: 'semillas',
      currentStock: 2,
      minStock: 10,
      reorderQuantity: 12,
      supplier: 'Agrosemillas CR',
      costPerReorder: 576000,
      priority: 'high',
      createdAt: new Date('2026-01-12'),
    },
    {
      id: '2',
      insumoId: '2',
      insumoName: 'Semilla de Chile Jalapeño',
      category: 'semillas',
      currentStock: 8,
      minStock: 10,
      reorderQuantity: 10,
      supplier: 'Agrosemillas CR',
      costPerReorder: 520000,
      priority: 'medium',
      createdAt: new Date('2026-01-10'),
    },
    {
      id: '3',
      insumoId: '7',
      insumoName: 'Fungicida Preventivo',
      category: 'pesticidas',
      currentStock: 12,
      minStock: 20,
      reorderQuantity: 15,
      supplier: 'BioControl',
      costPerReorder: 480000,
      priority: 'medium',
      createdAt: new Date('2026-01-08'),
    },
  ];
};

// Resumen por categoría
export const getMockCategorySummaries = async (): Promise<CategorySummary[]> => {
  await delay(300);
  return [
    { category: 'semillas', categoryLabel: 'Semillas', count: 3, totalValue: 1637000, bajoStock: 2, icon: '🌱', color: '#10b981' },
    { category: 'fertilizantes', categoryLabel: 'Abonos', count: 2, totalValue: 1800000, bajoStock: 0, icon: '🧪', color: '#3b82f6' },
    { category: 'pesticidas', categoryLabel: 'Agroquimicos', count: 2, totalValue: 1509000, bajoStock: 1, icon: '🐛', color: '#ef4444' },
    { category: 'alimentos', categoryLabel: 'Alimentos', count: 2, totalValue: 9260000, bajoStock: 0, icon: '🥕', color: '#f59e0b' },
    { category: 'medicamentos', categoryLabel: 'Medicamentos', count: 2, totalValue: 2485000, bajoStock: 0, icon: '💊', color: '#8b5cf6' },
    { category: 'herramientas', categoryLabel: 'Herramientas', count: 1, totalValue: 925000, bajoStock: 0, icon: '🔧', color: '#6366f1' },
  ];
};

// Datos de consumo
export const getMockConsumptionData = async (): Promise<ConsumptionData[]> => {
  await delay(300);
  return [
    { month: 'Ago', agro: 1200000, pecuario: 850000, apicultura: 120000, total: 2170000 },
    { month: 'Sep', agro: 1450000, pecuario: 920000, apicultura: 95000, total: 2465000 },
    { month: 'Oct', agro: 1100000, pecuario: 1100000, apicultura: 180000, total: 2380000 },
    { month: 'Nov', agro: 1680000, pecuario: 780000, apicultura: 140000, total: 2600000 },
    { month: 'Dic', agro: 980000, pecuario: 1250000, apicultura: 200000, total: 2430000 },
    { month: 'Ene', agro: 1520000, pecuario: 1080000, apicultura: 160000, total: 2760000 },
  ];
};
