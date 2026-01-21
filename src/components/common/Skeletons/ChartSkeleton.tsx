export default function ChartSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
      {/* Header */}
      <div className="h-5 w-48 bg-gray-200 rounded mb-6"></div>

      {/* Circular chart */}
      <div className="flex items-center justify-center py-8">
        <div className="w-48 h-48 bg-gray-200 rounded-full"></div>
      </div>

      {/* Legend items */}
      <div className="space-y-3 mt-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
            <div className="h-4 flex-1 bg-gray-200 rounded max-w-[120px]"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
