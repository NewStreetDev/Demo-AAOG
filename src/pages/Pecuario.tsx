import { useState } from 'react';
import { Plus, Stethoscope, Users, Heart, Droplets, LayoutDashboard, Beef, MapPin, FolderOpen } from 'lucide-react';
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
  MilkProductionFormModal,
  MilkProductionDetailModal,
  MilkProductionList,
  PecuarioDashboard,
  LivestockGroupFormModal,
  LivestockGroupDetailModal,
  LivestockGroupList,
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
  useMilkProduction,
  usePecuarioDashboard,
  usePecuarioProductionData,
  useLivestockGroups,
} from '../hooks/usePecuario';
import type { Livestock, LivestockGroup, Potrero, HealthRecord, ReproductionRecord, MilkProduction } from '../types/pecuario.types';

type TabType = 'dashboard' | 'inventario' | 'salud' | 'reproduccion' | 'produccion' | 'grupos';

export default function Pecuario() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

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

  // Modal state for Milk Production
  const [selectedMilkProduction, setSelectedMilkProduction] = useState<MilkProduction | null>(null);
  const [milkProductionFormModalOpen, setMilkProductionFormModalOpen] = useState(false);
  const [milkProductionDetailModalOpen, setMilkProductionDetailModalOpen] = useState(false);

  // Modal state for Livestock Groups
  const [selectedLivestockGroup, setSelectedLivestockGroup] = useState<LivestockGroup | null>(null);
  const [livestockGroupFormModalOpen, setLivestockGroupFormModalOpen] = useState(false);
  const [livestockGroupDetailModalOpen, setLivestockGroupDetailModalOpen] = useState(false);

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

  // Milk Production handlers
  const handleMilkProductionClick = (record: MilkProduction) => {
    setSelectedMilkProduction(record);
    setMilkProductionDetailModalOpen(true);
  };

  const handleMilkProductionEdit = (record: MilkProduction) => {
    setSelectedMilkProduction(record);
    setMilkProductionDetailModalOpen(false);
    setMilkProductionFormModalOpen(true);
  };

  const handleNewMilkProduction = () => {
    setSelectedMilkProduction(null);
    setMilkProductionFormModalOpen(true);
  };

  // Livestock Group handlers
  const handleLivestockGroupClick = (group: LivestockGroup) => {
    setSelectedLivestockGroup(group);
    setLivestockGroupDetailModalOpen(true);
  };

  const handleLivestockGroupEdit = (group: LivestockGroup) => {
    setSelectedLivestockGroup(group);
    setLivestockGroupDetailModalOpen(false);
    setLivestockGroupFormModalOpen(true);
  };

  const handleNewLivestockGroup = () => {
    setSelectedLivestockGroup(null);
    setLivestockGroupFormModalOpen(true);
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
  const { data: milkProduction, isLoading: milkProductionLoading } = useMilkProduction();
  const { data: dashboardStats, isLoading: dashboardStatsLoading } = usePecuarioDashboard();
  const { data: dashboardProductionData, isLoading: dashboardProductionLoading } = usePecuarioProductionData();
  const { data: livestockGroups, isLoading: livestockGroupsLoading } = useLivestockGroups();

  const tabs: { id: TabType; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventario', label: 'Inventario', icon: Beef },
    { id: 'grupos', label: 'Grupos', icon: FolderOpen },
    { id: 'salud', label: 'Salud', icon: Stethoscope },
    { id: 'reproduccion', label: 'Reproduccion', icon: Heart },
    { id: 'produccion', label: 'Produccion', icon: Droplets },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            {(dashboardStatsLoading || dashboardProductionLoading) ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <StatCardSkeleton key={i} />
                  ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <ChartSkeleton />
                  <ChartSkeleton />
                </div>
              </div>
            ) : dashboardStats && dashboardProductionData ? (
              <PecuarioDashboard
                stats={dashboardStats}
                productionData={dashboardProductionData}
              />
            ) : null}
          </>
        );

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

            {/* Potreros */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                {productionLoading ? (
                  <ChartSkeleton />
                ) : production ? (
                  <PecuarioProductionChart data={production} />
                ) : null}
              </div>
              <div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <MapPin className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Potreros</h3>
                    </div>
                    <button
                      onClick={handleNewPotrero}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      + Nuevo
                    </button>
                  </div>
                  <div className="space-y-3">
                    {potrerosLoading ? (
                      <>
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
                        ))}
                      </>
                    ) : potreros ? (
                      potreros.slice(0, 4).map((potrero) => (
                        <PotreroCard
                          key={potrero.id}
                          potrero={potrero}
                          onClick={() => handlePotreroClick(potrero)}
                        />
                      ))
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'grupos':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                {livestockGroupsLoading ? (
                  <ListCardSkeleton itemCount={5} />
                ) : livestockGroups ? (
                  <LivestockGroupList
                    livestockGroups={livestockGroups}
                    onGroupClick={handleLivestockGroupClick}
                    showFilters={true}
                  />
                ) : null}
              </div>
              <div>
                {tasksLoading ? (
                  <ListCardSkeleton itemCount={5} />
                ) : tasks ? (
                  <PecuarioTaskList
                    tasks={tasks.filter(t => t.type === 'health' || t.type === 'checkup')}
                  />
                ) : null}
              </div>
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

      case 'produccion':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                {milkProductionLoading ? (
                  <ListCardSkeleton itemCount={5} />
                ) : milkProduction ? (
                  <MilkProductionList
                    milkProduction={milkProduction}
                    onRecordClick={handleMilkProductionClick}
                    showFilters={true}
                  />
                ) : null}
              </div>
              <div>
                {productionLoading ? (
                  <ChartSkeleton />
                ) : production ? (
                  <PecuarioProductionChart data={production} />
                ) : null}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getActionButtons = () => {
    switch (activeTab) {
      case 'inventario':
        return (
          <>
            <button
              onClick={handleNewPotrero}
              className="btn-secondary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nuevo Potrero
            </button>
            <button
              onClick={handleNewLivestock}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nuevo Animal
            </button>
          </>
        );
      case 'grupos':
        return (
          <button
            onClick={handleNewLivestockGroup}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Grupo
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
              Accion Grupal
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
      case 'produccion':
        return (
          <button
            onClick={handleNewMilkProduction}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Registrar Ordeno
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
            Gestion de ganado, salud animal, reproduccion y produccion
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

      {/* Milk Production Modals */}
      <MilkProductionFormModal
        open={milkProductionFormModalOpen}
        onOpenChange={setMilkProductionFormModalOpen}
        milkProduction={selectedMilkProduction}
        onSuccess={() => setSelectedMilkProduction(null)}
      />
      <MilkProductionDetailModal
        open={milkProductionDetailModalOpen}
        onOpenChange={setMilkProductionDetailModalOpen}
        milkProduction={selectedMilkProduction}
        onEdit={handleMilkProductionEdit}
      />

      {/* Livestock Group Modals */}
      <LivestockGroupFormModal
        open={livestockGroupFormModalOpen}
        onOpenChange={setLivestockGroupFormModalOpen}
        livestockGroup={selectedLivestockGroup}
        onSuccess={() => setSelectedLivestockGroup(null)}
      />
      <LivestockGroupDetailModal
        open={livestockGroupDetailModalOpen}
        onOpenChange={setLivestockGroupDetailModalOpen}
        livestockGroup={selectedLivestockGroup}
        onEdit={handleLivestockGroupEdit}
        onDeleteSuccess={() => setSelectedLivestockGroup(null)}
      />
    </div>
  );
}
