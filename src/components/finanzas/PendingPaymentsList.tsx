import { ChevronRight, Clock, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import type { AccountsReceivable, AccountsPayable } from '../../types/finanzas.types';

interface PendingPaymentsListProps {
  receivables?: AccountsReceivable[];
  payables?: AccountsPayable[];
  type: 'receivable' | 'payable';
}

export default function PendingPaymentsList({
  receivables = [],
  payables = [],
  type,
}: PendingPaymentsListProps) {
  const items = type === 'receivable' ? receivables : payables;
  const title = type === 'receivable' ? 'Por Cobrar' : 'Por Pagar';
  const Icon = type === 'receivable' ? ArrowUpRight : ArrowDownLeft;
  const iconBg = type === 'receivable' ? 'bg-green-100' : 'bg-red-100';
  const iconColor = type === 'receivable' ? 'text-green-600' : 'text-red-600';

  return (
    <div className="card p-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          {title}
        </h3>
        <button className="btn-ghost text-xs gap-1 px-3 py-2">
          Ver Todo
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Items List */}
      <div className="space-y-3">
        {items.length > 0 ? (
          items.map((item) => {
            const daysLeft = Math.ceil(
              (new Date(item.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );
            const isOverdue = item.status === 'overdue' || daysLeft < 0;
            const name = 'buyerName' in item ? item.buyerName : item.supplierName;

            return (
              <div key={item.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-lg ${iconBg}`}>
                  <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.invoiceNumber}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <p className="text-sm font-bold text-gray-900">
                      ₡{item.amountPending.toLocaleString()}
                    </p>
                    <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-600' : 'text-amber-600'}`}>
                      <Clock className="w-3.5 h-3.5" />
                      {isOverdue ? `${Math.abs(daysLeft)} días vencido` : `${daysLeft} días`}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-sm text-gray-500 py-4">Sin pagos pendientes</p>
        )}
      </div>
    </div>
  );
}
