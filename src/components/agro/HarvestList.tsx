import { useState, useMemo } from 'react';
import {
  Calendar,
  MapPin,
  User,
  Package,
  Search,
  Filter,
  Star,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import type { Harvest } from '../../types/agro.types';

interface HarvestListProps {
  harvests: Harvest[];
  onHarvestClick?: (harvest: Harvest) => void;
  showFilters?: boolean;
  showTotals?: boolean;
  compact?: boolean;
  title?: string;
}

const qualityConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  A: { label: 'A', color: 'text-green-600', bgColor: 'bg-green-100' },
  B: { label: 'B', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  C: { label: 'C', color: 'text-amber-600', bgColor: 'bg-amber-100' },
};

const destinationConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  sale: { label: 'Venta', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
  processing: { label: 'Procesamiento', color: 'text-purple-600', bgColor: 'bg-purple-100' },
  storage: { label: 'Almacenamiento', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  seeds: { label: 'Semillas', color: 'text-amber-600', bgColor: 'bg-amber-100' },
};

export default function HarvestList({
  harvests,
  onHarvestClick,
  showFilters = true,
  showTotals = true,
  compact = false,
  title = 'Registro de Cosechas',
}: HarvestListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuality, setSelectedQuality] = useState<string>('all');

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

  // Calculate totals by crop
  const totals = useMemo(() => {
    const byType: Record<string, { quantity: number; unit: string; value: number }> = {};
    let totalValue = 0;

    harvests.forEach(h => {
      const key = h.cropName || 'Desconocido';
      if (!byType[key]) {
        byType[key] = { quantity: 0, unit: h.unit, value: 0 };
      }
      byType[key].quantity += h.quantity;
      byType[key].value += h.totalValue || 0;
      totalValue += h.totalValue || 0;
    });

    return { byType, totalValue };
  }, [harvests]);

  // Filter records
  const filteredHarvests = harvests.filter(harvest => {
    const matchesSearch =
      searchTerm === '' ||
      harvest.cropName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      harvest.loteName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      harvest.harvestedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      harvest.notes?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesQuality = selectedQuality === 'all' || harvest.quality === selectedQuality;

    return matchesSearch && matchesQuality;
  });

  if (harvests.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <Package className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No hay cosechas registradas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-green-100 rounded-lg">
          <Package className="w-5 h-5 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className="ml-auto text-sm text-gray-500">
          {filteredHarvests.length} cosecha{filteredHarvests.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Totals Summary */}
      {showTotals && Object.keys(totals.byType).length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-3 bg-gray-50 rounded-lg">
            {Object.entries(totals.byType).map(([crop, data]) => (
              <div key={crop} className="p-2 rounded-lg bg-green-100">
                <p className="text-xs font-medium text-green-600 truncate">{crop}</p>
                <p className="text-lg font-bold text-green-600">
                  {data.quantity.toLocaleString()} <span className="text-xs">{data.unit}</span>
                </p>
              </div>
            ))}
          </div>
          {totals.totalValue > 0 && (
            <div className="mt-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">Valor Total</span>
              </div>
              <span className="text-xl font-bold text-emerald-700">
                {formatCurrency(totals.totalValue)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por cultivo, lote..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedQuality}
              onChange={(e) => setSelectedQuality(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 bg-white appearance-none cursor-pointer"
            >
              <option value="all">Todas las calidades</option>
              <option value="A">Calidad A</option>
              <option value="B">Calidad B</option>
              <option value="C">Calidad C</option>
            </select>
          </div>
        </div>
      )}

      {/* Records List */}
      <div className={`space-y-3 ${!compact ? 'max-h-[500px]' : 'max-h-[300px]'} overflow-y-auto`}>
        {filteredHarvests.map((harvest) => {
          const qualityInfo = qualityConfig[harvest.quality] || {
            label: harvest.quality,
            color: 'text-gray-600',
            bgColor: 'bg-gray-100',
          };
          const destinationInfo = destinationConfig[harvest.destination] || {
            label: harvest.destination,
            color: 'text-gray-600',
            bgColor: 'bg-gray-100',
          };

          return (
            <div
              key={harvest.id}
              onClick={() => onHarvestClick?.(harvest)}
              className="p-4 rounded-lg border border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="p-2 rounded-lg bg-green-100">
                    <Package className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-600">
                        {harvest.cropName}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${qualityInfo.bgColor} ${qualityInfo.color}`}>
                        <Star className="w-3 h-3" />
                        {qualityInfo.label}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${destinationInfo.bgColor} ${destinationInfo.color}`}>
                        {destinationInfo.label}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-green-600">
                      {harvest.quantity.toLocaleString()} {harvest.unit}
                    </p>
                    {harvest.totalValue && (
                      <p className="text-sm font-medium text-emerald-600 flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {formatCurrency(harvest.totalValue)}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(harvest.date)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {harvest.loteName}
                      </span>
                      {harvest.harvestedBy && (
                        <span className="inline-flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {harvest.harvestedBy}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredHarvests.length === 0 && harvests.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No se encontraron cosechas con los filtros aplicados</p>
        </div>
      )}
    </div>
  );
}
