import type { BaseEntity } from './common.types';

// Worker Status
export type WorkerStatus = 'active' | 'inactive' | 'on_leave' | 'temporary';

// Worker Role/Position
export type WorkerRole = 'jefe' | 'supervisor' | 'trabajador' | 'especialista' | 'practicante';

// Task Status
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

// Worker record
export interface Worker extends BaseEntity {
  firstName: string;
  lastName: string;
  documentId: string;
  role: WorkerRole;
  moduleAssignment: 'agro' | 'pecuario' | 'apicultura' | 'procesamiento' | 'multiple';
  email?: string;
  phone?: string;
  hireDate: Date;
  status: WorkerStatus;
  hourlyRate?: number;
  specializations?: string[];
  notes?: string;
}

// Assignment (worker assignment to tasks/areas)
export interface WorkerAssignment extends BaseEntity {
  workerId: string;
  workerName: string;
  module: 'agro' | 'pecuario' | 'apicultura' | 'procesamiento';
  task: string;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'completed' | 'paused';
  notes?: string;
}

// Work Log/Attendance
export interface WorkLog extends BaseEntity {
  workerId: string;
  workerName: string;
  date: Date;
  checkInTime: Date;
  checkOutTime?: Date;
  hoursWorked?: number;
  status: 'present' | 'absent' | 'late' | 'early_departure';
  module?: string;
  notes?: string;
}

// Task assignment
export interface TrabajadoresTask extends BaseEntity {
  title: string;
  description: string;
  assignedTo: string;
  module: 'agro' | 'pecuario' | 'apicultura' | 'procesamiento';
  dueDate: Date;
  priority: 'high' | 'medium' | 'low';
  status: TaskStatus;
  completedAt?: Date;
}

// Dashboard Stats
export interface TrabajadoresDashboardStats {
  totalWorkers: number;
  activeWorkers: number;
  onLeaveWorkers: number;
  averageAttendance: number;
  totalHoursWorkedMonth: number;
  pendingTasks: number;
  completedTasksMonth: number;
  taskCompletionRate: number;
}

// Attendance Summary
export interface AttendanceSummary {
  date: string;
  present: number;
  absent: number;
  late: number;
  attendanceRate: number;
}

// Worker Performance
export interface WorkerPerformance {
  workerId: string;
  workerName: string;
  totalTasksAssigned: number;
  completedTasks: number;
  completionRate: number;
  averageHoursPerDay: number;
  attendanceRate: number;
  rating: number;
}

// Task by worker
export interface TasksByWorker {
  worker: string;
  pending: number;
  inProgress: number;
  completed: number;
  total: number;
}
