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
import type { PecuarioProductionData } from '../../types/pecuario.types';

interface PecuarioProductionChartProps {
  data: PecuarioProductionData[];
}

export default function PecuarioProductionChart({ data }: PecuarioProductionChartProps) {
  return (
    <div className="card p-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          Producción Mensual
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
              tickFormatter={(value) => `${value}L`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
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
                const labels: Record<string, string> = {
                  milk: 'Leche',
                  births: 'Nacimientos',
                  sales: 'Ventas',
                };
                const units: Record<string, string> = {
                  milk: ' L',
                  births: '',
                  sales: '',
                };
                return [`${numValue}${units[name as string] || ''}`, labels[name as string] || name];
              }}
              labelStyle={{ fontWeight: 600, color: '#1f2937' }}
            />
            <Legend
              wrapperStyle={{ fontSize: '0.75rem', paddingTop: '1rem' }}
              formatter={(value) => {
                const labels: Record<string, string> = {
                  milk: 'Leche (L)',
                  births: 'Nacimientos',
                  sales: 'Ventas',
                };
                return labels[value] || value;
              }}
            />
            <Bar
              yAxisId="left"
              dataKey="milk"
              fill="#8b5cf6"
              radius={[4, 4, 0, 0]}
              name="milk"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="births"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 2 }}
              name="births"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="sales"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ fill: '#f59e0b', strokeWidth: 2 }}
              name="sales"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
