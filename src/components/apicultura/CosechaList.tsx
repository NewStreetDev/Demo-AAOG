import { useState, useMemo } from 'react';
import {
  Calendar,
  MapPin,
  User,
  Droplet,
  Package,
  Search,
  Filter,
  Star,
} from 'lucide-react';
import type { Cosecha } from '../../types/apicultura.types';

interface CosechaListProps {
  cosechas: Cosecha[];
  onCosechaClick?: (cosecha: Cosecha) => void;
  showFilters?: boolean;
  showTotals?: boolean;
  compact?: boolean;
  title?: string;
}

const productTypeConfig: Record<string, { label: string; color: string; bgColor: string; icon: typeof Droplet }> = {
  honey: {
    label: 'Miel',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    icon: Droplet,
  },
  wax: {
    label: 'Cera',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    icon: Package,
  },
  royal_jelly: {
    label: 'Jalea Real',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    icon: Droplet,
  },
  propolis: {
    label: 'Propoleo',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    icon: Package,
  },
  pollen: {
    label: 'Polen',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    icon: Package,
  },
  hives: {
    label: 'Colmenas',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    icon: Package,
  },
};

const qualityConfig: Record<string, { label: string; color: string }> = {
  A: { label: 'A', color: 'text-green-600 bg-green-100' },
  B: { label: 'B', color: 'text-blue-600 bg-blue-100' },
  C: { label: 'C', color: 'text-amber-600 bg-amber-100' },
};

export default function CosechaList({
  cosechas,
  onCosechaClick,
  showFilters = true,
  showTotals = true,
  compact = false,
  title = 'Registro de Cosechas',
}: CosechaListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<string>('all');

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

  // Calculate totals by product type
  const totals = useMemo(() => {
    const result: Record<string, { quantity: number; unit: string }> = {};
    cosechas.forEach(c => {
      if (!result[c.productType]) {
        result[c.productType] = { quantity: 0, unit: c.unit };
      }
      result[c.productType].quantity += c.quantity;
    });
    return result;
  }, [cosechas]);

  // Filter records
  const filteredCosechas = cosechas.filter(cosecha => {
    const matchesSearch =
      searchTerm === '' ||
      cosecha.apiarioName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cosecha.colmenaCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cosecha.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cosecha.notes?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesProduct = selectedProduct === 'all' || cosecha.productType === selectedProduct;

    return matchesSearch && matchesProduct;
  });

  if (cosechas.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Droplet className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <Droplet className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No hay cosechas registradas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-amber-100 rounded-lg">
          <Droplet className="w-5 h-5 text-amber-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className="ml-auto text-sm text-gray-500">
          {filteredCosechas.length} cosecha{filteredCosechas.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Totals Summary */}
      {showTotals && Object.keys(totals).length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
          {Object.entries(totals).map(([productType, data]) => {
            const productInfo = productTypeConfig[productType] || {
              label: productType,
              color: 'text-gray-600',
              bgColor: 'bg-gray-100',
            };
            return (
              <div key={productType} className={`p-2 rounded-lg ${productInfo.bgColor}`}>
                <p className={`text-xs font-medium ${productInfo.color}`}>{productInfo.label}</p>
                <p className={`text-lg font-bold ${productInfo.color}`}>
                  {data.quantity} <span className="text-xs">{data.unit}</span>
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por apiario, colmena..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white appearance-none cursor-pointer"
            >
              <option value="all">Todos los productos</option>
              <option value="honey">Miel</option>
              <option value="wax">Cera</option>
              <option value="royal_jelly">Jalea Real</option>
              <option value="propolis">Propoleo</option>
              <option value="pollen">Polen</option>
              <option value="hives">Colmenas</option>
            </select>
          </div>
        </div>
      )}

      {/* Records List */}
      <div className={`space-y-3 ${!compact ? 'max-h-[500px]' : 'max-h-[300px]'} overflow-y-auto`}>
        {filteredCosechas.map((cosecha) => {
          const productInfo = productTypeConfig[cosecha.productType] || {
            label: cosecha.productType,
            color: 'text-gray-600',
            bgColor: 'bg-gray-100',
            icon: Package,
          };
          const ProductIcon = productInfo.icon;
          const qualityInfo = cosecha.quality ? qualityConfig[cosecha.quality] : null;

          return (
            <div
              key={cosecha.id}
              onClick={() => onCosechaClick?.(cosecha)}
              className="p-4 rounded-lg border border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`p-2 rounded-lg ${productInfo.bgColor}`}>
                    <ProductIcon className={`w-4 h-4 ${productInfo.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${productInfo.bgColor} ${productInfo.color}`}>
                        {productInfo.label}
                      </span>
                      {qualityInfo && (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${qualityInfo.color}`}>
                          <Star className="w-3 h-3" />
                          {qualityInfo.label}
                        </span>
                      )}
                    </div>
                    <p className={`text-lg font-bold ${productInfo.color}`}>
                      {cosecha.quantity} {cosecha.unit}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(cosecha.date)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {cosecha.apiarioName}
                        {cosecha.colmenaCode && ` - ${cosecha.colmenaCode}`}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {cosecha.performedBy}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCosechas.length === 0 && cosechas.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No se encontraron cosechas con los filtros aplicados</p>
        </div>
      )}
    </div>
  );
}
