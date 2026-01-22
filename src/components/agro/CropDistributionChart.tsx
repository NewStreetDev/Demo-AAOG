import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { CropDistribution } from '../../types/agro.types';

interface CropDistributionChartProps {
  data: CropDistribution[];
}

export default function CropDistributionChart({ data }: CropDistributionChartProps) {
  const totalArea = data.reduce((sum, item) => sum + item.area, 0);

  return (
    <div className="card p-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          Distribución de Cultivos
        </h3>
        <span className="text-sm text-gray-500">{totalArea.toFixed(1)} ha total</span>
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
              dataKey="area"
              nameKey="crop"
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
              formatter={(value, name) => [`${value} ha (${data.find(d => d.crop === name)?.percentage.toFixed(1)}%)`, name]}
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
