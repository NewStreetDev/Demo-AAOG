import { Wheat, Beef, Factory, DollarSign } from 'lucide-react';
import type { FincaDashboardStats, MonthlyAggregatedData, AggregatedTask, Finca } from '../../types/finca.types';
import type { WeatherData } from '../../types/dashboard.types';
import type { SystemModule } from '../../types/common.types';
import FincaStatCard from './FincaStatCard';
import FincaOverviewCard from './FincaOverviewCard';
import ModuleSummaryCard from './ModuleSummaryCard';
import AggregatedTaskList from './AggregatedTaskList';
import IncomeExpenseChart from './IncomeExpenseChart';
import RevenueByModuleChart from './RevenueByModuleChart';
import WeatherWidget from '../common/Cards/WeatherWidget';
import FincaMapCard from './FincaMapCard';

interface FincaDashboardProps {
  finca: Finca;
  stats: FincaDashboardStats;
  monthlyData: MonthlyAggregatedData[];
  tasks: AggregatedTask[];
  weather?: WeatherData;
  onEditFinca: () => void;
  onTaskClick?: (task: AggregatedTask) => void;
  onModuleClick?: (module: SystemModule) => void;
  onViewAllTasks?: () => void;
}

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${Math.round(value / 1000)}K`;
  }
  return value.toString();
}

export default function FincaDashboard({
  finca,
  stats,
  monthlyData,
  tasks,
  weather,
  onEditFinca,
  onTaskClick,
  onModuleClick,
  onViewAllTasks,
}: FincaDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Top Row: Finca Overview + Financial Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <FincaOverviewCard finca={finca} onEdit={onEditFinca} />
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
          <FincaStatCard
            label="Ingresos"
            value={`${formatCurrency(stats.totalIncome)}`}
            icon="income"
            subValue="Total acumulado"
            trend="up"
            trendValue="+12.5%"
          />
          <FincaStatCard
            label="Gastos"
            value={`${formatCurrency(stats.totalExpense)}`}
            icon="expense"
            subValue="Total acumulado"
          />
          <FincaStatCard
            label="Ganancia"
            value={`${formatCurrency(stats.netProfit)}`}
            icon="profit"
            subValue={`${stats.profitMargin}% margen`}
            trend="up"
            trendValue="+8.3%"
          />
          <FincaStatCard
            label="Divisiones"
            value={stats.totalDivisions}
            icon="area"
            subValue={`${stats.totalArea} ha totales`}
          />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <IncomeExpenseChart data={monthlyData} />
        <RevenueByModuleChart data={monthlyData} />
      </div>

      {/* Module Summaries */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Modulos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ModuleSummaryCard
            title="Agricultura"
            module="agro"
            icon={<Wheat className="w-5 h-5" />}
            mainValue={stats.agro.activeCrops}
            mainLabel="Cultivos activos"
            secondaryItems={[
              { label: 'Lotes', value: `${stats.agro.activeLotes}/${stats.agro.totalLotes}` },
              { label: 'Area cultivada', value: `${stats.agro.cultivatedArea} ha` },
            ]}
            pendingTasks={stats.agro.pendingTasks}
            status={stats.agro.pendingTasks > 5 ? 'warning' : 'good'}
            path="/agro"
            color="bg-lime-100 text-lime-600"
          />

          <ModuleSummaryCard
            title="Pecuario"
            module="pecuario"
            icon={<Beef className="w-5 h-5" />}
            mainValue={stats.pecuario.totalLivestock}
            mainLabel="Animales totales"
            secondaryItems={[
              { label: 'Bovinos', value: stats.pecuario.bySpecies.bovine },
              { label: 'Leche/mes', value: `${formatCurrency(stats.pecuario.monthlyMilkProduction)} L` },
            ]}
            pendingTasks={stats.pecuario.pendingTasks}
            status={stats.pecuario.pendingTasks > 3 ? 'warning' : 'good'}
            path="/pecuario"
            color="bg-orange-100 text-orange-600"
          />

          <ModuleSummaryCard
            title="Procesamiento"
            module="procesamiento"
            icon={<Factory className="w-5 h-5" />}
            mainValue={stats.procesamiento.activeBatches}
            mainLabel="Lotes activos"
            secondaryItems={[
              { label: 'Produccion/mes', value: `${formatCurrency(stats.procesamiento.monthlyProduction)} kg` },
            ]}
            pendingTasks={stats.procesamiento.pendingTasks}
            status={stats.procesamiento.pendingTasks > 3 ? 'warning' : 'good'}
            path="/procesamiento"
            color="bg-purple-100 text-purple-600"
          />

          <ModuleSummaryCard
            title="Finanzas"
            module="finanzas"
            icon={<DollarSign className="w-5 h-5" />}
            mainValue={`${formatCurrency(stats.finanzas.thisMonthIncome)}`}
            mainLabel="Ingresos del mes"
            secondaryItems={[
              { label: 'Por cobrar', value: formatCurrency(stats.finanzas.pendingReceivables) },
              { label: 'Por pagar', value: formatCurrency(stats.finanzas.pendingPayables) },
            ]}
            status={stats.finanzas.pendingPayables > stats.finanzas.pendingReceivables ? 'warning' : 'good'}
            path="/finanzas"
            color="bg-emerald-100 text-emerald-600"
          />
        </div>
      </div>

      {/* Map and Weather Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <FincaMapCard finca={finca} />
        {weather && <WeatherWidget weather={weather} />}
        <div className={weather ? '' : 'lg:col-span-2'}>
          <AggregatedTaskList
            tasks={tasks}
            maxItems={6}
            onTaskClick={onTaskClick}
            onModuleClick={onModuleClick}
            onViewAll={onViewAllTasks}
          />
        </div>
      </div>

      {/* Quick Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Resumen Rapido</h3>
            <p className="text-sm text-gray-500">Estado general de la finca</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Planes pendientes</span>
              <span className="text-lg font-bold text-gray-900">{stats.totalPendingPlans}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
              <span className="text-sm text-amber-700">Proximos vencimientos (7 dias)</span>
              <span className="text-lg font-bold text-amber-700">{stats.upcomingDeadlines}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
              <span className="text-sm text-emerald-700">Margen de ganancia</span>
              <span className="text-lg font-bold text-emerald-700">{stats.profitMargin}%</span>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Accesos Rapidos</h4>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="/finanzas"
                  className="p-2 text-sm text-center bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                >
                  Registrar Venta
                </a>
                <a
                  href="/pecuario"
                  className="p-2 text-sm text-center bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  Inventario Animal
                </a>
                <a
                  href="/agro"
                  className="p-2 text-sm text-center bg-lime-50 text-lime-700 rounded-lg hover:bg-lime-100 transition-colors"
                >
                  Planificacion Agro
                </a>
                <a
                  href="/procesamiento"
                  className="p-2 text-sm text-center bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  Ver Procesos
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
