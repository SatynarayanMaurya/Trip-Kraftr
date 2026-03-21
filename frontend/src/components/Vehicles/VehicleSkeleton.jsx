function VehicleSkeletonCard() {
    return (
      <div
        className="bg-white rounded-2xl overflow-hidden animate-pulse"
        style={{
          border: '1.5px solid #E5E7EB',
          boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
        }}
      >
        {/* Image Skeleton */}
        <div className="bg-gray-200 h-[150px] w-full" />
  
        {/* Content */}
        <div className="px-4 pt-3 pb-4 space-y-3">
          
          {/* Type + Model */}
          <div className="flex justify-between">
            <div className="h-3 w-20 bg-gray-200 rounded" />
            <div className="h-3 w-16 bg-gray-200 rounded" />
          </div>
  
          {/* Region */}
          <div className="h-3 w-28 bg-gray-200 rounded" />
  
          {/* Divider */}
          <div className="border-t border-gray-100" />
  
          {/* Pricing */}
          <div className="flex justify-between mt-2">
            <div className="space-y-1">
              <div className="h-2 w-16 bg-gray-200 rounded" />
              <div className="h-3 w-14 bg-gray-300 rounded" />
            </div>
            <div className="space-y-1 text-right">
              <div className="h-2 w-16 bg-gray-200 rounded ml-auto" />
              <div className="h-3 w-14 bg-gray-300 rounded ml-auto" />
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  export default function VehicleSkeletonGrid() {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <VehicleSkeletonCard key={i} />
        ))}
      </div>
    )
  }