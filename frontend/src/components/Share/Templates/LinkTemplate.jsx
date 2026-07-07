import React, { useState } from "react";
import { getUrl } from "../Utils/Messages";
function LinkTemplate({ data, tripType }) {
  const itineraryUrl = getUrl(data, tripType);

  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm max-w-xl">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Itinerary Link
      </h3>

      <div className="bg-gray-50 rounded-lg  flex items-center justify-between gap-3">
        <p className="text-sm text-blue-600 break-all">
          {itineraryUrl || "No URL available"}
        </p>

      </div>

    </div>
  );
}

export default LinkTemplate;