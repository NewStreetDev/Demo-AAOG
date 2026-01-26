import { useState } from 'react';
import { Plus, LayoutDashboard, Map, Sprout, ClipboardList, Package } from 'lucide-react';
import {
  AgroStatCard,
  CropCard,
  LoteCard,
  AgroProductionChart,
  CropDistributionChart,
  AgroTaskList,
  LoteFormModal,
  LoteDetailModal,
  CropFormModal,
  CropDetailModal,
  AgroActionFormModal,
  AgroActionDetailModal,
  AgroActionList,
  HarvestFormModal,
  HarvestDetailModal,
  HarvestList,
} from '../components/agro';
import StatCardSkeleton from '../components/common/Skeletons/StatCardSkeleton';
import ChartSkeleton from '../components/common/Skeletons/ChartSkeleton';
import ListCardSkeleton from '../components/common/Skeletons/ListCardSkeleton';
import {
  useLotes,
  useCrops,
  useAgroStats,
  useAgroProduction,
  useAgroTasks,
  useCropDistribution,
  useCropSummaries,
  useAgroActions,
  useHarvests,
} from '../hooks/useAgro';
import type { Lote, Crop, AgroAction, Harvest } from '../types/agro.types';

type TabType = 'dashboard' | 'lotes' | 'cultivos' | 'acciones' | 'cosechas';

const tabs: { id: TabType; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'lotes', label: 'Lotes', icon: Map },
  { id: 'cultivos', label: 'Cultivos', icon: Sprout },
  { id: 'acciones', label: 'Acciones', icon: ClipboardList },
  { id: 'cosechas', label: 'Cosechas', icon: Package },
];

export default function Agro() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Modal state for Lotes
  const [selectedLote, setSelectedLote] = useState<Lote | null>(null);
  const [loteFormModalOpen, setLoteFormModalOpen] = useState(false);
  const [loteDetailModalOpen, setLoteDetailModalOpen] = useState(false);

  // Modal state for Crops
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [cropFormModalOpen, setCropFormModalOpen] = useState(false);
  const [cropDetailModalOpen, setCropDetailModalOpen] = useState(false);

  // Modal state for AgroActions
  const [selectedAction, setSelectedAction] = useState<AgroAction | null>(null);
  const [actionFormModalOpen, setActionFormModalOpen] = useState(false);
  const [actionDetailModalOpen, setActionDetailModalOpen] = useState(false);

  // Modal state for Harvests
  const [selectedHarvest, setSelectedHarvest] = useState<Harvest | null>(null);
  const [harvestFormModalOpen, setHarvestFormModalOpen] = useState(false);
  const [harvestDetailModalOpen, setHarvestDetailModalOpen] = useState(false);

  // Lote handlers
  const handleLoteClick = (lote: Lote) => {
    setSelectedLote(lote);
    setLoteDetailModalOpen(true);
  };

  const handleLoteEdit = (lote: Lote) => {
    setSelectedLote(lote);
    setLoteDetailModalOpen(false);
    setLoteFormModalOpen(true);
  };

  const handleNewLote = () => {
    setSelectedLote(null);
    setLoteFormModalOpen(true);
  };

  // Crop handlers
  const handleCropClick = (cropId: string) => {
    const crop = crops?.find(c => c.id === cropId);
    if (crop) {
      setSelectedCrop(crop);
      setCropDetailModalOpen(true);
    }
  };

  const handleCropEdit = (crop: Crop) => {
    setSelectedCrop(crop);
    setCropDetailModalOpen(false);
    setCropFormModalOpen(true);
  };

  const handleNewCrop = () => {
    setSelectedCrop(null);
    setCropFormModalOpen(true);
  };

  // AgroAction handlers
  const handleActionClick = (action: AgroAction) => {
    setSelectedAction(action);
    setActionDetailModalOpen(true);
  };

  const handleActionEdit = (action: AgroAction) => {
    setSelectedAction(action);
    setActionDetailModalOpen(false);
    setActionFormModalOpen(true);
  };

  const handleNewAction = () => {
    setSelectedAction(null);
    setActionFormModalOpen(true);
  };

  // Harvest handlers
  const handleHarvestClick = (harvest: Harvest) => {
    setSelectedHarvest(harvest);
    setHarvestDetailModalOpen(true);
  };

  const handleHarvestEdit = (harvest: Harvest) => {
    setSelectedHarvest(harvest);
    setHarvestDetailModalOpen(false);
    setHarvestFormModalOpen(true);
  };

  const handleNewHarvest = () => {
    setSelectedHarvest(null);
    setHarvestFormModalOpen(true);
  };

  const { data: lotes, isLoading: lotesLoading } = useLotes();
  const { data: crops, isLoading: cropsLoading } = useCrops();
  const { data: stats, isLoading: statsLoading } = useAgroStats();
  const { data: production, isLoading: productionLoading } = useAgroProduction();
  const { data: tasks, isLoading: tasksLoading } = useAgroTasks();
  const { data: cropDist, isLoading: cropDistLoading } = useCropDistribution();
  const { data: cropSummaries, isLoading: summariesLoading } = useCropSummaries();
  const { data: agroActions, isLoading: actionsLoading } = useAgroActions();
  const { data: harvests, isLoading: harvestsLoading } = useHarvests();

  const renderActionButtons = () => {
    switch (activeTab) {
      case 'lotes':
        return (
          <button
            onClick={handleNewLote}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Lote
          </button>
        );
      case 'cultivos':
        return (
          <button
            onClick={handleNewCrop}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Cultivo
          </button>
        );
      case 'acciones':
        return (
          <button
            onClick={handleNewAction}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nueva Accion
          </button>
        );
      case 'cosechas':
        return (
          <button
            onClick={handleNewHarvest}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nueva Cosecha
          </button>
        );
      default:
        return (
          <div className="flex gap-2">
            <button
              onClick={handleNewAction}
              className="btn-secondary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Accion
            </button>
            <button
              onClick={handleNewHarvest}
              className="btn-secondary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Cosecha
            </button>
            <button
              onClick={handleNewCrop}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nuevo Cultivo
            </button>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Page header */}
      <div className="flex items-start justify-between animate-fade-in">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Agricultura
          </h1>
          <p className="text-sm text-gray-600">
            Gestion de cultivos, lotes, planificacion agricola y cosechas
          </p>
        </div>
        {renderActionButtons()}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id
                    ? 'border-green-500 text-green-600'
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
                <AgroStatCard
                  label="Cultivos Activos"
                  value={stats.activeCrops}
                  icon="crops"
                  subValue={`${stats.readyToHarvest} listos para cosechar`}
                />
                <AgroStatCard
                  label="Area Cultivada"
                  value={`${stats.cultivatedArea} ha`}
                  icon="area"
                  subValue={`de ${stats.totalArea} ha totales`}
                />
                <AgroStatCard
                  label="Cosecha del Mes"
                  value={`${stats.monthlyHarvest.quantity.toLocaleString()} ${stats.monthlyHarvest.unit}`}
                  icon="harvest"
                />
                <AgroStatCard
                  label="Ingresos del Mes"
                  value={`${(stats.monthlyRevenue / 1000000).toFixed(1)}M`}
                  icon="revenue"
                  subValue={`${stats.pendingActions} acciones pendientes`}
                />
              </>
            ) : null}
          </div>

          {/* Crops Grid */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Cultivos Activos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
              {summariesLoading ? (
                <>
                  {[...Array(4)].map((_, i) => (
                    <ListCardSkeleton key={i} itemCount={3} />
                  ))}
                </>
              ) : cropSummaries ? (
                cropSummaries.map((crop) => (
                  <CropCard
                    key={crop.id}
                    crop={crop}
                    onClick={() => handleCropClick(crop.id)}
                  />
                ))
              ) : null}
            </div>
          </div>

          {/* Production Chart and Crop Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
            {/* Production Chart - takes 2/3 */}
            <div className="lg:col-span-2">
              {productionLoading ? (
                <ChartSkeleton />
              ) : production ? (
                <AgroProductionChart data={production} />
              ) : null}
            </div>

            {/* Crop Distribution - takes 1/3 */}
            <div>
              {cropDistLoading ? (
                <ChartSkeleton />
              ) : cropDist ? (
                <CropDistributionChart data={cropDist} />
              ) : null}
            </div>
          </div>

          {/* Tasks and Lotes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
            {/* Tasks */}
            <div>
              {tasksLoading ? (
                <ListCardSkeleton itemCount={5} />
              ) : tasks ? (
                <AgroTaskList tasks={tasks} />
              ) : null}
            </div>

            {/* Lotes Grid - takes 2/3 */}
            <div className="lg:col-span-2">
              <div className="card p-5 animate-fade-in">
                <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-4">
                  Lotes
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lotesLoading ? (
                    <>
                      {[...Array(3)].map((_, i) => (
                        <StatCardSkeleton key={i} />
                      ))}
                    </>
                  ) : lotes ? (
                    lotes.slice(0, 6).map((lote) => (
                      <LoteCard
                        key={lote.id}
                        lote={lote}
                        onClick={() => handleLoteClick(lote)}
                      />
                    ))
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'lotes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {lotesLoading ? (
            <>
              {[...Array(8)].map((_, i) => (
                <StatCardSkeleton key={i} />
              ))}
            </>
          ) : lotes && lotes.length > 0 ? (
            lotes.map((lote) => (
              <LoteCard
                key={lote.id}
                lote={lote}
                onClick={() => handleLoteClick(lote)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              <Map className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No hay lotes registrados</p>
              <button
                onClick={handleNewLote}
                className="mt-4 btn-primary inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Crear Primer Lote
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'cultivos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cropsLoading ? (
            <>
              {[...Array(8)].map((_, i) => (
                <ListCardSkeleton key={i} itemCount={3} />
              ))}
            </>
          ) : crops && crops.length > 0 ? (
            crops.map((crop) => (
              <div
                key={crop.id}
                onClick={() => {
                  setSelectedCrop(crop);
                  setCropDetailModalOpen(true);
                }}
                className="card p-4 cursor-pointer hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{crop.name}</h3>
                    <p className="text-sm text-gray-500">{crop.variety}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    crop.status === 'ready' ? 'bg-green-100 text-green-700' :
                    crop.status === 'harvested' ? 'bg-gray-100 text-gray-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {crop.status === 'planned' ? 'Planificado' :
                     crop.status === 'planted' ? 'Sembrado' :
                     crop.status === 'growing' ? 'Creciendo' :
                     crop.status === 'flowering' ? 'Floreciendo' :
                     crop.status === 'fruiting' ? 'Fructificando' :
                     crop.status === 'ready' ? 'Listo' :
                     'Cosechado'}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Lote: {crop.loteName}</p>
                  <p>Area: {crop.area} ha</p>
                  {crop.estimatedYield && (
                    <p>Rendimiento Est.: {crop.estimatedYield.toLocaleString()} {crop.yieldUnit}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              <Sprout className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No hay cultivos registrados</p>
              <button
                onClick={handleNewCrop}
                className="mt-4 btn-primary inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Crear Primer Cultivo
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'acciones' && (
        <>
          {actionsLoading ? (
            <ListCardSkeleton itemCount={5} />
          ) : agroActions && agroActions.length > 0 ? (
            <AgroActionList
              actions={agroActions}
              onActionClick={handleActionClick}
              showFilters={true}
              title="Todas las Acciones Agricolas"
            />
          ) : (
            <div className="text-center py-12 text-gray-500">
              <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No hay acciones registradas</p>
              <button
                onClick={handleNewAction}
                className="mt-4 btn-primary inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Registrar Primera Accion
              </button>
            </div>
          )}
        </>
      )}

      {activeTab === 'cosechas' && (
        <>
          {harvestsLoading ? (
            <ListCardSkeleton itemCount={5} />
          ) : harvests && harvests.length > 0 ? (
            <HarvestList
              harvests={harvests}
              onHarvestClick={handleHarvestClick}
              showFilters={true}
              showTotals={true}
              title="Todas las Cosechas"
            />
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No hay cosechas registradas</p>
              <button
                onClick={handleNewHarvest}
                className="mt-4 btn-primary inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Registrar Primera Cosecha
              </button>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <LoteFormModal
        open={loteFormModalOpen}
        onOpenChange={setLoteFormModalOpen}
        lote={selectedLote}
        onSuccess={() => setSelectedLote(null)}
      />
      <LoteDetailModal
        open={loteDetailModalOpen}
        onOpenChange={setLoteDetailModalOpen}
        lote={selectedLote}
        onEdit={handleLoteEdit}
        onDeleteSuccess={() => setSelectedLote(null)}
      />
      <CropFormModal
        open={cropFormModalOpen}
        onOpenChange={setCropFormModalOpen}
        crop={selectedCrop}
        onSuccess={() => setSelectedCrop(null)}
      />
      <CropDetailModal
        open={cropDetailModalOpen}
        onOpenChange={setCropDetailModalOpen}
        crop={selectedCrop}
        onEdit={handleCropEdit}
        onDeleteSuccess={() => setSelectedCrop(null)}
      />
      <AgroActionFormModal
        open={actionFormModalOpen}
        onOpenChange={setActionFormModalOpen}
        action={selectedAction}
        onSuccess={() => setSelectedAction(null)}
      />
      <AgroActionDetailModal
        open={actionDetailModalOpen}
        onOpenChange={setActionDetailModalOpen}
        action={selectedAction}
        onEdit={handleActionEdit}
      />
      <HarvestFormModal
        open={harvestFormModalOpen}
        onOpenChange={setHarvestFormModalOpen}
        harvest={selectedHarvest}
        onSuccess={() => setSelectedHarvest(null)}
      />
      <HarvestDetailModal
        open={harvestDetailModalOpen}
        onOpenChange={setHarvestDetailModalOpen}
        harvest={selectedHarvest}
        onEdit={handleHarvestEdit}
      />
    </div>
  );
}
