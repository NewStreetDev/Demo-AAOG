export default function ProductionCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="h-5 w-40 bg-gray-200 rounded"></div>
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
      </div>

      {/* Grid of 4 production items */}
      <div className="grid grid-cols-2 gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            {/* Icon circle */}
            <div className="w-14 h-14 bg-gray-200 rounded-xl flex-shrink-0"></div>

            {/* Value and label */}
            <div className="flex-1">
              <div className="h-8 w-16 bg-gray-300 rounded mb-1"></div>
              <div className="h-3 w-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-5 pt-5 border-t border-gray-100 flex items-center justify-between">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <div className="h-6 w-20 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}
