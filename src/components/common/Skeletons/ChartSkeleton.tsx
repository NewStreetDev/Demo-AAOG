export default function ChartSkeleton() {
  return (
    <div className="card p-6 relative overflow-hidden">
      <div className="animate-pulse">
        {/* Header */}
        <div className="mb-6 space-y-2">
          <div className="h-5 w-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded shimmer" />
          <div className="h-3 w-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded shimmer" />
        </div>

        {/* Circular chart */}
        <div className="flex items-center justify-center py-8 mb-8">
          <div className="relative">
            <div className="w-48 h-48 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 rounded-full shimmer" />
            {/* Inner circle for donut effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-white rounded-full" />
            </div>
          </div>
        </div>

        {/* Legend items */}
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gradient-to-br from-gray-300 via-gray-200 to-gray-300 rounded-full shimmer" />
              <div className="h-4 flex-1 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded max-w-[140px] shimmer" />
            </div>
          ))}
        </div>
      </div>

      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
    </div>
  );
}
