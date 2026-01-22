import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { Activity } from '../../../types/dashboard.types';
import { TrendingUp } from 'lucide-react';

interface ActivityChartProps {
  activities: Activity[];
}

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-xl border border-gray-100 ring-1 ring-black/5">
        <p className="text-sm font-bold text-gray-900 mb-1">{data.name}</p>
        <p className="text-lg font-bold" style={{ color: data.payload.color }}>
          {data.value}%
        </p>
      </div>
    );
  }
  return null;
};

// Custom label component for center text
const CenterLabel = ({ viewBox, totalActivities }: any) => {
  const { cx, cy } = viewBox;
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
      <tspan x={cx} dy="-0.5em" className="text-3xl font-bold fill-gray-900">
        {totalActivities}
      </tspan>
      <tspan x={cx} dy="1.8em" className="text-xs font-semibold fill-gray-500">
        Actividades
      </tspan>
    </text>
  );
};

export default function ActivityChart({ activities }: ActivityChartProps) {
  const totalActivities = activities.reduce((sum, activity) => sum + activity.value, 0);

  return (
    <div className="card p-6 animate-fade-in relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-3xl opacity-20 -z-10" />

      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">
          Mis Últimas Actividades
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Distribución por tipo de actividad
        </p>
      </div>

      {/* Chart container */}
      <div className="h-80 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              {activities.map((_entry, index) => (
                <filter key={`shadow-${index}`} id={`shadow-${index}`}>
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
                </filter>
              ))}
            </defs>
            <Pie
              data={activities}
              cx="50%"
              cy="45%"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={3}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
              label={CenterLabel}
              labelLine={false}
            >
              {activities.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="white"
                  strokeWidth={3}
                  style={{
                    filter: `url(#shadow-${index})`,
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={60}
              iconType="circle"
              iconSize={10}
              formatter={(value, entry: any) => (
                <span className="text-xs font-semibold text-gray-700 hover:text-gray-900 transition-colors">
                  {value} <span className="font-bold" style={{ color: entry.color }}>({entry.payload.value}%)</span>
                </span>
              )}
              wrapperStyle={{
                paddingTop: '20px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Activity details */}
      <div className="mt-4 pt-4 border-t border-gray-100/80">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 font-medium">Total de actividades</span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">{totalActivities}</span>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
