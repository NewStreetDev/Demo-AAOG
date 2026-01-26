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
import type { MonthlyAggregatedData } from '../../types/finca.types';

interface RevenueByModuleChartProps {
  data: MonthlyAggregatedData[];
}

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toString();
}

export default function RevenueByModuleChart({ data }: RevenueByModuleChartProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Ingresos por Modulo</h3>
        <p className="text-sm text-gray-500">Desglose mensual</p>
      </div>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatCurrency}
            />
            <Tooltip
              formatter={(value, name) => {
                const labels: Record<string, string> = {
                  agroRevenue: 'Agricultura',
                  pecuarioRevenue: 'Pecuario',
                  apiculturaRevenue: 'Apicultura',
                };
                return [
                  new Intl.NumberFormat('es-CR', {
                    style: 'currency',
                    currency: 'CRC',
                    maximumFractionDigits: 0,
                  }).format(Number(value) || 0),
                  labels[String(name)] || String(name),
                ];
              }}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend
              formatter={(value: string) => {
                const labels: Record<string, string> = {
                  agroRevenue: 'Agricultura',
                  pecuarioRevenue: 'Pecuario',
                  apiculturaRevenue: 'Apicultura',
                };
                return labels[value] || value;
              }}
              wrapperStyle={{ fontSize: '12px' }}
            />
            <Bar
              dataKey="agroRevenue"
              fill="#84cc16"
              radius={[4, 4, 0, 0]}
              stackId="revenue"
            />
            <Bar
              dataKey="pecuarioRevenue"
              fill="#f97316"
              radius={[4, 4, 0, 0]}
              stackId="revenue"
            />
            <Bar
              dataKey="apiculturaRevenue"
              fill="#fbbf24"
              radius={[4, 4, 0, 0]}
              stackId="revenue"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
