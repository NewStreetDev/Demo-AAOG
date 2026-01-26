import { useState } from 'react';
import {
  Calendar,
  Tag,
  Syringe,
  Pill,
  Bug,
  ClipboardCheck,
  Scissors,
  Stethoscope,
  Search,
  Filter,
  DollarSign,
} from 'lucide-react';
import type { HealthRecord } from '../../types/pecuario.types';

interface HealthRecordListProps {
  healthRecords: HealthRecord[];
  onRecordClick?: (record: HealthRecord) => void;
  showFilters?: boolean;
  compact?: boolean;
}

const typeConfig: Record<string, { label: string; color: string; bgColor: string; icon: typeof Syringe }> = {
  vaccination: {
    label: 'Vacunacion',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    icon: Syringe,
  },
  treatment: {
    label: 'Tratamiento',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    icon: Pill,
  },
  deworming: {
    label: 'Desparasitacion',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    icon: Bug,
  },
  checkup: {
    label: 'Revision',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    icon: ClipboardCheck,
  },
  surgery: {
    label: 'Cirugia',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    icon: Scissors,
  },
};

export default function HealthRecordList({
  healthRecords,
  onRecordClick,
  showFilters = true,
  compact = false,
}: HealthRecordListProps) {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Filter records
  const filteredRecords = healthRecords.filter(record => {
    const matchesSearch =
      searchTerm === '' ||
      record.livestockTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.medication?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.veterinarian?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'all' || record.type === selectedType;

    return matchesSearch && matchesType;
  });

  if (healthRecords.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Stethoscope className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Historial de Salud</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <Stethoscope className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No hay registros de salud</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Stethoscope className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Historial de Salud</h3>
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
              placeholder="Buscar por arete, descripcion..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white appearance-none cursor-pointer"
            >
              <option value="all">Todos los tipos</option>
              <option value="vaccination">Vacunacion</option>
              <option value="treatment">Tratamiento</option>
              <option value="deworming">Desparasitacion</option>
              <option value="checkup">Revision</option>
              <option value="surgery">Cirugia</option>
            </select>
          </div>
        </div>
      )}

      {/* Records List */}
      <div className={`space-y-3 ${!compact ? 'max-h-[500px]' : 'max-h-[300px]'} overflow-y-auto`}>
        {filteredRecords.map((record) => {
          const typeInfo = typeConfig[record.type] || {
            label: record.type,
            color: 'text-gray-600',
            bgColor: 'bg-gray-100',
            icon: Stethoscope,
          };
          const TypeIcon = typeInfo.icon;

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
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${typeInfo.bgColor} ${typeInfo.color}`}>
                        {typeInfo.label}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <Tag className="w-3 h-3" />
                        {record.livestockTag}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {record.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(record.date)}
                      </span>
                      {record.medication && (
                        <span className="inline-flex items-center gap-1">
                          <Pill className="w-3 h-3" />
                          {record.medication}
                          {record.dosage && ` (${record.dosage})`}
                        </span>
                      )}
                      {record.cost && (
                        <span className="inline-flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {formatCurrency(record.cost)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {record.veterinarian && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    Veterinario: <span className="font-medium text-gray-700">{record.veterinarian}</span>
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredRecords.length === 0 && healthRecords.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No se encontraron registros con los filtros aplicados</p>
        </div>
      )}
    </div>
  );
}
