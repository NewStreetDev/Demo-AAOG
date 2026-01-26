import { useState } from 'react';
import {
  Calendar,
  MapPin,
  User,
  Pill,
  Package,
  Utensils,
  Crown,
  Heart,
  Search,
  Filter,
  ClipboardList,
} from 'lucide-react';
import type { AccionApicultura } from '../../types/apicultura.types';

interface AccionListProps {
  acciones: AccionApicultura[];
  onAccionClick?: (accion: AccionApicultura) => void;
  showFilters?: boolean;
  compact?: boolean;
  title?: string;
}

const typeConfig: Record<string, { label: string; color: string; bgColor: string; icon: typeof Pill }> = {
  medication: {
    label: 'Medicamentos',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    icon: Pill,
  },
  panel_change: {
    label: 'Cambio Panales',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    icon: Package,
  },
  feeding: {
    label: 'Alimentacion',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    icon: Utensils,
  },
  revision: {
    label: 'Revision',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    icon: Calendar,
  },
  queen_change: {
    label: 'Cambio Reinas',
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
    icon: Crown,
  },
  reproduction: {
    label: 'Reproduccion',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    icon: Heart,
  },
  harvest: {
    label: 'Cosecha',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    icon: Package,
  },
};

export default function AccionList({
  acciones,
  onAccionClick,
  showFilters = true,
  compact = false,
  title = 'Registro de Acciones',
}: AccionListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const today = new Date();
    const diffTime = today.getTime() - d.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} dias`;

    return d.toLocaleDateString('es-CR', {
      day: 'numeric',
      month: 'short',
      year: d.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    });
  };

  // Filter records
  const filteredAcciones = acciones.filter(accion => {
    const matchesSearch =
      searchTerm === '' ||
      accion.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      accion.apiarioName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      accion.colmenaCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      accion.performedBy.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'all' || accion.type === selectedType;

    return matchesSearch && matchesType;
  });

  if (acciones.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-100 rounded-lg">
            <ClipboardList className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No hay acciones registradas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-amber-100 rounded-lg">
          <ClipboardList className="w-5 h-5 text-amber-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className="ml-auto text-sm text-gray-500">
          {filteredAcciones.length} accion{filteredAcciones.length !== 1 ? 'es' : ''}
        </span>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por descripcion, apiario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white appearance-none cursor-pointer"
            >
              <option value="all">Todos los tipos</option>
              <option value="medication">Medicamentos</option>
              <option value="panel_change">Cambio Panales</option>
              <option value="feeding">Alimentacion</option>
              <option value="queen_change">Cambio Reinas</option>
              <option value="reproduction">Reproduccion</option>
            </select>
          </div>
        </div>
      )}

      {/* Records List */}
      <div className={`space-y-3 ${!compact ? 'max-h-[500px]' : 'max-h-[300px]'} overflow-y-auto`}>
        {filteredAcciones.map((accion) => {
          const typeInfo = typeConfig[accion.type] || {
            label: accion.type,
            color: 'text-gray-600',
            bgColor: 'bg-gray-100',
            icon: ClipboardList,
          };
          const TypeIcon = typeInfo.icon;

          return (
            <div
              key={accion.id}
              onClick={() => onAccionClick?.(accion)}
              className="p-4 rounded-lg border border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`p-2 rounded-lg ${typeInfo.bgColor}`}>
                    <TypeIcon className={`w-4 h-4 ${typeInfo.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${typeInfo.bgColor} ${typeInfo.color}`}>
                        {typeInfo.label}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {accion.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(accion.date)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {accion.apiarioName}
                        {accion.colmenaCode && ` - ${accion.colmenaCode}`}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {accion.performedBy}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAcciones.length === 0 && acciones.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No se encontraron acciones con los filtros aplicados</p>
        </div>
      )}
    </div>
  );
}
