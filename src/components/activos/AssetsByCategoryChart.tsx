import { ChevronRight } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { AssetsByCategory } from '../../types/activos.types';

interface AssetsByCategoryChartProps {
  data: AssetsByCategory[];
}

export default function AssetsByCategoryChart({ data }: AssetsByCategoryChartProps) {
  const chartData = data.map((item) => ({
    name: item.category,
    valor: item.value / 1000000,
    cantidad: item.count,
  }));

  return (
    <div className="card p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          Valor por Categoría
        </h3>
        <button className="btn-ghost text-xs gap-1 px-3 py-2">
          Ver Detalle
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={true} vertical={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
              tickFormatter={(value) => `₡${value}M`}
            />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                fontSize: '0.875rem',
              }}
              formatter={(value) => [`₡${Number(value).toFixed(1)}M`, 'Valor']}
            />
            <Bar dataKey="valor" fill="#3b82f6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
