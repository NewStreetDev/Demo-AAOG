import { useState } from 'react';
import {
  Calendar,
  Tag,
  Heart,
  Baby,
  Search,
  Filter,
  Syringe,
  Clock,
  CheckCircle,
  XCircle,
  CircleDot,
} from 'lucide-react';
import type { ReproductionRecord } from '../../types/pecuario.types';

interface ReproductionListProps {
  reproductionRecords: ReproductionRecord[];
  onRecordClick?: (record: ReproductionRecord) => void;
  showFilters?: boolean;
  compact?: boolean;
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: typeof Clock }> = {
  pending: {
    label: 'Pendiente',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    icon: Clock,
  },
  confirmed: {
    label: 'Confirmado',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    icon: CheckCircle,
  },
  failed: {
    label: 'Fallido',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    icon: XCircle,
  },
  born: {
    label: 'Nacido',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    icon: Baby,
  },
};

const typeConfig: Record<string, { label: string; color: string; bgColor: string; icon: typeof Heart }> = {
  natural: {
    label: 'Monta natural',
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
    icon: Heart,
  },
  artificial_insemination: {
    label: 'Inseminacion',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    icon: Syringe,
  },
};

export default function ReproductionList({
  reproductionRecords,
  onRecordClick,
  showFilters = true,
  compact = false,
}: ReproductionListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

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

  const calculateDaysUntilBirth = (record: ReproductionRecord) => {
    if (!record.expectedBirthDate || record.status === 'born' || record.status === 'failed') {
      return null;
    }
    const today = new Date();
    const expected = new Date(record.expectedBirthDate);
    const diffTime = expected.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Filter records
  const filteredRecords = reproductionRecords.filter(record => {
    const matchesSearch =
      searchTerm === '' ||
      record.cowTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.bullTag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.calfTag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.notes?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  if (reproductionRecords.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-pink-100 rounded-lg">
            <Heart className="w-5 h-5 text-pink-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Reproduccion</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No hay registros de reproduccion</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-pink-100 rounded-lg">
          <Heart className="w-5 h-5 text-pink-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Reproduccion</h3>
        <span className="ml-auto text-sm text-gray-500">
          {filteredRecords.length} registro{filteredRecords.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por arete..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white appearance-none cursor-pointer"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="confirmed">Confirmado</option>
              <option value="failed">Fallido</option>
              <option value="born">Nacido</option>
            </select>
          </div>
        </div>
      )}

      {/* Records List */}
      <div className={`space-y-3 ${!compact ? 'max-h-[500px]' : 'max-h-[300px]'} overflow-y-auto`}>
        {filteredRecords.map((record) => {
          const statusInfo = statusConfig[record.status] || {
            label: record.status,
            color: 'text-gray-600',
            bgColor: 'bg-gray-100',
            icon: CircleDot,
          };
          const StatusIcon = statusInfo.icon;

          const typeInfo = typeConfig[record.type] || {
            label: record.type,
            color: 'text-gray-600',
            bgColor: 'bg-gray-100',
            icon: Heart,
          };
          const TypeIcon = typeInfo.icon;

          const daysUntilBirth = calculateDaysUntilBirth(record);

          return (
            <div
              key={record.id}
              onClick={() => onRecordClick?.(record)}
              className="p-4 rounded-lg border border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`p-2 rounded-lg ${typeInfo.bgColor}`}>
                    <TypeIcon className={`w-4 h-4 ${typeInfo.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <Tag className="w-3 h-3" />
                        {record.cowTag}
                      </span>
                      {record.bullTag && (
                        <span className="inline-flex items-center gap-1 text-xs text-blue-600">
                          + {record.bullTag}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {typeInfo.label}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(record.serviceDate)}
                      </span>
                      {record.calfTag && (
                        <span className="inline-flex items-center gap-1 text-green-600">
                          <Baby className="w-3 h-3" />
                          {record.calfTag}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Days until birth */}
                {daysUntilBirth !== null && (
                  <div className={`text-center px-3 py-2 rounded-lg ${
                    daysUntilBirth <= 7 ? 'bg-amber-100' : 'bg-blue-50'
                  }`}>
                    <p className={`text-lg font-bold ${
                      daysUntilBirth <= 7 ? 'text-amber-700' : 'text-blue-700'
                    }`}>
                      {daysUntilBirth > 0 ? daysUntilBirth : 'Hoy'}
                    </p>
                    <p className={`text-xs ${
                      daysUntilBirth <= 7 ? 'text-amber-600' : 'text-blue-600'
                    }`}>
                      {daysUntilBirth > 0 ? 'dias' : 'parto'}
                    </p>
                  </div>
                )}
              </div>
              {record.notes && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500 line-clamp-1">
                    {record.notes}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredRecords.length === 0 && reproductionRecords.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No se encontraron registros con los filtros aplicados</p>
        </div>
      )}
    </div>
  );
}
