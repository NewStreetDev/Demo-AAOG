import { TrendingUp, TrendingDown } from 'lucide-react';
import type { DashboardMetric } from '../../../types/dashboard.types';

interface StatCardProps {
  metric: DashboardMetric;
}

export default function StatCard({ metric }: StatCardProps) {
  const { label, value, trend, sparklineData } = metric;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {trend > 0 ? (
                <>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">
                    +{trend}%
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600 font-medium">
                    {trend}%
                  </span>
                </>
              )}
            </div>
          )}
        </div>
        {sparklineData && sparklineData.length > 0 && (
          <div className="ml-4">
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
  const width = 80;
  const height = 30;

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
