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
import type { ApiculturaProductionData } from '../../types/apicultura.types';

interface ApiculturaProductionChartProps {
  data: ApiculturaProductionData[];
}

export default function ApiculturaProductionChart({ data }: ApiculturaProductionChartProps) {
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
          <AreaChart
            data={data}
            margin={{ top: 5, right: 5, left: -10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="honeyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="waxGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="pollenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
              tickFormatter={(value) => `${value}kg`}
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
                  honey: 'Miel',
                  wax: 'Cera',
                  pollen: 'Polen',
                  propolis: 'Propóleo',
                };
                return [`${numValue} kg`, labels[name as string] || name];
              }}
              labelStyle={{ fontWeight: 600, color: '#1f2937' }}
            />
            <Legend
              wrapperStyle={{ fontSize: '0.75rem', paddingTop: '1rem' }}
              formatter={(value) => {
                const labels: Record<string, string> = {
                  honey: 'Miel',
                  wax: 'Cera',
                  pollen: 'Polen',
                };
                return labels[value] || value;
              }}
            />
            <Area
              type="monotone"
              dataKey="honey"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="url(#honeyGradient)"
              name="honey"
            />
            <Area
              type="monotone"
              dataKey="wax"
              stroke="#f97316"
              strokeWidth={2}
              fill="url(#waxGradient)"
              name="wax"
            />
            <Area
              type="monotone"
              dataKey="pollen"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#pollenGradient)"
              name="pollen"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
