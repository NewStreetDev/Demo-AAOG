import {
  FinanzasStatCard,
  IncomeExpenseChart,
  SalesByModuleChart,
  BudgetProgressCard,
  PendingPaymentsList,
  FinanzasTaskList,
} from '../components/finanzas';
import StatCardSkeleton from '../components/common/Skeletons/StatCardSkeleton';
import ChartSkeleton from '../components/common/Skeletons/ChartSkeleton';
import ListCardSkeleton from '../components/common/Skeletons/ListCardSkeleton';
import {
  useFinanzasStats,
  useMonthlyFinancialData,
  useSalesByModule,
  useBudgetComparisons,
  useAccountsReceivable,
  useAccountsPayable,
  useFinanzasTasks,
} from '../hooks/useFinanzas';

export default function Finanzas() {
  const { data: stats, isLoading: statsLoading } = useFinanzasStats();
  const { data: monthlyData, isLoading: monthlyLoading } = useMonthlyFinancialData();
  const { data: salesByModule, isLoading: moduleLoading } = useSalesByModule();
  const { data: budgets, isLoading: budgetLoading } = useBudgetComparisons();
  const { data: receivables, isLoading: receivableLoading } = useAccountsReceivable();
  const { data: payables, isLoading: payableLoading } = useAccountsPayable();
  const { data: tasks, isLoading: tasksLoading } = useFinanzasTasks();

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Page header */}
      <div className="space-y-1 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Finanzas
        </h1>
        <p className="text-sm text-gray-600">
          Gestión financiera, presupuestos, ingresos y gastos
        </p>
      </div>

      {/* Stats Grid - 6 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-5">
        {statsLoading ? (
          <>
            {[...Array(6)].map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </>
        ) : stats ? (
          <>
            <FinanzasStatCard
              label="Ingresos Totales"
              value={`₡${(stats.totalIncome / 1000000).toFixed(1)}M`}
              icon="income"
              subValue="este período"
            />
            <FinanzasStatCard
              label="Gastos Totales"
              value={`₡${(stats.totalExpense / 1000000).toFixed(1)}M`}
              icon="expense"
              subValue="este período"
            />
            <FinanzasStatCard
              label="Ganancia Neta"
              value={`₡${(stats.netProfit / 1000000).toFixed(1)}M`}
              icon="profit"
              trend={12}
              trendLabel="vs mes anterior"
            />
            <FinanzasStatCard
              label="Por Cobrar"
              value={`₡${(stats.pendingReceivables / 1000000).toFixed(1)}M`}
              icon="receivable"
              subValue={`${stats.overdueSales} vencidas`}
            />
            <FinanzasStatCard
              label="Por Pagar"
              value={`₡${(stats.pendingPayables / 1000000).toFixed(1)}M`}
              icon="pending"
              subValue={`${stats.overduePayments} vencidas`}
            />
            <FinanzasStatCard
              label="Flujo de Caja"
              value={`₡${(stats.cashFlow / 1000000).toFixed(1)}M`}
              icon="cashflow"
              trend={8}
              trendLabel="vs mes anterior"
            />
          </>
        ) : null}
      </div>

      {/* Income vs Expense and Sales by Module */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
        {/* Chart - takes 2/3 */}
        <div className="lg:col-span-2">
          {monthlyLoading ? (
            <ChartSkeleton />
          ) : monthlyData ? (
            <IncomeExpenseChart data={monthlyData} />
          ) : null}
        </div>

        {/* Sales by Module - takes 1/3 */}
        <div>
          {moduleLoading ? (
            <ChartSkeleton />
          ) : salesByModule ? (
            <SalesByModuleChart data={salesByModule} />
          ) : null}
        </div>
      </div>

      {/* Budget Progress Cards */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Presupuestos vs Real
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {budgetLoading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <StatCardSkeleton key={i} />
              ))}
            </>
          ) : budgets ? (
            budgets.map((budget) => (
              <BudgetProgressCard key={budget.category} budget={budget} />
            ))
          ) : null}
        </div>
      </div>

      {/* Pending Payments and Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
        {/* Accounts Receivable - takes 1/3 */}
        <div>
          {receivableLoading ? (
            <ListCardSkeleton itemCount={3} />
          ) : (
            <PendingPaymentsList receivables={receivables} type="receivable" />
          )}
        </div>

        {/* Accounts Payable - takes 1/3 */}
        <div>
          {payableLoading ? (
            <ListCardSkeleton itemCount={3} />
          ) : (
            <PendingPaymentsList payables={payables} type="payable" />
          )}
        </div>

        {/* Tasks - takes 1/3 */}
        <div>
          {tasksLoading ? (
            <ListCardSkeleton itemCount={5} />
          ) : tasks ? (
            <FinanzasTaskList tasks={tasks} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
