import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  TrabajadoresStatCard,
  WorkerCard,
  TrabajadoresTaskList,
  AttendanceChart,
  TasksByWorkerChart,
  WorkerPerformanceList,
  WorkerFormModal,
  WorkerDetailModal,
} from '../components/trabajadores';
import StatCardSkeleton from '../components/common/Skeletons/StatCardSkeleton';
import ChartSkeleton from '../components/common/Skeletons/ChartSkeleton';
import ListCardSkeleton from '../components/common/Skeletons/ListCardSkeleton';
import {
  useWorkers,
  useTrabajadoresStats,
  useTrabajadoresTasks,
  useAttendanceSummary,
  useTasksByWorker,
  useWorkerPerformance,
} from '../hooks/useTrabajadores';
import type { Worker } from '../types/trabajadores.types';

export default function Trabajadores() {
  const { data: workers, isLoading: workersLoading } = useWorkers();
  const { data: stats, isLoading: statsLoading } = useTrabajadoresStats();
  const { data: tasks, isLoading: tasksLoading } = useTrabajadoresTasks();
  const { data: attendance, isLoading: attendanceLoading } = useAttendanceSummary();
  const { data: tasksByWorker, isLoading: tasksByWorkerLoading } = useTasksByWorker();
  const { data: performance, isLoading: performanceLoading } = useWorkerPerformance();

  // Modal state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);

  const handleWorkerClick = (worker: Worker) => {
    setSelectedWorker(worker);
    setIsDetailModalOpen(true);
  };

  const handleEditWorker = (worker: Worker) => {
    setEditingWorker(worker);
    setIsFormModalOpen(true);
  };

  const handleNewWorker = () => {
    setEditingWorker(null);
    setIsFormModalOpen(true);
  };

  const handleFormModalClose = (open: boolean) => {
    setIsFormModalOpen(open);
    if (!open) {
      setEditingWorker(null);
    }
  };

  const handleDetailModalClose = (open: boolean) => {
    setIsDetailModalOpen(open);
    if (!open) {
      setSelectedWorker(null);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Page header */}
      <div className="flex items-start justify-between animate-fade-in">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Trabajadores
          </h1>
          <p className="text-sm text-gray-600">
            Gestión de personal, asignaciones de tareas y control de asistencia
          </p>
        </div>
        <button
          className="btn-primary inline-flex items-center gap-2"
          onClick={handleNewWorker}
        >
          <Plus className="w-4 h-4" />
          Nuevo Trabajador
        </button>
      </div>

      {/* Stats Grid - 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        {statsLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </>
        ) : stats ? (
          <>
            <TrabajadoresStatCard
              label="Personal Total"
              value={stats.totalWorkers}
              icon="workers"
              subValue={`${stats.activeWorkers} activos`}
            />
            <TrabajadoresStatCard
              label="Asistencia Promedio"
              value={`${stats.averageAttendance}%`}
              icon="attendance"
              subValue={`${stats.onLeaveWorkers} en permiso`}
            />
            <TrabajadoresStatCard
              label="Horas Mes"
              value={stats.totalHoursWorkedMonth}
              icon="hours"
              subValue="horas trabajadas"
            />
            <TrabajadoresStatCard
              label="Tareas Completadas"
              value={`${stats.taskCompletionRate}%`}
              icon="tasks"
              subValue={`${stats.completedTasksMonth} este mes`}
            />
          </>
        ) : null}
      </div>

      {/* Workers Grid */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Personal Activo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {workersLoading ? (
            <>
              {[...Array(6)].map((_, i) => (
                <ListCardSkeleton key={i} itemCount={3} />
              ))}
            </>
          ) : workers ? (
            workers.map((worker) => (
              <WorkerCard
                key={worker.id}
                worker={worker}
                onClick={() => handleWorkerClick(worker)}
              />
            ))
          ) : null}
        </div>
      </div>

      {/* Attendance and Tasks by Worker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
        {/* Attendance Chart - takes 2/3 */}
        <div className="lg:col-span-2">
          {attendanceLoading ? (
            <ChartSkeleton />
          ) : attendance ? (
            <AttendanceChart data={attendance} />
          ) : null}
        </div>

        {/* Tasks by Worker - takes 1/3 */}
        <div>
          {tasksByWorkerLoading ? (
            <ChartSkeleton />
          ) : tasksByWorker ? (
            <TasksByWorkerChart data={tasksByWorker} />
          ) : null}
        </div>
      </div>

      {/* Tasks and Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
        {/* Tasks - takes 1/3 */}
        <div>
          {tasksLoading ? (
            <ListCardSkeleton itemCount={5} />
          ) : tasks ? (
            <TrabajadoresTaskList tasks={tasks} />
          ) : null}
        </div>

        {/* Performance - takes 2/3 */}
        <div className="lg:col-span-2">
          {performanceLoading ? (
            <ListCardSkeleton itemCount={3} />
          ) : performance ? (
            <WorkerPerformanceList workers={performance} />
          ) : null}
        </div>
      </div>

      {/* Modals */}
      <WorkerFormModal
        open={isFormModalOpen}
        onOpenChange={handleFormModalClose}
        worker={editingWorker}
      />
      <WorkerDetailModal
        open={isDetailModalOpen}
        onOpenChange={handleDetailModalClose}
        worker={selectedWorker}
        onEdit={handleEditWorker}
      />
    </div>
  );
}
