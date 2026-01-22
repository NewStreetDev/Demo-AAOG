import {
  ReportesStatCard,
  ModuleSummaryCard,
  ConsolidatedChart,
  TrendChart,
  ReportsList,
  ReportesTaskList,
} from '../components/reportes';
import StatCardSkeleton from '../components/common/Skeletons/StatCardSkeleton';
import ChartSkeleton from '../components/common/Skeletons/ChartSkeleton';
import ListCardSkeleton from '../components/common/Skeletons/ListCardSkeleton';
import {
  useConsolidatedStats,
  useModuleComparisons,
  usePeriodComparison,
  useTrendData,
  useGeneratedReports,
  useReportesTasks,
} from '../hooks/useReportes';

export default function Reportes() {
  const { data: stats, isLoading: statsLoading } = useConsolidatedStats();
  const { data: modules, isLoading: modulesLoading } = useModuleComparisons();
  const { data: comparison, isLoading: comparisonLoading } = usePeriodComparison();
  const { data: trends, isLoading: trendsLoading } = useTrendData();
  const { data: reports, isLoading: reportsLoading } = useGeneratedReports();
  const { data: tasks, isLoading: tasksLoading } = useReportesTasks();

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Page header */}
      <div className="space-y-1 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Reportes e Informes
        </h1>
        <p className="text-sm text-gray-600">
          Consolidación de datos y análisis de todos los módulos de la finca
        </p>
      </div>

      {/* Stats Grid - 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        {statsLoading || comparisonLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </>
        ) : stats && comparison ? (
          <>
            <ReportesStatCard
              label="Ingresos Totales"
              value={`₡${(stats.totalIncome / 1000000).toFixed(1)}M`}
              icon="income"
              trend={comparison.variance.revenueChangePercent}
            />
            <ReportesStatCard
              label="Ganancia Neta"
              value={`₡${(stats.netProfit / 1000000).toFixed(1)}M`}
              icon="profit"
              trend={comparison.variance.profitChangePercent}
            />
            <ReportesStatCard
              label="Producción Total"
              value={`${(stats.totalProduction / 1000).toFixed(0)}K`}
              icon="production"
              subValue={stats.productionUnit}
              trend={comparison.variance.productionChangePercent}
            />
            <ReportesStatCard
              label="Margen de Ganancia"
              value={`${stats.profitMargin}%`}
              icon="margin"
              subValue="rentabilidad global"
            />
          </>
        ) : null}
      </div>

      {/* Module Summaries */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Desempeño por Módulo
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {modulesLoading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <StatCardSkeleton key={i} />
              ))}
            </>
          ) : modules ? (
            modules.map((module) => (
              <ModuleSummaryCard key={module.module} module={module} />
            ))
          ) : null}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
        {/* Trend Chart */}
        <div>
          {trendsLoading ? (
            <ChartSkeleton />
          ) : trends ? (
            <TrendChart data={trends} />
          ) : null}
        </div>

        {/* Consolidated Chart */}
        <div>
          {modulesLoading ? (
            <ChartSkeleton />
          ) : modules ? (
            <ConsolidatedChart data={modules} />
          ) : null}
        </div>
      </div>

      {/* Reports and Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
        {/* Reports List - 2/3 */}
        <div className="lg:col-span-2">
          {reportsLoading ? (
            <ListCardSkeleton itemCount={4} />
          ) : reports ? (
            <ReportsList reports={reports} />
          ) : null}
        </div>

        {/* Tasks - 1/3 */}
        <div>
          {tasksLoading ? (
            <ListCardSkeleton itemCount={5} />
          ) : tasks ? (
            <ReportesTaskList tasks={tasks} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
