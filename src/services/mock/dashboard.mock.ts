import type {
  DashboardMetric,
  ProductionSummary,
  InventoryItem,
  Task,
  WorkerSummary,
  Activity,
  WeatherData,
  MonthlyIncome,
} from '../../types/dashboard.types';

// Simular delay de API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Dashboard Metrics
export const getMockMetrics = async (): Promise<DashboardMetric[]> => {
  await delay(300);
  return [
    {
      label: 'Producción Mensual',
      value: '$7,500',
      trend: 12.5,
      sparklineData: [4000, 5200, 6100, 5800, 7500],
      color: 'green',
    },
    {
      label: 'Ingresos del Mes',
      value: '$5,200',
      trend: 8.2,
      sparklineData: [3000, 3500, 4200, 4800, 5200],
      color: 'blue',
    },
    {
      label: 'Total de Trabajadores',
      value: 8,
      sparklineData: [6, 7, 7, 8, 8],
      color: 'orange',
    },
    {
      label: 'Mis Fincas',
      value: 1,
      color: 'green',
    },
  ];
};

// Production Summary
export const getMockProductionSummary = async (): Promise<ProductionSummary> => {
  await delay(300);
  return {
    month: 'Enero',
    items: [
      {
        id: '1',
        name: 'Leche',
        quantity: 1200,
        unit: 'L',
        icon: 'milk',
        color: 'blue',
      },
      {
        id: '2',
        name: 'Huevos',
        quantity: 350,
        unit: 'Doc',
        icon: 'egg',
        color: 'orange',
      },
      {
        id: '3',
        name: 'Miel',
        quantity: 80,
        unit: 'kg',
        icon: 'honey',
        color: 'yellow',
      },
      {
        id: '4',
        name: 'Carne',
        quantity: 120,
        unit: 'kg',
        icon: 'meat',
        color: 'red',
      },
    ],
    totalValue: 7500,
  };
};

// Inventory
export const getMockInventory = async (): Promise<InventoryItem[]> => {
  await delay(300);
  return [
    {
      id: '1',
      name: 'Insumos en Inventario',
      category: 'insumo',
      quantity: 25,
      unit: 'items',
      minStock: 10,
      status: 'en_stock',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Solicitudes Pendientes',
      category: 'insumo',
      quantity: 3,
      unit: 'solicitudes',
      minStock: 0,
      status: 'bajo',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      name: 'Préstamos a Vencer',
      category: 'insumo',
      quantity: 5,
      unit: 'items',
      minStock: 0,
      status: 'critico',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
};

// Activities for pie chart
export const getMockActivities = async (): Promise<Activity[]> => {
  await delay(300);
  return [
    { name: 'Leche', value: 35, color: '#3b82f6' },
    { name: 'Huevos', value: 25, color: '#f97316' },
    { name: 'Miel', value: 20, color: '#eab308' },
    { name: 'Carne', value: 20, color: '#ef4444' },
  ];
};

// Workers
export const getMockWorkers = async (): Promise<WorkerSummary[]> => {
  await delay(300);
  return [
    {
      id: '1',
      name: 'Juan Pérez',
      role: 'Encargado',
      status: 'active',
      currentTask: 'Supervisión general',
    },
    {
      id: '2',
      name: 'María López',
      role: 'Operaria',
      status: 'active',
      currentTask: 'Ordeño',
    },
    {
      id: '3',
      name: 'Carlos Sánchez',
      role: 'Obrero',
      status: 'active',
      currentTask: 'Mantenimiento',
    },
  ];
};

// Tasks
export const getMockTasks = async (): Promise<Task[]> => {
  await delay(300);
  return [
    {
      id: '1',
      title: 'Revisión de galera',
      description: 'Inspección de seguridad mensual',
      priority: 'high',
      status: 'pending',
      category: 'revision',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'Comprobación de estado de máquinas',
      description: 'Verificar estado operativo de equipos',
      priority: 'medium',
      status: 'pending',
      category: 'maintenance',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      title: 'Mantenimiento de usuario',
      description: 'Actualización de permisos',
      priority: 'low',
      status: 'pending',
      category: 'other',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
};

// Weather
export const getMockWeather = async (): Promise<WeatherData> => {
  await delay(300);
  return {
    current: {
      temperature: 28,
      condition: 'Soleado',
      humidity: 60,
      icon: '☀️',
    },
    forecast: [
      { day: 'Mar', tempHigh: 30, tempLow: 18, condition: 'Soleado', icon: '☀️' },
      { day: 'Mié', tempHigh: 29, tempLow: 17, condition: 'Parcialmente nublado', icon: '⛅' },
      { day: 'Jue', tempHigh: 29, tempLow: 17, condition: 'Parcialmente nublado', icon: '⛅' },
      { day: 'Vie', tempHigh: 27, tempLow: 16, condition: 'Nublado', icon: '☁️' },
    ],
  };
};

// Monthly Income
export const getMockMonthlyIncome = async (): Promise<MonthlyIncome> => {
  await delay(300);
  return {
    month: 'Enero',
    amount: 5200,
    breakdown: [
      { category: 'Venta de leche', amount: 2500 },
      { category: 'Venta de huevos', amount: 1200 },
      { category: 'Venta de miel', amount: 1000 },
      { category: 'Otros', amount: 500 },
    ],
  };
};
