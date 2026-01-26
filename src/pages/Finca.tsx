import { useState } from 'react';
import { Plus, LayoutDashboard, Map, CalendarDays } from 'lucide-react';
import {
  FincaDashboard,
  FincaFormModal,
  DivisionList,
  DivisionFormModal,
  DivisionDetailModal,
  GeneralPlanList,
  GeneralPlanFormModal,
  GeneralPlanDetailModal,
} from '../components/finca';
import StatCardSkeleton from '../components/common/Skeletons/StatCardSkeleton';
import ChartSkeleton from '../components/common/Skeletons/ChartSkeleton';
import ListCardSkeleton from '../components/common/Skeletons/ListCardSkeleton';
import {
  useFinca,
  useDivisions,
  useGeneralPlans,
  useFincaDashboard,
  useMonthlyAggregatedData,
  useAggregatedTasks,
} from '../hooks/useFinca';
import type { Division, GeneralPlan } from '../types/finca.types';

type TabType = 'dashboard' | 'divisiones' | 'planificacion';

export default function Finca() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Finca modal state
  const [fincaFormModalOpen, setFincaFormModalOpen] = useState(false);

  // Division modal state
  const [selectedDivision, setSelectedDivision] = useState<Division | null>(null);
  const [divisionFormModalOpen, setDivisionFormModalOpen] = useState(false);
  const [divisionDetailModalOpen, setDivisionDetailModalOpen] = useState(false);

  // Plan modal state
  const [selectedPlan, setSelectedPlan] = useState<GeneralPlan | null>(null);
  const [planFormModalOpen, setPlanFormModalOpen] = useState(false);
  const [planDetailModalOpen, setPlanDetailModalOpen] = useState(false);

  // Queries
  const { data: finca, isLoading: fincaLoading } = useFinca();
  const { data: divisions, isLoading: divisionsLoading } = useDivisions();
  const { data: plans, isLoading: plansLoading } = useGeneralPlans();
  const { data: dashboardStats, isLoading: dashboardLoading } = useFincaDashboard();
  const { data: monthlyData, isLoading: monthlyDataLoading } = useMonthlyAggregatedData();
  const { data: tasks, isLoading: tasksLoading } = useAggregatedTasks();

  // Finca handlers
  const handleEditFinca = () => {
    setFincaFormModalOpen(true);
  };

  // Division handlers
  const handleDivisionClick = (division: Division) => {
    setSelectedDivision(division);
    setDivisionDetailModalOpen(true);
  };

  const handleDivisionEdit = (division: Division) => {
    setSelectedDivision(division);
    setDivisionDetailModalOpen(false);
    setDivisionFormModalOpen(true);
  };

  const handleNewDivision = () => {
    setSelectedDivision(null);
    setDivisionFormModalOpen(true);
  };

  // Plan handlers
  const handlePlanClick = (plan: GeneralPlan) => {
    setSelectedPlan(plan);
    setPlanDetailModalOpen(true);
  };

  const handlePlanEdit = (plan: GeneralPlan) => {
    setSelectedPlan(plan);
    setPlanDetailModalOpen(false);
    setPlanFormModalOpen(true);
  };

  const handleNewPlan = () => {
    setSelectedPlan(null);
    setPlanFormModalOpen(true);
  };

  const tabs: { id: TabType; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'divisiones', label: 'Divisiones', icon: Map },
    { id: 'planificacion', label: 'Planificacion', icon: CalendarDays },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            {(fincaLoading || dashboardLoading || monthlyDataLoading || tasksLoading) ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="h-48 bg-gray-100 rounded-xl animate-pulse" />
                  <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <StatCardSkeleton key={i} />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <ChartSkeleton />
                  <ChartSkeleton />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <StatCardSkeleton key={i} />
                  ))}
                </div>
              </div>
            ) : finca && dashboardStats && monthlyData && tasks ? (
              <FincaDashboard
                finca={finca}
                stats={dashboardStats}
                monthlyData={monthlyData}
                tasks={tasks}
                onEditFinca={handleEditFinca}
              />
            ) : null}
          </>
        );

      case 'divisiones':
        return (
          <>
            {divisionsLoading ? (
              <ListCardSkeleton itemCount={6} />
            ) : divisions ? (
              <DivisionList
                divisions={divisions}
                onDivisionClick={handleDivisionClick}
                showFilters={true}
              />
            ) : null}
          </>
        );

      case 'planificacion':
        return (
          <>
            {plansLoading ? (
              <ListCardSkeleton itemCount={5} />
            ) : plans ? (
              <GeneralPlanList
                plans={plans}
                onPlanClick={handlePlanClick}
                showFilters={true}
              />
            ) : null}
          </>
        );

      default:
        return null;
    }
  };

  const getActionButtons = () => {
    switch (activeTab) {
      case 'divisiones':
        return (
          <button
            onClick={handleNewDivision}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nueva Division
          </button>
        );
      case 'planificacion':
        return (
          <button
            onClick={handleNewPlan}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Plan
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
            Finca
          </h1>
          <p className="text-sm text-gray-600">
            Vision general y gestion centralizada de la finca
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
                    ? 'border-green-600 text-green-600'
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
      <FincaFormModal
        open={fincaFormModalOpen}
        onOpenChange={setFincaFormModalOpen}
        finca={finca || null}
      />

      <DivisionFormModal
        open={divisionFormModalOpen}
        onOpenChange={setDivisionFormModalOpen}
        division={selectedDivision}
        onSuccess={() => setSelectedDivision(null)}
      />
      <DivisionDetailModal
        open={divisionDetailModalOpen}
        onOpenChange={setDivisionDetailModalOpen}
        division={selectedDivision}
        onEdit={handleDivisionEdit}
        onDeleteSuccess={() => setSelectedDivision(null)}
      />

      <GeneralPlanFormModal
        open={planFormModalOpen}
        onOpenChange={setPlanFormModalOpen}
        plan={selectedPlan}
        onSuccess={() => setSelectedPlan(null)}
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
