import React from 'react'


function Card({ val }) {
  const status = val?.status || "created";

  const STATUS_STYLES = {
    created: "bg-purple-100 text-purple-700",
    planning: "bg-orange-100 text-orange-700",
    confirmed: "bg-green-100 text-green-700",
    inProgress: "bg-blue-100 text-blue-700",
    completed: "bg-green-200 text-green-800",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="w-full sm:w-[260px] bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer">
      
      {/* Image Section */}
      <div className="relative">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJo7n7XXByw40QwFnGILGMq2BxD55PkKl8yA&s"
          alt="trip"
          className="w-full h-[150px] object-cover"
        />

        {/* Status Badge */}
        <span
          className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full font-medium ${STATUS_STYLES[status]}`}
        >
          {status}
        </span>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col gap-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Trip ID</span>
          <span className="font-medium text-gray-800">
            {val?.tripId || "—"}
          </span>
        </div>

        {/* Optional extra info (future ready) */}
        <div className="text-xs text-gray-400">
          Click to view details →
        </div>
      </div>
    </div>
  );
}
function SuggestionCardGroupCard({ data, closeSuggestion, setSelectedGroupTripDetails }) {

  const cardClick = (val) => {
    setSelectedGroupTripDetails(val);
    closeSuggestion();
  };


  return (
    <div className="w-full">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Suggested Group Trips
        </h2>
        <button
          onClick={closeSuggestion}
          className="text-sm text-gray-500 hover:text-black transition"
        >
          Skip
        </button>
      </div>

      {/* Content */}
      {data?.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          No matching group trips found. Proceed manually.
        </div>
      ) : (
        <div className="flex flex-wrap gap-6">
          {data?.map((val) => (
            <div key={val?._id} onClick={() => cardClick(val)}>
              <Card val={val} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SuggestionCardGroupCard