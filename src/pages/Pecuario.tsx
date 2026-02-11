import { useState, useMemo } from 'react';
import { Plus, Stethoscope, Users, Heart, Beef, MapPin, CalendarDays } from 'lucide-react';
import {
  PecuarioStatCard,
  LivestockTable,
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
  LivestockGroupList,
  LivestockGroupFormModal,
  LivestockGroupDetailModal,
  BeehiveTable,
  BeehiveFormModal,
  BeehiveDetailModal,
} from '../components/pecuario';
import StatCardSkeleton from '../components/common/Skeletons/StatCardSkeleton';
import ChartSkeleton from '../components/common/Skeletons/ChartSkeleton';
import ListCardSkeleton from '../components/common/Skeletons/ListCardSkeleton';
import {
  useLivestock,
  usePotreros,
  usePecuarioStats,
  usePecuarioTasks,
  useCategoryDistribution,
  useHealthRecords,
  useReproductionRecords,
  useLivestockGroups,
  useBeehives,
} from '../hooks/usePecuario';
import type { Livestock, Potrero, HealthRecord, ReproductionRecord, LivestockGroup, Beehive } from '../types/pecuario.types';
import type { GeneralPlan } from '../types/finca.types';
import { GeneralPlanFormModal, GeneralPlanDetailModal } from '../components/finca';
import { CalendarView } from '../components/common/Calendar';
import { useGeneralPlans } from '../hooks/useFinca';

type TabType = 'planificacion' | 'inventario' | 'salud' | 'reproduccion' | 'potreros';

export default function Pecuario() {
  const [activeTab, setActiveTab] = useState<TabType>('planificacion');
  const [inventoryView, setInventoryView] = useState<'ganado' | 'colmenas'>('ganado');

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

  // Modal state for Livestock Groups
  const [selectedGroup, setSelectedGroup] = useState<LivestockGroup | null>(null);
  const [groupFormModalOpen, setGroupFormModalOpen] = useState(false);
  const [groupDetailModalOpen, setGroupDetailModalOpen] = useState(false);

  // Modal state for Beehives
  const [selectedBeehive, setSelectedBeehive] = useState<Beehive | null>(null);
  const [beehiveFormModalOpen, setBeehiveFormModalOpen] = useState(false);
  const [beehiveDetailModalOpen, setBeehiveDetailModalOpen] = useState(false);

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

  // Livestock Group handlers
  const handleGroupClick = (group: LivestockGroup) => {
    setSelectedGroup(group);
    setGroupDetailModalOpen(true);
  };

  const handleGroupEdit = (group: LivestockGroup) => {
    setSelectedGroup(group);
    setGroupDetailModalOpen(false);
    setGroupFormModalOpen(true);
  };

  const handleNewGroup = () => {
    setSelectedGroup(null);
    setGroupFormModalOpen(true);
  };

  // Beehive handlers
  const handleBeehiveClick = (beehive: Beehive) => {
    setSelectedBeehive(beehive);
    setBeehiveDetailModalOpen(true);
  };

  const handleBeehiveEdit = (beehive: Beehive) => {
    setSelectedBeehive(beehive);
    setBeehiveDetailModalOpen(false);
    setBeehiveFormModalOpen(true);
  };

  const handleNewBeehive = () => {
    setSelectedBeehive(null);
    setBeehiveFormModalOpen(true);
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
  const { data: tasks, isLoading: tasksLoading } = usePecuarioTasks();
  const { data: categoryDist, isLoading: categoryLoading } = useCategoryDistribution();
  const { data: healthRecords, isLoading: healthRecordsLoading } = useHealthRecords();
  const { data: reproductionRecords, isLoading: reproductionLoading } = useReproductionRecords();
  const { data: livestockGroups, isLoading: livestockGroupsLoading } = useLivestockGroups();
  const { data: beehives, isLoading: beehivesLoading } = useBeehives();
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
            {/* Toggle Ganado / Colmenas */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1 w-fit">
              <button
                onClick={() => setInventoryView('ganado')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  inventoryView === 'ganado'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Ganado
              </button>
              <button
                onClick={() => setInventoryView('colmenas')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  inventoryView === 'colmenas'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Colmenas
              </button>
            </div>

            {inventoryView === 'ganado' ? (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {statsLoading ? (
                    <>
                      {[...Array(2)].map((_, i) => (
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
              </>
            ) : (
              <>
                {/* Beehive Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {beehivesLoading ? (
                    <>
                      {[...Array(2)].map((_, i) => (
                        <StatCardSkeleton key={i} />
                      ))}
                    </>
                  ) : beehives ? (
                    <>
                      <PecuarioStatCard
                        label="Colmenas Activas"
                        value={beehives.filter(b => b.status === 'active').length}
                        icon="livestock"
                        subValue={`${beehives.length} total registradas`}
                      />
                      <PecuarioStatCard
                        label="Colonias Fuertes"
                        value={beehives.filter(b => b.strength === 'strong' && b.status === 'active').length}
                        icon="potreros"
                        subValue={`${beehives.filter(b => b.strength === 'weak' && b.status === 'active').length} débiles requieren atención`}
                      />
                    </>
                  ) : null}
                </div>

                {/* Beehive Table */}
                {beehivesLoading ? (
                  <ListCardSkeleton itemCount={6} />
                ) : beehives ? (
                  <BeehiveTable
                    beehives={beehives}
                    onBeehiveClick={handleBeehiveClick}
                  />
                ) : null}
              </>
            )}
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

            {/* Grupos de Animales */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Grupos de Animales</h2>
              {livestockGroupsLoading ? (
                <ListCardSkeleton itemCount={4} />
              ) : livestockGroups ? (
                <LivestockGroupList
                  livestockGroups={livestockGroups}
                  onGroupClick={handleGroupClick}
                  showFilters={true}
                />
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
        return inventoryView === 'colmenas' ? (
          <button
            onClick={handleNewBeehive}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nueva Colmena
          </button>
        ) : (
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
          <>
            <button
              onClick={handleNewGroup}
              className="btn-ghost inline-flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Nuevo Grupo
            </button>
            <button
              onClick={handleNewPotrero}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nuevo Potrero
            </button>
          </>
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

      {/* Livestock Group Modals */}
      <LivestockGroupFormModal
        open={groupFormModalOpen}
        onOpenChange={setGroupFormModalOpen}
        livestockGroup={selectedGroup}
        onSuccess={() => setSelectedGroup(null)}
      />
      <LivestockGroupDetailModal
        open={groupDetailModalOpen}
        onOpenChange={setGroupDetailModalOpen}
        livestockGroup={selectedGroup}
        onEdit={handleGroupEdit}
        onDeleteSuccess={() => setSelectedGroup(null)}
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

      {/* Beehive Modals */}
      <BeehiveFormModal
        open={beehiveFormModalOpen}
        onOpenChange={setBeehiveFormModalOpen}
        beehive={selectedBeehive}
        onSuccess={() => setSelectedBeehive(null)}
      />
      <BeehiveDetailModal
        open={beehiveDetailModalOpen}
        onOpenChange={setBeehiveDetailModalOpen}
        beehive={selectedBeehive}
        onEdit={handleBeehiveEdit}
        onDeleteSuccess={() => setSelectedBeehive(null)}
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
