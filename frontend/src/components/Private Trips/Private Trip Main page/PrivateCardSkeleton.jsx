import React from 'react'


function PrivateCardSkeleton() {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3 animate-pulse">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <div className="h-3 w-20 bg-gray-100 rounded" />
            <div className="h-5 w-36 bg-gray-200 rounded" />
            <div className="h-3 w-28 bg-gray-100 rounded" />
          </div>
          <div className="h-6 w-16 bg-gray-100 rounded-full" />
        </div>
        <div className="flex gap-3">
          <div className="h-4 w-20 bg-gray-100 rounded" />
          <div className="h-4 w-24 bg-gray-100 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-20 bg-yellow-50 rounded-full" />
          <div className="h-6 w-24 bg-green-50 rounded-full" />
        </div>
        <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-2.5 w-16 bg-gray-100 rounded" />
            <div className="h-5 w-24 bg-gray-200 rounded" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-gray-100 rounded-lg" />
            <div className="h-8 w-8 bg-gray-100 rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

export default PrivateCardSkeleton