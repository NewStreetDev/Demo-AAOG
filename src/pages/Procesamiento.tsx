import { useState } from 'react';
import { Plus, Activity, Factory, Package, Shield } from 'lucide-react';
import {
  ProcesamientoStatCard,
  BatchList,
  ProcessingLineCard,
  ProductionOutputChart,
  ProductionByTypeChart,
  ProcesamientoTaskList,
  ProcessingLineFormModal,
  ProcessingLineDetailModal,
  ProcessingLineList,
  ProcessingBatchFormModal,
  ProcessingBatchDetailModal,
  ProcessingBatchList,
  QualityControlFormModal,
  QualityControlDetailModal,
  QualityControlList,
} from '../components/procesamiento';
import StatCardSkeleton from '../components/common/Skeletons/StatCardSkeleton';
import ChartSkeleton from '../components/common/Skeletons/ChartSkeleton';
import ListCardSkeleton from '../components/common/Skeletons/ListCardSkeleton';
import {
  useProcesamientoStats,
  useProcessingLines,
  useProcessingBatches,
  useQualityControls,
  useProcesamientoProduction,
  useProductionByType,
  useBatchSummaries,
  useProcesamientoTasks,
} from '../hooks/useProcesamiento';
import type {
  ProcessingLine,
  ProcessingBatch,
  QualityControl,
} from '../types/procesamiento.types';

type TabType = 'dashboard' | 'lineas' | 'lotes' | 'calidad';

export default function Procesamiento() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Data queries
  const { data: stats, isLoading: statsLoading } = useProcesamientoStats();
  const { data: lines, isLoading: linesLoading } = useProcessingLines();
  const { data: batches, isLoading: batchesLoading } = useProcessingBatches();
  const { data: qualityControls, isLoading: qcLoading } = useQualityControls();
  const { data: production, isLoading: productionLoading } = useProcesamientoProduction();
  const { data: byType, isLoading: byTypeLoading } = useProductionByType();
  const { data: batchSummaries, isLoading: summariesLoading } = useBatchSummaries();
  const { data: tasks, isLoading: tasksLoading } = useProcesamientoTasks();

  // Processing Line modal state
  const [lineFormOpen, setLineFormOpen] = useState(false);
  const [lineDetailOpen, setLineDetailOpen] = useState(false);
  const [selectedLine, setSelectedLine] = useState<ProcessingLine | null>(null);

  // Processing Batch modal state
  const [batchFormOpen, setBatchFormOpen] = useState(false);
  const [batchDetailOpen, setBatchDetailOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<ProcessingBatch | null>(null);

  // Quality Control modal state
  const [qcFormOpen, setQcFormOpen] = useState(false);
  const [qcDetailOpen, setQcDetailOpen] = useState(false);
  const [selectedQC, setSelectedQC] = useState<QualityControl | null>(null);

  // Processing Line handlers
  const handleLineClick = (line: ProcessingLine) => {
    setSelectedLine(line);
    setLineDetailOpen(true);
  };

  const handleLineEdit = (line: ProcessingLine) => {
    setSelectedLine(line);
    setLineFormOpen(true);
  };

  const handleNewLine = () => {
    setSelectedLine(null);
    setLineFormOpen(true);
  };

  // Processing Batch handlers
  const handleBatchClick = (batch: ProcessingBatch) => {
    setSelectedBatch(batch);
    setBatchDetailOpen(true);
  };

  const handleBatchEdit = (batch: ProcessingBatch) => {
    setSelectedBatch(batch);
    setBatchFormOpen(true);
  };

  const handleNewBatch = () => {
    setSelectedBatch(null);
    setBatchFormOpen(true);
  };

  // Quality Control handlers
  const handleQCClick = (qc: QualityControl) => {
    setSelectedQC(qc);
    setQcDetailOpen(true);
  };

  const handleQCEdit = (qc: QualityControl) => {
    setSelectedQC(qc);
    setQcFormOpen(true);
  };

  const handleNewQC = () => {
    setSelectedQC(null);
    setQcFormOpen(true);
  };

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: Activity },
    { id: 'lineas' as TabType, label: 'Lineas', icon: Factory },
    { id: 'lotes' as TabType, label: 'Lotes', icon: Package },
    { id: 'calidad' as TabType, label: 'Calidad', icon: Shield },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Procesamiento
          </h1>
          <p className="text-sm text-gray-600">
            Gestion de procesamiento de productos agricolas, pecuarios y apicolas
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {activeTab === 'dashboard' && (
            <>
              <button
                onClick={handleNewBatch}
                className="btn-secondary inline-flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                Nuevo Lote
              </button>
              <button
                onClick={handleNewLine}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nueva Linea
              </button>
            </>
          )}
          {activeTab === 'lineas' && (
            <button
              onClick={handleNewLine}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nueva Linea
            </button>
          )}
          {activeTab === 'lotes' && (
            <button
              onClick={handleNewBatch}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nuevo Lote
            </button>
          )}
          {activeTab === 'calidad' && (
            <button
              onClick={handleNewQC}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nuevo Control
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-1 -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Dashboard Tab Content */}
      {activeTab === 'dashboard' && (
        <>
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
                  label="Produccion"
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
                  subValue={`${stats.activeProcessingLines}/${stats.totalProcessingLines} lineas activas`}
                />
              </>
            ) : null}
          </div>

          {/* Processing Lines */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Lineas de Procesamiento
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
                  <div key={line.id} onClick={() => handleLineClick(line)} className="cursor-pointer">
                    <ProcessingLineCard line={line} />
                  </div>
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
              {summariesLoading ? (
                <ListCardSkeleton itemCount={3} />
              ) : batchSummaries ? (
                <BatchList batches={batchSummaries} />
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
        </>
      )}

      {/* Lineas Tab Content */}
      {activeTab === 'lineas' && (
        <div className="grid grid-cols-1 gap-6">
          {linesLoading ? (
            <ListCardSkeleton itemCount={4} />
          ) : lines ? (
            <ProcessingLineList
              lines={lines}
              onLineClick={handleLineClick}
            />
          ) : null}
        </div>
      )}

      {/* Lotes Tab Content */}
      {activeTab === 'lotes' && (
        <div className="grid grid-cols-1 gap-6">
          {batchesLoading ? (
            <ListCardSkeleton itemCount={5} />
          ) : batches ? (
            <ProcessingBatchList
              batches={batches}
              onBatchClick={handleBatchClick}
            />
          ) : null}
        </div>
      )}

      {/* Calidad Tab Content */}
      {activeTab === 'calidad' && (
        <div className="grid grid-cols-1 gap-6">
          {qcLoading ? (
            <ListCardSkeleton itemCount={3} />
          ) : qualityControls ? (
            <QualityControlList
              qualityControls={qualityControls}
              onQCClick={handleQCClick}
            />
          ) : null}
        </div>
      )}

      {/* Processing Line Modals */}
      <ProcessingLineFormModal
        open={lineFormOpen}
        onOpenChange={setLineFormOpen}
        line={selectedLine}
      />
      <ProcessingLineDetailModal
        open={lineDetailOpen}
        onOpenChange={setLineDetailOpen}
        line={selectedLine}
        onEdit={handleLineEdit}
      />

      {/* Processing Batch Modals */}
      <ProcessingBatchFormModal
        open={batchFormOpen}
        onOpenChange={setBatchFormOpen}
        batch={selectedBatch}
      />
      <ProcessingBatchDetailModal
        open={batchDetailOpen}
        onOpenChange={setBatchDetailOpen}
        batch={selectedBatch}
        onEdit={handleBatchEdit}
      />

      {/* Quality Control Modals */}
      <QualityControlFormModal
        open={qcFormOpen}
        onOpenChange={setQcFormOpen}
        qualityControl={selectedQC}
      />
      <QualityControlDetailModal
        open={qcDetailOpen}
        onOpenChange={setQcDetailOpen}
        qualityControl={selectedQC}
        onEdit={handleQCEdit}
      />
    </div>
  );
}
