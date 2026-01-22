import type {
  Worker,
  WorkerAssignment,
  WorkLog,
  TrabajadoresTask,
  TrabajadoresDashboardStats,
  AttendanceSummary,
  WorkerPerformance,
  TasksByWorker,
} from '../../types/trabajadores.types';
import type { WorkerFormData } from '../../schemas/worker.schema';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory store for workers (simulates database)
let workersStore: Worker[] = [];

// Initial Workers Mock Data
const initialWorkers: Worker[] = [
  {
    id: '1',
    firstName: 'Juan',
    lastName: 'García',
    documentId: '1234567890',
    role: 'supervisor',
    moduleAssignment: 'agro',
    email: 'juan.garcia@finca.com',
    phone: '8765-4321',
    hireDate: new Date('2020-03-15'),
    status: 'active',
    hourlyRate: 15000,
    specializations: ['riego', 'fertilización'],
    createdAt: new Date('2020-03-15'),
    updatedAt: new Date('2026-01-15'),
  },
  {
    id: '2',
    firstName: 'María',
    lastName: 'López',
    documentId: '0987654321',
    role: 'trabajador',
    moduleAssignment: 'pecuario',
    email: 'maria.lopez@finca.com',
    phone: '8765-4322',
    hireDate: new Date('2021-06-20'),
    status: 'active',
    hourlyRate: 12000,
    specializations: ['alimentación', 'ordeño'],
    createdAt: new Date('2021-06-20'),
    updatedAt: new Date('2026-01-15'),
  },
  {
    id: '3',
    firstName: 'Carlos',
    lastName: 'Rodríguez',
    documentId: '1122334455',
    role: 'especialista',
    moduleAssignment: 'apicultura',
    email: 'carlos.rodriguez@finca.com',
    phone: '8765-4323',
    hireDate: new Date('2019-01-10'),
    status: 'active',
    hourlyRate: 18000,
    specializations: ['manejo de abejas', 'cosecha de miel'],
    createdAt: new Date('2019-01-10'),
    updatedAt: new Date('2026-01-15'),
  },
  {
    id: '4',
    firstName: 'Ana',
    lastName: 'Martínez',
    documentId: '5566778899',
    role: 'trabajador',
    moduleAssignment: 'procesamiento',
    email: 'ana.martinez@finca.com',
    phone: '8765-4324',
    hireDate: new Date('2022-09-05'),
    status: 'on_leave',
    hourlyRate: 11000,
    specializations: ['empaque', 'etiquetado'],
    createdAt: new Date('2022-09-05'),
    updatedAt: new Date('2026-01-15'),
  },
  {
    id: '5',
    firstName: 'Roberto',
    lastName: 'Sánchez',
    documentId: '6677889900',
    role: 'jefe',
    moduleAssignment: 'multiple',
    email: 'roberto.sanchez@finca.com',
    phone: '8765-4325',
    hireDate: new Date('2018-02-01'),
    status: 'active',
    hourlyRate: 25000,
    specializations: ['gestión', 'planificación'],
    createdAt: new Date('2018-02-01'),
    updatedAt: new Date('2026-01-15'),
  },
  {
    id: '6',
    firstName: 'Laura',
    lastName: 'Fernández',
    documentId: '7788990011',
    role: 'practicante',
    moduleAssignment: 'agro',
    email: 'laura.fernandez@finca.com',
    phone: '8765-4326',
    hireDate: new Date('2025-11-01'),
    status: 'active',
    hourlyRate: 8000,
    specializations: ['siembra', 'cosecha'],
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2026-01-15'),
  },
];

// Initialize the store with initial data
function initializeStore() {
  if (workersStore.length === 0) {
    workersStore = [...initialWorkers];
  }
}

// Workers Mock Data
export const getMockWorkers = async (): Promise<Worker[]> => {
  await delay(300);
  initializeStore();
  return [...workersStore];
};

// Worker Assignments
export const getMockWorkerAssignments = async (): Promise<WorkerAssignment[]> => {
  await delay(300);
  return [
    {
      id: '1',
      workerId: '1',
      workerName: 'Juan García',
      module: 'agro',
      task: 'Riego de cultivos - Lote Norte',
      startDate: new Date('2026-01-15'),
      status: 'active',
      createdAt: new Date('2026-01-15'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: '2',
      workerId: '2',
      workerName: 'María López',
      module: 'pecuario',
      task: 'Alimentación de ganado',
      startDate: new Date('2026-01-14'),
      status: 'active',
      createdAt: new Date('2026-01-14'),
      updatedAt: new Date('2026-01-14'),
    },
    {
      id: '3',
      workerId: '3',
      workerName: 'Carlos Rodríguez',
      module: 'apicultura',
      task: 'Inspección de colmenas',
      startDate: new Date('2026-01-10'),
      status: 'active',
      createdAt: new Date('2026-01-10'),
      updatedAt: new Date('2026-01-10'),
    },
  ];
};

// Work Logs/Attendance
export const getMockWorkLogs = async (): Promise<WorkLog[]> => {
  await delay(300);
  return [
    {
      id: '1',
      workerId: '1',
      workerName: 'Juan García',
      date: new Date('2026-01-20'),
      checkInTime: new Date('2026-01-20T06:00:00'),
      checkOutTime: new Date('2026-01-20T14:30:00'),
      hoursWorked: 8.5,
      status: 'present',
      module: 'agro',
      createdAt: new Date('2026-01-20'),
      updatedAt: new Date('2026-01-20'),
    },
    {
      id: '2',
      workerId: '2',
      workerName: 'María López',
      date: new Date('2026-01-20'),
      checkInTime: new Date('2026-01-20T06:15:00'),
      checkOutTime: new Date('2026-01-20T14:45:00'),
      hoursWorked: 8.5,
      status: 'late',
      module: 'pecuario',
      createdAt: new Date('2026-01-20'),
      updatedAt: new Date('2026-01-20'),
    },
    {
      id: '3',
      workerId: '3',
      workerName: 'Carlos Rodríguez',
      date: new Date('2026-01-20'),
      checkInTime: new Date('2026-01-20T06:00:00'),
      checkOutTime: new Date('2026-01-20T15:00:00'),
      hoursWorked: 9,
      status: 'present',
      module: 'apicultura',
      createdAt: new Date('2026-01-20'),
      updatedAt: new Date('2026-01-20'),
    },
  ];
};

// Tasks
export const getMockTrabajadoresTasks = async (): Promise<TrabajadoresTask[]> => {
  await delay(300);
  return [
    {
      id: '1',
      title: 'Riego del Lote Norte',
      description: 'Aplicar riego a cultivos de tomate',
      assignedTo: 'Juan García',
      module: 'agro',
      dueDate: new Date('2026-01-21'),
      priority: 'high',
      status: 'in_progress',
      createdAt: new Date('2026-01-20'),
      updatedAt: new Date('2026-01-20'),
    },
    {
      id: '2',
      title: 'Inspección de ganado',
      description: 'Revisar salud de animales en potrero 3',
      assignedTo: 'María López',
      module: 'pecuario',
      dueDate: new Date('2026-01-22'),
      priority: 'high',
      status: 'pending',
      createdAt: new Date('2026-01-20'),
      updatedAt: new Date('2026-01-20'),
    },
    {
      id: '3',
      title: 'Cosecha de miel',
      description: 'Recolectar miel de colmenas activas',
      assignedTo: 'Carlos Rodríguez',
      module: 'apicultura',
      dueDate: new Date('2026-01-25'),
      priority: 'medium',
      status: 'pending',
      createdAt: new Date('2026-01-20'),
      updatedAt: new Date('2026-01-20'),
    },
    {
      id: '4',
      title: 'Limpieza de establos',
      description: 'Limpieza general de instalaciones',
      assignedTo: 'María López',
      module: 'pecuario',
      dueDate: new Date('2026-01-21'),
      priority: 'medium',
      status: 'pending',
      createdAt: new Date('2026-01-20'),
      updatedAt: new Date('2026-01-20'),
    },
    {
      id: '5',
      title: 'Preparación de terreno',
      description: 'Preparar lote sur para nueva siembra',
      assignedTo: 'Juan García',
      module: 'agro',
      dueDate: new Date('2026-01-28'),
      priority: 'low',
      status: 'pending',
      createdAt: new Date('2026-01-20'),
      updatedAt: new Date('2026-01-20'),
    },
  ];
};

// Dashboard Stats
export const getMockTrabajadoresStats = async (): Promise<TrabajadoresDashboardStats> => {
  await delay(300);
  return {
    totalWorkers: 6,
    activeWorkers: 5,
    onLeaveWorkers: 1,
    averageAttendance: 92,
    totalHoursWorkedMonth: 864,
    pendingTasks: 8,
    completedTasksMonth: 24,
    taskCompletionRate: 75,
  };
};

// Attendance Summary by date
export const getMockAttendanceSummary = async (): Promise<AttendanceSummary[]> => {
  await delay(300);
  return [
    { date: 'Lun', present: 5, absent: 0, late: 1, attendanceRate: 95 },
    { date: 'Mar', present: 5, absent: 1, late: 0, attendanceRate: 83 },
    { date: 'Mié', present: 6, absent: 0, late: 0, attendanceRate: 100 },
    { date: 'Jue', present: 5, absent: 0, late: 1, attendanceRate: 95 },
    { date: 'Vie', present: 5, absent: 1, late: 0, attendanceRate: 83 },
  ];
};

// Worker Performance
export const getMockWorkerPerformance = async (): Promise<WorkerPerformance[]> => {
  await delay(300);
  return [
    {
      workerId: '1',
      workerName: 'Juan García',
      totalTasksAssigned: 12,
      completedTasks: 10,
      completionRate: 83.3,
      averageHoursPerDay: 8.5,
      attendanceRate: 100,
      rating: 4.5,
    },
    {
      workerId: '2',
      workerName: 'María López',
      totalTasksAssigned: 10,
      completedTasks: 7,
      completionRate: 70,
      averageHoursPerDay: 8.2,
      attendanceRate: 95,
      rating: 4.0,
    },
    {
      workerId: '3',
      workerName: 'Carlos Rodríguez',
      totalTasksAssigned: 8,
      completedTasks: 8,
      completionRate: 100,
      averageHoursPerDay: 8.8,
      attendanceRate: 100,
      rating: 5.0,
    },
    {
      workerId: '5',
      workerName: 'Roberto Sánchez',
      totalTasksAssigned: 15,
      completedTasks: 14,
      completionRate: 93.3,
      averageHoursPerDay: 9.0,
      attendanceRate: 100,
      rating: 4.8,
    },
  ];
};

// Tasks by Worker summary
export const getMockTasksByWorker = async (): Promise<TasksByWorker[]> => {
  await delay(300);
  return [
    { worker: 'Juan García', pending: 2, inProgress: 1, completed: 9, total: 12 },
    { worker: 'María López', pending: 3, inProgress: 0, completed: 7, total: 10 },
    { worker: 'Carlos Rodríguez', pending: 1, inProgress: 0, completed: 8, total: 9 },
    { worker: 'Roberto Sánchez', pending: 1, inProgress: 0, completed: 14, total: 15 },
  ];
};

// CRUD Operations

// Get single worker by ID
export const getMockWorkerById = async (id: string): Promise<Worker | null> => {
  await delay(200);
  initializeStore();
  return workersStore.find(w => w.id === id) || null;
};

// Create new worker
export const createMockWorker = async (data: WorkerFormData): Promise<Worker> => {
  await delay(400);
  initializeStore();

  const now = new Date();
  const newWorker: Worker = {
    id: String(Date.now()),
    firstName: data.firstName,
    lastName: data.lastName,
    documentId: data.documentId,
    role: data.role,
    moduleAssignment: data.moduleAssignment,
    status: data.status,
    hireDate: new Date(data.hireDate),
    hourlyRate: data.hourlyRate ? parseFloat(data.hourlyRate) : undefined,
    email: data.email || undefined,
    phone: data.phone || undefined,
    notes: data.notes || undefined,
    specializations: [],
    createdAt: now,
    updatedAt: now,
  };

  workersStore.push(newWorker);
  return newWorker;
};

// Update existing worker
export const updateMockWorker = async (id: string, data: WorkerFormData): Promise<Worker> => {
  await delay(400);
  initializeStore();

  const index = workersStore.findIndex(w => w.id === id);
  if (index === -1) {
    throw new Error('Trabajador no encontrado');
  }

  const existing = workersStore[index];
  const updatedWorker: Worker = {
    ...existing,
    firstName: data.firstName,
    lastName: data.lastName,
    documentId: data.documentId,
    role: data.role,
    moduleAssignment: data.moduleAssignment,
    status: data.status,
    hireDate: new Date(data.hireDate),
    hourlyRate: data.hourlyRate ? parseFloat(data.hourlyRate) : undefined,
    email: data.email || undefined,
    phone: data.phone || undefined,
    notes: data.notes || undefined,
    updatedAt: new Date(),
  };

  workersStore[index] = updatedWorker;
  return updatedWorker;
};

// Delete worker
export const deleteMockWorker = async (id: string): Promise<void> => {
  await delay(300);
  initializeStore();

  const index = workersStore.findIndex(w => w.id === id);
  if (index === -1) {
    throw new Error('Trabajador no encontrado');
  }

  workersStore.splice(index, 1);
};
