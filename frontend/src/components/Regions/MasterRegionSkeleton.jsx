const MasterRegionSkeleton = () => {
    const rows = Array.from({ length: 5 }); // 5 skeleton rows
  
    return (
      <div className="bg-[#111827] border border-[#1e2d45] rounded-2xl overflow-hidden animate-pulse">
        {/* Table Header (already exists, optional to show shimmer) */}
        {/* <div className="grid grid-cols-[2fr_2fr_1.2fr_1.5fr_140px] px-6 py-3.5 border-b border-[#1e2d45]">
          {['Region Name', 'Country', 'Status', 'Created', 'Actions'].map(h => (
            <span
              key={h}
              className="text-[11px] font-bold tracking-widest uppercase text-gray-500"
            >
              {h}
            </span>
          ))}
        </div> */}
  
        {/* Skeleton Rows */}
        {rows.map((_, idx) => (
          <div
            key={idx}
            className={`grid grid-cols-[2fr_2fr_1.2fr_1.5fr_140px] px-6 py-5 items-center border-b border-[#1a2537] gap-3`}
          >
            {/* Region Name Skeleton */}
            <div className="flex items-center gap-3">
              {/* <div className="w-8 h-8 rounded-lg bg-gray-700/50"></div> */}
              <div className="h-4 bg-gray-700/50 rounded w-32"></div>
            </div>
  
            {/* Country Skeleton */}
            <div className="flex items-center gap-2">
              <div className="w-5 h-4 bg-gray-700/50 rounded"></div>
              <div className="h-4 bg-gray-700/50 rounded w-20"></div>
            </div>
  
            {/* Status Skeleton */}
            <div className="h-5 bg-gray-700/50 rounded w-16"></div>
  
            {/* Created Date Skeleton */}
            <div className="h-4 bg-gray-700/50 rounded w-20"></div>
  
            {/* Actions Skeleton */}
            <div className="flex gap-2">
              <div className="h-6 bg-gray-700/50 rounded w-12"></div>
              <div className="h-6 bg-gray-700/50 rounded w-12"></div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  

export default MasterRegionSkeleton