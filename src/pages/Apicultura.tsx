import {
  ApiarioCard,
  ColmenaList,
  ApiculturaProductionChart,
  ApiculturaTaskList,
  HealthDistributionChart,
  ApiculturaStatCard,
} from '../components/apicultura';
import StatCardSkeleton from '../components/common/Skeletons/StatCardSkeleton';
import ChartSkeleton from '../components/common/Skeletons/ChartSkeleton';
import ListCardSkeleton from '../components/common/Skeletons/ListCardSkeleton';
import {
  useApiarios,
  useColmenas,
  useApiculturaStats,
  useApiculturaProduction,
  useApiculturaTasks,
  useHealthDistribution,
} from '../hooks/useApicultura';

export default function Apicultura() {
  const { data: apiarios, isLoading: apiariosLoading } = useApiarios();
  const { data: colmenas, isLoading: colmenasLoading } = useColmenas();
  const { data: stats, isLoading: statsLoading } = useApiculturaStats();
  const { data: production, isLoading: productionLoading } = useApiculturaProduction();
  const { data: tasks, isLoading: tasksLoading } = useApiculturaTasks();
  const { data: healthDist, isLoading: healthLoading } = useHealthDistribution();

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Page header */}
      <div className="space-y-1 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Apicultura
        </h1>
        <p className="text-sm text-gray-600">
          Gestión de apiarios, colmenas y producción apícola
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
            <ApiculturaStatCard
              label="Total Apiarios"
              value={stats.totalApiarios}
              icon="apiarios"
            />
            <ApiculturaStatCard
              label="Total Colmenas"
              value={stats.totalColmenas}
              icon="colmenas"
              subValue={`${stats.activeColmenas} activas`}
            />
            <ApiculturaStatCard
              label="Salud Promedio"
              value={stats.averageHealth.toFixed(1)}
              icon="health"
              subValue="de 10 puntos"
            />
            <ApiculturaStatCard
              label="Producción Miel"
              value={`${stats.monthlyProduction.honey} kg`}
              icon="production"
              subValue="este mes"
            />
          </>
        ) : null}
      </div>

      {/* Apiarios Grid */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Apiarios</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {apiariosLoading ? (
            <>
              {[...Array(3)].map((_, i) => (
                <ListCardSkeleton key={i} itemCount={3} />
              ))}
            </>
          ) : apiarios ? (
            apiarios.map((apiario) => (
              <ApiarioCard key={apiario.id} apiario={apiario} />
            ))
          ) : null}
        </div>
      </div>

      {/* Middle Section - Production Chart and Health Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
        {/* Production Chart - takes 2/3 */}
        <div className="lg:col-span-2">
          {productionLoading ? (
            <ChartSkeleton />
          ) : production ? (
            <ApiculturaProductionChart data={production} />
          ) : null}
        </div>

        {/* Health Distribution - takes 1/3 */}
        <div>
          {healthLoading ? (
            <ChartSkeleton />
          ) : healthDist ? (
            <HealthDistributionChart data={healthDist} />
          ) : null}
        </div>
      </div>

      {/* Bottom Section - Tasks and Colmenas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
        {/* Tasks */}
        <div>
          {tasksLoading ? (
            <ListCardSkeleton itemCount={5} />
          ) : tasks ? (
            <ApiculturaTaskList tasks={tasks} />
          ) : null}
        </div>

        {/* Colmenas List */}
        <div>
          {colmenasLoading ? (
            <ListCardSkeleton itemCount={5} />
          ) : colmenas ? (
            <ColmenaList colmenas={colmenas} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
