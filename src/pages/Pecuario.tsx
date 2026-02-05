import { useState, useMemo } from 'react';
import { Plus, Stethoscope, Users, Heart, Beef, MapPin, CalendarDays } from 'lucide-react';
import {
  PecuarioStatCard,
  LivestockTable,
  PecuarioProductionChart,
  CategoryDistributionChart,
  PecuarioTaskList,
  PotreroCard,
  LivestockFormModal,
  LivestockDetailModal,
  PotreroFormModal,
  PotreroDetailModal,
  HealthRecordFormModal,
  HealthRecordDetailModal,
  HealthRecordList,
  GroupHealthActionFormModal,
  ReproductionFormModal,
  ReproductionDetailModal,
  ReproductionList,
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
  useHealthRecords,
  useReproductionRecords,
} from '../hooks/usePecuario';
import type { Livestock, Potrero, HealthRecord, ReproductionRecord } from '../types/pecuario.types';
import type { GeneralPlan } from '../types/finca.types';
import { GeneralPlanFormModal, GeneralPlanDetailModal } from '../components/finca';
import { CalendarView } from '../components/common/Calendar';
import { useGeneralPlans } from '../hooks/useFinca';

type TabType = 'planificacion' | 'inventario' | 'salud' | 'reproduccion' | 'potreros';

export default function Pecuario() {
  const [activeTab, setActiveTab] = useState<TabType>('planificacion');

  // Modal state for Livestock
  const [selectedLivestock, setSelectedLivestock] = useState<Livestock | null>(null);
  const [livestockFormModalOpen, setLivestockFormModalOpen] = useState(false);
  const [livestockDetailModalOpen, setLivestockDetailModalOpen] = useState(false);

  // Modal state for Potrero
  const [selectedPotrero, setSelectedPotrero] = useState<Potrero | null>(null);
  const [potreroFormModalOpen, setPotreroFormModalOpen] = useState(false);
  const [potreroDetailModalOpen, setPotreroDetailModalOpen] = useState(false);

  // Modal state for Health Records
  const [selectedHealthRecord, setSelectedHealthRecord] = useState<HealthRecord | null>(null);
  const [healthRecordFormModalOpen, setHealthRecordFormModalOpen] = useState(false);
  const [healthRecordDetailModalOpen, setHealthRecordDetailModalOpen] = useState(false);
  const [preselectedLivestockForHealth, setPreselectedLivestockForHealth] = useState<Livestock | null>(null);

  // Modal state for Group Health Actions
  const [groupHealthActionModalOpen, setGroupHealthActionModalOpen] = useState(false);

  // Modal state for Reproduction Records
  const [selectedReproductionRecord, setSelectedReproductionRecord] = useState<ReproductionRecord | null>(null);
  const [reproductionFormModalOpen, setReproductionFormModalOpen] = useState(false);
  const [reproductionDetailModalOpen, setReproductionDetailModalOpen] = useState(false);
  const [preselectedCowForReproduction, setPreselectedCowForReproduction] = useState<Livestock | null>(null);

  // Modal state for Plans
  const [selectedPlan, setSelectedPlan] = useState<GeneralPlan | null>(null);
  const [planFormModalOpen, setPlanFormModalOpen] = useState(false);
  const [planDetailModalOpen, setPlanDetailModalOpen] = useState(false);
  const [preselectedDate, setPreselectedDate] = useState<Date | null>(null);

  // Livestock handlers
  const handleLivestockClick = (livestock: Livestock) => {
    setSelectedLivestock(livestock);
    setLivestockDetailModalOpen(true);
  };

  const handleLivestockEdit = (livestock: Livestock) => {
    setSelectedLivestock(livestock);
    setLivestockDetailModalOpen(false);
    setLivestockFormModalOpen(true);
  };

  const handleNewLivestock = () => {
    setSelectedLivestock(null);
    setLivestockFormModalOpen(true);
  };

  // Potrero handlers
  const handlePotreroClick = (potrero: Potrero) => {
    setSelectedPotrero(potrero);
    setPotreroDetailModalOpen(true);
  };

  const handlePotreroEdit = (potrero: Potrero) => {
    setSelectedPotrero(potrero);
    setPotreroDetailModalOpen(false);
    setPotreroFormModalOpen(true);
  };

  const handleNewPotrero = () => {
    setSelectedPotrero(null);
    setPotreroFormModalOpen(true);
  };

  // Health Record handlers
  const handleHealthRecordClick = (record: HealthRecord) => {
    setSelectedHealthRecord(record);
    setHealthRecordDetailModalOpen(true);
  };

  const handleHealthRecordEdit = (record: HealthRecord) => {
    setSelectedHealthRecord(record);
    setHealthRecordDetailModalOpen(false);
    setHealthRecordFormModalOpen(true);
  };

  const handleNewHealthRecord = (livestock?: Livestock) => {
    setSelectedHealthRecord(null);
    setPreselectedLivestockForHealth(livestock || null);
    setHealthRecordFormModalOpen(true);
  };

  const handleAddHealthRecordFromDetail = (livestock: Livestock) => {
    setPreselectedLivestockForHealth(livestock);
    setSelectedHealthRecord(null);
    setHealthRecordFormModalOpen(true);
  };

  const handleViewHealthRecordFromDetail = (record: HealthRecord) => {
    setSelectedHealthRecord(record);
    setHealthRecordDetailModalOpen(true);
  };

  // Group Health Action handlers
  const handleNewGroupHealthAction = () => {
    setGroupHealthActionModalOpen(true);
  };

  // Reproduction handlers
  const handleReproductionRecordClick = (record: ReproductionRecord) => {
    setSelectedReproductionRecord(record);
    setReproductionDetailModalOpen(true);
  };

  const handleReproductionRecordEdit = (record: ReproductionRecord) => {
    setSelectedReproductionRecord(record);
    setReproductionDetailModalOpen(false);
    setReproductionFormModalOpen(true);
  };

  const handleNewReproductionRecord = (cow?: Livestock) => {
    setSelectedReproductionRecord(null);
    setPreselectedCowForReproduction(cow || null);
    setReproductionFormModalOpen(true);
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

  // Queries
  const { data: livestock, isLoading: livestockLoading } = useLivestock();
  const { data: potreros, isLoading: potrerosLoading } = usePotreros();
  const { data: stats, isLoading: statsLoading } = usePecuarioStats();
  const { data: production, isLoading: productionLoading } = usePecuarioProduction();
  const { data: tasks, isLoading: tasksLoading } = usePecuarioTasks();
  const { data: categoryDist, isLoading: categoryLoading } = useCategoryDistribution();
  const { data: healthRecords, isLoading: healthRecordsLoading } = useHealthRecords();
  const { data: reproductionRecords, isLoading: reproductionLoading } = useReproductionRecords();
  const { data: allPlans, isLoading: plansLoading } = useGeneralPlans();

  // Filter plans for pecuario module
  const pecuarioPlans = useMemo(() => {
    if (!allPlans) return [];
    return allPlans.filter(plan => plan.targetModule === 'pecuario');
  }, [allPlans]);

  const tabs: { id: TabType; label: string; icon: typeof CalendarDays }[] = [
    { id: 'planificacion', label: 'Planificación', icon: CalendarDays },
    { id: 'inventario', label: 'Inventario e Identificación', icon: Beef },
    { id: 'salud', label: 'Salud Animal', icon: Stethoscope },
    { id: 'reproduccion', label: 'Reproducción y Control de Partos', icon: Heart },
    { id: 'potreros', label: 'Gestión de Potreros', icon: MapPin },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'inventario':
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    label="Produccion Leche"
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                {livestockLoading ? (
                  <ListCardSkeleton itemCount={6} />
                ) : livestock ? (
                  <LivestockTable
                    livestock={livestock}
                    onLivestockClick={handleLivestockClick}
                  />
                ) : null}
              </div>
              <div>
                {categoryLoading ? (
                  <ChartSkeleton />
                ) : categoryDist ? (
                  <CategoryDistributionChart data={categoryDist} />
                ) : null}
              </div>
            </div>

            {/* Production Chart */}
            <div className="grid grid-cols-1 gap-4">
              {productionLoading ? (
                <ChartSkeleton />
              ) : production ? (
                <PecuarioProductionChart data={production} />
              ) : null}
            </div>
          </div>
        );

      case 'salud':
        return (
          <div className="space-y-6">
            {/* Health Records and Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                {healthRecordsLoading ? (
                  <ListCardSkeleton itemCount={5} />
                ) : healthRecords ? (
                  <HealthRecordList
                    healthRecords={healthRecords}
                    onRecordClick={handleHealthRecordClick}
                    showFilters={true}
                  />
                ) : null}
              </div>
              <div>
                {tasksLoading ? (
                  <ListCardSkeleton itemCount={5} />
                ) : tasks ? (
                  <PecuarioTaskList tasks={tasks} />
                ) : null}
              </div>
            </div>
          </div>
        );

      case 'reproduccion':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                {reproductionLoading ? (
                  <ListCardSkeleton itemCount={5} />
                ) : reproductionRecords ? (
                  <ReproductionList
                    reproductionRecords={reproductionRecords}
                    onRecordClick={handleReproductionRecordClick}
                    showFilters={true}
                  />
                ) : null}
              </div>
              <div>
                {tasksLoading ? (
                  <ListCardSkeleton itemCount={5} />
                ) : tasks ? (
                  <PecuarioTaskList
                    tasks={tasks.filter(t => t.type === 'reproduction' || t.type === 'checkup')}
                  />
                ) : null}
              </div>
            </div>
          </div>
        );

      case 'potreros':
        return (
          <div className="space-y-6">
            {/* Potreros Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {potrerosLoading ? (
                <>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </>
              ) : potreros ? (
                potreros.map((potrero) => (
                  <PotreroCard
                    key={potrero.id}
                    potrero={potrero}
                    onClick={() => handlePotreroClick(potrero)}
                  />
                ))
              ) : null}
            </div>
          </div>
        );

      case 'planificacion':
        return (
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
                plans={pecuarioPlans}
                onDayClick={handlePlanDayClick}
                onPlanClick={handlePlanClick}
                onPlanEdit={handlePlanEdit}
                onPlanView={handlePlanView}
                defaultModule="pecuario"
                showModuleColors={false}
              />
            )}
          </>
        );

      default:
        return null;
    }
  };

  const getActionButtons = () => {
    switch (activeTab) {
      case 'inventario':
        return (
          <button
            onClick={handleNewLivestock}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Animal
          </button>
        );
      case 'potreros':
        return (
          <button
            onClick={handleNewPotrero}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Potrero
          </button>
        );
      case 'salud':
        return (
          <>
            <button
              onClick={handleNewGroupHealthAction}
              className="btn-ghost inline-flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Acción Grupal
            </button>
            <button
              onClick={() => handleNewHealthRecord()}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Registro Salud
            </button>
          </>
        );
      case 'reproduccion':
        return (
          <button
            onClick={() => handleNewReproductionRecord()}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Registro
          </button>
        );
      case 'planificacion':
        return (
          <button
            onClick={handleNewPlan}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nueva Acción
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Page header */}
      <div className="flex items-start justify-between animate-fade-in">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Pecuario
          </h1>
          <p className="text-sm text-gray-600">
            Gestión de ganado, salud animal y reproducción
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {getActionButtons()}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-1 overflow-x-auto pb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                  ${isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {renderTabContent()}
      </div>

      {/* Modals */}
      <LivestockFormModal
        open={livestockFormModalOpen}
        onOpenChange={setLivestockFormModalOpen}
        livestock={selectedLivestock}
        onSuccess={() => setSelectedLivestock(null)}
      />
      <LivestockDetailModal
        open={livestockDetailModalOpen}
        onOpenChange={setLivestockDetailModalOpen}
        livestock={selectedLivestock}
        onEdit={handleLivestockEdit}
        onDeleteSuccess={() => setSelectedLivestock(null)}
        onAddHealthRecord={handleAddHealthRecordFromDetail}
        onViewHealthRecord={handleViewHealthRecordFromDetail}
      />
      <PotreroFormModal
        open={potreroFormModalOpen}
        onOpenChange={setPotreroFormModalOpen}
        potrero={selectedPotrero}
        onSuccess={() => setSelectedPotrero(null)}
      />
      <PotreroDetailModal
        open={potreroDetailModalOpen}
        onOpenChange={setPotreroDetailModalOpen}
        potrero={selectedPotrero}
        onEdit={handlePotreroEdit}
        onDeleteSuccess={() => setSelectedPotrero(null)}
      />

      {/* Health Record Modals */}
      <HealthRecordFormModal
        open={healthRecordFormModalOpen}
        onOpenChange={(open) => {
          setHealthRecordFormModalOpen(open);
          if (!open) {
            setPreselectedLivestockForHealth(null);
          }
        }}
        healthRecord={selectedHealthRecord}
        livestock={preselectedLivestockForHealth}
        onSuccess={() => {
          setSelectedHealthRecord(null);
          setPreselectedLivestockForHealth(null);
        }}
      />
      <HealthRecordDetailModal
        open={healthRecordDetailModalOpen}
        onOpenChange={setHealthRecordDetailModalOpen}
        healthRecord={selectedHealthRecord}
        onEdit={handleHealthRecordEdit}
      />

      {/* Group Health Action Modal */}
      <GroupHealthActionFormModal
        open={groupHealthActionModalOpen}
        onOpenChange={setGroupHealthActionModalOpen}
        onSuccess={() => {}}
      />

      {/* Reproduction Modals */}
      <ReproductionFormModal
        open={reproductionFormModalOpen}
        onOpenChange={(open) => {
          setReproductionFormModalOpen(open);
          if (!open) {
            setPreselectedCowForReproduction(null);
          }
        }}
        reproductionRecord={selectedReproductionRecord}
        preselectedCow={preselectedCowForReproduction}
        onSuccess={() => {
          setSelectedReproductionRecord(null);
          setPreselectedCowForReproduction(null);
        }}
      />
      <ReproductionDetailModal
        open={reproductionDetailModalOpen}
        onOpenChange={setReproductionDetailModalOpen}
        reproductionRecord={selectedReproductionRecord}
        onEdit={handleReproductionRecordEdit}
      />

      {/* Plan Modals - filtered to pecuario module */}
      <GeneralPlanFormModal
        open={planFormModalOpen}
        onOpenChange={(open) => {
          setPlanFormModalOpen(open);
          if (!open) setPreselectedDate(null);
        }}
        plan={selectedPlan}
        defaultModule="pecuario"
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
