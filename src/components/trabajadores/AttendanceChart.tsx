import { ChevronRight } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { AttendanceSummary } from '../../types/trabajadores.types';

interface AttendanceChartProps {
  data: AttendanceSummary[];
}

export default function AttendanceChart({ data }: AttendanceChartProps) {
  return (
    <div className="card p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          Asistencia Semanal
        </h3>
        <button className="btn-ghost text-xs gap-1 px-3 py-2">
          Ver Historial
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 5, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
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
            />
            <Legend wrapperStyle={{ fontSize: '0.75rem', paddingTop: '1rem' }} />
            <Bar dataKey="present" fill="#10b981" name="Presentes" radius={[4, 4, 0, 0]} />
            <Bar dataKey="absent" fill="#ef4444" name="Ausentes" radius={[4, 4, 0, 0]} />
            <Bar dataKey="late" fill="#f59e0b" name="Retrasados" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
