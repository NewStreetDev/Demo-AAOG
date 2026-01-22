import { ChevronRight } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import type { EquipmentByStatus } from '../../types/infraestructura.types';

interface EquipmentStatusChartProps {
  data: EquipmentByStatus[];
}

const COLORS = ['#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

export default function EquipmentStatusChart({ data }: EquipmentStatusChartProps) {
  const chartData = data.map((item) => ({
    name: item.status,
    value: item.count,
  }));

  return (
    <div className="card p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          Estado de Equipos
        </h3>
        <button className="btn-ghost text-xs gap-1 px-3 py-2">
          Ver Más
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '0.75rem', paddingTop: '0.5rem' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
