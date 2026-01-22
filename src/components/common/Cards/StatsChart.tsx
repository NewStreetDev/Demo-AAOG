import { ChevronRight } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { StatsChartData } from '../../../types/dashboard.types';

interface StatsChartProps {
  data: StatsChartData[];
}

export default function StatsChart({ data }: StatsChartProps) {
  return (
    <div className="card p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          Estadísticas Generales
        </h3>
        <button className="btn-ghost text-xs gap-1 px-3 py-2">
          Reporte Financiero
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
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
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                fontSize: '0.875rem',
              }}
              formatter={(value, name) => {
                const numValue = typeof value === 'number' ? value : 0;
                return [
                  name === 'production'
                    ? `${numValue.toLocaleString()} kg`
                    : `$${numValue.toLocaleString()}`,
                  name === 'production' ? 'Producción' : 'Ingresos',
                ];
              }}
              labelStyle={{ fontWeight: 600, color: '#1f2937' }}
            />
            <Legend
              wrapperStyle={{ fontSize: '0.75rem', paddingTop: '1rem' }}
              formatter={(value) =>
                value === 'production' ? 'Producción (kg)' : 'Ingresos ($)'
              }
            />
            <Bar
              dataKey="production"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              name="production"
            />
            <Bar
              dataKey="income"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              name="income"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
