import {
  ProcesamientoStatCard,
  BatchList,
  ProcessingLineCard,
  ProductionOutputChart,
  ProductionByTypeChart,
  ProcesamientoTaskList,
} from '../components/procesamiento';
import StatCardSkeleton from '../components/common/Skeletons/StatCardSkeleton';
import ChartSkeleton from '../components/common/Skeletons/ChartSkeleton';
import ListCardSkeleton from '../components/common/Skeletons/ListCardSkeleton';
import {
  useProcesamientoStats,
  useProcessingLines,
  useProcesamientoProduction,
  useProductionByType,
  useBatchSummaries,
  useProcesamientoTasks,
} from '../hooks/useProcesamiento';

export default function Procesamiento() {
  const { data: stats, isLoading: statsLoading } = useProcesamientoStats();
  const { data: lines, isLoading: linesLoading } = useProcessingLines();
  const { data: production, isLoading: productionLoading } = useProcesamientoProduction();
  const { data: byType, isLoading: byTypeLoading } = useProductionByType();
  const { data: batches, isLoading: batchesLoading } = useBatchSummaries();
  const { data: tasks, isLoading: tasksLoading } = useProcesamientoTasks();

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Page header */}
      <div className="space-y-1 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Procesamiento
        </h1>
        <p className="text-sm text-gray-600">
          Gestión de procesamiento de productos agrícolas, pecuarios y apícolas
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
            <ProcesamientoStatCard
              label="Lotes Activos"
              value={stats.activeBatches}
              icon="batches"
              subValue={`${stats.totalBatchesThisMonth} este mes`}
            />
            <ProcesamientoStatCard
              label="Producción"
              value={`${stats.totalProduced} ${stats.producedUnit}`}
              icon="production"
              subValue={`de ${stats.totalProcessed} ${stats.processedUnit} procesados`}
            />
            <ProcesamientoStatCard
              label="Calidad"
              value={`${stats.qualityPassRate}%`}
              icon="quality"
              subValue={`${stats.pendingQualityControl} pendientes QC`}
            />
            <ProcesamientoStatCard
              label="Rendimiento"
              value={`${stats.averageYield}%`}
              icon="yield"
              subValue={`${stats.activeProcessingLines}/${stats.totalProcessingLines} líneas activas`}
            />
          </>
        ) : null}
      </div>

      {/* Processing Lines */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Líneas de Procesamiento
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {linesLoading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <StatCardSkeleton key={i} />
              ))}
            </>
          ) : lines ? (
            lines.map((line) => (
              <ProcessingLineCard key={line.id} line={line} />
            ))
          ) : null}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
        {/* Production Chart - 2/3 */}
        <div className="lg:col-span-2">
          {productionLoading ? (
            <ChartSkeleton />
          ) : production ? (
            <ProductionOutputChart data={production} />
          ) : null}
        </div>

        {/* By Type Chart - 1/3 */}
        <div>
          {byTypeLoading ? (
            <ChartSkeleton />
          ) : byType ? (
            <ProductionByTypeChart data={byType} />
          ) : null}
        </div>
      </div>

      {/* Batches and Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
        {/* Active Batches */}
        <div>
          {batchesLoading ? (
            <ListCardSkeleton itemCount={3} />
          ) : batches ? (
            <BatchList batches={batches} />
          ) : null}
        </div>

        {/* Tasks */}
        <div>
          {tasksLoading ? (
            <ListCardSkeleton itemCount={5} />
          ) : tasks ? (
            <ProcesamientoTaskList tasks={tasks} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
