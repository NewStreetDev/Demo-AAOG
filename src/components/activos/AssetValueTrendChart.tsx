import { ChevronRight } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { AssetValueTrend } from '../../types/activos.types';

interface AssetValueTrendChartProps {
  data: AssetValueTrend[];
}

export default function AssetValueTrendChart({ data }: AssetValueTrendChartProps) {
  return (
    <div className="card p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          Tendencia de Valor
        </h3>
        <button className="btn-ghost text-xs gap-1 px-3 py-2">
          Ver Historial
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
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
              tickFormatter={(value) => `${value}M`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                fontSize: '0.875rem',
              }}
              formatter={(value) => [`₡${value}M`, '']}
            />
            <Legend wrapperStyle={{ fontSize: '0.75rem', paddingTop: '1rem' }} />
            <Line
              type="monotone"
              dataKey="acquisitionValue"
              stroke="#6b7280"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Costo Adquisición"
            />
            <Line
              type="monotone"
              dataKey="currentValue"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              name="Valor Actual"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
