import { ChevronRight } from 'lucide-react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { TrendData } from '../../types/reportes.types';

interface TrendChartProps {
  data: TrendData[];
}

export default function TrendChart({ data }: TrendChartProps) {
  const chartData = data.map((d) => ({
    period: d.period,
    ingresos: d.revenue / 1000000,
    gastos: d.expense / 1000000,
    ganancia: d.profit / 1000000,
  }));

  return (
    <div className="card p-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          Tendencia Financiera
        </h3>
        <button className="btn-ghost text-xs gap-1 px-3 py-2">
          Ver Historial
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 5, right: 5, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="period"
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
              formatter={(value, name) => {
                const labels: Record<string, string> = {
                  ingresos: 'Ingresos',
                  gastos: 'Gastos',
                  ganancia: 'Ganancia',
                };
                return [`₡${Number(value).toFixed(2)}M`, labels[name as string] || name];
              }}
              labelStyle={{ fontWeight: 600, color: '#1f2937' }}
            />
            <Legend
              wrapperStyle={{ fontSize: '0.75rem', paddingTop: '1rem' }}
              formatter={(value) => {
                const labels: Record<string, string> = {
                  ingresos: 'Ingresos',
                  gastos: 'Gastos',
                  ganancia: 'Ganancia',
                };
                return labels[value] || value;
              }}
            />
            <Bar dataKey="ingresos" fill="#10b981" radius={[4, 4, 0, 0]} name="ingresos" />
            <Bar dataKey="gastos" fill="#ef4444" radius={[4, 4, 0, 0]} name="gastos" />
            <Line
              type="monotone"
              dataKey="ganancia"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2 }}
              name="ganancia"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
