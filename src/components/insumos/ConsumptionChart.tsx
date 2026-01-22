import { ChevronRight } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { ConsumptionData } from '../../types/insumos.types';

interface ConsumptionChartProps {
  data: ConsumptionData[];
}

export default function ConsumptionChart({ data }: ConsumptionChartProps) {
  return (
    <div className="card p-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          Consumo por Módulo
        </h3>
        <button className="btn-ghost text-xs gap-1 px-3 py-2">
          Ver Detalle
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 5, left: -10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="agroGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="pecuarioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="apiculturaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
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
                const labels: Record<string, string> = {
                  agro: 'Agricultura',
                  pecuario: 'Pecuario',
                  apicultura: 'Apicultura',
                };
                return [`₡${numValue.toLocaleString()}`, labels[name as string] || name];
              }}
              labelStyle={{ fontWeight: 600, color: '#1f2937' }}
            />
            <Legend
              wrapperStyle={{ fontSize: '0.75rem', paddingTop: '1rem' }}
              formatter={(value) => {
                const labels: Record<string, string> = {
                  agro: 'Agricultura',
                  pecuario: 'Pecuario',
                  apicultura: 'Apicultura',
                };
                return labels[value] || value;
              }}
            />
            <Area
              type="monotone"
              dataKey="agro"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#agroGradient)"
              name="agro"
            />
            <Area
              type="monotone"
              dataKey="pecuario"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#pecuarioGradient)"
              name="pecuario"
            />
            <Area
              type="monotone"
              dataKey="apicultura"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="url(#apiculturaGradient)"
              name="apicultura"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
