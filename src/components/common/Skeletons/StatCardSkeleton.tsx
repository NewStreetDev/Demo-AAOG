export default function StatCardSkeleton() {
  return (
    <div className="card p-6 relative overflow-hidden">
      <div className="space-y-3 animate-pulse">
        {/* Label skeleton */}
        <div className="h-3 w-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded shimmer" />

        {/* Value skeleton - larger */}
        <div className="h-10 w-28 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded shimmer" />

        {/* Trend indicator skeleton */}
        <div className="h-7 w-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full shimmer" />
      </div>

      {/* Shimmer overlay effect */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
}
