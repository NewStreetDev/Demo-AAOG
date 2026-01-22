import { ChevronRight } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { DepreciationSummary } from '../../types/activos.types';

interface DepreciationChartProps {
  data: DepreciationSummary[];
}

export default function DepreciationChart({ data }: DepreciationChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    depreciation: item.depreciation / 1000000,
    accumulated: item.accumulated / 1000000,
  }));

  return (
    <div className="card p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          Depreciación Acumulada
        </h3>
        <button className="btn-ghost text-xs gap-1 px-3 py-2">
          Ver Detalle
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 5, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₡${value}M`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                fontSize: '0.875rem',
              }}
              formatter={(value) => [`₡${Number(value).toFixed(1)}M`, '']}
            />
            <Area
              type="monotone"
              dataKey="accumulated"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.2}
              strokeWidth={2}
              name="Acumulada"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
