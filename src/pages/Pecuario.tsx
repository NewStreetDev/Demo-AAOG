import {
  PecuarioStatCard,
  LivestockTable,
  PecuarioProductionChart,
  CategoryDistributionChart,
  PecuarioTaskList,
  PotreroCard,
} from '../components/pecuario';
import StatCardSkeleton from '../components/common/Skeletons/StatCardSkeleton';
import ChartSkeleton from '../components/common/Skeletons/ChartSkeleton';
import ListCardSkeleton from '../components/common/Skeletons/ListCardSkeleton';
import {
  useLivestock,
  usePotreros,
  usePecuarioStats,
  usePecuarioProduction,
  usePecuarioTasks,
  useCategoryDistribution,
} from '../hooks/usePecuario';

export default function Pecuario() {
  const { data: livestock, isLoading: livestockLoading } = useLivestock();
  const { data: potreros, isLoading: potrerosLoading } = usePotreros();
  const { data: stats, isLoading: statsLoading } = usePecuarioStats();
  const { data: production, isLoading: productionLoading } = usePecuarioProduction();
  const { data: tasks, isLoading: tasksLoading } = usePecuarioTasks();
  const { data: categoryDist, isLoading: categoryLoading } = useCategoryDistribution();

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Page header */}
      <div className="space-y-1 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Pecuario
        </h1>
        <p className="text-sm text-gray-600">
          Gestión de ganado, salud animal, reproducción y producción
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
            <PecuarioStatCard
              label="Total Ganado"
              value={stats.totalLivestock}
              icon="livestock"
              subValue={`${stats.byCategory.vacas} vacas, ${stats.byCategory.toros} toros`}
            />
            <PecuarioStatCard
              label="Salud General"
              value={`${stats.healthyPercentage}%`}
              icon="health"
              subValue={`${stats.pendingHealthActions} acciones pendientes`}
            />
            <PecuarioStatCard
              label="Producción Leche"
              value={`${stats.monthlyMilkProduction.toLocaleString()} L`}
              icon="milk"
              subValue="este mes"
            />
            <PecuarioStatCard
              label="Potreros Activos"
              value={stats.activePotrerosCount}
              icon="potreros"
              subValue={`${stats.recentBirths} nacimientos recientes`}
            />
          </>
        ) : null}
      </div>

      {/* Livestock Table and Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
        {/* Livestock Table - takes 2/3 */}
        <div className="lg:col-span-2">
          {livestockLoading ? (
            <ListCardSkeleton itemCount={6} />
          ) : livestock ? (
            <LivestockTable livestock={livestock} />
          ) : null}
        </div>

        {/* Category Distribution - takes 1/3 */}
        <div>
          {categoryLoading ? (
            <ChartSkeleton />
          ) : categoryDist ? (
            <CategoryDistributionChart data={categoryDist} />
          ) : null}
        </div>
      </div>

      {/* Production Chart and Potreros */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
        {/* Production Chart - takes 2/3 */}
        <div className="lg:col-span-2">
          {productionLoading ? (
            <ChartSkeleton />
          ) : production ? (
            <PecuarioProductionChart data={production} />
          ) : null}
        </div>

        {/* Tasks - takes 1/3 */}
        <div>
          {tasksLoading ? (
            <ListCardSkeleton itemCount={5} />
          ) : tasks ? (
            <PecuarioTaskList tasks={tasks} />
          ) : null}
        </div>
      </div>

      {/* Potreros Section */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Potreros</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {potrerosLoading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <StatCardSkeleton key={i} />
              ))}
            </>
          ) : potreros ? (
            potreros.map((potrero) => (
              <PotreroCard key={potrero.id} potrero={potrero} />
            ))
          ) : null}
        </div>
      </div>
    </div>
  );
}
