import {
  TrabajadoresStatCard,
  WorkerCard,
  TrabajadoresTaskList,
  AttendanceChart,
  TasksByWorkerChart,
  WorkerPerformanceList,
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

export default function Trabajadores() {
  const { data: workers, isLoading: workersLoading } = useWorkers();
  const { data: stats, isLoading: statsLoading } = useTrabajadoresStats();
  const { data: tasks, isLoading: tasksLoading } = useTrabajadoresTasks();
  const { data: attendance, isLoading: attendanceLoading } = useAttendanceSummary();
  const { data: tasksByWorker, isLoading: tasksByWorkerLoading } = useTasksByWorker();
  const { data: performance, isLoading: performanceLoading } = useWorkerPerformance();

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Page header */}
      <div className="space-y-1 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Trabajadores
        </h1>
        <p className="text-sm text-gray-600">
          Gestión de personal, asignaciones de tareas y control de asistencia
        </p>
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
              <WorkerCard key={worker.id} worker={worker} />
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
    </div>
  );
}
