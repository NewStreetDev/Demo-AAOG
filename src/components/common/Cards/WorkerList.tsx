import { ChevronRight } from 'lucide-react';
import type { WorkerSummary } from '../../../types/dashboard.types';

interface WorkerListProps {
  workers: WorkerSummary[];
}

const avatarGradients = [
  'from-emerald-400 to-green-600',
  'from-blue-400 to-blue-600',
  'from-purple-400 to-purple-600',
  'from-orange-400 to-orange-600',
  'from-pink-400 to-pink-600',
];

export default function WorkerList({ workers }: WorkerListProps) {
  return (
    <div className="card p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">
            Mis Trabajadores
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {workers.filter(w => w.status === 'active').length} activos
          </p>
        </div>
        <button className="btn-ghost text-xs gap-1.5 px-3 py-2">
          Ver Todos
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Worker list */}
      <div className="space-y-2.5">
        {workers.map((worker, index) => {
          const initials = worker.name.split(' ').map(n => n[0]).join('').substring(0, 2);
          const gradient = avatarGradients[index % avatarGradients.length];
          const isActive = worker.status === 'active';

          return (
            <div
              key={worker.id}
              className="group relative flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-pointer animate-slide-up"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              {/* Avatar with gradient and ring */}
              <div className="relative flex-shrink-0">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                >
                  {initials}
                </div>

                {/* Active status indicator */}
                {isActive && (
                  <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full ring-2 ring-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  </div>
                )}

                {/* Glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate group-hover:text-gray-950 transition-colors">
                  {worker.name}
                </p>
                <p className="text-xs font-medium text-gray-500 mt-0.5 truncate">
                  {worker.role}
                </p>
              </div>

              {/* Status badge */}
              <div className="flex-shrink-0">
                {isActive ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-bold ring-1 ring-green-200/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Activo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold ring-1 ring-gray-200/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    Inactivo
                  </span>
                )}
              </div>

              {/* Hover indicator */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
