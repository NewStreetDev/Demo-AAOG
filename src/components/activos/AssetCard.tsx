import { MapPin, Calendar, User } from 'lucide-react';
import type { Asset } from '../../types/activos.types';

interface AssetCardProps {
  asset: Asset;
  onClick?: () => void;
}

function getStatusBadgeColor(status: Asset['status']): string {
  const colors = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-700',
    disposed: 'bg-red-100 text-red-700',
    under_maintenance: 'bg-amber-100 text-amber-700',
  };
  return colors[status] || colors.active;
}

function getStatusLabel(status: Asset['status']): string {
  const labels = {
    active: 'Activo',
    inactive: 'Inactivo',
    disposed: 'Dado de Baja',
    under_maintenance: 'En Mantenimiento',
  };
  return labels[status];
}

function getCategoryLabel(category: Asset['category']): string {
  const labels = {
    land: 'Terreno',
    building: 'Edificación',
    vehicle: 'Vehículo',
    machinery: 'Maquinaria',
    livestock: 'Semoviente',
    equipment: 'Equipo',
    other: 'Otro',
  };
  return labels[category];
}

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `₡${(value / 1000000).toFixed(1)}M`;
  }
  return `₡${(value / 1000).toFixed(0)}K`;
}

export default function AssetCard({ asset, onClick }: AssetCardProps) {
  const statusColor = getStatusBadgeColor(asset.status);
  const depreciation = asset.acquisitionCost > 0
    ? ((asset.accumulatedDepreciation / asset.acquisitionCost) * 100).toFixed(0)
    : '0';

  return (
    <div
      className="card p-5 hover:shadow-lg transition-all duration-300 cursor-pointer animate-fade-in"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-gray-400">{asset.code}</span>
          </div>
          <h3 className="font-bold text-gray-900 text-base truncate">
            {asset.name}
          </h3>
          <p className="text-sm text-gray-600 mt-0.5">{getCategoryLabel(asset.category)}</p>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColor} flex-shrink-0`}>
          {getStatusLabel(asset.status)}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>{asset.location}</span>
        </div>
        {asset.responsiblePerson && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4 text-gray-400" />
            <span>{asset.responsiblePerson}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>Adq: {new Date(asset.acquisitionDate).toLocaleDateString('es-CR', { month: 'short', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">Valor actual</span>
          <span className="text-sm font-bold text-gray-900">{formatCurrency(asset.currentValue)}</span>
        </div>
        {asset.depreciationMethod !== 'none' && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Depreciación</span>
            <span className="text-xs font-medium text-purple-600">{depreciation}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
