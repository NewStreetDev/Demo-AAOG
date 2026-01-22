import type { LucideIcon } from 'lucide-react';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'default' | 'compact';
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'default',
}: EmptyStateProps) {
  const isCompact = variant === 'compact';

  return (
    <div className={`flex flex-col items-center justify-center text-center ${isCompact ? 'py-10' : 'py-16'} animate-fade-in`}>
      {/* Icon Circle with premium styling */}
      <div className="relative mb-6">
        <div
          className={`${
            isCompact ? 'w-20 h-20' : 'w-24 h-24'
          } bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center ring-1 ring-gray-200/50 shadow-sm`}
        >
          <Icon className={`${isCompact ? 'w-10 h-10' : 'w-12 h-12'} text-gray-400`} strokeWidth={1.5} />
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gray-200/50 rounded-full blur-sm" />
        <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gray-100/50 rounded-full blur-md" />
      </div>

      {/* Title - Premium typography */}
      <h3 className={`${isCompact ? 'text-xl' : 'text-2xl'} font-bold text-gray-900 mb-3 tracking-tight`}>
        {title}
      </h3>

      {/* Description - Better readability */}
      <p className={`text-sm text-gray-600 max-w-md mb-8 leading-relaxed font-medium`}>
        {description}
      </p>

      {/* Action Button - Premium CTA */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn-primary gap-2 px-6 py-3 shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          {actionLabel}
        </button>
      )}

      {/* Subtle background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-gray-100 to-transparent rounded-full blur-3xl opacity-50" />
      </div>
    </div>
  );
}
