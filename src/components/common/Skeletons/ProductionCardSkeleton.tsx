export default function ProductionCardSkeleton() {
  return (
    <div className="card p-6 relative overflow-hidden">
      <div className="animate-pulse">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="h-5 w-40 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded shimmer" />
          <div className="h-6 w-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full shimmer" />
        </div>

        {/* Grid of 4 production items */}
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100">
              {/* Icon circle */}
              <div className="w-14 h-14 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 rounded-xl flex-shrink-0 shimmer" />

              {/* Value and label */}
              <div className="flex-1 space-y-2">
                <div className="h-4 w-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded shimmer" />
                <div className="h-6 w-12 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded shimmer" />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
          <div className="h-4 w-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded shimmer" />
          <div className="h-8 w-24 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded shimmer" />
        </div>
      </div>

      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
    </div>
  );
}
