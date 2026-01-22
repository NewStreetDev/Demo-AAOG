import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { SalesByModule } from '../../types/finanzas.types';

interface SalesByModuleChartProps {
  data: SalesByModule[];
}

export default function SalesByModuleChart({ data }: SalesByModuleChartProps) {
  const totalSales = data.reduce((sum, item) => sum + item.totalSales, 0);

  return (
    <div className="card p-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          Ventas por Módulo
        </h3>
        <span className="text-sm text-gray-500">₡{(totalSales / 1000000).toFixed(1)}M</span>
      </div>

      {/* Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={3}
              dataKey="totalSales"
              nameKey="moduleName"
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
                return [`₡${(numValue / 1000000).toFixed(2)}M`, 'Ventas'];
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
        {data.map((item) => (
          <div key={item.module} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-600 truncate">{item.moduleName}</p>
              <p className="text-sm font-bold text-gray-900">
                {item.percentage}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
