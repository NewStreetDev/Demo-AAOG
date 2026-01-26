import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  Beef,
  Heart,
  Droplets,
  MapPin,
  Activity,
  Baby,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import type { PecuarioDashboardStats, PecuarioProductionData } from '../../types/pecuario.types';

interface PecuarioDashboardProps {
  stats: PecuarioDashboardStats;
  productionData: PecuarioProductionData[];
  isLoading?: boolean;
}

const SPECIES_COLORS = {
  bovine: '#3b82f6',
  porcine: '#ec4899',
  caprine: '#8b5cf6',
  buffalo: '#f59e0b',
  equine: '#10b981',
  ovine: '#6366f1',
  poultry: '#ef4444',
};

const speciesLabels: Record<string, string> = {
  bovine: 'Bovinos',
  porcine: 'Porcinos',
  caprine: 'Caprinos',
  buffalo: 'Bufalinos',
  equine: 'Equinos',
  ovine: 'Ovinos',
  poultry: 'Aves',
};

export default function PecuarioDashboard({
  stats,
  productionData,
}: PecuarioDashboardProps) {
  // Prepare species distribution data for pie chart
  const speciesData = Object.entries(stats.bySpecies)
    .filter(([_, count]) => count > 0)
    .map(([species, count]) => ({
      name: speciesLabels[species] || species,
      value: count,
      color: SPECIES_COLORS[species as keyof typeof SPECIES_COLORS] || '#94a3b8',
    }));

  // Prepare category distribution data for bovines
  const categoryData = [
    { name: 'Vacas', value: stats.byCategory.vacas, color: '#ec4899' },
    { name: 'Novillos', value: stats.byCategory.novillos, color: '#3b82f6' },
    { name: 'Novillas', value: stats.byCategory.novillas, color: '#8b5cf6' },
    { name: 'Terneros', value: stats.byCategory.terneros, color: '#10b981' },
    { name: 'Terneras', value: stats.byCategory.terneras, color: '#f59e0b' },
    { name: 'Toros', value: stats.byCategory.toros, color: '#ef4444' },
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Livestock */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Beef className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalLivestock}</p>
              <p className="text-sm text-gray-500">Total Animales</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.bySpecies)
                .filter(([_, count]) => count > 0)
                .slice(0, 3)
                .map(([species, count]) => (
                  <span
                    key={species}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                    style={{
                      backgroundColor: `${SPECIES_COLORS[species as keyof typeof SPECIES_COLORS]}20`,
                      color: SPECIES_COLORS[species as keyof typeof SPECIES_COLORS],
                    }}
                  >
                    {count} {speciesLabels[species]?.toLowerCase()}
                  </span>
                ))}
            </div>
          </div>
        </div>

        {/* Health Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.healthyPercentage}%</p>
              <p className="text-sm text-gray-500">Salud General</p>
            </div>
          </div>
          {stats.pendingHealthActions > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {stats.pendingHealthActions} acciones pendientes
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Milk Production */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-100 rounded-lg">
              <Droplets className="w-6 h-6 text-cyan-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.monthlyMilkProduction.toLocaleString()} L
              </p>
              <p className="text-sm text-gray-500">Produccion Mensual</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-cyan-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">
                ~{Math.round(stats.monthlyMilkProduction / 30)} L/dia promedio
              </span>
            </div>
          </div>
        </div>

        {/* Potreros & Births */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <MapPin className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.activePotrerosCount}</p>
              <p className="text-sm text-gray-500">Potreros Activos</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-pink-600">
              <Baby className="w-4 h-4" />
              <span className="text-sm font-medium">
                {stats.recentBirths} nacimientos recientes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Production Trends Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Tendencias de Produccion
            </h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(value, name) => {
                    const labels: Record<string, string> = {
                      milk: 'Leche (L)',
                      births: 'Nacimientos',
                      sales: 'Ventas',
                    };
                    return [value ?? 0, labels[String(name)] || String(name)];
                  }}
                />
                <Legend
                  formatter={(value) => {
                    const labels: Record<string, string> = {
                      milk: 'Leche (L)',
                      births: 'Nacimientos',
                      sales: 'Ventas',
                    };
                    return labels[value] || value;
                  }}
                />
                <Bar dataKey="milk" fill="#06b6d4" name="milk" radius={[4, 4, 0, 0]} />
                <Bar dataKey="births" fill="#ec4899" name="births" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sales" fill="#10b981" name="sales" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Species Distribution Pie Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Heart className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Distribucion por Especie
            </h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={speciesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                  labelLine={{ stroke: '#6b7280', strokeWidth: 1 }}
                >
                  {speciesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(value) => [`${value ?? 0} animales`, 'Cantidad']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bovine Categories (if bovines exist) */}
      {stats.bySpecies.bovine > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Beef className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Categorias de Bovinos
            </h3>
            <span className="ml-auto text-sm text-gray-500">
              {stats.bySpecies.bovine} animales
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categoryData.map((category) => (
              <div
                key={category.name}
                className="text-center p-4 rounded-lg"
                style={{ backgroundColor: `${category.color}10` }}
              >
                <p
                  className="text-3xl font-bold"
                  style={{ color: category.color }}
                >
                  {category.value}
                </p>
                <p className="text-sm text-gray-600 mt-1">{category.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
