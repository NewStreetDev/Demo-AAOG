import {
  InsumosStatCard,
  CategoryStockCard,
  InsumosList,
  MovementList,
  LowStockAlertList,
  ConsumptionChart,
  StockDistributionChart,
} from '../components/insumos';
import StatCardSkeleton from '../components/common/Skeletons/StatCardSkeleton';
import ChartSkeleton from '../components/common/Skeletons/ChartSkeleton';
import ListCardSkeleton from '../components/common/Skeletons/ListCardSkeleton';
import {
  useInsumos,
  useInsumosStats,
  useMovements,
  useLowStockAlerts,
  useCategorySummaries,
  useConsumptionData,
} from '../hooks/useInsumos';

export default function Insumos() {
  const { data: insumos, isLoading: insumosLoading } = useInsumos();
  const { data: stats, isLoading: statsLoading } = useInsumosStats();
  const { data: movements, isLoading: movementsLoading } = useMovements();
  const { data: alerts, isLoading: alertsLoading } = useLowStockAlerts();
  const { data: categories, isLoading: categoriesLoading } = useCategorySummaries();
  const { data: consumption, isLoading: consumptionLoading } = useConsumptionData();

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Page header */}
      <div className="space-y-1 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Gestión de Insumos
        </h1>
        <p className="text-sm text-gray-600">
          Control de inventario, stock y movimientos de materiales e insumos
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
            <InsumosStatCard
              label="Total Insumos"
              value={stats.totalInsumosCount}
              icon="insumos"
              subValue="activos en inventario"
            />
            <InsumosStatCard
              label="Estado de Stock"
              value={stats.enStock}
              icon="stock"
              subValue={`${stats.bajoStock} bajo, ${stats.criticoStock} crítico`}
            />
            <InsumosStatCard
              label="Valor Inventario"
              value={`₡${(stats.totalInventoryValue / 1000000).toFixed(1)}M`}
              icon="valor"
            />
            <InsumosStatCard
              label="Movimientos"
              value={stats.monthlyMovements}
              icon="movimientos"
              subValue="este mes"
            />
          </>
        ) : null}
      </div>

      {/* Alerts Section */}
      {!alertsLoading && alerts && alerts.length > 0 && (
        <LowStockAlertList alerts={alerts} />
      )}

      {/* Category Summary Grid */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Resumen por Categoría
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-5">
          {categoriesLoading ? (
            <>
              {[...Array(6)].map((_, i) => (
                <StatCardSkeleton key={i} />
              ))}
            </>
          ) : categories ? (
            categories.map((cat) => (
              <CategoryStockCard key={cat.category} category={cat} />
            ))
          ) : null}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
        {/* Consumption Chart - 2/3 */}
        <div className="lg:col-span-2">
          {consumptionLoading ? (
            <ChartSkeleton />
          ) : consumption ? (
            <ConsumptionChart data={consumption} />
          ) : null}
        </div>

        {/* Stock Distribution - 1/3 */}
        <div>
          {categoriesLoading ? (
            <ChartSkeleton />
          ) : categories ? (
            <StockDistributionChart data={categories} />
          ) : null}
        </div>
      </div>

      {/* Insumos List and Movements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
        {/* Insumos List - 2/3 */}
        <div className="lg:col-span-2">
          {insumosLoading ? (
            <ListCardSkeleton itemCount={6} />
          ) : insumos ? (
            <InsumosList insumos={insumos} />
          ) : null}
        </div>

        {/* Movements - 1/3 */}
        <div>
          {movementsLoading ? (
            <ListCardSkeleton itemCount={5} />
          ) : movements ? (
            <MovementList movements={movements} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
