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
import type { AgroProductionData } from '../../types/agro.types';

interface AgroProductionChartProps {
  data: AgroProductionData[];
}

export default function AgroProductionChart({ data }: AgroProductionChartProps) {
  return (
    <div className="card p-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          Producción y Ventas
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
              yAxisId="left"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
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
                if (name === 'harvest') return [`${numValue.toLocaleString()} kg`, 'Cosecha'];
                if (name === 'revenue') return [`₡${numValue.toLocaleString()}`, 'Ingresos'];
                return [value, name];
              }}
              labelStyle={{ fontWeight: 600, color: '#1f2937' }}
            />
            <Legend
              wrapperStyle={{ fontSize: '0.75rem', paddingTop: '1rem' }}
              formatter={(value) => {
                const labels: Record<string, string> = {
                  harvest: 'Cosecha (kg)',
                  revenue: 'Ingresos (₡)',
                };
                return labels[value] || value;
              }}
            />
            <Bar
              yAxisId="left"
              dataKey="harvest"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
              name="harvest"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
              name="revenue"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
