import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { ProductionByType } from '../../types/procesamiento.types';

interface ProductionByTypeChartProps {
  data: ProductionByType[];
}

export default function ProductionByTypeChart({ data }: ProductionByTypeChartProps) {
  const totalQuantity = data.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="card p-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          Por Tipo de Producto
        </h3>
        <span className="text-sm text-gray-500">{totalQuantity} kg</span>
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
              dataKey="quantity"
              nameKey="productType"
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
              formatter={(value, name) => [`${value} kg`, name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100">
        {data.map((item) => (
          <div key={item.productType} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-600 truncate">{item.productType}</p>
              <p className="text-xs text-gray-500">{item.percentage}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
