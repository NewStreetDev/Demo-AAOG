interface ListCardSkeletonProps {
  itemCount?: number;
  showAvatar?: boolean;
}

export default function ListCardSkeleton({ itemCount = 3, showAvatar = false }: ListCardSkeletonProps) {
  return (
    <div className="card p-6 relative overflow-hidden">
      <div className="animate-pulse">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <div className="h-5 w-36 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded shimmer" />
            <div className="h-3 w-24 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded shimmer" />
          </div>
          <div className="h-8 w-24 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg shimmer" />
        </div>

        {/* List items */}
        <div className="space-y-2.5">
          {[...Array(itemCount)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100">
              {showAvatar && (
                <div className="w-12 h-12 bg-gradient-to-br from-gray-300 via-gray-200 to-gray-300 rounded-xl flex-shrink-0 shimmer" />
              )}
              {!showAvatar && (
                <div className="w-10 h-10 bg-gradient-to-br from-gray-300 via-gray-200 to-gray-300 rounded-xl flex-shrink-0 shimmer" />
              )}
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded w-3/4 shimmer" />
                <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-1/2 shimmer" />
              </div>
              <div className="w-16 h-7 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg shimmer" />
            </div>
          ))}
        </div>
      </div>

      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
    </div>
  );
}
