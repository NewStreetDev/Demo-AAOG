import { MapPin, Calendar, Heart, ChevronRight } from 'lucide-react';
import type { Apiario } from '../../types/apicultura.types';

interface ApiarioCardProps {
  apiario: Apiario;
  onClick?: () => void;
}

function getHealthColor(health: number): string {
  if (health >= 9) return 'text-green-600 bg-green-100';
  if (health >= 7) return 'text-blue-600 bg-blue-100';
  if (health >= 5) return 'text-amber-600 bg-amber-100';
  return 'text-red-600 bg-red-100';
}

function getHealthLabel(health: number): string {
  if (health >= 9) return 'Excelente';
  if (health >= 7) return 'Buena';
  if (health >= 5) return 'Regular';
  return 'Crítica';
}

export default function ApiarioCard({ apiario, onClick }: ApiarioCardProps) {
  const healthColor = getHealthColor(apiario.healthAverage);
  const healthLabel = getHealthLabel(apiario.healthAverage);

  const formatDate = (date?: Date) => {
    if (!date) return 'Sin revisión';
    return new Date(date).toLocaleDateString('es-CR', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div
      className="card p-5 hover:shadow-lg transition-all duration-300 cursor-pointer animate-fade-in"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{apiario.name}</h3>
          <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
            <MapPin className="w-3.5 h-3.5" />
            <span>{apiario.location.address || 'Sin ubicación'}</span>
          </div>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            apiario.status === 'active'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {apiario.status === 'active' ? 'Activo' : 'Inactivo'}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-apicultura">{apiario.colmenasCount}</p>
          <p className="text-xs text-gray-500">Colmenas</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">{apiario.activeColmenas}</p>
          <p className="text-xs text-gray-500">Activas</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-amber-600">{apiario.production.honey}</p>
          <p className="text-xs text-gray-500">kg Miel</p>
        </div>
      </div>

      {/* Health and Last Revision */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-full ${healthColor}`}>
            <Heart className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Salud promedio</p>
            <p className="text-sm font-semibold">
              {apiario.healthAverage.toFixed(1)} - {healthLabel}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Calendar className="w-3.5 h-3.5" />
          <span className="text-xs">{formatDate(apiario.lastRevision)}</span>
        </div>
      </div>

      {/* View More */}
      <div className="flex justify-end mt-3">
        <button className="btn-ghost text-xs gap-1 px-2 py-1">
          Ver Detalles
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
