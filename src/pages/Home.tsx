import StatCard from '../components/common/Cards/StatCard';
import MapCard from '../components/common/Cards/MapCard';
import FincaOverview from '../components/common/Cards/FincaOverview';
import TaskList from '../components/common/Cards/TaskList';
import StatsChart from '../components/common/Cards/StatsChart';
import DocumentsCard from '../components/common/Cards/DocumentsCard';
import StatCardSkeleton from '../components/common/Skeletons/StatCardSkeleton';
import ChartSkeleton from '../components/common/Skeletons/ChartSkeleton';
import ListCardSkeleton from '../components/common/Skeletons/ListCardSkeleton';
import {
  useGeneralStats,
  useFarmSummaries,
  useTasks,
  useStatsChartData,
  useAuditSummary,
} from '../hooks/useDashboard';

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useGeneralStats();
  const { data: farms, isLoading: farmsLoading } = useFarmSummaries();
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { data: chartData, isLoading: chartLoading } = useStatsChartData();
  const { data: auditSummary, isLoading: auditLoading } = useAuditSummary();

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Page header */}
      <div className="space-y-1 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Panel General
        </h1>
        <p className="text-sm text-gray-600">
          Resumen administrativo de todas las fincas asociadas
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
            <StatCard
              label="Fincas Registradas"
              value={stats.registeredFarms}
              icon="farms"
            />
            <StatCard
              label="Trabajadores Activos"
              value={stats.activeWorkers}
              icon="workers"
            />
            <StatCard
              label="Producción del Mes"
              value={`${stats.monthlyProduction.value.toLocaleString()} ${stats.monthlyProduction.unit}`}
              icon="production"
            />
            <StatCard
              label="Ingresos del Mes"
              value={`$${stats.monthlyIncome.toLocaleString()}`}
              icon="income"
            />
          </>
        ) : null}
      </div>

      {/* Map and Vision General - 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
        {/* Map - takes 2/3 of space */}
        <div className="lg:col-span-2">
          {farmsLoading ? (
            <ChartSkeleton />
          ) : farms ? (
            <MapCard farms={farms} />
          ) : null}
        </div>

        {/* Vision General - takes 1/3 of space */}
        <div>
          {farmsLoading ? (
            <ListCardSkeleton itemCount={5} />
          ) : farms ? (
            <FincaOverview farms={farms} />
          ) : null}
        </div>
      </div>

      {/* Bottom row - 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
        {/* Tasks */}
        <div>
          {tasksLoading ? (
            <ListCardSkeleton itemCount={4} />
          ) : tasks ? (
            <TaskList tasks={tasks} />
          ) : null}
        </div>

        {/* Stats Chart */}
        <div>
          {chartLoading ? (
            <ChartSkeleton />
          ) : chartData ? (
            <StatsChart data={chartData} />
          ) : null}
        </div>

        {/* Documents Card */}
        <div>
          {auditLoading ? (
            <ListCardSkeleton itemCount={3} />
          ) : auditSummary ? (
            <DocumentsCard auditSummary={auditSummary} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
