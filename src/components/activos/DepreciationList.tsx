import { ChevronRight, TrendingDown } from 'lucide-react';
import type { DepreciationRecord } from '../../types/activos.types';

interface DepreciationListProps {
  records: DepreciationRecord[];
}

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `₡${(value / 1000000).toFixed(2)}M`;
  }
  return `₡${(value / 1000).toFixed(0)}K`;
}

export default function DepreciationList({ records }: DepreciationListProps) {
  return (
    <div className="card p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          Depreciación del Período
        </h3>
        <button className="btn-ghost text-xs gap-1 px-3 py-2">
          Ver Todo
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {records.length > 0 ? (
          records.map((record) => (
            <div key={record.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                <TrendingDown className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {record.assetName}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {record.period}
                </p>
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                  <div>
                    <span className="text-gray-500">Depreciación:</span>{' '}
                    <span className="font-medium text-purple-600">
                      {formatCurrency(record.depreciationAmount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Valor libro:</span>{' '}
                    <span className="font-medium text-gray-900">
                      {formatCurrency(record.bookValue)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-gray-500 py-4">Sin registros de depreciación</p>
        )}
      </div>
    </div>
  );
}
