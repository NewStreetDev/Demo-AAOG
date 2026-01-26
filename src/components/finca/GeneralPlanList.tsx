import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import type { GeneralPlan, PlanStatus, PlanPriority } from '../../types/finca.types';
import GeneralPlanCard from './GeneralPlanCard';

interface GeneralPlanListProps {
  plans: GeneralPlan[];
  onPlanClick: (plan: GeneralPlan) => void;
  showFilters?: boolean;
}

const statusFilters: { value: PlanStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'in_progress', label: 'En Progreso' },
  { value: 'completed', label: 'Completados' },
  { value: 'cancelled', label: 'Cancelados' },
];

const priorityFilters: { value: PlanPriority | 'all'; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'high', label: 'Alta' },
  { value: 'medium', label: 'Media' },
  { value: 'low', label: 'Baja' },
];

export default function GeneralPlanList({
  plans,
  onPlanClick,
  showFilters = true,
}: GeneralPlanListProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PlanStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<PlanPriority | 'all'>('all');

  const filteredPlans = plans.filter(plan => {
    const matchesSearch =
      plan.title.toLowerCase().includes(search.toLowerCase()) ||
      (plan.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === 'all' || plan.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || plan.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Count by status
  const pendingCount = plans.filter(p => p.status === 'pending').length;
  const inProgressCount = plans.filter(p => p.status === 'in_progress').length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {showFilters && (
        <div className="p-4 border-b border-gray-100 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar plan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-500 flex-shrink-0">Estado:</span>
              {statusFilters.map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                  className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                    statusFilter === filter.value
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs text-gray-500 flex-shrink-0">Prioridad:</span>
              {priorityFilters.map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setPriorityFilter(filter.value)}
                  className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                    priorityFilter === filter.value
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">
            {filteredPlans.length} planes encontrados
          </span>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-amber-600">
              {pendingCount} pendientes
            </span>
            <span className="text-blue-600">
              {inProgressCount} en progreso
            </span>
          </div>
        </div>

        {filteredPlans.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No se encontraron planes</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPlans.map(plan => (
              <GeneralPlanCard
                key={plan.id}
                plan={plan}
                onClick={() => onPlanClick(plan)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
