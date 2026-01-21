interface ListCardSkeletonProps {
  itemCount?: number;
  showAvatar?: boolean;
}

export default function ListCardSkeleton({ itemCount = 3, showAvatar = false }: ListCardSkeletonProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="h-5 w-36 bg-gray-200 rounded"></div>
        <div className="h-8 w-20 bg-gray-200 rounded"></div>
      </div>

      {/* List items */}
      <div className="space-y-3">
        {[...Array(itemCount)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3">
            {showAvatar && (
              <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
            )}
            {!showAvatar && (
              <div className="w-6 h-6 bg-gray-300 rounded-full flex-shrink-0"></div>
            )}
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
