import { useState } from 'react';
import {
  Calendar,
  MapPin,
  User,
  Search,
  Filter,
  ClipboardCheck,
  Crown,
  Heart,
} from 'lucide-react';
import type { Revision } from '../../types/apicultura.types';

interface RevisionListProps {
  revisiones: Revision[];
  onRevisionClick?: (revision: Revision) => void;
  showFilters?: boolean;
  compact?: boolean;
  title?: string;
}

const typeLabels: Record<string, string> = {
  general: 'General',
  individual: 'Individual',
};

export default function RevisionList({
  revisiones,
  onRevisionClick,
  showFilters = true,
  compact = false,
  title = 'Historial de Revisiones',
}: RevisionListProps) {
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

  const getHealthColor = (value: number) => {
    if (value >= 8) return 'bg-green-100 text-green-700';
    if (value >= 6) return 'bg-blue-100 text-blue-700';
    if (value >= 4) return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  // Filter records
  const filteredRevisiones = revisiones.filter(revision => {
    const matchesSearch =
      searchTerm === '' ||
      revision.apiarioName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      revision.colmenaCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      revision.inspector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      revision.comments?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'all' || revision.type === selectedType;

    return matchesSearch && matchesType;
  });

  if (revisiones.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <ClipboardCheck className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <ClipboardCheck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No hay revisiones registradas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-purple-100 rounded-lg">
          <ClipboardCheck className="w-5 h-5 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className="ml-auto text-sm text-gray-500">
          {filteredRevisiones.length} revision{filteredRevisiones.length !== 1 ? 'es' : ''}
        </span>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por apiario, colmena, inspector..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white appearance-none cursor-pointer"
            >
              <option value="all">Todos los tipos</option>
              <option value="general">General (Apiario)</option>
              <option value="individual">Individual (Colmena)</option>
            </select>
          </div>
        </div>
      )}

      {/* Records List */}
      <div className={`space-y-3 ${!compact ? 'max-h-[500px]' : 'max-h-[300px]'} overflow-y-auto`}>
        {filteredRevisiones.map((revision) => (
          <div
            key={revision.id}
            onClick={() => onRevisionClick?.(revision)}
            className="p-4 rounded-lg border border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="p-2 rounded-lg bg-purple-100">
                  <ClipboardCheck className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
                      {typeLabels[revision.type]}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getHealthColor(revision.generalState)}`}>
                      Estado: {revision.generalState}/10
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getHealthColor(revision.sanity)}`}>
                      Sanidad: {revision.sanity}/10
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(revision.date)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {revision.apiarioName}
                      {revision.colmenaCode && ` - ${revision.colmenaCode}`}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {revision.inspector}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs">
                    <span className="inline-flex items-center gap-1 text-pink-600">
                      <Crown className="w-3 h-3" />
                      {revision.queenPresent ? 'Reina presente' : 'Sin reina'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-amber-600">
                      Madurez: {revision.honeyMaturity}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {revision.comments && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500 truncate">
                  {revision.comments}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredRevisiones.length === 0 && revisiones.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No se encontraron revisiones con los filtros aplicados</p>
        </div>
      )}
    </div>
  );
}
