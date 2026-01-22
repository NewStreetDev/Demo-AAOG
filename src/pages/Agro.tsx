import {
  AgroStatCard,
  CropCard,
  LoteCard,
  AgroProductionChart,
  CropDistributionChart,
  AgroTaskList,
} from '../components/agro';
import StatCardSkeleton from '../components/common/Skeletons/StatCardSkeleton';
import ChartSkeleton from '../components/common/Skeletons/ChartSkeleton';
import ListCardSkeleton from '../components/common/Skeletons/ListCardSkeleton';
import {
  useLotes,
  useAgroStats,
  useAgroProduction,
  useAgroTasks,
  useCropDistribution,
  useCropSummaries,
} from '../hooks/useAgro';

export default function Agro() {
  const { data: lotes, isLoading: lotesLoading } = useLotes();
  const { data: stats, isLoading: statsLoading } = useAgroStats();
  const { data: production, isLoading: productionLoading } = useAgroProduction();
  const { data: tasks, isLoading: tasksLoading } = useAgroTasks();
  const { data: cropDist, isLoading: cropDistLoading } = useCropDistribution();
  const { data: cropSummaries, isLoading: cropsLoading } = useCropSummaries();

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Page header */}
      <div className="space-y-1 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Agricultura
        </h1>
        <p className="text-sm text-gray-600">
          Gestión de cultivos, lotes, planificación agrícola y cosechas
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
            <AgroStatCard
              label="Cultivos Activos"
              value={stats.activeCrops}
              icon="crops"
              subValue={`${stats.readyToHarvest} listos para cosechar`}
            />
            <AgroStatCard
              label="Área Cultivada"
              value={`${stats.cultivatedArea} ha`}
              icon="area"
              subValue={`de ${stats.totalArea} ha totales`}
            />
            <AgroStatCard
              label="Cosecha del Mes"
              value={`${stats.monthlyHarvest.quantity.toLocaleString()} ${stats.monthlyHarvest.unit}`}
              icon="harvest"
            />
            <AgroStatCard
              label="Ingresos del Mes"
              value={`₡${(stats.monthlyRevenue / 1000000).toFixed(1)}M`}
              icon="revenue"
              subValue={`${stats.pendingActions} acciones pendientes`}
            />
          </>
        ) : null}
      </div>

      {/* Crops Grid */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Cultivos Activos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {cropsLoading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <ListCardSkeleton key={i} itemCount={3} />
              ))}
            </>
          ) : cropSummaries ? (
            cropSummaries.map((crop) => (
              <CropCard key={crop.id} crop={crop} />
            ))
          ) : null}
        </div>
      </div>

      {/* Production Chart and Crop Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
        {/* Production Chart - takes 2/3 */}
        <div className="lg:col-span-2">
          {productionLoading ? (
            <ChartSkeleton />
          ) : production ? (
            <AgroProductionChart data={production} />
          ) : null}
        </div>

        {/* Crop Distribution - takes 1/3 */}
        <div>
          {cropDistLoading ? (
            <ChartSkeleton />
          ) : cropDist ? (
            <CropDistributionChart data={cropDist} />
          ) : null}
        </div>
      </div>

      {/* Tasks and Lotes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
        {/* Tasks */}
        <div>
          {tasksLoading ? (
            <ListCardSkeleton itemCount={5} />
          ) : tasks ? (
            <AgroTaskList tasks={tasks} />
          ) : null}
        </div>

        {/* Lotes Grid - takes 2/3 */}
        <div className="lg:col-span-2">
          <div className="card p-5 animate-fade-in">
            <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-4">
              Lotes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lotesLoading ? (
                <>
                  {[...Array(3)].map((_, i) => (
                    <StatCardSkeleton key={i} />
                  ))}
                </>
              ) : lotes ? (
                lotes.slice(0, 6).map((lote) => (
                  <LoteCard key={lote.id} lote={lote} />
                ))
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
