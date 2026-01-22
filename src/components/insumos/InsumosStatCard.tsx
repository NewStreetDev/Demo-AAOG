import { Package, AlertTriangle, DollarSign, ArrowUpDown } from 'lucide-react';

interface InsumosStatCardProps {
  label: string;
  value: string | number;
  icon?: 'insumos' | 'stock' | 'valor' | 'movimientos';
  subValue?: string;
}

const iconComponents = {
  insumos: Package,
  stock: AlertTriangle,
  valor: DollarSign,
  movimientos: ArrowUpDown,
};

const iconColors = {
  insumos: 'bg-blue-100 text-blue-600',
  stock: 'bg-orange-100 text-orange-600',
  valor: 'bg-green-100 text-green-600',
  movimientos: 'bg-purple-100 text-purple-600',
};

export default function InsumosStatCard({
  label,
  value,
  icon = 'insumos',
  subValue,
}: InsumosStatCardProps) {
  const IconComponent = iconComponents[icon] || Package;
  const iconColor = iconColors[icon] || iconColors.insumos;

  return (
    <div className="card p-5 animate-fade-in hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {label}
          </p>
          <p className="text-3xl font-bold text-gray-900 tracking-tight">
            {value}
          </p>
          {subValue && (
            <p className="text-xs text-gray-500">{subValue}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${iconColor}`}>
          <IconComponent className="w-6 h-6" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}
