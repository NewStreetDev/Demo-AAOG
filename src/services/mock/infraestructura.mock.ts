import type {
  Facility,
  Equipment,
  MaintenanceRecord,
  InfraestructuraDashboardStats,
  FacilitiesByType,
  EquipmentByStatus,
  MaintenanceTimeline,
  InfrastructureActivity,
} from '../../types/infraestructura.types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Facilities Mock Data
export const getMockFacilities = async (): Promise<Facility[]> => {
  await delay(300);
  return [
    {
      id: '1',
      name: 'Bodega Principal',
      type: 'storage',
      description: 'Almacén central de insumos y productos',
      location: 'Sector Norte',
      area: 500,
      capacity: '200 toneladas',
      status: 'operational',
      constructionDate: new Date('2018-03-15'),
      lastMaintenanceDate: new Date('2025-12-01'),
      nextMaintenanceDate: new Date('2026-06-01'),
      assignedModule: 'general',
      createdAt: new Date('2018-03-15'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: '2',
      name: 'Establo Principal',
      type: 'barn',
      description: 'Establo para ganado lechero',
      location: 'Sector Este',
      area: 800,
      capacity: '50 cabezas',
      status: 'operational',
      constructionDate: new Date('2015-06-20'),
      lastMaintenanceDate: new Date('2025-11-15'),
      nextMaintenanceDate: new Date('2026-05-15'),
      assignedModule: 'pecuario',
      createdAt: new Date('2015-06-20'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: '3',
      name: 'Invernadero #1',
      type: 'greenhouse',
      description: 'Invernadero para cultivos protegidos',
      location: 'Sector Sur',
      area: 1200,
      capacity: '5000 plantas',
      status: 'operational',
      constructionDate: new Date('2020-02-10'),
      lastMaintenanceDate: new Date('2026-01-10'),
      nextMaintenanceDate: new Date('2026-07-10'),
      assignedModule: 'agro',
      createdAt: new Date('2020-02-10'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: '4',
      name: 'Planta de Procesamiento',
      type: 'processing',
      description: 'Instalación para procesamiento de productos',
      location: 'Sector Central',
      area: 400,
      status: 'maintenance',
      constructionDate: new Date('2019-08-05'),
      lastMaintenanceDate: new Date('2026-01-18'),
      assignedModule: 'procesamiento',
      createdAt: new Date('2019-08-05'),
      updatedAt: new Date('2026-01-18'),
    },
    {
      id: '5',
      name: 'Casa de Extracción',
      type: 'processing',
      description: 'Sala de extracción de miel',
      location: 'Sector Oeste',
      area: 150,
      status: 'operational',
      constructionDate: new Date('2021-04-12'),
      lastMaintenanceDate: new Date('2025-10-20'),
      nextMaintenanceDate: new Date('2026-04-20'),
      assignedModule: 'apicultura',
      createdAt: new Date('2021-04-12'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: '6',
      name: 'Oficina Administrativa',
      type: 'building',
      description: 'Oficinas y área administrativa',
      location: 'Entrada Principal',
      area: 200,
      status: 'operational',
      constructionDate: new Date('2010-01-01'),
      lastMaintenanceDate: new Date('2025-08-15'),
      nextMaintenanceDate: new Date('2026-08-15'),
      assignedModule: 'general',
      createdAt: new Date('2010-01-01'),
      updatedAt: new Date('2026-01-15'),
    },
  ];
};

// Equipment Mock Data
export const getMockEquipment = async (): Promise<Equipment[]> => {
  await delay(300);
  return [
    {
      id: '1',
      name: 'Tractor John Deere 5075E',
      type: 'vehicle',
      brand: 'John Deere',
      model: '5075E',
      serialNumber: 'JD5075E-2021-001',
      status: 'operational',
      purchaseDate: new Date('2021-03-15'),
      lastMaintenanceDate: new Date('2025-12-20'),
      nextMaintenanceDate: new Date('2026-03-20'),
      location: 'Bodega Principal',
      value: 45000000,
      createdAt: new Date('2021-03-15'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: '2',
      name: 'Sistema de Riego Automatizado',
      type: 'irrigation',
      brand: 'Netafim',
      model: 'DripNet PC',
      status: 'operational',
      purchaseDate: new Date('2020-06-10'),
      lastMaintenanceDate: new Date('2026-01-05'),
      nextMaintenanceDate: new Date('2026-07-05'),
      location: 'Invernadero #1',
      value: 15000000,
      createdAt: new Date('2020-06-10'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: '3',
      name: 'Ordeñadora Mecánica',
      type: 'machinery',
      brand: 'DeLaval',
      model: 'VMS V300',
      serialNumber: 'DL-VMS-2019-045',
      status: 'operational',
      purchaseDate: new Date('2019-09-20'),
      lastMaintenanceDate: new Date('2025-11-30'),
      nextMaintenanceDate: new Date('2026-02-28'),
      location: 'Establo Principal',
      value: 85000000,
      createdAt: new Date('2019-09-20'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: '4',
      name: 'Centrifugadora de Miel',
      type: 'machinery',
      brand: 'Lyson',
      model: 'W224BB',
      status: 'operational',
      purchaseDate: new Date('2021-05-15'),
      lastMaintenanceDate: new Date('2025-09-10'),
      nextMaintenanceDate: new Date('2026-03-10'),
      location: 'Casa de Extracción',
      value: 2500000,
      createdAt: new Date('2021-05-15'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: '5',
      name: 'Generador Eléctrico',
      type: 'electrical',
      brand: 'Caterpillar',
      model: 'DE110',
      serialNumber: 'CAT-DE110-2020-112',
      status: 'repair',
      purchaseDate: new Date('2020-01-20'),
      lastMaintenanceDate: new Date('2025-10-15'),
      location: 'Bodega Principal',
      value: 25000000,
      createdAt: new Date('2020-01-20'),
      updatedAt: new Date('2026-01-18'),
    },
    {
      id: '6',
      name: 'Camión de Carga',
      type: 'vehicle',
      brand: 'Isuzu',
      model: 'NPR 75L',
      serialNumber: 'ISZ-NPR-2022-089',
      status: 'operational',
      purchaseDate: new Date('2022-02-28'),
      lastMaintenanceDate: new Date('2025-12-10'),
      nextMaintenanceDate: new Date('2026-06-10'),
      location: 'Entrada Principal',
      value: 35000000,
      createdAt: new Date('2022-02-28'),
      updatedAt: new Date('2026-01-15'),
    },
  ];
};

// Maintenance Records
export const getMockMaintenanceRecords = async (): Promise<MaintenanceRecord[]> => {
  await delay(300);
  return [
    {
      id: '1',
      targetType: 'equipment',
      targetId: '5',
      targetName: 'Generador Eléctrico',
      description: 'Reparación de sistema de arranque',
      scheduledDate: new Date('2026-01-20'),
      priority: 'high',
      status: 'in_progress',
      assignedTo: 'Técnico Externo',
      cost: 500000,
      createdAt: new Date('2026-01-18'),
      updatedAt: new Date('2026-01-18'),
    },
    {
      id: '2',
      targetType: 'facility',
      targetId: '4',
      targetName: 'Planta de Procesamiento',
      description: 'Mantenimiento preventivo de sistemas de refrigeración',
      scheduledDate: new Date('2026-01-22'),
      priority: 'high',
      status: 'scheduled',
      assignedTo: 'Juan García',
      cost: 350000,
      createdAt: new Date('2026-01-15'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: '3',
      targetType: 'equipment',
      targetId: '3',
      targetName: 'Ordeñadora Mecánica',
      description: 'Revisión y calibración trimestral',
      scheduledDate: new Date('2026-02-28'),
      priority: 'medium',
      status: 'scheduled',
      assignedTo: 'Técnico DeLaval',
      createdAt: new Date('2026-01-10'),
      updatedAt: new Date('2026-01-10'),
    },
    {
      id: '4',
      targetType: 'facility',
      targetId: '2',
      targetName: 'Establo Principal',
      description: 'Inspección estructural semestral',
      scheduledDate: new Date('2026-05-15'),
      priority: 'low',
      status: 'scheduled',
      createdAt: new Date('2026-01-05'),
      updatedAt: new Date('2026-01-05'),
    },
    {
      id: '5',
      targetType: 'equipment',
      targetId: '1',
      targetName: 'Tractor John Deere 5075E',
      description: 'Cambio de aceite y filtros',
      scheduledDate: new Date('2026-03-20'),
      priority: 'medium',
      status: 'scheduled',
      assignedTo: 'Carlos Rodríguez',
      cost: 150000,
      createdAt: new Date('2025-12-20'),
      updatedAt: new Date('2025-12-20'),
    },
  ];
};

// Dashboard Stats
export const getMockInfraestructuraStats = async (): Promise<InfraestructuraDashboardStats> => {
  await delay(300);
  return {
    totalFacilities: 6,
    operationalFacilities: 5,
    facilitiesInMaintenance: 1,
    totalEquipment: 6,
    operationalEquipment: 5,
    equipmentInRepair: 1,
    pendingMaintenances: 5,
    overdueMaintenances: 0,
  };
};

// Facilities by Type
export const getMockFacilitiesByType = async (): Promise<FacilitiesByType[]> => {
  await delay(300);
  return [
    { type: 'Almacén', count: 1, operational: 1 },
    { type: 'Establo', count: 1, operational: 1 },
    { type: 'Invernadero', count: 1, operational: 1 },
    { type: 'Procesamiento', count: 2, operational: 1 },
    { type: 'Edificio', count: 1, operational: 1 },
  ];
};

// Equipment by Status
export const getMockEquipmentByStatus = async (): Promise<EquipmentByStatus[]> => {
  await delay(300);
  return [
    { status: 'Operativo', count: 5 },
    { status: 'En Reparación', count: 1 },
    { status: 'Mantenimiento', count: 0 },
    { status: 'Fuera de Servicio', count: 0 },
  ];
};

// Maintenance Timeline
export const getMockMaintenanceTimeline = async (): Promise<MaintenanceTimeline[]> => {
  await delay(300);
  return [
    { month: 'Sep', completed: 3, scheduled: 1 },
    { month: 'Oct', completed: 2, scheduled: 2 },
    { month: 'Nov', completed: 4, scheduled: 1 },
    { month: 'Dic', completed: 3, scheduled: 2 },
    { month: 'Ene', completed: 1, scheduled: 4 },
    { month: 'Feb', completed: 0, scheduled: 2 },
  ];
};

// Recent Activity
export const getMockInfrastructureActivity = async (): Promise<InfrastructureActivity[]> => {
  await delay(300);
  return [
    {
      id: '1',
      type: 'maintenance',
      targetName: 'Invernadero #1',
      description: 'Mantenimiento de sistema de ventilación completado',
      date: new Date('2026-01-10'),
      status: 'completed',
      createdAt: new Date('2026-01-10'),
      updatedAt: new Date('2026-01-10'),
    },
    {
      id: '2',
      type: 'repair',
      targetName: 'Generador Eléctrico',
      description: 'Reparación de sistema de arranque en progreso',
      date: new Date('2026-01-18'),
      status: 'in_progress',
      createdAt: new Date('2026-01-18'),
      updatedAt: new Date('2026-01-18'),
    },
    {
      id: '3',
      type: 'inspection',
      targetName: 'Establo Principal',
      description: 'Inspección rutinaria programada',
      date: new Date('2026-01-25'),
      status: 'scheduled',
      createdAt: new Date('2026-01-15'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: '4',
      type: 'maintenance',
      targetName: 'Sistema de Riego',
      description: 'Revisión de válvulas y sensores completada',
      date: new Date('2026-01-05'),
      status: 'completed',
      createdAt: new Date('2026-01-05'),
      updatedAt: new Date('2026-01-05'),
    },
  ];
};
