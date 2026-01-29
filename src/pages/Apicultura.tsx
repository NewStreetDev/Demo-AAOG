import { useState, useMemo } from 'react';
import { Plus, ClipboardList, ClipboardCheck, Droplet, Activity, CalendarDays } from 'lucide-react';
import {
  ApiarioCard,
  ColmenaList,
  ApiculturaProductionChart,
  HealthDistributionChart,
  ApiculturaStatCard,
  ApiarioFormModal,
  ApiarioDetailModal,
  ColmenaFormModal,
  ColmenaDetailModal,
  WorkPlanFormModal,
  WorkPlanDetailModal,
  WorkPlanList,
  AccionFormModal,
  AccionDetailModal,
  AccionList,
  RevisionFormModal,
  RevisionDetailModal,
  RevisionList,
  CosechaFormModal,
  CosechaDetailModal,
  CosechaList,
} from '../components/apicultura';
import StatCardSkeleton from '../components/common/Skeletons/StatCardSkeleton';
import ChartSkeleton from '../components/common/Skeletons/ChartSkeleton';
import ListCardSkeleton from '../components/common/Skeletons/ListCardSkeleton';
import {
  useApiarios,
  useColmenas,
  useApiculturaStats,
  useApiculturaProduction,
  useHealthDistribution,
  useWorkPlans,
  useAcciones,
  useRevisiones,
  useCosechas,
} from '../hooks/useApicultura';
import type { Apiario, Colmena, WorkPlan, AccionApicultura, Revision, Cosecha } from '../types/apicultura.types';
import type { GeneralPlan } from '../types/finca.types';
import { GeneralPlanFormModal, GeneralPlanDetailModal } from '../components/finca';
import { CalendarView } from '../components/common/Calendar';
import { useGeneralPlans } from '../hooks/useFinca';

type TabType = 'dashboard' | 'planificacion' | 'acciones' | 'revisiones' | 'cosechas';

export default function Apicultura() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const { data: apiarios, isLoading: apiariosLoading } = useApiarios();
  const { data: colmenas, isLoading: colmenasLoading } = useColmenas();
  const { data: stats, isLoading: statsLoading } = useApiculturaStats();
  const { data: production, isLoading: productionLoading } = useApiculturaProduction();
  const { data: healthDist, isLoading: healthLoading } = useHealthDistribution();
  const { data: workPlans, isLoading: workPlansLoading } = useWorkPlans();
  const { data: acciones, isLoading: accionesLoading } = useAcciones();
  const { data: revisiones, isLoading: revisionesLoading } = useRevisiones();
  const { data: cosechas, isLoading: cosechasLoading } = useCosechas();

  // Apiario modals state
  const [apiarioFormOpen, setApiarioFormOpen] = useState(false);
  const [apiarioDetailOpen, setApiarioDetailOpen] = useState(false);
  const [selectedApiario, setSelectedApiario] = useState<Apiario | null>(null);

  // Colmena modals state
  const [colmenaFormOpen, setColmenaFormOpen] = useState(false);
  const [colmenaDetailOpen, setColmenaDetailOpen] = useState(false);
  const [selectedColmena, setSelectedColmena] = useState<Colmena | null>(null);

  // WorkPlan modals state
  const [workPlanFormOpen, setWorkPlanFormOpen] = useState(false);
  const [workPlanDetailOpen, setWorkPlanDetailOpen] = useState(false);
  const [selectedWorkPlan, setSelectedWorkPlan] = useState<WorkPlan | null>(null);

  // Accion modals state
  const [accionFormOpen, setAccionFormOpen] = useState(false);
  const [accionDetailOpen, setAccionDetailOpen] = useState(false);
  const [selectedAccion, setSelectedAccion] = useState<AccionApicultura | null>(null);

  // Revision modals state
  const [revisionFormOpen, setRevisionFormOpen] = useState(false);
  const [revisionDetailOpen, setRevisionDetailOpen] = useState(false);
  const [selectedRevision, setSelectedRevision] = useState<Revision | null>(null);

  // Cosecha modals state
  const [cosechaFormOpen, setCosechaFormOpen] = useState(false);
  const [cosechaDetailOpen, setCosechaDetailOpen] = useState(false);
  const [selectedCosecha, setSelectedCosecha] = useState<Cosecha | null>(null);

  // Plan modals state
  const [selectedPlan, setSelectedPlan] = useState<GeneralPlan | null>(null);
  const [planFormModalOpen, setPlanFormModalOpen] = useState(false);
  const [planDetailModalOpen, setPlanDetailModalOpen] = useState(false);
  const [preselectedDate, setPreselectedDate] = useState<Date | null>(null);

  // Apiario handlers
  const handleApiarioClick = (apiario: Apiario) => {
    setSelectedApiario(apiario);
    setApiarioDetailOpen(true);
  };

  const handleApiarioEdit = (apiario: Apiario) => {
    setSelectedApiario(apiario);
    setApiarioFormOpen(true);
  };

  const handleNewApiario = () => {
    setSelectedApiario(null);
    setApiarioFormOpen(true);
  };

  // Colmena handlers
  const handleColmenaClick = (colmena: Colmena) => {
    setSelectedColmena(colmena);
    setColmenaDetailOpen(true);
  };

  const handleColmenaEdit = (colmena: Colmena) => {
    setSelectedColmena(colmena);
    setColmenaFormOpen(true);
  };

  const handleNewColmena = () => {
    setSelectedColmena(null);
    setColmenaFormOpen(true);
  };

  // WorkPlan handlers
  const handleWorkPlanClick = (workPlan: WorkPlan) => {
    setSelectedWorkPlan(workPlan);
    setWorkPlanDetailOpen(true);
  };

  const handleWorkPlanEdit = (workPlan: WorkPlan) => {
    setSelectedWorkPlan(workPlan);
    setWorkPlanFormOpen(true);
  };

  const handleNewWorkPlan = () => {
    setSelectedWorkPlan(null);
    setWorkPlanFormOpen(true);
  };

  // Accion handlers
  const handleAccionClick = (accion: AccionApicultura) => {
    setSelectedAccion(accion);
    setAccionDetailOpen(true);
  };

  const handleAccionEdit = (accion: AccionApicultura) => {
    setSelectedAccion(accion);
    setAccionFormOpen(true);
  };

  const handleNewAccion = () => {
    setSelectedAccion(null);
    setAccionFormOpen(true);
  };

  // Revision handlers
  const handleRevisionClick = (revision: Revision) => {
    setSelectedRevision(revision);
    setRevisionDetailOpen(true);
  };

  const handleRevisionEdit = (revision: Revision) => {
    setSelectedRevision(revision);
    setRevisionFormOpen(true);
  };

  const handleNewRevision = () => {
    setSelectedRevision(null);
    setRevisionFormOpen(true);
  };

  // Cosecha handlers
  const handleCosechaClick = (cosecha: Cosecha) => {
    setSelectedCosecha(cosecha);
    setCosechaDetailOpen(true);
  };

  const handleCosechaEdit = (cosecha: Cosecha) => {
    setSelectedCosecha(cosecha);
    setCosechaFormOpen(true);
  };

  const handleNewCosecha = () => {
    setSelectedCosecha(null);
    setCosechaFormOpen(true);
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

  // Filter plans for apicultura module
  const apiculturaPlans = useMemo(() => {
    if (!allPlans) return [];
    return allPlans.filter(plan => plan.targetModule === 'apicultura');
  }, [allPlans]);

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: Activity },
    { id: 'planificacion' as TabType, label: 'Planificacion', icon: CalendarDays },
    { id: 'acciones' as TabType, label: 'Acciones', icon: ClipboardList },
    { id: 'revisiones' as TabType, label: 'Revisiones', icon: ClipboardCheck },
    { id: 'cosechas' as TabType, label: 'Cosechas', icon: Droplet },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Apicultura
          </h1>
          <p className="text-sm text-gray-600">
            Gestion de apiarios, colmenas y produccion apicola
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {activeTab === 'dashboard' && (
            <>
              <button
                onClick={handleNewWorkPlan}
                className="btn-secondary inline-flex items-center gap-2"
              >
                <ClipboardList className="w-4 h-4" />
                Plan de Trabajo
              </button>
              <button
                onClick={handleNewColmena}
                className="btn-secondary inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nueva Colmena
              </button>
              <button
                onClick={handleNewApiario}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nuevo Apiario
              </button>
            </>
          )}
          {activeTab === 'acciones' && (
            <button
              onClick={handleNewAccion}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nueva Accion
            </button>
          )}
          {activeTab === 'revisiones' && (
            <button
              onClick={handleNewRevision}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nueva Revision
            </button>
          )}
          {activeTab === 'cosechas' && (
            <button
              onClick={handleNewCosecha}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nueva Cosecha
            </button>
          )}
          {activeTab === 'planificacion' && (
            <button
              onClick={handleNewPlan}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nueva Accion
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
                    ? 'border-amber-500 text-amber-600'
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
                <ApiculturaStatCard
                  label="Total Apiarios"
                  value={stats.totalApiarios}
                  icon="apiarios"
                />
                <ApiculturaStatCard
                  label="Total Colmenas"
                  value={stats.totalColmenas}
                  icon="colmenas"
                  subValue={`${stats.activeColmenas} activas`}
                />
                <ApiculturaStatCard
                  label="Salud Promedio"
                  value={stats.averageHealth.toFixed(1)}
                  icon="health"
                  subValue="de 10 puntos"
                />
                <ApiculturaStatCard
                  label="Produccion Miel"
                  value={`${stats.monthlyProduction.honey} kg`}
                  icon="production"
                  subValue="este mes"
                />
              </>
            ) : null}
          </div>

          {/* Apiarios Grid */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Apiarios</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
              {apiariosLoading ? (
                <>
                  {[...Array(3)].map((_, i) => (
                    <ListCardSkeleton key={i} itemCount={3} />
                  ))}
                </>
              ) : apiarios ? (
                apiarios.map((apiario) => (
                  <ApiarioCard
                    key={apiario.id}
                    apiario={apiario}
                    onClick={() => handleApiarioClick(apiario)}
                  />
                ))
              ) : null}
            </div>
          </div>

          {/* Middle Section - Production Chart and Health Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
            {/* Production Chart - takes 2/3 */}
            <div className="lg:col-span-2">
              {productionLoading ? (
                <ChartSkeleton />
              ) : production ? (
                <ApiculturaProductionChart data={production} />
              ) : null}
            </div>

            {/* Health Distribution - takes 1/3 */}
            <div>
              {healthLoading ? (
                <ChartSkeleton />
              ) : healthDist ? (
                <HealthDistributionChart data={healthDist} />
              ) : null}
            </div>
          </div>

          {/* Bottom Section - Work Plans and Colmenas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
            {/* Work Plans */}
            <div>
              {workPlansLoading ? (
                <ListCardSkeleton itemCount={5} />
              ) : workPlans ? (
                <WorkPlanList
                  workPlans={workPlans}
                  onWorkPlanClick={handleWorkPlanClick}
                />
              ) : null}
            </div>

            {/* Colmenas List */}
            <div>
              {colmenasLoading ? (
                <ListCardSkeleton itemCount={5} />
              ) : colmenas ? (
                <ColmenaList
                  colmenas={colmenas}
                  onColmenaClick={handleColmenaClick}
                />
              ) : null}
            </div>
          </div>
        </>
      )}

      {/* Acciones Tab Content */}
      {activeTab === 'acciones' && (
        <div className="grid grid-cols-1 gap-6">
          {accionesLoading ? (
            <ListCardSkeleton itemCount={5} />
          ) : acciones ? (
            <AccionList
              acciones={acciones}
              onAccionClick={handleAccionClick}
            />
          ) : null}
        </div>
      )}

      {/* Revisiones Tab Content */}
      {activeTab === 'revisiones' && (
        <div className="grid grid-cols-1 gap-6">
          {revisionesLoading ? (
            <ListCardSkeleton itemCount={5} />
          ) : revisiones ? (
            <RevisionList
              revisiones={revisiones}
              onRevisionClick={handleRevisionClick}
            />
          ) : null}
        </div>
      )}

      {/* Cosechas Tab Content */}
      {activeTab === 'cosechas' && (
        <div className="grid grid-cols-1 gap-6">
          {cosechasLoading ? (
            <ListCardSkeleton itemCount={5} />
          ) : cosechas ? (
            <CosechaList
              cosechas={cosechas}
              onCosechaClick={handleCosechaClick}
            />
          ) : null}
        </div>
      )}

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
              plans={apiculturaPlans}
              onDayClick={handlePlanDayClick}
              onPlanClick={handlePlanClick}
              onPlanEdit={handlePlanEdit}
              onPlanView={handlePlanView}
              defaultModule="apicultura"
              showModuleColors={false}
            />
          )}
        </>
      )}

      {/* Apiario Modals */}
      <ApiarioFormModal
        open={apiarioFormOpen}
        onOpenChange={setApiarioFormOpen}
        apiario={selectedApiario}
      />
      <ApiarioDetailModal
        open={apiarioDetailOpen}
        onOpenChange={setApiarioDetailOpen}
        apiario={selectedApiario}
        onEdit={handleApiarioEdit}
      />

      {/* Colmena Modals */}
      <ColmenaFormModal
        open={colmenaFormOpen}
        onOpenChange={setColmenaFormOpen}
        colmena={selectedColmena}
      />
      <ColmenaDetailModal
        open={colmenaDetailOpen}
        onOpenChange={setColmenaDetailOpen}
        colmena={selectedColmena}
        onEdit={handleColmenaEdit}
      />

      {/* WorkPlan Modals */}
      <WorkPlanFormModal
        open={workPlanFormOpen}
        onOpenChange={setWorkPlanFormOpen}
        workPlan={selectedWorkPlan}
      />
      <WorkPlanDetailModal
        open={workPlanDetailOpen}
        onOpenChange={setWorkPlanDetailOpen}
        workPlan={selectedWorkPlan}
        onEdit={handleWorkPlanEdit}
      />

      {/* Accion Modals */}
      <AccionFormModal
        open={accionFormOpen}
        onOpenChange={setAccionFormOpen}
        accion={selectedAccion}
      />
      <AccionDetailModal
        open={accionDetailOpen}
        onOpenChange={setAccionDetailOpen}
        accion={selectedAccion}
        onEdit={handleAccionEdit}
      />

      {/* Revision Modals */}
      <RevisionFormModal
        open={revisionFormOpen}
        onOpenChange={setRevisionFormOpen}
        revision={selectedRevision}
      />
      <RevisionDetailModal
        open={revisionDetailOpen}
        onOpenChange={setRevisionDetailOpen}
        revision={selectedRevision}
        onEdit={handleRevisionEdit}
      />

      {/* Cosecha Modals */}
      <CosechaFormModal
        open={cosechaFormOpen}
        onOpenChange={setCosechaFormOpen}
        cosecha={selectedCosecha}
      />
      <CosechaDetailModal
        open={cosechaDetailOpen}
        onOpenChange={setCosechaDetailOpen}
        cosecha={selectedCosecha}
        onEdit={handleCosechaEdit}
      />

      {/* Plan Modals - filtered to apicultura module */}
      <GeneralPlanFormModal
        open={planFormModalOpen}
        onOpenChange={(open) => {
          setPlanFormModalOpen(open);
          if (!open) setPreselectedDate(null);
        }}
        plan={selectedPlan}
        defaultModule="apicultura"
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
