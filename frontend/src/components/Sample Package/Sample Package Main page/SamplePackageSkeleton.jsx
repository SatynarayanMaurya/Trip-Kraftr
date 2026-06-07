// SamplePackageSkeleton.jsx
// Import this and use <SamplePackageSkeleton count={8} /> wherever needed

import React from 'react';

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
      {/* Image skeleton */}
      <div className="h-44 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 bg-size-[200%_100%]" />

      {/* Body skeleton */}
      <div className="p-3">
        {/* Top row */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 space-y-2 mr-4">
            <div className="h-3.5 bg-gray-200 rounded w-3/4" />
            <div className="h-2.5 bg-gray-100 rounded w-1/3" />
          </div>
          <div className="h-3 bg-gray-200 rounded w-16 mt-1" />
        </div>

        {/* Bottom row */}
        <div className="flex justify-between items-center mt-3">
          <div className="h-3 bg-gray-200 rounded w-16" />
          <div className="flex gap-2">
            <div className="h-5 w-5 bg-gray-200 rounded-full" />
            <div className="h-5 w-5 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SamplePackageSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default SamplePackageSkeleton;