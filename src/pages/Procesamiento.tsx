import { useState, useMemo } from 'react';
import { Plus, CalendarDays, Package } from 'lucide-react';
import {
  ProcessingBatchFormModal,
  ProcessingBatchDetailModal,
  ProcessingBatchList,
} from '../components/procesamiento';
import ListCardSkeleton from '../components/common/Skeletons/ListCardSkeleton';
import {
  useProcessingBatches,
} from '../hooks/useProcesamiento';
import type {
  ProcessingBatch,
} from '../types/procesamiento.types';
import type { GeneralPlan } from '../types/finca.types';
import { GeneralPlanFormModal, GeneralPlanDetailModal } from '../components/finca';
import { CalendarView } from '../components/common/Calendar';
import { useGeneralPlans } from '../hooks/useFinca';

type TabType = 'planificacion' | 'procesos';

export default function Procesamiento() {
  const [activeTab, setActiveTab] = useState<TabType>('planificacion');

  // Data queries
  const { data: batches, isLoading: batchesLoading } = useProcessingBatches();

  // Processing Batch modal state
  const [batchFormOpen, setBatchFormOpen] = useState(false);
  const [batchDetailOpen, setBatchDetailOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<ProcessingBatch | null>(null);

  // Plan modals state
  const [selectedPlan, setSelectedPlan] = useState<GeneralPlan | null>(null);
  const [planFormModalOpen, setPlanFormModalOpen] = useState(false);
  const [planDetailModalOpen, setPlanDetailModalOpen] = useState(false);
  const [preselectedDate, setPreselectedDate] = useState<Date | null>(null);

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

  // Plan handlers
  const handlePlanClick = (_plan: GeneralPlan) => {
    // Popover handles this - no action needed here
  };

  const handlePlanView = (plan: GeneralPlan) => {
    setSelectedPlan(plan);
    setPlanDetailModalOpen(true);
  };

  const handlePlanEdit = (plan: GeneralPlan) => {
    setSelectedPlan(plan);
    setPlanDetailModalOpen(false);
    setPreselectedDate(null);
    setPlanFormModalOpen(true);
  };

  const handleNewPlan = () => {
    setSelectedPlan(null);
    setPreselectedDate(null);
    setPlanFormModalOpen(true);
  };

  const handlePlanDayClick = (date: Date) => {
    setSelectedPlan(null);
    setPreselectedDate(date);
    setPlanFormModalOpen(true);
  };

  // Query for general plans
  const { data: allPlans, isLoading: plansLoading } = useGeneralPlans();

  // Filter plans for procesamiento module
  const procesamientoPlans = useMemo(() => {
    if (!allPlans) return [];
    return allPlans.filter(plan => plan.targetModule === 'procesamiento');
  }, [allPlans]);

  const tabs = [
    { id: 'planificacion' as TabType, label: 'Planificación', icon: CalendarDays },
    { id: 'procesos' as TabType, label: 'Lotes y Procesamiento', icon: Package },
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
            Gestión de procesamiento de productos agrícolas y pecuarios
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {activeTab === 'planificacion' && (
            <button
              onClick={handleNewPlan}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nueva Acción
            </button>
          )}
          {activeTab === 'procesos' && (
            <button
              onClick={handleNewBatch}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nuevo Proceso
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

      {/* Planificacion Tab Content */}
      {activeTab === 'planificacion' && (
        <>
          {plansLoading ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 animate-pulse">
              <div className="h-12 bg-gray-100 rounded-lg mb-4" />
              <div className="grid grid-cols-7 gap-2">
                {[...Array(35)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-100 rounded-lg" />
                ))}
              </div>
            </div>
          ) : (
            <CalendarView
              plans={procesamientoPlans}
              onDayClick={handlePlanDayClick}
              onPlanClick={handlePlanClick}
              onPlanEdit={handlePlanEdit}
              onPlanView={handlePlanView}
              defaultModule="procesamiento"
              showModuleColors={false}
            />
          )}
        </>
      )}

      {/* Procesos Tab Content */}
      {activeTab === 'procesos' && (
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

      {/* Plan Modals - filtered to procesamiento module */}
      <GeneralPlanFormModal
        open={planFormModalOpen}
        onOpenChange={(open) => {
          setPlanFormModalOpen(open);
          if (!open) setPreselectedDate(null);
        }}
        plan={selectedPlan}
        defaultModule="procesamiento"
        preselectedDate={preselectedDate}
        onSuccess={() => {
          setSelectedPlan(null);
          setPreselectedDate(null);
        }}
      />
      <GeneralPlanDetailModal
        open={planDetailModalOpen}
        onOpenChange={setPlanDetailModalOpen}
        plan={selectedPlan}
        onEdit={handlePlanEdit}
        onDeleteSuccess={() => setSelectedPlan(null)}
      />
    </div>
  );
}
