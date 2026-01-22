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
import type { ProcesamientoProductionData } from '../../types/procesamiento.types';

interface ProductionOutputChartProps {
  data: ProcesamientoProductionData[];
}

export default function ProductionOutputChart({ data }: ProductionOutputChartProps) {
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
              tickFormatter={(value) => `${value}`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
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
                  processed: 'Procesado',
                  produced: 'Producido',
                  yieldRate: 'Rendimiento',
                };
                const unit = name === 'yieldRate' ? '%' : ' kg';
                return [`${numValue}${unit}`, labels[name as string] || name];
              }}
              labelStyle={{ fontWeight: 600, color: '#1f2937' }}
            />
            <Legend
              wrapperStyle={{ fontSize: '0.75rem', paddingTop: '1rem' }}
              formatter={(value) => {
                const labels: Record<string, string> = {
                  processed: 'Procesado (kg)',
                  produced: 'Producido (kg)',
                  yieldRate: 'Rendimiento (%)',
                };
                return labels[value] || value;
              }}
            />
            <Bar
              yAxisId="left"
              dataKey="processed"
              fill="#94a3b8"
              radius={[4, 4, 0, 0]}
              name="processed"
            />
            <Bar
              yAxisId="left"
              dataKey="produced"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              name="produced"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="yieldRate"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ fill: '#f59e0b', strokeWidth: 2 }}
              name="yieldRate"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
