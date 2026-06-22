const SKELETON_COUNT = 8

export default function HotelCardSkeleton() {
  return (
    <>
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse bg-white rounded-2xl p-4 border border-gray-200"
          style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
        >
          {/* Top title */}
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />

          {/* Category badge */}
          <div className="h-3 bg-gray-200 rounded w-1/3 mb-4" />

          {/* Info rows */}
          <div className="space-y-2 mb-4">
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-5/6" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>

          {/* Bottom buttons */}
          <div className="flex gap-2 mt-4">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-8 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      ))}
    </>
  )
}