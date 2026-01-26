import { useState, useMemo } from 'react';
import {
  Calendar,
  Droplets,
  Search,
  Filter,
  Sun,
  Moon,
  TrendingUp,
  Award,
  Thermometer,
} from 'lucide-react';
import type { MilkProduction } from '../../types/pecuario.types';

interface MilkProductionListProps {
  milkProduction: MilkProduction[];
  onRecordClick?: (record: MilkProduction) => void;
  showFilters?: boolean;
  compact?: boolean;
}

const shiftConfig: Record<string, { label: string; color: string; bgColor: string; icon: typeof Sun }> = {
  morning: {
    label: 'Manana',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    icon: Sun,
  },
  afternoon: {
    label: 'Tarde',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    icon: Moon,
  },
};

const qualityConfig: Record<string, { color: string; bgColor: string }> = {
  A: { color: 'text-green-600', bgColor: 'bg-green-100' },
  B: { color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  C: { color: 'text-red-600', bgColor: 'bg-red-100' },
};

export default function MilkProductionList({
  milkProduction,
  onRecordClick,
  showFilters = true,
  compact = false,
}: MilkProductionListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShift, setSelectedShift] = useState<string>('all');

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
  const filteredRecords = milkProduction.filter(record => {
    const matchesSearch =
      searchTerm === '' ||
      record.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatDate(record.date).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesShift = selectedShift === 'all' || record.shift === selectedShift;

    return matchesSearch && matchesShift;
  });

  // Calculate totals for filtered records
  const totals = useMemo(() => {
    const totalLiters = filteredRecords.reduce((sum, r) => sum + r.totalLiters, 0);
    const totalCows = filteredRecords.reduce((sum, r) => sum + r.cowsMilked, 0);
    const avgPerCow = totalCows > 0 ? totalLiters / totalCows : 0;
    const recordCount = filteredRecords.length;

    return { totalLiters, totalCows, avgPerCow, recordCount };
  }, [filteredRecords]);

  if (milkProduction.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Droplets className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Produccion de Leche</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <Droplets className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No hay registros de produccion</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Droplets className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Produccion de Leche</h3>
        <span className="ml-auto text-sm text-gray-500">
          {filteredRecords.length} registro{filteredRecords.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <Droplets className="w-4 h-4 text-blue-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-blue-700">{totals.totalLiters.toLocaleString()} L</p>
          <p className="text-xs text-blue-600">Total</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <TrendingUp className="w-4 h-4 text-green-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-green-700">{totals.avgPerCow.toFixed(2)} L</p>
          <p className="text-xs text-green-600">Promedio/vaca</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <Calendar className="w-4 h-4 text-purple-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-purple-700">{totals.recordCount}</p>
          <p className="text-xs text-purple-600">Ordenos</p>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por fecha o notas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white appearance-none cursor-pointer"
            >
              <option value="all">Todos los turnos</option>
              <option value="morning">Manana</option>
              <option value="afternoon">Tarde</option>
            </select>
          </div>
        </div>
      )}

      {/* Records List */}
      <div className={`space-y-3 ${!compact ? 'max-h-[400px]' : 'max-h-[300px]'} overflow-y-auto`}>
        {filteredRecords.map((record) => {
          const shiftInfo = shiftConfig[record.shift] || {
            label: record.shift,
            color: 'text-gray-600',
            bgColor: 'bg-gray-100',
            icon: Sun,
          };
          const ShiftIcon = shiftInfo.icon;
          const qualityInfo = record.quality ? qualityConfig[record.quality] : null;

          return (
            <div
              key={record.id}
              onClick={() => onRecordClick?.(record)}
              className="p-4 rounded-lg border border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`p-2 rounded-lg ${shiftInfo.bgColor}`}>
                    <ShiftIcon className={`w-4 h-4 ${shiftInfo.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${shiftInfo.bgColor} ${shiftInfo.color}`}>
                        {shiftInfo.label}
                      </span>
                      {qualityInfo && (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${qualityInfo.bgColor} ${qualityInfo.color}`}>
                          <Award className="w-3 h-3" />
                          {record.quality}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {record.totalLiters.toLocaleString()} litros
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(record.date)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        {record.cowsMilked} vacas
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {record.avgPerCow.toFixed(2)} L/vaca
                      </span>
                      {record.temperature !== undefined && (
                        <span className="inline-flex items-center gap-1">
                          <Thermometer className="w-3 h-3" />
                          {record.temperature.toFixed(1)}C
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Total Liters Badge */}
                <div className="text-center px-3 py-2 bg-blue-50 rounded-lg">
                  <p className="text-lg font-bold text-blue-700">
                    {record.totalLiters}
                  </p>
                  <p className="text-xs text-blue-600">L</p>
                </div>
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

      {filteredRecords.length === 0 && milkProduction.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No se encontraron registros con los filtros aplicados</p>
        </div>
      )}
    </div>
  );
}
