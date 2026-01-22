import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { CategorySummary } from '../../types/insumos.types';

interface StockDistributionChartProps {
  data: CategorySummary[];
}

export default function StockDistributionChart({ data }: StockDistributionChartProps) {
  const totalValue = data.reduce((sum, item) => sum + item.totalValue, 0);

  return (
    <div className="card p-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          Valor por Categoría
        </h3>
        <span className="text-sm text-gray-500">₡{(totalValue / 1000000).toFixed(1)}M</span>
      </div>

      {/* Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={3}
              dataKey="totalValue"
              nameKey="categoryLabel"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                fontSize: '0.875rem',
              }}
              formatter={(value) => {
                const numValue = typeof value === 'number' ? value : 0;
                return [`₡${(numValue / 1000000).toFixed(2)}M`, 'Valor'];
              }}
            />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              wrapperStyle={{ fontSize: '0.75rem', paddingLeft: '1rem' }}
              formatter={(value) => (
                <span className="text-gray-700">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
