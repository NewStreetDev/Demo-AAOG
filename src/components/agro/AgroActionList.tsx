import { useState } from 'react';
import {
  Calendar,
  MapPin,
  User,
  Droplet,
  Leaf,
  Scissors,
  Bug,
  Sprout,
  Tractor,
  Package,
  Search,
  Filter,
  ClipboardList,
  DollarSign,
} from 'lucide-react';
import type { AgroAction } from '../../types/agro.types';

interface AgroActionListProps {
  actions: AgroAction[];
  onActionClick?: (action: AgroAction) => void;
  showFilters?: boolean;
  compact?: boolean;
  title?: string;
}

const typeConfig: Record<string, { label: string; color: string; bgColor: string; icon: typeof Droplet }> = {
  planting: {
    label: 'Siembra',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    icon: Sprout,
  },
  irrigation: {
    label: 'Riego',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    icon: Droplet,
  },
  fertilization: {
    label: 'Fertilizacion',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    icon: Leaf,
  },
  pesticide: {
    label: 'Pesticidas',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    icon: Bug,
  },
  weeding: {
    label: 'Deshierbe',
    color: 'text-lime-600',
    bgColor: 'bg-lime-100',
    icon: Scissors,
  },
  pruning: {
    label: 'Poda',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    icon: Scissors,
  },
  harvest: {
    label: 'Cosecha',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    icon: Package,
  },
  soil_preparation: {
    label: 'Prep. Suelo',
    color: 'text-stone-600',
    bgColor: 'bg-stone-100',
    icon: Tractor,
  },
};

export default function AgroActionList({
  actions,
  onActionClick,
  showFilters = true,
  compact = false,
  title = 'Registro de Acciones',
}: AgroActionListProps) {
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Filter records
  const filteredActions = actions.filter(action => {
    const matchesSearch =
      searchTerm === '' ||
      action.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.loteName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.cropName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.insumoUsed?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'all' || action.type === selectedType;

    return matchesSearch && matchesType;
  });

  if (actions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <ClipboardList className="w-5 h-5 text-green-600" />
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
        <div className="p-2 bg-green-100 rounded-lg">
          <ClipboardList className="w-5 h-5 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className="ml-auto text-sm text-gray-500">
          {filteredActions.length} accion{filteredActions.length !== 1 ? 'es' : ''}
        </span>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por descripcion, lote, cultivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white appearance-none cursor-pointer"
            >
              <option value="all">Todos los tipos</option>
              <option value="planting">Siembra</option>
              <option value="irrigation">Riego</option>
              <option value="fertilization">Fertilizacion</option>
              <option value="pesticide">Pesticidas</option>
              <option value="weeding">Deshierbe</option>
              <option value="pruning">Poda</option>
              <option value="harvest">Cosecha</option>
              <option value="soil_preparation">Prep. Suelo</option>
            </select>
          </div>
        </div>
      )}

      {/* Records List */}
      <div className={`space-y-3 ${!compact ? 'max-h-[500px]' : 'max-h-[300px]'} overflow-y-auto`}>
        {filteredActions.map((action) => {
          const typeInfo = typeConfig[action.type] || {
            label: action.type,
            color: 'text-gray-600',
            bgColor: 'bg-gray-100',
            icon: ClipboardList,
          };
          const TypeIcon = typeInfo.icon;

          return (
            <div
              key={action.id}
              onClick={() => onActionClick?.(action)}
              className="p-4 rounded-lg border border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`p-2 rounded-lg ${typeInfo.bgColor}`}>
                    <TypeIcon className={`w-4 h-4 ${typeInfo.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${typeInfo.bgColor} ${typeInfo.color}`}>
                        {typeInfo.label}
                      </span>
                      {action.cost && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700">
                          <DollarSign className="w-3 h-3" />
                          {formatCurrency(action.cost)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {action.description}
                    </p>
                    {action.insumoUsed && (
                      <p className="text-xs text-gray-600 mt-1">
                        {action.insumoUsed}
                        {action.quantity && ` - ${action.quantity} ${action.unit}`}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(action.date)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {action.loteName}
                        {action.cropName && ` - ${action.cropName}`}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {action.performedBy}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredActions.length === 0 && actions.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No se encontraron acciones con los filtros aplicados</p>
        </div>
      )}
    </div>
  );
}
