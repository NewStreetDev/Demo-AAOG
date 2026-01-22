import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  FinanzasStatCard,
  IncomeExpenseChart,
  SalesByModuleChart,
  BudgetProgressCard,
  PendingPaymentsList,
  FinanzasTaskList,
  SaleRecordFormModal,
  SaleRecordDetailModal,
  PurchaseRecordFormModal,
  PurchaseRecordDetailModal,
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
  useSalesRecords,
  usePurchaseRecords,
} from '../hooks/useFinanzas';
import type { SaleRecord, PurchaseRecord } from '../types/finanzas.types';

export default function Finanzas() {
  const { data: stats, isLoading: statsLoading } = useFinanzasStats();
  const { data: monthlyData, isLoading: monthlyLoading } = useMonthlyFinancialData();
  const { data: salesByModule, isLoading: moduleLoading } = useSalesByModule();
  const { data: budgets, isLoading: budgetLoading } = useBudgetComparisons();
  const { data: receivables, isLoading: receivableLoading } = useAccountsReceivable();
  const { data: payables, isLoading: payableLoading } = useAccountsPayable();
  const { data: tasks, isLoading: tasksLoading } = useFinanzasTasks();
  const { data: sales, isLoading: salesLoading } = useSalesRecords();
  const { data: purchases, isLoading: purchasesLoading } = usePurchaseRecords();

  // Sale modals state
  const [saleFormOpen, setSaleFormOpen] = useState(false);
  const [saleDetailOpen, setSaleDetailOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<SaleRecord | null>(null);

  // Purchase modals state
  const [purchaseFormOpen, setPurchaseFormOpen] = useState(false);
  const [purchaseDetailOpen, setPurchaseDetailOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseRecord | null>(null);

  // Sale handlers
  const handleSaleClick = (sale: SaleRecord) => {
    setSelectedSale(sale);
    setSaleDetailOpen(true);
  };

  const handleSaleEdit = (sale: SaleRecord) => {
    setSelectedSale(sale);
    setSaleFormOpen(true);
  };

  const handleNewSale = () => {
    setSelectedSale(null);
    setSaleFormOpen(true);
  };

  // Purchase handlers
  const handlePurchaseClick = (purchase: PurchaseRecord) => {
    setSelectedPurchase(purchase);
    setPurchaseDetailOpen(true);
  };

  const handlePurchaseEdit = (purchase: PurchaseRecord) => {
    setSelectedPurchase(purchase);
    setPurchaseFormOpen(true);
  };

  const handleNewPurchase = () => {
    setSelectedPurchase(null);
    setPurchaseFormOpen(true);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Finanzas
          </h1>
          <p className="text-sm text-gray-600">
            Gestión financiera, presupuestos, ingresos y gastos
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleNewPurchase}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nueva Compra
          </button>
          <button
            onClick={handleNewSale}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nueva Venta
          </button>
        </div>
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

      {/* Recent Sales and Purchases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
        {/* Recent Sales */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Ventas Recientes</h3>
            <span className="text-sm text-gray-500">{sales?.length || 0} total</span>
          </div>
          {salesLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : sales && sales.length > 0 ? (
            <div className="space-y-2">
              {sales.slice(0, 5).map((sale) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => handleSaleClick(sale)}
                >
                  <div>
                    <p className="font-medium text-gray-900">{sale.invoiceNumber}</p>
                    <p className="text-sm text-gray-500">{sale.buyerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      ₡{sale.totalAmount.toLocaleString('es-CR')}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      sale.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : sale.paymentStatus === 'partial'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {sale.paymentStatus === 'paid' ? 'Pagado' : sale.paymentStatus === 'partial' ? 'Parcial' : 'Pendiente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No hay ventas registradas</p>
          )}
        </div>

        {/* Recent Purchases */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Compras Recientes</h3>
            <span className="text-sm text-gray-500">{purchases?.length || 0} total</span>
          </div>
          {purchasesLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : purchases && purchases.length > 0 ? (
            <div className="space-y-2">
              {purchases.slice(0, 5).map((purchase) => (
                <div
                  key={purchase.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => handlePurchaseClick(purchase)}
                >
                  <div>
                    <p className="font-medium text-gray-900">{purchase.invoiceNumber}</p>
                    <p className="text-sm text-gray-500">{purchase.supplierName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">
                      ₡{purchase.totalAmount.toLocaleString('es-CR')}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      purchase.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : purchase.paymentStatus === 'partial'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {purchase.paymentStatus === 'paid' ? 'Pagado' : purchase.paymentStatus === 'partial' ? 'Parcial' : 'Pendiente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No hay compras registradas</p>
          )}
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

      {/* Sale Modals */}
      <SaleRecordFormModal
        open={saleFormOpen}
        onOpenChange={setSaleFormOpen}
        saleRecord={selectedSale}
      />
      <SaleRecordDetailModal
        open={saleDetailOpen}
        onOpenChange={setSaleDetailOpen}
        saleRecord={selectedSale}
        onEdit={handleSaleEdit}
      />

      {/* Purchase Modals */}
      <PurchaseRecordFormModal
        open={purchaseFormOpen}
        onOpenChange={setPurchaseFormOpen}
        purchaseRecord={selectedPurchase}
      />
      <PurchaseRecordDetailModal
        open={purchaseDetailOpen}
        onOpenChange={setPurchaseDetailOpen}
        purchaseRecord={selectedPurchase}
        onEdit={handlePurchaseEdit}
      />
    </div>
  );
}
