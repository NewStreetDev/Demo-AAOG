import { Beef, Heart, Milk, TreePine } from 'lucide-react';

interface PecuarioStatCardProps {
  label: string;
  value: string | number;
  icon?: 'livestock' | 'health' | 'milk' | 'potreros';
  subValue?: string;
}

const iconComponents = {
  livestock: Beef,
  health: Heart,
  milk: Milk,
  potreros: TreePine,
};

const iconColors = {
  livestock: 'bg-blue-100 text-blue-600',
  health: 'bg-green-100 text-green-600',
  milk: 'bg-purple-100 text-purple-600',
  potreros: 'bg-emerald-100 text-emerald-600',
};

export default function PecuarioStatCard({
  label,
  value,
  icon = 'livestock',
  subValue,
}: PecuarioStatCardProps) {
  const IconComponent = iconComponents[icon] || Beef;
  const iconColor = iconColors[icon] || iconColors.livestock;

  return (
    <div className="card p-5 animate-fade-in hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between">
        {/* Content */}
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

        {/* Icon */}
        <div className={`p-3 rounded-xl ${iconColor}`}>
          <IconComponent className="w-6 h-6" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}
