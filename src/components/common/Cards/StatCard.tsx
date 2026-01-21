import { TrendingUp, TrendingDown } from 'lucide-react';
import type { DashboardMetric } from '../../../types/dashboard.types';

interface StatCardProps {
  metric: DashboardMetric;
}

export default function StatCard({ metric }: StatCardProps) {
  const { label, value, trend, sparklineData } = metric;

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
      {/* Label - Small and subtle */}
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">{label}</p>

      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Value - Large and prominent */}
          <p className="text-4xl font-bold text-gray-900 mb-3">{value}</p>

          {/* Trend - Clear visual indicator */}
          {trend !== undefined && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50">
              {trend > 0 ? (
                <>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-semibold">
                    +{trend}%
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600 font-semibold">
                    {trend}%
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Sparkline - Visual context */}
        {sparklineData && sparklineData.length > 0 && (
          <div className="ml-6 flex items-center">
            <Sparkline data={sparklineData} color={metric.color || 'green'} />
          </div>
        )}
      </div>
    </div>
  );
}

// Simple sparkline component
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  const width = 100;
  const height = 40;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const colorMap: Record<string, string> = {
    green: '#22c55e',    // status.success
    blue: '#3b82f6',     // status.info
    orange: '#f59e0b',   // status.warning
    red: '#ef4444',      // status.danger
  };

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={colorMap[color] || colorMap.green}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
