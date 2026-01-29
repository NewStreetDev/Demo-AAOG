import { useState, useEffect, useMemo } from 'react';
import { Plus, LayoutDashboard, Map, CalendarDays, Calendar } from 'lucide-react';
import {
  FincaDashboard,
  FincaFormModal,
  DivisionList,
  DivisionFormModal,
  DivisionDetailModal,
  GeneralPlanFormModal,
  GeneralPlanDetailModal,
  AnnualPlanSelector,
  AnnualPlanHeader,
  AnnualPlanFormModal,
  AnnualPlanDetailModal,
} from '../components/finca';
import { CalendarView } from '../components/common/Calendar';
import StatCardSkeleton from '../components/common/Skeletons/StatCardSkeleton';
import ChartSkeleton from '../components/common/Skeletons/ChartSkeleton';
import ListCardSkeleton from '../components/common/Skeletons/ListCardSkeleton';
import { cn } from '../utils/cn';
import {
  useFinca,
  useDivisions,
  useFincaDashboard,
  useMonthlyAggregatedData,
  useAggregatedTasks,
} from '../hooks/useFinca';
import {
  useAnnualPlans,
  useAnnualPlan,
  useAnnualPlanPlans,
} from '../hooks/useAnnualPlan';
import type { Division, GeneralPlan, AnnualPlan, PlanPhase } from '../types/finca.types';

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
  const [preselectedDate, setPreselectedDate] = useState<Date | null>(null);

  // Annual plan state
  const [selectedAnnualPlanId, setSelectedAnnualPlanId] = useState<string | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<PlanPhase>('initial');
  const [annualPlanFormModalOpen, setAnnualPlanFormModalOpen] = useState(false);
  const [annualPlanDetailModalOpen, setAnnualPlanDetailModalOpen] = useState(false);
  const [selectedAnnualPlanForEdit, setSelectedAnnualPlanForEdit] = useState<AnnualPlan | null>(null);

  // Queries
  const { data: finca, isLoading: fincaLoading } = useFinca();
  const { data: divisions, isLoading: divisionsLoading } = useDivisions();
  const { data: dashboardStats, isLoading: dashboardLoading } = useFincaDashboard();
  const { data: monthlyData, isLoading: monthlyDataLoading } = useMonthlyAggregatedData();
  const { data: tasks, isLoading: tasksLoading } = useAggregatedTasks();

  // Annual plan queries
  const { data: annualPlans, isLoading: annualPlansLoading } = useAnnualPlans();
  const { data: selectedAnnualPlan } = useAnnualPlan(selectedAnnualPlanId || undefined);
  const { data: filteredPlans = [], isLoading: plansLoading } = useAnnualPlanPlans(
    selectedAnnualPlanId || undefined,
    selectedPhase
  );

  // Auto-select current year's plan on mount
  useEffect(() => {
    if (annualPlans && annualPlans.length > 0 && !selectedAnnualPlanId) {
      const currentYear = new Date().getFullYear();
      const currentYearPlan = annualPlans.find(p => p.year === currentYear);

      if (currentYearPlan) {
        setSelectedAnnualPlanId(currentYearPlan.id);
        // If plan is active, default to execution view
        if (currentYearPlan.status === 'active') {
          setSelectedPhase('execution');
        }
      } else {
        // Select the most recent plan (annualPlans should be sorted)
        const sortedPlans = [...annualPlans].sort((a, b) => b.year - a.year);
        setSelectedAnnualPlanId(sortedPlans[0].id);
      }
    }
  }, [annualPlans, selectedAnnualPlanId]);

  // Determine if execution tab should be enabled
  const isExecutionEnabled = useMemo(() => {
    if (!selectedAnnualPlan) return false;
    return selectedAnnualPlan.status === 'active' || selectedAnnualPlan.status === 'completed';
  }, [selectedAnnualPlan]);

  // Determine if the annual plan is editable (current year and active status)
  const isCurrentYear = useMemo(() => {
    if (!selectedAnnualPlan) return false;
    return selectedAnnualPlan.year === new Date().getFullYear();
  }, [selectedAnnualPlan]);

  // Plans are editable if:
  // - For initial phase: status is 'draft' or 'planning'
  // - For execution phase: status is 'active' AND it's the current year
  const isPlanEditable = useMemo(() => {
    if (!selectedAnnualPlan) return false;

    if (selectedPhase === 'initial') {
      return selectedAnnualPlan.status === 'draft' || selectedAnnualPlan.status === 'planning';
    } else {
      // Execution phase
      return selectedAnnualPlan.status === 'active' && isCurrentYear;
    }
  }, [selectedAnnualPlan, selectedPhase, isCurrentYear]);

  // Reset to initial phase when selecting a plan that doesn't support execution
  useEffect(() => {
    if (!isExecutionEnabled && selectedPhase === 'execution') {
      setSelectedPhase('initial');
    }
  }, [isExecutionEnabled, selectedPhase]);

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

  const handleDayClick = (date: Date) => {
    setSelectedPlan(null);
    setPreselectedDate(date);
    setPlanFormModalOpen(true);
  };

  // Annual plan handlers
  const handleAnnualPlanChange = (planId: string) => {
    setSelectedAnnualPlanId(planId);
    // Reset to initial phase when changing plan
    const plan = annualPlans?.find(p => p.id === planId);
    if (plan && (plan.status === 'active' || plan.status === 'completed')) {
      setSelectedPhase('execution');
    } else {
      setSelectedPhase('initial');
    }
  };

  const handleCreateAnnualPlan = () => {
    setSelectedAnnualPlanForEdit(null);
    setAnnualPlanFormModalOpen(true);
  };

  const handleEditAnnualPlan = () => {
    setSelectedAnnualPlanForEdit(selectedAnnualPlan || null);
    setAnnualPlanFormModalOpen(true);
  };

  const handleAnnualPlanActivate = () => {
    // Switch to execution view after activation
    setSelectedPhase('execution');
  };

  const handleAnnualPlanComplete = () => {
    // Plan is now completed - stay on execution view
    // UI will automatically become read-only
  };

  const handleAnnualPlanDelete = () => {
    // Clear selection after deletion
    setSelectedAnnualPlanId(null);
  };

  const handleAnnualPlanFormSuccess = () => {
    setSelectedAnnualPlanForEdit(null);
  };

  const tabs: { id: TabType; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'divisiones', label: 'Divisiones', icon: Map },
    { id: 'planificacion', label: 'Planificacion', icon: CalendarDays },
  ];

  // Render planning tab content
  const renderPlanningTab = () => {
    // Loading state for annual plans
    if (annualPlansLoading) {
      return (
        <div className="space-y-4">
          <div className="h-10 w-64 bg-gray-100 animate-pulse rounded-lg" />
          <div className="h-24 bg-gray-100 animate-pulse rounded-xl" />
          <div className="h-96 bg-gray-100 animate-pulse rounded-xl" />
        </div>
      );
    }

    // No annual plans state
    if (!annualPlans || annualPlans.length === 0) {
      return (
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay planes anuales
            </h3>
            <p className="text-sm text-gray-600 mb-6 max-w-md">
              Crea un plan anual para comenzar a organizar las actividades de tu finca.
              Los planes anuales te permiten planificar y dar seguimiento a todas las acciones del ano.
            </p>
            <button
              onClick={handleCreateAnnualPlan}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Crear Plan Anual
            </button>
          </div>
        </div>
      );
    }

    // No plan selected state
    if (!selectedAnnualPlanId) {
      return (
        <div className="space-y-4">
          <AnnualPlanSelector
            selectedPlanId={selectedAnnualPlanId}
            onPlanChange={handleAnnualPlanChange}
            onCreateNew={handleCreateAnnualPlan}
          />
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Seleccione un plan anual
              </h3>
              <p className="text-sm text-gray-600 max-w-md">
                Selecciona un plan anual del selector de arriba para ver y gestionar sus acciones planificadas.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Annual Plan Selector */}
        <AnnualPlanSelector
          selectedPlanId={selectedAnnualPlanId}
          onPlanChange={handleAnnualPlanChange}
          onCreateNew={handleCreateAnnualPlan}
        />

        {/* Annual Plan Header */}
        <AnnualPlanHeader
          annualPlan={selectedAnnualPlan || null}
          onEdit={handleEditAnnualPlan}
          onActivate={handleAnnualPlanActivate}
          onComplete={handleAnnualPlanComplete}
          onDelete={handleAnnualPlanDelete}
        />

        {/* Phase Toggle */}
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setSelectedPhase('initial')}
              className={cn(
                'flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors',
                selectedPhase === 'initial'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              Planificacion Inicial
            </button>
            <button
              onClick={() => setSelectedPhase('execution')}
              disabled={!isExecutionEnabled}
              className={cn(
                'flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors',
                selectedPhase === 'execution'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900',
                !isExecutionEnabled && 'opacity-50 cursor-not-allowed'
              )}
              title={!isExecutionEnabled ? 'El plan debe estar activo para ver la ejecucion' : undefined}
            >
              Plan de Ejecucion
            </button>
          </div>

          {/* Read-only indicator */}
          {selectedAnnualPlan && !isPlanEditable && (
            <span className="text-sm text-gray-500 italic">
              {selectedAnnualPlan.status === 'completed'
                ? 'Plan completado - solo lectura'
                : selectedPhase === 'execution' && !isCurrentYear
                  ? 'Ano anterior - solo lectura'
                  : selectedPhase === 'initial' && selectedAnnualPlan.status === 'active'
                    ? 'Plan activo - planificacion inicial bloqueada'
                    : ''}
            </span>
          )}
        </div>

        {/* Calendar View */}
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
            plans={filteredPlans}
            onDayClick={isPlanEditable ? handleDayClick : () => {}}
            onPlanClick={handlePlanClick}
            onPlanEdit={isPlanEditable ? handlePlanEdit : undefined}
            onPlanView={handlePlanView}
            showModuleColors={true}
            onAddAction={isPlanEditable ? handleNewPlan : undefined}
            groupByActionType={true}
          />
        )}
      </div>
    );
  };

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
        return renderPlanningTab();

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
        // Only show "Nuevo Plan" button if an annual plan is selected and editable
        if (selectedAnnualPlanId && selectedAnnualPlan && isPlanEditable) {
          return (
            <button
              onClick={handleNewPlan}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nueva Accion
            </button>
          );
        }
        return null;
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
        onOpenChange={(open) => {
          setPlanFormModalOpen(open);
          if (!open) setPreselectedDate(null);
        }}
        plan={selectedPlan}
        preselectedDate={preselectedDate}
        onSuccess={() => {
          setSelectedPlan(null);
          setPreselectedDate(null);
        }}
        annualPlanId={selectedAnnualPlanId || undefined}
        planPhase={selectedPhase}
      />
      <GeneralPlanDetailModal
        open={planDetailModalOpen}
        onOpenChange={setPlanDetailModalOpen}
        plan={selectedPlan}
        onEdit={handlePlanEdit}
        onDeleteSuccess={() => setSelectedPlan(null)}
        readOnly={!isPlanEditable}
      />

      {/* Annual Plan Modals */}
      <AnnualPlanFormModal
        open={annualPlanFormModalOpen}
        onOpenChange={setAnnualPlanFormModalOpen}
        annualPlan={selectedAnnualPlanForEdit}
        onSuccess={handleAnnualPlanFormSuccess}
      />
      <AnnualPlanDetailModal
        open={annualPlanDetailModalOpen}
        onOpenChange={setAnnualPlanDetailModalOpen}
        annualPlan={selectedAnnualPlan || null}
        onEdit={handleEditAnnualPlan}
        onActivate={handleAnnualPlanActivate}
        onDelete={handleAnnualPlanDelete}
      />
    </div>
  );
}
