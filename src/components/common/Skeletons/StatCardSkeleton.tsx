export default function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
      {/* Label skeleton */}
      <div className="h-3 w-32 bg-gray-200 rounded mb-3"></div>

      {/* Value skeleton - larger */}
      <div className="h-10 w-24 bg-gray-300 rounded mb-3"></div>

      {/* Trend indicator skeleton */}
      <div className="h-7 w-16 bg-gray-200 rounded-full"></div>
    </div>
  );
}
