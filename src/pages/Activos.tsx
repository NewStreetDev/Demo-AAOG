import {
  ActivosStatCard,
  AssetCard,
  AssetsByCategoryChart,
  AssetValueTrendChart,
  DepreciationChart,
  ActivityList,
  DepreciationList,
} from '../components/activos';
import StatCardSkeleton from '../components/common/Skeletons/StatCardSkeleton';
import ChartSkeleton from '../components/common/Skeletons/ChartSkeleton';
import ListCardSkeleton from '../components/common/Skeletons/ListCardSkeleton';
import {
  useAssets,
  useActivosStats,
  useAssetsByCategory,
  useAssetValueTrend,
  useDepreciationSummary,
  useAssetActivity,
  useDepreciationRecords,
} from '../hooks/useActivos';

function formatCurrency(value: number): string {
  if (value >= 1000000000) {
    return `₡${(value / 1000000000).toFixed(2)}B`;
  }
  if (value >= 1000000) {
    return `₡${(value / 1000000).toFixed(0)}M`;
  }
  return `₡${(value / 1000).toFixed(0)}K`;
}

export default function Activos() {
  const { data: assets, isLoading: assetsLoading } = useAssets();
  const { data: stats, isLoading: statsLoading } = useActivosStats();
  const { data: byCategory, isLoading: byCategoryLoading } = useAssetsByCategory();
  const { data: valueTrend, isLoading: valueTrendLoading } = useAssetValueTrend();
  const { data: depreciationSummary, isLoading: depreciationSummaryLoading } = useDepreciationSummary();
  const { data: activity, isLoading: activityLoading } = useAssetActivity();
  const { data: depreciationRecords, isLoading: depreciationRecordsLoading } = useDepreciationRecords();

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Page header */}
      <div className="space-y-1 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Activos
        </h1>
        <p className="text-sm text-gray-600">
          Registro, seguimiento y valoración de activos de la finca
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
            <ActivosStatCard
              label="Total Activos"
              value={stats.totalAssets}
              icon="assets"
              subValue={`${stats.activeAssets} activos`}
            />
            <ActivosStatCard
              label="Valor Total"
              value={formatCurrency(stats.totalCurrentValue)}
              icon="value"
              subValue="valor actual"
            />
            <ActivosStatCard
              label="Depreciación"
              value={formatCurrency(stats.totalDepreciation)}
              icon="depreciation"
              subValue="acumulada"
            />
            <ActivosStatCard
              label="En Mantenimiento"
              value={stats.assetsUnderMaintenance}
              icon="alerts"
              subValue="activos"
            />
          </>
        ) : null}
      </div>

      {/* Charts Row - Value Trend and By Category */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
        {/* Value Trend - takes 2/3 */}
        <div className="lg:col-span-2">
          {valueTrendLoading ? (
            <ChartSkeleton />
          ) : valueTrend ? (
            <AssetValueTrendChart data={valueTrend} />
          ) : null}
        </div>

        {/* By Category - takes 1/3 */}
        <div>
          {byCategoryLoading ? (
            <ChartSkeleton />
          ) : byCategory ? (
            <AssetsByCategoryChart data={byCategory} />
          ) : null}
        </div>
      </div>

      {/* Assets Grid */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Inventario de Activos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {assetsLoading ? (
            <>
              {[...Array(8)].map((_, i) => (
                <ListCardSkeleton key={i} itemCount={3} />
              ))}
            </>
          ) : assets ? (
            assets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))
          ) : null}
        </div>
      </div>

      {/* Depreciation and Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
        {/* Depreciation Chart - takes 2/3 */}
        <div className="lg:col-span-2">
          {depreciationSummaryLoading ? (
            <ChartSkeleton />
          ) : depreciationSummary ? (
            <DepreciationChart data={depreciationSummary} />
          ) : null}
        </div>

        {/* Activity - takes 1/3 */}
        <div>
          {activityLoading ? (
            <ListCardSkeleton itemCount={4} />
          ) : activity ? (
            <ActivityList activities={activity} />
          ) : null}
        </div>
      </div>

      {/* Depreciation Records */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
        <div>
          {depreciationRecordsLoading ? (
            <ListCardSkeleton itemCount={3} />
          ) : depreciationRecords ? (
            <DepreciationList records={depreciationRecords} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
