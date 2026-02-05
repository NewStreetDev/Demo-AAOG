import { useState, useEffect, useMemo } from 'react';
import { Plus, Map, CalendarDays, Calendar, Info, Pencil } from 'lucide-react';
import {
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
import ListCardSkeleton from '../components/common/Skeletons/ListCardSkeleton';
import { cn } from '../utils/cn';
import {
  useFinca,
  useDivisions,
} from '../hooks/useFinca';
import {
  useAnnualPlans,
  useAnnualPlan,
  useAnnualPlanPlans,
} from '../hooks/useAnnualPlan';
import type { Division, GeneralPlan, AnnualPlan, PlanPhase } from '../types/finca.types';

type TabType = 'info' | 'divisiones' | 'planificacion';

export default function Finca() {
  const [activeTab, setActiveTab] = useState<TabType>('planificacion');

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
  const { data: finca } = useFinca();
  const { data: divisions, isLoading: divisionsLoading } = useDivisions();

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
        if (currentYearPlan.status === 'active') {
          setSelectedPhase('execution');
        }
      } else {
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

  const isCurrentYear = useMemo(() => {
    if (!selectedAnnualPlan) return false;
    return selectedAnnualPlan.year === new Date().getFullYear();
  }, [selectedAnnualPlan]);

  const isPlanEditable = useMemo(() => {
    if (!selectedAnnualPlan) return false;

    if (selectedPhase === 'initial') {
      return selectedAnnualPlan.status === 'draft' || selectedAnnualPlan.status === 'planning';
    } else {
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
    // Popover handles this
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
    setSelectedPhase('execution');
  };

  const handleAnnualPlanComplete = () => {
    // Plan completed - stay on execution view, UI becomes read-only
  };

  const handleAnnualPlanDelete = () => {
    setSelectedAnnualPlanId(null);
  };

  const handleAnnualPlanFormSuccess = () => {
    setSelectedAnnualPlanForEdit(null);
  };

  const tabs: { id: TabType; label: string; icon: typeof Map }[] = [
    { id: 'info', label: 'Información General', icon: Info },
    { id: 'divisiones', label: 'Divisiones', icon: Map },
    { id: 'planificacion', label: 'Planificación', icon: CalendarDays },
  ];

  // Render planning tab content
  const renderPlanningTab = () => {
    if (annualPlansLoading) {
      return (
        <div className="space-y-4">
          <div className="h-10 w-64 bg-gray-100 animate-pulse rounded-lg" />
          <div className="h-24 bg-gray-100 animate-pulse rounded-xl" />
          <div className="h-96 bg-gray-100 animate-pulse rounded-xl" />
        </div>
      );
    }

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
              Los planes anuales te permiten planificar y dar seguimiento a todas las acciones del año.
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
        <AnnualPlanSelector
          selectedPlanId={selectedAnnualPlanId}
          onPlanChange={handleAnnualPlanChange}
          onCreateNew={handleCreateAnnualPlan}
        />

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
              Planificación Inicial
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
              title={!isExecutionEnabled ? 'El plan debe estar activo para ver la ejecución' : undefined}
            >
              Plan de Ejecución
            </button>
          </div>

          {selectedAnnualPlan && !isPlanEditable && (
            <span className="text-sm text-gray-500 italic">
              {selectedAnnualPlan.status === 'completed'
                ? 'Plan completado - solo lectura'
                : selectedPhase === 'execution' && !isCurrentYear
                  ? 'Año anterior - solo lectura'
                  : selectedPhase === 'initial' && selectedAnnualPlan.status === 'active'
                    ? 'Plan activo - planificación inicial bloqueada'
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
      case 'info':
        return (
          <div className="space-y-6">
            {finca ? (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Datos de la Finca</h3>
                  <button
                    onClick={handleEditFinca}
                    className="btn-secondary inline-flex items-center gap-2 text-sm"
                  >
                    <Pencil className="w-4 h-4" />
                    Editar
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Nombre</p>
                    <p className="font-medium text-gray-900">{finca.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Área Total</p>
                    <p className="font-medium text-gray-900">{finca.totalArea} hectáreas</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Propietario</p>
                    <p className="font-medium text-gray-900">{finca.owner}</p>
                  </div>
                  {finca.location?.address && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Dirección</p>
                      <p className="font-medium text-gray-900">{finca.location.address}</p>
                    </div>
                  )}
                  {finca.location?.department && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Provincia</p>
                      <p className="font-medium text-gray-900">{finca.location.department}</p>
                    </div>
                  )}
                  {finca.location?.municipality && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Cantón</p>
                      <p className="font-medium text-gray-900">{finca.location.municipality}</p>
                    </div>
                  )}
                  {finca.contactPhone && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Teléfono</p>
                      <p className="font-medium text-gray-900">{finca.contactPhone}</p>
                    </div>
                  )}
                  {finca.contactEmail && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Correo</p>
                      <p className="font-medium text-gray-900">{finca.contactEmail}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Estado</p>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      finca.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {finca.status === 'active' ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                </div>
                {finca.description && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Descripción</p>
                    <p className="text-gray-700">{finca.description}</p>
                  </div>
                )}
                {finca.notes && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-1">Notas</p>
                    <p className="text-gray-700">{finca.notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="card p-8 text-center">
                <Info className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500 mb-4">No hay información de la finca registrada</p>
                <button
                  onClick={handleEditFinca}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Registrar Finca
                </button>
              </div>
            )}
          </div>
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
      case 'info':
        return null;
      case 'divisiones':
        return (
          <button
            onClick={handleNewDivision}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nueva División
          </button>
        );
      case 'planificacion':
        if (selectedAnnualPlanId && selectedAnnualPlan && isPlanEditable) {
          return (
            <button
              onClick={handleNewPlan}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nueva Acción
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
            Mi Finca
          </h1>
          <p className="text-sm text-gray-600">
            Gestión centralizada de la finca y planificación de actividades
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
