import { Wheat, Beef, Bug, Users, Package, Building, Landmark, DollarSign } from 'lucide-react';
import type { FincaDashboardStats, MonthlyAggregatedData, AggregatedTask, Finca } from '../../types/finca.types';
import FincaStatCard from './FincaStatCard';
import FincaOverviewCard from './FincaOverviewCard';
import ModuleSummaryCard from './ModuleSummaryCard';
import AggregatedTaskList from './AggregatedTaskList';
import IncomeExpenseChart from './IncomeExpenseChart';
import RevenueByModuleChart from './RevenueByModuleChart';

interface FincaDashboardProps {
  finca: Finca;
  stats: FincaDashboardStats;
  monthlyData: MonthlyAggregatedData[];
  tasks: AggregatedTask[];
  onEditFinca: () => void;
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
  onEditFinca,
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
            title="Apicultura"
            module="apicultura"
            icon={<Bug className="w-5 h-5" />}
            mainValue={stats.apicultura.totalColmenas}
            mainLabel="Colmenas totales"
            secondaryItems={[
              { label: 'Apiarios', value: stats.apicultura.totalApiarios },
              { label: 'Miel/mes', value: `${stats.apicultura.monthlyHoneyProduction} kg` },
            ]}
            pendingTasks={stats.apicultura.pendingTasks}
            status={stats.apicultura.pendingTasks > 4 ? 'warning' : 'good'}
            path="/apicultura"
            color="bg-amber-100 text-amber-600"
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

          <ModuleSummaryCard
            title="Trabajadores"
            module="trabajadores"
            icon={<Users className="w-5 h-5" />}
            mainValue={stats.trabajadores.activeWorkers}
            mainLabel="Trabajadores activos"
            secondaryItems={[
              { label: 'Total', value: stats.trabajadores.totalWorkers },
              { label: 'Asistencia', value: `${stats.trabajadores.averageAttendance}%` },
            ]}
            pendingTasks={stats.trabajadores.pendingTasks}
            path="/trabajadores"
            color="bg-indigo-100 text-indigo-600"
          />

          <ModuleSummaryCard
            title="Insumos"
            module="insumos"
            icon={<Package className="w-5 h-5" />}
            mainValue={stats.insumos.totalItems}
            mainLabel="Items en inventario"
            secondaryItems={[
              { label: 'Stock bajo', value: stats.insumos.lowStockItems },
              { label: 'Critico', value: stats.insumos.criticalStockItems },
            ]}
            status={stats.insumos.criticalStockItems > 0 ? 'critical' : stats.insumos.lowStockItems > 3 ? 'warning' : 'good'}
            path="/insumos"
            color="bg-purple-100 text-purple-600"
          />

          <ModuleSummaryCard
            title="Infraestructura"
            module="infraestructura"
            icon={<Building className="w-5 h-5" />}
            mainValue={stats.infraestructura.operationalFacilities}
            mainLabel="Instalaciones operativas"
            secondaryItems={[
              { label: 'Total', value: stats.infraestructura.totalFacilities },
              { label: 'Mant. pendiente', value: stats.infraestructura.pendingMaintenances },
            ]}
            pendingTasks={stats.infraestructura.pendingMaintenances}
            status={stats.infraestructura.pendingMaintenances > 2 ? 'warning' : 'good'}
            path="/infraestructura"
            color="bg-slate-100 text-slate-600"
          />

          <ModuleSummaryCard
            title="Activos"
            module="activos"
            icon={<Landmark className="w-5 h-5" />}
            mainValue={stats.activos.activeAssets}
            mainLabel="Activos en uso"
            secondaryItems={[
              { label: 'Total', value: stats.activos.totalAssets },
              { label: 'Valor', value: formatCurrency(stats.activos.totalValue) },
            ]}
            path="/activos"
            color="bg-cyan-100 text-cyan-600"
          />
        </div>
      </div>

      {/* Tasks and Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AggregatedTaskList tasks={tasks} maxItems={8} />

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
                  Registrar Ordeno
                </a>
                <a
                  href="/agro"
                  className="p-2 text-sm text-center bg-lime-50 text-lime-700 rounded-lg hover:bg-lime-100 transition-colors"
                >
                  Ver Cultivos
                </a>
                <a
                  href="/trabajadores"
                  className="p-2 text-sm text-center bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  Asistencia
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
