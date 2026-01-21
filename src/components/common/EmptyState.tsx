import { LucideIcon } from 'lucide-react';

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
    <div className={`flex flex-col items-center justify-center text-center ${isCompact ? 'py-8' : 'py-12'}`}>
      {/* Icon Circle */}
      <div
        className={`${
          isCompact ? 'w-16 h-16' : 'w-20 h-20'
        } bg-gray-100 rounded-full flex items-center justify-center mb-4`}
      >
        <Icon className={`${isCompact ? 'w-8 h-8' : 'w-10 h-10'} text-gray-400`} />
      </div>

      {/* Title - Prominent */}
      <h3 className={`${isCompact ? 'text-lg' : 'text-xl'} font-semibold text-gray-900 mb-2`}>
        {title}
      </h3>

      {/* Description - Supporting text */}
      <p className={`text-sm text-gray-600 max-w-sm mb-6`}>
        {description}
      </p>

      {/* Action Button - Clear CTA */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
